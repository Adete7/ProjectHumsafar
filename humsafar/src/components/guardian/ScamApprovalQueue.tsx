"use client";

import { useState, useEffect } from 'react';
import {
  AlertOctagon,
  CheckCircle,
  ShieldOff,
  PhoneCall,
  ShieldCheck,
  AlertTriangle,
  Clock,
  User,
  Filter,
  Check,
} from 'lucide-react';
import {
  SharedScamAlert,
  getSharedScamAlerts,
  updateScamAlertStatus,
} from '@/lib/storageEvents';

export default function ScamApprovalQueue() {
  const [alerts, setAlerts] = useState<SharedScamAlert[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'PENDING_REVIEW' | 'BLOCKED' | 'APPROVED'>('ALL');
  const [callingAlert, setCallingAlert] = useState<SharedScamAlert | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  useEffect(() => {
    setAlerts(getSharedScamAlerts());
    const listener = (e: any) => {
      if (e.detail) setAlerts(e.detail);
    };
    window.addEventListener('humsafar_scams_change', listener);
    return () => window.removeEventListener('humsafar_scams_change', listener);
  }, []);

  const handleBlock = (id: string) => {
    const updated = updateScamAlertStatus(id, 'BLOCKED');
    setAlerts(updated);
    setFeedbackToast('संदेश और नंबर को ब्लॉक कर दिया गया (Scam Confirmed & Number Blocked)');
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const handleApprove = (id: string) => {
    const updated = updateScamAlertStatus(id, 'APPROVED');
    setAlerts(updated);
    setFeedbackToast('संदेश सुरक्षित घोषित किया गया (Marked as Safe / False Alarm)');
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const handleCallSenior = (alert: SharedScamAlert) => {
    setCallingAlert(alert);
  };

  const filteredAlerts =
    filter === 'ALL' ? alerts : alerts.filter((a) => a.status === filter);

  return (
    <div className="flex flex-col gap-6">
      {/* Toast message */}
      {feedbackToast && (
        <div className="p-4 rounded-2xl bg-slate-900 text-amber-300 font-bold text-sm shadow-xl flex items-center gap-2 animate-bounce border-2 border-amber-400">
          <Check size={20} className="text-emerald-400" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Filter Tabs & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          {(
            [
              { key: 'ALL', label: 'सभी (All)' },
              { key: 'PENDING_REVIEW', label: 'समीक्षा बाकी (Pending)' },
              { key: 'BLOCKED', label: 'ब्लॉक किए गए (Blocked)' },
              { key: 'APPROVED', label: 'स्वीकृत (Safe)' },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all border ${
                filter === t.key
                  ? 'bg-slate-900 text-amber-300 border-slate-900 shadow'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {t.label} ({alerts.filter((a) => (t.key === 'ALL' ? true : a.status === t.key)).length})
            </button>
          ))}
        </div>

        <span className="text-xs font-bold text-slate-500">
          रीयल-टाइम सुरक्षा कतार (Live Security Queue)
        </span>
      </div>

      {/* Alerts List */}
      {filteredAlerts.length === 0 ? (
        <div className="glass-surface p-12 rounded-3xl border-2 border-dashed border-slate-300 text-center">
          <CheckCircle className="mx-auto text-emerald-500 mb-2" size={48} />
          <h3 className="text-elder-lg font-black text-slate-800">
            कतार में कोई संदेश नहीं है (No Alerts)
          </h3>
          <p className="text-sm font-bold text-slate-500">
            सभी संदिग्ध संदेशों का ऑडिट पूरा हो चुका है।
          </p>
        </div>
      ) : (
        filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`glass-surface-card rounded-3xl p-6 sm:p-7 border-l-8 shadow-xl flex flex-col gap-4 transition-all ${
              alert.status === 'BLOCKED'
                ? 'border-l-slate-600 opacity-80'
                : alert.status === 'APPROVED'
                ? 'border-l-emerald-500'
                : 'border-l-red-600'
            }`}
          >
            {/* Top metadata */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-xl ${
                    alert.riskLevel === 'CRITICAL'
                      ? 'bg-red-100 text-red-700'
                      : alert.riskLevel === 'MODERATE'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  <AlertOctagon size={22} />
                </div>
                <span className="font-black text-sm uppercase tracking-wide px-3 py-1 rounded-full bg-slate-900 text-white">
                  {alert.riskLevel} RISK
                </span>
                <span className="text-xs font-extrabold text-slate-600">
                  स्रोत: {alert.source || 'SMS / WhatsApp'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-black px-3 py-1 rounded-full border ${
                    alert.status === 'BLOCKED'
                      ? 'bg-red-100 text-red-800 border-red-300'
                      : alert.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                  }`}
                >
                  {alert.status === 'BLOCKED'
                    ? '🛑 BLOCKED & REPORTED'
                    : alert.status === 'APPROVED'
                    ? '✅ APPROVED SAFE'
                    : '⏳ PENDING GUARDIAN REVIEW'}
                </span>

                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <Clock size={14} /> {alert.timestamp}
                </span>
              </div>
            </div>

            {/* Content box */}
            <div className="bg-white/90 p-4 rounded-2xl border-2 border-slate-200">
              <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
                संदेश सामग्री (Target Message Text):
              </span>
              <p className="mt-1.5 text-slate-950 font-bold text-base font-mono">
                "{alert.content}"
              </p>
            </div>

            {/* AI Technical Analysis */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border-2 border-amber-200">
              <span className="text-xs font-black uppercase text-amber-900 tracking-wider">
                🛡️ AI विश्लेषण और ठगी का तरीका (Technical Breakdown for Caregiver):
              </span>
              <p className="mt-1 text-slate-800 font-bold text-sm">
                {alert.guardianSummary}
              </p>
            </div>

            {/* Elder explanation shown on Senior device */}
            <div className="text-xs font-bold text-slate-600">
              <span className="font-black text-slate-800">बुजुर्ग को चेतावनी (Shown to Senior):</span>{' '}
              {alert.elderExplanation}
            </div>

            {/* 1-Tap Actionable Guardian Controls */}
            <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-200 mt-2">
              <button
                onClick={() => handleBlock(alert.id)}
                disabled={alert.status === 'BLOCKED'}
                className="flex-1 min-w-[190px] py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShieldOff size={18} />
                <span>Confirm Scam & Block Number</span>
              </button>

              <button
                onClick={() => handleApprove(alert.id)}
                disabled={alert.status === 'APPROVED'}
                className="flex-1 min-w-[190px] py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <CheckCircle size={18} />
                <span>Mark as Safe / False Alarm</span>
              </button>

              <button
                onClick={() => handleCallSenior(alert)}
                className="py-3.5 px-5 rounded-xl bg-slate-900 hover:bg-orange-600 text-amber-300 hover:text-white font-black text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <PhoneCall size={18} />
                <span>दादाजी को कॉल करें (Call Senior)</span>
              </button>
            </div>
          </div>
        ))
      )}

      {/* Reassurance Call Simulation Modal */}
      {callingAlert && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in">
          <div className="glass-surface-warm p-8 rounded-3xl max-w-md w-full text-center border-4 border-amber-400 shadow-2xl">
            <div className="w-24 h-24 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-4 animate-bounce shadow-xl">
              <PhoneCall size={44} />
            </div>

            <h3 className="text-elder-2xl font-black text-slate-950">
              Calling Dada-ji...
            </h3>
            <p className="text-elder-base text-slate-700 font-bold mt-1 mb-6">
              Reassuring elder about flagged scam: "{callingAlert.content.slice(0, 45)}..."
            </p>

            <a
              href="tel:+919876543210"
              className="w-full block py-4 rounded-2xl bg-emerald-600 text-white font-black text-elder-base shadow-lg hover:bg-emerald-700 mb-3"
            >
              फोन डायल करें (+91 98765 43210)
            </a>

            <button
              onClick={() => setCallingAlert(null)}
              className="w-full py-3 rounded-2xl bg-slate-200 text-slate-800 font-black text-sm hover:bg-slate-300"
            >
              बंद करें (Close)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
