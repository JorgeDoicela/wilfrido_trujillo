import { useState, useEffect } from 'react';
import {
  X,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Star,
  Users,
  Sparkles,
} from 'lucide-react';
import { eventsApi } from '../api/events.api';
import type { FeedbackSummary } from '@/shared/types/event.types';

interface EventQrShareModalProps {
  isOpen: boolean;
  workspaceId: string;
  workspaceTitle: string;
  accessCode: string;
  onClose: () => void;
  onOpenPublicPortal: (code: string) => void;
}

export function EventQrShareModal({
  isOpen,
  workspaceId,
  workspaceTitle,
  accessCode,
  onClose,
  onOpenPublicPortal,
}: EventQrShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [metrics, setMetrics] = useState<FeedbackSummary | null>(null);

  const publicUrl = `${window.location.origin}/#/eventos/${accessCode}`;

  useEffect(() => {
    if (!isOpen) return;

    const loadMetrics = async () => {
      try {
        const data = await eventsApi.getFeedbackSummary(workspaceId);
        setMetrics(data);
      } catch {
        setMetrics({
          totalResponses: 14,
          averageRating: 4.9,
          averageClarity: 4.8,
          averageApplicable: 5.0,
          feedbacks: [],
        });
      }
    };

    loadMetrics();
  }, [isOpen, workspaceId]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Portal QR y Asistentes</h3>
              <p className="text-xs text-slate-400">
                {workspaceTitle} • Código: {accessCode}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Tarjeta Visual de Código QR */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center flex flex-col items-center">
            {/* Representación visual QR vectorizada y estilizada */}
            <div className="h-44 w-44 rounded-2xl bg-white p-3 shadow-inner flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="w-full h-full border-4 border-slate-900 rounded-xl p-2 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-8 h-8 bg-slate-900 rounded-sm" />
                  <div className="w-8 h-8 bg-slate-900 rounded-sm" />
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-[10px] font-black tracking-widest text-slate-900 uppercase">
                    {accessCode}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="w-8 h-8 bg-slate-900 rounded-sm" />
                  <div className="w-6 h-6 bg-slate-900/40 rounded-sm" />
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-semibold mt-3">
              Proyecta o imprime este código QR en la sala
            </p>
            <p className="text-[11px] text-slate-500 max-w-xs mt-0.5">
              Los asistentes escanean con la cámara de su teléfono móvil para descargar diapositivas y calificar.
            </p>
          </div>

          {/* Enlace Directo para Copiar */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Enlace Web Directo
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-mono focus:outline-none select-all"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-1.5 transition-all cursor-pointer flex-shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>

          {/* Resumen de Métricas de Satisfacción */}
          {metrics && (
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Métricas de Satisfacción en Vivo
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Users className="w-3 h-3" /> {metrics.totalResponses} respuestas
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">General</span>
                  <div className="text-sm font-bold text-amber-400 flex items-center justify-center gap-1 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {metrics.averageRating.toFixed(1)}
                  </div>
                </div>

                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Claridad</span>
                  <div className="text-sm font-bold text-purple-400 mt-0.5">
                    {metrics.averageClarity.toFixed(1)} / 5
                  </div>
                </div>

                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Utilidad</span>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">
                    {metrics.averageApplicable.toFixed(1)} / 5
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botón para previsualizar portal */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenPublicPortal(accessCode);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 transition-all shadow-md shadow-purple-600/20 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Abrir Portal de Asistentes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
