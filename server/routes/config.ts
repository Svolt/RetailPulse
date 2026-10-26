import { Router, Request, Response } from 'express';
import { db, ExperienceConfig, DashboardWidgetConfig, NavModuleConfig, BrandThemeConfig } from '../db';
import { AuthenticatedRequest, authenticate, requirePermission } from '../auth';

const router = Router();

// GET /api/config/published - Get active published configuration
router.get('/published', (req: Request, res: Response) => {
  return res.json({
    config: db.publishedConfig
  });
});

// All subsequent routes require authentication
router.use(authenticate);

// GET /api/config/draft - Get working draft
router.get('/draft', requirePermission('config:read'), (req: AuthenticatedRequest, res: Response) => {
  return res.json({
    draft: db.draftConfig,
    publishedVersion: db.publishedConfig.versionId
  });
});

// PUT /api/config/draft - Update working draft
router.put('/draft', requirePermission('config:edit'), (req: AuthenticatedRequest, res: Response) => {
  const { widgets, navigation, theme, changeSummary, targetAudience } = req.body;

  // Validate theme hex colors & presence
  if (theme) {
    if (theme.primaryColor && !/^#[0-9A-Fa-f]{6}$/.test(theme.primaryColor)) {
      return res.status(400).json({ error: 'Primary color must be a valid 6-character hex code (e.g. #153B2B).' });
    }
    if (theme.accentColor && !/^#[0-9A-Fa-f]{6}$/.test(theme.accentColor)) {
      return res.status(400).json({ error: 'Accent color must be a valid 6-character hex code (e.g. #C8F43D).' });
    }
    db.draftConfig.theme = { ...db.draftConfig.theme, ...theme };
  }

  // Validate widgets: ensure at least one widget remains enabled
  if (widgets && Array.isArray(widgets)) {
    const enabledCount = widgets.filter((w: DashboardWidgetConfig) => w.isEnabled).length;
    if (enabledCount === 0) {
      return res.status(400).json({ error: 'At least one dashboard widget must remain enabled.' });
    }
    db.draftConfig.widgets = widgets;
  }

  // Validate navigation: ensure at least overview is enabled
  if (navigation && Array.isArray(navigation)) {
    db.draftConfig.navigation = navigation;
  }

  if (changeSummary) db.draftConfig.changeSummary = changeSummary;
  if (targetAudience) db.draftConfig.targetAudience = targetAudience;

  return res.json({
    success: true,
    draft: db.draftConfig
  });
});

// POST /api/config/publish - Publish draft snapshot
router.post('/publish', requirePermission('config:publish'), (req: AuthenticatedRequest, res: Response) => {
  const { changeSummary } = req.body;

  if (!changeSummary || changeSummary.trim().length < 5) {
    return res.status(400).json({ error: 'A descriptive change summary (at least 5 characters) is required to publish.' });
  }

  // Integrity validation: check that enabled widgets exist
  const enabledWidgets = db.draftConfig.widgets.filter(w => w.isEnabled);
  if (enabledWidgets.length === 0) {
    return res.status(400).json({ error: 'Cannot publish configuration with zero enabled widgets.' });
  }

  const now = new Date();
  const nextVerNum = db.publishedConfig.versionNumber + 1;
  const versionId = `cfg-v1.${nextVerNum}.0`;
  const publishedAt = now.toISOString().replace('T', ' ').substring(0, 19);

  // Archive current published config
  db.publishedConfig.status = 'archived';

  // Create immutable published snapshot
  const newPublication: ExperienceConfig = {
    versionId,
    versionNumber: nextVerNum,
    status: 'published',
    publishedAt,
    publishedBy: `${req.user!.name} (${req.user!.role})`,
    changeSummary: changeSummary.trim(),
    targetAudience: db.draftConfig.targetAudience || 'all',
    theme: JSON.parse(JSON.stringify(db.draftConfig.theme)),
    widgets: JSON.parse(JSON.stringify(db.draftConfig.widgets)),
    navigation: JSON.parse(JSON.stringify(db.draftConfig.navigation))
  };

  db.publishedConfig = newPublication;
  db.configHistory.unshift(newPublication);

  // Reset draft to baseline of new publication
  db.draftConfig = JSON.parse(JSON.stringify(newPublication));
  db.draftConfig.status = 'draft';
  db.draftConfig.versionId = `cfg-v1.${nextVerNum + 1}.0-draft`;
  db.draftConfig.versionNumber = nextVerNum + 1;
  db.draftConfig.changeSummary = 'Draft in progress';

  db.logAudit(
    req.user!.name,
    req.user!.role,
    'PUBLISH_EXPERIENCE_CONFIG',
    versionId,
    `Published version ${versionId}. Summary: ${changeSummary}. Enabled widgets: ${enabledWidgets.length}`,
    req.ip || '127.0.0.1'
  );

  return res.json({
    success: true,
    publishedConfig: newPublication,
    message: `Configuration ${versionId} successfully published and live for all retailer storefronts!`
  });
});

