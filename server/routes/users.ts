import { Router, Response } from 'express';
import { db, UserAccount, PlatformRole, UserAccountStatus } from '../db';
import { AuthenticatedRequest, authenticate, requirePermission } from '../auth';

const router = Router();

// Apply auth to all user routes
router.use(authenticate);

// GET /api/users - List users with search and filters
router.get('/', requirePermission('users:read'), (req: AuthenticatedRequest, res: Response) => {
  const { query, role, status, territory, programme } = req.query;

  let filtered = [...db.users];

  if (query) {
    const q = String(query).toLowerCase();
    filtered = filtered.filter(u => 
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q)
    );
  }

  if (role && role !== 'all') {
    filtered = filtered.filter(u => u.role === role);
  }

  if (status && status !== 'all') {
    filtered = filtered.filter(u => u.status === status);
  }

  if (territory && territory !== 'all') {
    filtered = filtered.filter(u => u.territory === territory);
  }

  if (programme && programme !== 'all') {
    filtered = filtered.filter(u => u.programme === programme);
  }

  return res.json({
    users: filtered,
    total: filtered.length
  });
});

// POST /api/users - Create new user or dispatch invitation
router.post('/', requirePermission('users:manage'), (req: AuthenticatedRequest, res: Response) => {
  const { name, email, phone, role, storeIds, territory, distributor, programme, isInvite } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ error: 'Name, email, and role are required.' });
  }

  // Duplicate check
  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: `An account already exists with email: ${email}` });
  }

  const now = new Date();
  const formattedDate = now.toISOString().replace('T', ' ').substring(0, 16);

  const inviteToken = isInvite ? `inv-tok-${Date.now()}-${Math.random().toString(36).substring(2, 8)}` : undefined;
  const inviteExpiresAt = isInvite ? new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString() : undefined;

  const newUser: UserAccount = {
    id: `usr-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    phone: phone || '',
    role: role as PlatformRole,
    status: isInvite ? 'pending_invite' : 'active',
    storeIds: Array.isArray(storeIds) ? storeIds : [],
    territory: territory || 'General Region',
    distributor: distributor || '',
    programme: programme || 'Apex Platinum Partner 2026',
    createdAt: formattedDate,
    invitedBy: req.user!.name,
    inviteToken,
    inviteExpiresAt
  };

  db.users.push(newUser);

  db.logAudit(
    req.user!.name,
    req.user!.role,
    isInvite ? 'INVITE_USER' : 'CREATE_USER',
    `${newUser.name} (${newUser.email})`,
    `Role: ${newUser.role}, Status: ${newUser.status}, Stores: ${newUser.storeIds.join(', ') || 'None'}`,
    req.ip || '127.0.0.1'
  );

  return res.status(201).json({
    user: newUser,
    activationUrl: inviteToken ? `${req.protocol}://${req.get('host')}/activate?token=${inviteToken}` : undefined
  });
});

// PATCH /api/users/:id/status - Suspend, reactivate, or deactivate
router.patch('/:id/status', requirePermission('users:manage'), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status, reason } = req.body;

  const validStatuses: UserAccountStatus[] = ['active', 'suspended', 'deactivated', 'pending_invite'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  const user = db.users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'User account not found.' });
  }

  // Prevent self-lockout of last Super Admin
  if (user.id === req.user!.id && status !== 'active') {
    return res.status(400).json({ error: 'You cannot suspend or deactivate your own active session.' });
  }

  const oldStatus = user.status;
  user.status = status;

  // If suspended or deactivated, revoke all active sessions for this user
  if (status === 'suspended' || status === 'deactivated') {
    for (const [token, sess] of db.sessions.entries()) {
      if (sess.userId === user.id) {
        db.sessions.delete(token);
      }
    }
  }

  db.logAudit(
    req.user!.name,
    req.user!.role,
    `ACCOUNT_STATUS_${status.toUpperCase()}`,
    `${user.name} (${user.email})`,
    `Status transitioned from ${oldStatus} to ${status}. Reason: ${reason || 'Administrative action'}`,
    req.ip || '127.0.0.1'
  );

  return res.json({
    success: true,
    user
  });
});

