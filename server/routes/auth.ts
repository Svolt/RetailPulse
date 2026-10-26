import { Router, Request, Response } from 'express';
import { db, UserAccount, ROLE_PERMISSIONS } from '../db';
import { AuthenticatedRequest, authenticate } from '../auth';

const router = Router();

// Sign In
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email address is required.' });
  }

  // Find user by email
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: 'No account found matching this email address.' });
  }

  if (user.status === 'suspended') {
    return res.status(403).json({ error: 'This account has been suspended by an administrator.' });
  }

  if (user.status === 'deactivated') {
    return res.status(403).json({ error: 'This account has been deactivated.' });
  }

  if (user.status === 'pending_invite') {
    return res.status(403).json({ 
      error: 'Account invitation pending activation. Please use the activation link sent to your email.' 
    });
  }

  // Create session token
  const token = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24; // 24 hours

  user.lastLoginAt = new Date().toISOString().replace('T', ' ').substring(0, 16);

  db.sessions.set(token, {
    token,
    userId: user.id,
    user,
    expiresAt
  });

  db.logAudit(
    user.name,
    user.role,
    'USER_LOGIN',
    user.email,
    'Successful authentication and session creation',
    req.ip || '127.0.0.1'
  );

  const permissions = [
    ...(ROLE_PERMISSIONS[user.role] || []),
    ...(user.permissionsOverride || [])
  ];

  return res.json({
    token,
    user,
    permissions,
    expiresAt
  });
});

// Current User Session Info
router.get('/me', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const permissions = [
    ...(ROLE_PERMISSIONS[user.role] || []),
    ...(user.permissionsOverride || [])
  ];

  return res.json({
    user,
    permissions,
    token: req.sessionToken
  });
});

// Sign Out
router.post('/logout', authenticate, (req: AuthenticatedRequest, res: Response) => {
  if (req.sessionToken) {
    db.sessions.delete(req.sessionToken);
  }
  db.logAudit(
    req.user!.name,
    req.user!.role,
    'USER_LOGOUT',
    req.user!.email,
    'Session explicitly revoked',
    req.ip || '127.0.0.1'
  );
  return res.json({ success: true, message: 'Logged out successfully.' });
});

// Activate account via invitation token
router.post('/activate', (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Activation token is required.' });
  }

  const user = db.users.find(u => u.inviteToken === token);
  if (!user) {
    return res.status(404).json({ error: 'Invalid or already activated invitation token.' });
  }

  if (user.inviteExpiresAt && new Date(user.inviteExpiresAt) < new Date()) {
    return res.status(400).json({ error: 'This invitation token has expired. Request a new invite from an admin.' });
  }

  // Activate user
  user.status = 'active';
  user.inviteToken = undefined;
  user.inviteExpiresAt = undefined;
  user.lastLoginAt = new Date().toISOString().replace('T', ' ').substring(0, 16);

  // Generate session token
  const sessionToken = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24;

  db.sessions.set(sessionToken, {
    token: sessionToken,
    userId: user.id,
    user,
    expiresAt
  });

  db.logAudit(
    user.name,
    user.role,
    'ACCOUNT_ACTIVATED',
    user.email,
    'Account activated via single-use invitation token',
    req.ip || '127.0.0.1'
  );

  return res.json({
    success: true,
    message: 'Account activated successfully!',
    token: sessionToken,
    user,
    permissions: ROLE_PERMISSIONS[user.role] || []
  });
});

// Password recovery
router.post('/reset-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    db.logAudit(
      'System Security',
      'Security Process',
      'PASSWORD_RESET_REQUESTED',
      user.email,
      'Recovery instructions generated and sent',
      req.ip || '127.0.0.1'
    );
  }

  // Always return 200 for user enumeration protection
  return res.json({ 
    success: true, 
    message: 'If an account matches that email address, recovery instructions have been dispatched.' 
  });
});

export default router;