// GET /api/config/history - Version history
router.get('/history', requirePermission('config:read'), (_req: AuthenticatedRequest, res: Response) => {
  return res.json({
    history: db.configHistory,
    currentVersionId: db.publishedConfig.versionId
  });
});

// POST /api/config/rollback - Roll back to a previous version
router.post('/rollback', requirePermission('config:rollback'), (req: AuthenticatedRequest, res: Response) => {
  const { targetVersionId } = req.body;

  if (!targetVersionId) {
    return res.status(400).json({ error: 'Target version ID is required for rollback.' });
  }

  const targetSnapshot = db.configHistory.find(v => v.versionId === targetVersionId);
  if (!targetSnapshot) {
    return res.status(404).json({ error: `Historical version ${targetVersionId} not found.` });
  }

  const now = new Date();
  const nextVerNum = db.publishedConfig.versionNumber + 1;
  const rollbackVersionId = `cfg-v1.${nextVerNum}.0-rollback-to-${targetSnapshot.versionId}`;
  const publishedAt = now.toISOString().replace('T', ' ').substring(0, 19);

  // Create new published rollback snapshot (never erase history)
  const newPublication: ExperienceConfig = {
    versionId: rollbackVersionId,
    versionNumber: nextVerNum,
    status: 'published',
    publishedAt,
    publishedBy: `${req.user!.name} (${req.user!.role})`,
    changeSummary: `Audited rollback to historical snapshot ${targetSnapshot.versionId} (Originally published by ${targetSnapshot.publishedBy} on ${targetSnapshot.publishedAt})`,
    targetAudience: targetSnapshot.targetAudience,
    theme: JSON.parse(JSON.stringify(targetSnapshot.theme)),
    widgets: JSON.parse(JSON.stringify(targetSnapshot.widgets)),
    navigation: JSON.parse(JSON.stringify(targetSnapshot.navigation))
  };

  db.publishedConfig = newPublication;
  db.configHistory.unshift(newPublication);

  // Sync draft
  db.draftConfig = JSON.parse(JSON.stringify(newPublication));
  db.draftConfig.status = 'draft';
  db.draftConfig.versionId = `cfg-v1.${nextVerNum + 1}.0-draft`;
  db.draftConfig.versionNumber = nextVerNum + 1;
  db.draftConfig.changeSummary = `Derived from rollback ${rollbackVersionId}`;

  db.logAudit(
    req.user!.name,
    req.user!.role,
    'ROLLBACK_EXPERIENCE_CONFIG',
    rollbackVersionId,
    `Rolled back to settings from version ${targetSnapshot.versionId}`,
    req.ip || '127.0.0.1'
  );

  return res.json({
    success: true,
    publishedConfig: newPublication,
    message: `Platform successfully rolled back to ${targetSnapshot.versionId} settings (Audited as ${rollbackVersionId}).`
  });
});

export default router;