// PATCH /api/users/:id/assignments - Assign stores and programmes
router.patch('/:id/assignments', requirePermission('users:manage'), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { storeIds, territory, distributor, programme, role } = req.body;

  const user = db.users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'User account not found.' });
  }

  if (storeIds !== undefined && Array.isArray(storeIds)) {
    user.storeIds = storeIds;
  }
  if (territory !== undefined) user.territory = territory;
  if (distributor !== undefined) user.distributor = distributor;
  if (programme !== undefined) user.programme = programme;
  if (role !== undefined) user.role = role as PlatformRole;

  db.logAudit(
    req.user!.name,
    req.user!.role,
    'USER_ASSIGNMENT_UPDATED',
    `${user.name} (${user.email})`,
    `Updated store mappings: [${user.storeIds.join(', ')}], Territory: ${user.territory}, Role: ${user.role}`,
    req.ip || '127.0.0.1'
  );

  return res.json({
    success: true,
    user
  });
});

// POST /api/users/:id/resend-invite
router.post('/:id/resend-invite', requirePermission('users:manage'), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const user = db.users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ error: 'User account not found.' });
  }

  const now = new Date();
  const inviteToken = `inv-tok-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const inviteExpiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

  user.status = 'pending_invite';
  user.inviteToken = inviteToken;
  user.inviteExpiresAt = inviteExpiresAt;

  db.logAudit(
    req.user!.name,
    req.user!.role,
    'RESEND_INVITATION',
    `${user.name} (${user.email})`,
    `Generated fresh single-use invite token valid until ${inviteExpiresAt}`,
    req.ip || '127.0.0.1'
  );

  return res.json({
    success: true,
    activationUrl: `${req.protocol}://${req.get('host')}/activate?token=${inviteToken}`,
    expiresAt: inviteExpiresAt
  });
});

// GET /api/users/template - Return CSV template
router.get('/csv-template', requirePermission('users:read'), (_req: AuthenticatedRequest, res: Response) => {
  const template = 'name,email,phone,role,store_codes,territory,distributor,programme\n' +
    '"Sunil Kumar","sunil.kumar@example.com","+91 98200 44101","Retailer","RT-8421","West Mumbai Commercial Zone","Reliance Trade Logistics Ltd","Apex Platinum Partner 2026"\n' +
    '"Meera Deshmukh","meera.deshmukh@example.com","+91 98200 44102","Operations Admin","","National Operations","","Apex Enterprise Loyalty"\n' +
    '"Rohan Mehta","rohan.mehta@example.com","+91 98200 44103","Finance","","Treasury Desk","","Universal Settlement"';
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="retailpulse_user_import_template.csv"');
  return res.send(template);
});

