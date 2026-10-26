import { Request, Response, NextFunction } from 'express';
import { db, UserAccount, ROLE_PERMISSIONS, PlatformRole } from './db';

export interface AuthenticatedRequest extends Request {
  user?: UserAccount;
  sessionToken?: string;
}

export function extractAuthToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  if (req.headers['x-session-token']) {
    return String(req.headers['x-session-token']);
  }
  return null;
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = extractAuthToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Authentication required. No session token provided.' });
  }

  const session = db.sessions.get(token);
  if (!session) {
    return res.status(401).json({ error: 'Invalid or expired session. Please sign in again.' });
  }

  if (Date.now() > session.expiresAt) {
    db.sessions.delete(token);
    return res.status(401).json({ error: 'Session expired. Please sign in again.' });
  }

  // Check if user is suspended or deactivated
  const freshUser = db.users.find(u => u.id === session.userId);
  if (!freshUser || freshUser.status === 'suspended' || freshUser.status === 'deactivated') {
    return res.status(403).json({ error: 'Account access has been suspended or deactivated. Contact administrator.' });
  }

  req.user = freshUser;
  req.sessionToken = token;
  next();
}

export function requirePermission(permission: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const rolePerms = ROLE_PERMISSIONS[req.user.role] || [];
    const customPerms = req.user.permissionsOverride || [];
    const hasPerm = rolePerms.includes(permission) || customPerms.includes(permission) || req.user.role === 'Super Admin';

    if (!hasPerm) {
      db.logAudit(
        req.user.name,
        req.user.role,
        'PERMISSION_DENIED',
        `Attempted action requiring ${permission}`,
        `Action blocked on ${req.method} ${req.originalUrl}`,
        req.ip || '127.0.0.1'
      );
      return res.status(403).json({ 
        error: `Access Denied: Your account role (${req.user.role}) lacks the required permission: [${permission}].` 
      });
    }

    next();
  };
}

export function requireRole(allowedRoles: PlatformRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role) && req.user.role !== 'Super Admin') {
      return res.status(403).json({ 
        error: `Access Denied: Requires one of [${allowedRoles.join(', ')}].` 
      });
    }

    next();
  };
}

export function enforceTenantAccess(req: AuthenticatedRequest, targetStoreId: string): boolean {
  if (!req.user) return false;
  if (req.user.role === 'Super Admin' || req.user.role === 'Operations Admin' || req.user.role === 'Finance') {
    return true; // Admins have platform-wide scope
  }
  return req.user.storeIds.includes(targetStoreId);
}
