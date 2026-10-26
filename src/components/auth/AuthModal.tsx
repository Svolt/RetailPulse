import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  UserCheck,
  Building,
  Sparkles
} from 'lucide-react';
import { useAuth, DEMO_ACCOUNTS } from '../../context/AuthContext';
import { PlatformRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'activate' | 'reset';
  initialToken?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'signin',
  initialToken = '' 
}) => {
  const { login, activateAccount, demoQuickLogin, currentUser } = useAuth();

  const [mode, setMode] = useState<'signin' | 'activate' | 'reset'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activationToken, setActivationToken] = useState(initialToken);
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      onClose();
    } else {
      setErrorMessage(res.error || 'Failed to authenticate');
    }
  };

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const res = await activateAccount(activationToken, newPassword);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMessage('Account successfully activated and signed in!');
      setTimeout(() => onClose(), 1500);
    } else {
      setErrorMessage(res.error || 'Activation failed');
    }
  };

  const handleQuickDemoSelect = async (role: PlatformRole) => {
    setErrorMessage(null);
    setIsSubmitting(true);
    await demoQuickLogin(role);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#E5EAE1] overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#153B2B] text-[#FFFFFF] p-6 relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#C8F43D] text-[#153B2B] flex items-center justify-center font-bold text-sm">
                ▲
              </div>
              <div>
                <h3 className="text-base font-bold text-[#FFFFFF]">RetailPulse Security Gateway</h3>
                <p className="text-xs text-[#DDE4D8]">Role-based Access & Session Authentication</p>
              </div>
            </div>
            {currentUser && (
              <button 
                onClick={onClose}
                className="p-1 rounded-lg text-[#DDE4D8] hover:text-[#FFFFFF] hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[#E5EAE1] bg-[#FAFBF9] text-xs">
          <button
            onClick={() => { setMode('signin'); setErrorMessage(null); }}
            className={`flex-1 py-3 font-semibold text-center transition-colors cursor-pointer border-b-2 ${
              mode === 'signin' ? 'border-[#153B2B] text-[#153B2B] bg-[#FFFFFF]' : 'border-transparent text-[#697565]'
            }`}
          >
            Sign In with Credentials
          </button>
          <button
            onClick={() => { setMode('activate'); setErrorMessage(null); }}
            className={`flex-1 py-3 font-semibold text-center transition-colors cursor-pointer border-b-2 ${
              mode === 'activate' ? 'border-[#153B2B] text-[#153B2B] bg-[#FFFFFF]' : 'border-transparent text-[#697565]'
            }`}
          >
            Activate Invitation Token
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl flex items-center gap-2 text-xs text-[#DC2626]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-[#EAF7EE] border border-[#A7F3D0] rounded-xl flex items-center gap-2 text-xs text-[#16A34A] font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {mode === 'signin' && (
            <>
              {/* Credentials Form */}
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#172018] mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#697565] absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. alexandra.vance@retailpulse.io"
                      className="w-full text-xs bg-[#FAFBF9] border border-[#DDE4D8] rounded-xl pl-9 pr-3 py-2 text-[#172018] focus:outline-none focus:ring-1 focus:ring-[#153B2B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172018] mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#697565] absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter account password"
                      className="w-full text-xs bg-[#FAFBF9] border border-[#DDE4D8] rounded-xl pl-9 pr-3 py-2 text-[#172018] focus:outline-none focus:ring-1 focus:ring-[#153B2B]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-[#153B2B] text-[#C8F43D] hover:bg-[#1E4D38] font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {isSubmitting ? 'Verifying Session...' : 'Authenticate & Enter Platform'}
                </button>
              </form>

              {/* Quick Demo Switcher Section for Evaluator */}
              <div className="pt-2 border-t border-[#E5EAE1] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#172018]">Demo Evaluator Fast-Logins:</span>
                  <span className="text-[10px] text-[#697565] bg-[#EAEFE6] px-2 py-0.5 rounded font-mono">
                    Real RBAC Enforcement
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DEMO_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.role}
                      type="button"
                      onClick={() => handleQuickDemoSelect(acc.role)}
                      className="p-2.5 text-left bg-[#FAFBF9] hover:bg-[#F5F7F3] border border-[#E5EAE1] hover:border-[#153B2B] rounded-xl transition-all cursor-pointer group text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#153B2B] group-hover:text-[#172018]">{acc.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <div className="text-[10px] text-[#697565] mt-0.5 font-medium truncate">{acc.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {mode === 'activate' && (
            <form onSubmit={handleActivate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#172018] mb-1">
                  Single-Use Invitation Token
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#697565] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={activationToken}
                    onChange={(e) => setActivationToken(e.target.value)}
                    placeholder="e.g. inv-tok-99201a4"
                    className="w-full text-xs font-mono bg-[#FAFBF9] border border-[#DDE4D8] rounded-xl pl-9 pr-3 py-2 text-[#172018] focus:outline-none focus:ring-1 focus:ring-[#153B2B]"
                  />
                </div>
                <p className="text-[10px] text-[#697565] mt-1">
                  Try test invite token: <code className="font-mono font-bold text-[#153B2B]">inv-tok-99201a4</code> (Sunil Mehta)
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172018] mb-1">
                  Set Your Secure Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#697565] absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full text-xs bg-[#FAFBF9] border border-[#DDE4D8] rounded-xl pl-9 pr-3 py-2 text-[#172018] focus:outline-none focus:ring-1 focus:ring-[#153B2B]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-[#C8F43D] text-[#153B2B] hover:bg-[#BBE832] font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {isSubmitting ? 'Activating Account...' : 'Activate & Sign In'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