// POST /api/users/bulk-import - CSV parser with row-level validation & error report
router.post('/bulk-import', requirePermission('users:import'), (req: AuthenticatedRequest, res: Response) => {
  const { csvText, conflictResolution = 'skip' } = req.body; // 'skip' | 'update'

  if (!csvText || typeof csvText !== 'string') {
    return res.status(400).json({ error: 'csvText content string is required.' });
  }

  const lines = csvText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length < 2) {
    return res.status(400).json({ error: 'CSV file contains no data rows.' });
  }

  const headers = lines[0].split(',').map(h => h.replace(/^["']|["']$/g, '').trim().toLowerCase());
  const rows = lines.slice(1);

  const validRoles: PlatformRole[] = ['Super Admin', 'Operations Admin', 'Finance', 'Support Agent', 'Retailer'];

  const results = {
    totalRows: rows.length,
    successCount: 0,
    skippedCount: 0,
    errorCount: 0,
    errors: [] as { row: number; email?: string; error: string }[],
    importedUsers: [] as UserAccount[]
  };

  rows.forEach((rowStr, idx) => {
    const rowNum = idx + 2; // 1-indexed, header is 1
    // Simple CSV row parser handling quotes
    const values = rowStr.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)?.map(v => v.replace(/^["']|["']$/g, '').trim()) || rowStr.split(',').map(v => v.trim());

    const rowObj: Record<string, string> = {};
    headers.forEach((h, i) => {
      rowObj[h] = values[i] || '';
    });

    const name = rowObj['name'];
    const email = rowObj['email']?.toLowerCase();
    const phone = rowObj['phone'] || '';
    const roleInput = rowObj['role'] || 'Retailer';
    const storeCodesStr = rowObj['store_codes'] || '';
    const territory = rowObj['territory'] || 'General Territory';
    const distributor = rowObj['distributor'] || '';
    const programme = rowObj['programme'] || 'Apex Platinum Partner 2026';

    // Required fields validation
    if (!name || !email) {
      results.errorCount++;
      results.errors.push({ row: rowNum, error: 'Missing mandatory name or email field.' });
      return;
    }

    // Email format validation
    if (!email.includes('@') || !email.includes('.')) {
      results.errorCount++;
      results.errors.push({ row: rowNum, email, error: 'Invalid email address syntax.' });
      return;
    }

    // Role validation
    const matchedRole = validRoles.find(r => r.toLowerCase() === roleInput.toLowerCase());
    if (!matchedRole) {
      results.errorCount++;
      results.errors.push({ row: rowNum, email, error: `Invalid role '${roleInput}'. Must be one of: ${validRoles.join(', ')}` });
      return;
    }

    // Resolve store IDs from store codes
    const storeCodes = storeCodesStr.split(';').map(c => c.trim()).filter(Boolean);
    const resolvedStoreIds: string[] = [];
    storeCodes.forEach(code => {
      const matchedStore = db.stores.find(s => s.code.toLowerCase() === code.toLowerCase());
      if (matchedStore) resolvedStoreIds.push(matchedStore.id);
    });

    // Check duplicate
    const existingIndex = db.users.findIndex(u => u.email === email);
    if (existingIndex >= 0) {
      if (conflictResolution === 'skip') {
        results.skippedCount++;
        return;
      } else {
        // Update existing user
        const existingUser = db.users[existingIndex];
        existingUser.name = name;
        existingUser.phone = phone || existingUser.phone;
        existingUser.role = matchedRole;
        if (resolvedStoreIds.length > 0) existingUser.storeIds = resolvedStoreIds;
        existingUser.territory = territory;
        existingUser.distributor = distributor;
        existingUser.programme = programme;

        results.successCount++;
        results.importedUsers.push(existingUser);
        return;
      }
    }

    // Create new invited user
    const now = new Date();
    const inviteToken = `inv-tok-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const inviteExpiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const newUser: UserAccount = {
      id: `usr-${Date.now()}-${idx}`,
      name,
      email,
      phone,
      role: matchedRole,
      status: 'pending_invite',
      storeIds: resolvedStoreIds,
      territory,
      distributor,
      programme,
      createdAt: now.toISOString().replace('T', ' ').substring(0, 16),
      invitedBy: `${req.user!.name} (Bulk CSV Import)`,
      inviteToken,
      inviteExpiresAt
    };

    db.users.push(newUser);
    results.successCount++;
    results.importedUsers.push(newUser);
  });

  db.logAudit(
    req.user!.name,
    req.user!.role,
    'BULK_USER_IMPORT',
    `CSV Import (${results.totalRows} rows)`,
    `Successfully processed: ${results.successCount}, Skipped: ${results.skippedCount}, Errors: ${results.errorCount}`,
    req.ip || '127.0.0.1'
  );

  return res.json({
    summary: {
      total: results.totalRows,
      successful: results.successCount,
      skipped: results.skippedCount,
      failed: results.errorCount
    },
    errors: results.errors
  });
});

export default router;
