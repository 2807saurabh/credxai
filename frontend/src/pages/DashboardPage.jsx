import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import systemService from '../services/systemService';
import predictionService from '../services/predictionService';
import { 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  ShieldAlert,
  ArrowRight,
  Database,
  History,
  Activity,
  Server,
  RefreshCw,
  Info,
  Clock,
  Inbox,
  AlertCircle
} from 'lucide-react';

const DashboardRecentEvaluations = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    predictionService.getHistory()
      .then(data => {
        if (isMounted) setApps(Array.isArray(data) ? data.slice(0, 5) : []);
      })
      .catch(err => {
        if (isMounted) setError(err.message || 'Failed to load recent applications.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
        <div className="w-4 h-4 border-2 border-brand-cyan/20 border-t-brand-cyan rounded-full animate-spin"></div>
        <span>Querying recent evaluation logs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl bg-brand-rose/10 border border-brand-rose/30 text-brand-rose text-xs flex items-center gap-2">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span>Could not connect to history service. Check Spring Boot status below.</span>
      </div>
    );
  }

  if (apps.length === 0) {
    return (
      <div className="py-8 px-4 text-center rounded-xl bg-navy-950/40 border border-dashed border-navy-800 flex flex-col items-center justify-center space-y-2">
        <Inbox className="w-8 h-8 text-slate-500" />
        <h4 className="text-xs font-bold text-slate-300">No Applications Logged Yet</h4>
        <p className="text-[11px] text-slate-500 max-w-sm">
          Run your first credit evaluation to persist auditable scores to MySQL.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-slate-300">
        <thead className="bg-navy-950/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-navy-800">
          <tr>
            <th className="px-4 py-2.5">App ID</th>
            <th className="px-4 py-2.5">Model Engine</th>
            <th className="px-4 py-2.5">Risk Tier</th>
            <th className="px-4 py-2.5">Probability</th>
            <th className="px-4 py-2.5">Timestamp</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-navy-800/60 font-sans">
          {apps.map(app => (
            <tr key={app.id} className="hover:bg-navy-850/60 transition-colors">
              <td className="px-4 py-2.5 font-mono font-semibold text-white">#{app.id}</td>
              <td className="px-4 py-2.5">
                <span className="font-medium text-slate-200">
                  {app.modelType === 'ALTERNATIVE_DATA' ? 'Alternative Data' : 'Traditional Bureau'}
                </span>
              </td>
              <td className="px-4 py-2.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                  app.riskBand === 'LOW_RISK'
                    ? 'bg-brand-emerald/15 text-brand-emerald border-brand-emerald/30'
                    : app.riskBand === 'MEDIUM_RISK'
                    ? 'bg-brand-amber/15 text-brand-amber border-brand-amber/30'
                    : 'bg-brand-rose/15 text-brand-rose border-brand-rose/30'
                }`}>
                  {app.riskBand ? app.riskBand.replace('_', ' ') : 'UNKNOWN'}
                </span>
              </td>
              <td className="px-4 py-2.5 font-mono font-semibold text-white">
                {app.defaultProbability != null ? (app.defaultProbability * 100).toFixed(2) + '%' : 'N/A'}
              </td>
              <td className="px-4 py-2.5 text-slate-400 font-mono text-[11px]">
                {new Date(app.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DashboardPage = () => {
  const { user } = useAuth();

  // Status check states (do not display online unless checked)
  const [serviceStatus, setServiceStatus] = useState({
    springBoot: { status: 'CHECKING', label: 'Port 8080' },
    traditionalMl: { status: 'CHECKING', label: 'Port 8002' },
    alternativeMl: { status: 'CHECKING', label: 'Port 8001' },
    lastChecked: null
  });
  const [isChecking, setIsChecking] = useState(false);

  // Active check routine
  const checkHealth = async () => {
    setIsChecking(true);
    try {
      const [backendRes, tradRes, altRes] = await Promise.all([
        systemService.checkBackend(),
        systemService.checkTraditionalMl(),
        systemService.checkAlternativeMl()
      ]);

      setServiceStatus({
        springBoot: { 
          status: backendRes.status, 
          label: 'Port 8080', 
          detail: backendRes.status === 'ONLINE' ? 'HTTP Gateway Ready' : 'Unreachable' 
        },
        traditionalMl: { 
          status: tradRes.status, 
          label: 'Port 8002', 
          detail: tradRes.status === 'ONLINE' ? 'Model Ready' : 'Unreachable' 
        },
        alternativeMl: { 
          status: altRes.status, 
          label: 'Port 8001', 
          detail: altRes.status === 'ONLINE' ? 'Model Ready' : 'Unreachable' 
        },
        lastChecked: new Date().toLocaleTimeString()
      });
    } catch {
      // In case of any unexpected runtime failure
      setServiceStatus(prev => ({ ...prev, lastChecked: new Date().toLocaleTimeString() }));
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Dashboard Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-navy-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/20 border border-brand-cyan/30 text-brand-cyan text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Explainable AI Credit Risk Platform</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Underwriting Intelligence, Backed by XAI
            </h1>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              CredXAI solves the "black-box" dilemma in automated loan scoring. By combining audited Logistic Regression models with direct linear coefficient attributions, financial institutions can evaluate risk transparently, explain credit decisions to applicants, and meet stringent regulatory compliance standards.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/assess/traditional"
              className="px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-medium text-xs sm:text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Traditional Model</span>
            </Link>
            <Link
              to="/assess/alternative"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-cyan/20 to-brand-blue/20 hover:bg-navy-800 text-brand-cyan border border-brand-cyan/40 font-medium text-xs sm:text-sm transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Alternative Model</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Two Prominent Assessment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Traditional Credit Assessment Card */}
        <div className="bg-navy-900/80 border border-navy-800 rounded-2xl p-6 sm:p-7 hover:border-brand-blue/50 transition-all duration-300 shadow-xl flex flex-col justify-between group">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="p-3.5 rounded-2xl bg-brand-blue/15 border border-brand-blue/30 text-brand-cyan group-hover:scale-105 transition-transform">
                <FileText className="w-7 h-7" />
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-navy-800 text-slate-300 font-medium border border-navy-700">
                12 Bureau Inputs
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-cyan transition-colors">
              Traditional Credit Assessment
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
              Tailored for applicants with established credit histories. Evaluates demographic profile, family dependents, declared income, loan amounts, annuity installment ratios, and property assets against the calibrated Home Credit risk benchmark.
            </p>
            <div className="space-y-2 mb-6 text-xs">
              <div className="flex justify-between py-1.5 border-b border-navy-800 text-slate-400">
                <span>Model Engine:</span>
                <span className="font-semibold text-slate-200">Simplified Traditional Logistic Regression</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-navy-800 text-slate-400">
                <span>Output Metrics:</span>
                <span className="text-slate-300">Default Probability &amp; Band (Low, Med, High)</span>
              </div>
              <div className="flex justify-between py-1.5 text-slate-400">
                <span>Attribution:</span>
                <span className="text-brand-cyan font-medium">Top 5 Risk-Increasing / Decreasing Coefficients</span>
              </div>
            </div>
          </div>
          <Link
            to="/assess/traditional"
            className="w-full py-3 rounded-xl bg-navy-800 hover:bg-brand-blue text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 border border-navy-700 hover:border-brand-blue shadow-md"
          >
            <span>Start Traditional Evaluation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Alternative Data Assessment Card */}
        <div className="bg-navy-900/80 border border-navy-800 rounded-2xl p-6 sm:p-7 hover:border-brand-cyan/50 transition-all duration-300 shadow-xl flex flex-col justify-between group">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="p-3.5 rounded-2xl bg-brand-cyan/15 border border-brand-cyan/30 text-brand-cyan group-hover:scale-105 transition-transform">
                <Sparkles className="w-7 h-7" />
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-navy-800 text-slate-300 font-medium border border-navy-700">
                8 Behavioral Inputs
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-cyan transition-colors">
              Alternative Data Assessment
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
              Built for thin-file, young, or gig-economy applicants lacking conventional credit bureau coverage. Evaluates cashflow stability, bill consistency, account tenure, average balances, and overdraft frequency to unlock inclusive financing.
            </p>
            <div className="space-y-2 mb-6 text-xs">
              <div className="flex justify-between py-1.5 border-b border-navy-800 text-slate-400">
                <span>Model Engine:</span>
                <span className="font-semibold text-slate-200">Behavioral Alternative Logistic Pipeline</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-navy-800 text-slate-400">
                <span>Output Metrics:</span>
                <span className="text-slate-300">Default Probability &amp; Band (Low, Med, High)</span>
              </div>
              <div className="flex justify-between py-1.5 text-slate-400">
                <span>Attribution:</span>
                <span className="text-brand-cyan font-medium">Model-based XAI Feature Vector Contributions</span>
              </div>
            </div>
          </div>
          <Link
            to="/assess/alternative"
            className="w-full py-3 rounded-xl bg-navy-800 hover:bg-brand-blue text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 border border-navy-700 hover:border-brand-blue shadow-md"
          >
            <span>Start Alternative Evaluation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 3. Recent Assessments Section with Real Database Records */}
      <div className="bg-navy-900/80 border border-navy-800 rounded-2xl p-6 sm:p-7 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-navy-800">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-brand-cyan" />
            <h2 className="text-base font-bold text-white">Recent Assessments</h2>
          </div>
          <Link
            to="/history"
            className="text-xs text-brand-cyan hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
          >
            <span>View Full History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <DashboardRecentEvaluations />
      </div>

      {/* 4. Architecture & Verified Service Health Section */}
      <div className="bg-navy-900/60 border border-navy-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Server className="w-4 h-4 text-brand-cyan" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Architecture &amp; Real-Time Service Status
            </h2>
          </div>
          <button
            onClick={checkHealth}
            disabled={isChecking}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-brand-cyan transition-colors disabled:opacity-50"
            title="Recheck service connectivity"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-brand-cyan' : ''}`} />
            <span>{isChecking ? 'Checking...' : 'Check Status'}</span>
            {serviceStatus.lastChecked && (
              <span className="text-[11px] text-slate-500 ml-1">
                ({serviceStatus.lastChecked})
              </span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Spring Boot */}
          <div className="p-4 rounded-xl bg-navy-950/70 border border-navy-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Spring Boot Gateway</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                serviceStatus.springBoot.status === 'ONLINE'
                  ? 'bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30'
                  : serviceStatus.springBoot.status === 'CHECKING'
                  ? 'bg-brand-amber/15 text-brand-amber border border-brand-amber/30'
                  : 'bg-brand-rose/15 text-brand-rose border border-brand-rose/30'
              }`}>
                {serviceStatus.springBoot.status}
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Target: <strong className="font-mono text-slate-200">http://localhost:8080</strong>
            </div>
            <div className="text-[11px] text-slate-500">
              JWT security, Flyway migrations, credit application persistence.
            </div>
          </div>

          {/* Traditional ML Service */}
          <div className="p-4 rounded-xl bg-navy-950/70 border border-navy-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Traditional ML Service</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                serviceStatus.traditionalMl.status === 'ONLINE'
                  ? 'bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30'
                  : serviceStatus.traditionalMl.status === 'CHECKING'
                  ? 'bg-brand-amber/15 text-brand-amber border border-brand-amber/30'
                  : 'bg-brand-rose/15 text-brand-rose border border-brand-rose/30'
              }`}>
                {serviceStatus.traditionalMl.status}
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Target: <strong className="font-mono text-slate-200">http://127.0.0.1:8002</strong>
            </div>
            <div className="text-[11px] text-slate-500">
              FastAPI service with 12-feature Home Credit Logistic model.
            </div>
          </div>

          {/* Alternative ML Service */}
          <div className="p-4 rounded-xl bg-navy-950/70 border border-navy-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Alternative ML Service</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                serviceStatus.alternativeMl.status === 'ONLINE'
                  ? 'bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30'
                  : serviceStatus.alternativeMl.status === 'CHECKING'
                  ? 'bg-brand-amber/15 text-brand-amber border border-brand-amber/30'
                  : 'bg-brand-rose/15 text-brand-rose border border-brand-rose/30'
              }`}>
                {serviceStatus.alternativeMl.status}
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Target: <strong className="font-mono text-slate-200">http://127.0.0.1:8001</strong>
            </div>
            <div className="text-[11px] text-slate-500">
              FastAPI service with 8-feature thin-file behavioral pipeline.
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 pt-2 text-[11px] text-slate-500">
          <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-brand-cyan" />
          <span>Status indicators actively verify network connectivity via live health probes rather than assuming static availability.</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
