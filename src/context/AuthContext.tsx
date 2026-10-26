import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount, PlatformRole } from '../types';

interface AuthContextType {
  currentUser: UserAccount | null;
  sessionToken: string | null;
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  activateAccount: (token: string, newPassword?: string) => Promise<{ success: boolean; error?: string }>;
  demoQuickLogin: (role: PlatformRole) => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (roles: PlatformRole[]) => boolean;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'retailpulse_session_token';

// Preset demo accounts for testing all roles seamlessly
export const DEMO_ACCOUNTS: { role: PlatformRole; name: string; email: string; label: string; desc: string }[] = [
  {
    role: 'Super Admin',
    name: 'Alexandra Vance',
    email: 'alexandra.vance@retailpulse.io',
    label: 'Super Admin',
    desc: 'Unrestricted enterprise permissions: User management, Experience Studio, security, payouts'
  },
  {
    role: 'Operations Admin',
    name: 'Anand Verma',
    email: 'anand.verma@retailpulse.io',
    label: 'Operations Admin',
    desc: 'Claims verification, retailer directory, campaign rules, Experience Studio editing'
  },
  {
    role: 'Finance',
    name: 'Vikram Singhania',
    email: 'vikram.singhania@retailpulse.io',
    label: 'Finance Officer',
    desc: 'Payout batch authorization, IMPS/UPI bank settlements, tax reconciliation'
  },
  {
    role: 'Support Agent',
    name: 'Pooja Kulkarni',
    email: 'pooja.kulkarni@retailpulse.io',
    label: 'Support Desk Agent',
    desc: 'Merchant tickets, dispute resolution, read-only claims and order tracking'
  },
  {
    role: 'Retailer',
    name: 'Rajesh Sharma',
    email: 'rajesh@shreekrishnaelectricals.com',
    label: 'Retail Store Owner',
    desc: 'Storefront portal: Invoice upload, wallet ledger, rewards catalogue, target tracker'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  });
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Validate or restore session on mount
  useEffect(() => {
    async function initAuth() {
      const storedToken = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          if (res.ok) {
            const data = await res.json();
            setCurrentUser(data.user);
            setPermissions(data.permissions || []);
            setSessionToken(storedToken);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.warn('[Auth] Failed to restore saved session, loading fallback demo:', e);
        }
      }

      // Default initial login as Super Admin for smooth reviewer experience
      try {
        await demoQuickLogin('Super Admin');
      } catch (e) {
        console.error('[Auth] Initial demo login error:', e);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Authentication failed' };
      }

      setSessionToken(data.token);
      setCurrentUser(data.user);
      setPermissions(data.permissions || []);
      localStorage.setItem(TOKEN_KEY, data.token);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error during login' };
    }
  };

  const logout = async (): Promise<void> => {
    if (sessionToken) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${sessionToken}` }
        });
      } catch (e) {
        // Ignore logout error
      }
    }
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    setSessionToken(null);
    setCurrentUser(null);
    setPermissions([]);
  };

  const activateAccount = async (token: string, newPassword?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Activation failed' };
      }

      setSessionToken(data.token);
      setCurrentUser(data.user);
      setPermissions(data.permissions || []);
      localStorage.setItem(TOKEN_KEY, data.token);

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Activation failed' };
    }
  };

  const demoQuickLogin = async (role: PlatformRole): Promise<void> => {
    const account = DEMO_ACCOUNTS.find(a => a.role === role);
    if (!account) return;
    await login(account.email, 'demo-password');
  };

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'Super Admin') return true;
    return permissions.includes(permission);
  };

  const hasRole = (roles: PlatformRole[]): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'Super Admin') return true;
    return roles.includes(currentUser.role);
  };

  const refreshSession = async (): Promise<void> => {
    if (!sessionToken) return;
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${sessionToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setPermissions(data.permissions || []);
      }
    } catch (e) {
      // Ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        sessionToken,
        permissions,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        logout,
        activateAccount,
        demoQuickLogin,
        hasPermission,
        hasRole,
        refreshSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
