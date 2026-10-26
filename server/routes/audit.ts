import { Router, Response } from 'express';
import { db } from '../db';
import { AuthenticatedRequest, authenticate, requirePermission } from '../auth';

const router = Router();
router.use(authenticate);

// GET /api/audit - List immutable audit events
router.get('/', requirePermission('audit:read'), (req: AuthenticatedRequest, res: Response) => {
  const { query, action, role } = req.query;

  let logs = [...db.auditLogs];

  if (query) {
    const q = String(query).toLowerCase();
    logs = logs.filter(l => 
      l.action.toLowerCase().includes(q) ||
      l.actor.toLowerCase().includes(q) ||
      l.target.toLowerCase().includes(q) ||
      l.details.toLowerCase().includes(q)
    );
  }

  if (action && action !== 'all') {
    logs = logs.filter(l => l.action === action);
  }

  if (role && role !== 'all') {
    logs = logs.filter(l => l.actorRole === role);
  }

  return res.json({ logs });
});

export default router;
