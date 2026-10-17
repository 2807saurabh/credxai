import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Mail, Key, Hash, CheckCircle2 } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Account &amp; Security Profile</h1>
        <p className="text-xs text-slate-400 mt-1">
          Active credit risk analyst session and platform authentication attributes.
        </p>
      </div>

      <div className="bg-navy-900/80 border border-navy-800 rounded-2xl p-6 shadow-xl space-y-6">
        {/* User Identity Banner */}
        <div className="flex items-center gap-4 pb-6 border-b border-navy-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-cyan flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-cyan-500/20">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{user?.fullName || 'Risk Analyst'}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                {user?.email || 'N/A'}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-brand-cyan font-medium px-2 py-0.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/20">
                {user?.role || 'USER'}
              </span>
            </div>
          </div>
        </div>

        {/* Identity Attributes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-navy-950/60 border border-navy-800/80 space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Hash className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Assigned User ID</span>
            </div>
            <div className="text-sm font-semibold text-white font-mono">
              #{user?.id || 'Unassigned'}
            </div>
            <p className="text-[11px] text-slate-500">
              Unique identity mapped to credit applications and database records.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-navy-950/60 border border-navy-800/80 space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Key className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Authentication Token</span>
            </div>
            <div className="text-sm font-semibold text-brand-emerald flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Active JWT Session</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Stateless Bearer token verified on every underwriting request.
            </p>
          </div>
        </div>

        {/* Access Rights */}
        <div className="p-4 rounded-xl bg-navy-950/60 border border-navy-800/80">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <Shield className="w-4 h-4 text-brand-cyan" />
            <span className="font-semibold text-slate-300">Underwriting Scope &amp; Authorizations</span>
          </div>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
            <li>Authorized for Traditional Home Credit Risk Assessment (`/api/predictions/traditional`)</li>
            <li>Authorized for Alternative Gig &amp; Thin-File Assessment (`/api/predictions/alternative`)</li>
            <li>Role-Based Access Control verified via Spring Security JwtFilter</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
