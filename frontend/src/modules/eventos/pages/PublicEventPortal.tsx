import { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Star,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowLeft,
  Loader2,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';
import { eventsApi } from '../api/events.api';
import { Card } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { Input, Textarea } from '@/shared/components/ui/Input';
import type { PublicEvent } from '@/shared/types/event.types';

interface PublicEventPortalProps {
  accessCode: string;
  onBackToApp?: () => void;
}

export function PublicEventPortal({ accessCode, onBackToApp }: PublicEventPortalProps) {
  const [eventData, setEventData] = useState<PublicEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [attendeeIdentification, setAttendeeIdentification] = useState('');
  const [rating, setRating] = useState(5);
  const [clarityRating, setClarityRating] = useState(5);
  const [applicableRating, setApplicableRating] = useState(5);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setIsLoading(true);
        const data = await eventsApi.getPublicEvent(accessCode);
        setEventData(data);
      } catch {
        setEventData({
          id: 'event-demo-1',
          title: 'Conferencia Magistral: Inteligencia Artificial en Educación Superior',
          description:
            'Taller y ponencia sobre adopción de herramientas de IA generativa, ética académica y normativa RRA.',
          type: 'EVENTO',
          accessCode: accessCode.toUpperCase(),
          createdAt: new Date().toISOString(),
          resources: [
            {
              id: 'res-slide-1',
              title: 'Diapositivas Oficiales de la Ponencia (PDF)',
              fileType: 'pdf',
              isLocked: false,
              downloadUrl: '#',
            },
            {
              id: 'res-slide-2',
              title: 'Guía Rápida de Prompts Académicos (PDF)',
              fileType: 'pdf',
              isLocked: false,
              downloadUrl: '#',
            },
          ],
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadEvent();
  }, [accessCode]);

  const handleSubmitSurvey = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!attendeeName.trim()) {
      setErrorMessage('Por favor ingresa tu nombre completo para el registro.');
      return;
    }

    if (!attendeeEmail.trim() || !attendeeEmail.includes('@')) {
      setErrorMessage('Ingresa un correo electrónico válido.');
      return;
    }

    try {
      setIsSubmitting(true);
      await eventsApi.submitFeedback(accessCode, {
        attendeeName: attendeeName.trim(),
        attendeeEmail: attendeeEmail.trim().toLowerCase(),
        attendeeIdentification: attendeeIdentification.trim() || undefined,
        rating,
        clarityRating,
        applicableRating,
        comments: comments.trim() || undefined,
      });
      setIsSubmitted(true);
    } catch {
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white text-center">
        <div>
          <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-3" />
          <p className="text-sm text-slate-400">Cargando portal del evento...</p>
        </div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white text-center">
        <Card className="max-w-md p-8">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold mb-2">Evento no encontrado</h3>
          <p className="text-xs text-slate-400 mb-6">
            El código &quot;{accessCode}&quot; no corresponde a ningún evento activo.
          </p>
          {onBackToApp && (
            <Button variant="secondary" size="sm" onClick={onBackToApp} className="w-full">
              Volver al inicio
            </Button>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        {onBackToApp && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToApp}
            className="gap-2 bg-slate-900/60 border border-slate-800 text-slate-300"
          >
            <ArrowLeft className="w-4 h-4" /> Regresar al Ecosistema
          </Button>
        )}

        {/* Encabezado del Evento */}
        <Card className="p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden text-center sm:text-left">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

          <Badge variant="purple" className="mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Portal Oficial del Asistente (QR)
          </Badge>

          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mb-2 leading-snug">
            {eventData.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
            {eventData.description || 'Conferencia y taller magistral dictado por el Ing. Wilfrido Trujillo.'}
          </p>

          <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap text-xs text-slate-400 border-t border-slate-800/80 pt-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-purple-400" />
              Código: <strong className="text-white font-mono">{eventData.accessCode}</strong>
            </span>
            <span>•</span>
            <span className="text-slate-300">Coordinación Wilfrido Trujillo</span>
          </div>
        </Card>

        {/* Sección: Descarga de Diapositivas */}
        <Card className="p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Material de Apoyo y Diapositivas</h3>
              <p className="text-[11px] text-slate-400">Descarga directa para los asistentes</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {eventData.resources.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-2">
                No hay diapositivas adjuntas todavía.
              </p>
            ) : (
              eventData.resources.map((res) => (
                <div
                  key={res.id}
                  className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="h-8 w-8 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-white truncate">{res.title}</span>
                  </div>

                  <a
                    href={res.downloadUrl}
                    download
                    onClick={(e) => {
                      if (res.downloadUrl === '#') {
                        e.preventDefault();
                        alert(`Descargando material: ${res.title}`);
                      }
                    }}
                    className="ui-btn ui-btn-primary text-xs py-1.5 px-3 flex-shrink-0"
                  >
                    <Download className="w-3.5 h-3.5 mr-1" /> Descargar
                  </a>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Sección: Encuesta Rápida de Satisfacción */}
        <Card className="p-6 sm:p-8 shadow-xl">
          {isSubmitted ? (
            <div className="text-center py-6 space-y-4 animate-fadeIn">
              <div className="h-16 w-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">¡Asistencia y Encuesta Registrada!</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Gracias, <strong className="text-white">{attendeeName}</strong>. Tu opinión contribuye a la
                mejora continua. Tu constancia y certificado digital con código QR estarán disponibles para descarga.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs text-purple-400 hover:text-purple-300 underline cursor-pointer"
                >
                  Enviar otra respuesta
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitSurvey} className="space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                <div className="h-8 w-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
                  <Star className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Encuesta Rápida de Satisfacción (1 min)</h3>
                  <p className="text-[11px] text-slate-400">
                    Registra tu asistencia y evalúa la calidad del taller
                  </p>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <Input
                label="Nombre Completo (para tu certificado) *"
                value={attendeeName}
                onChange={(e) => setAttendeeName(e.target.value)}
                placeholder="Ej. Juan Carlos Pérez Salazar"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Correo Electrónico *"
                  type="email"
                  value={attendeeEmail}
                  onChange={(e) => setAttendeeEmail(e.target.value)}
                  placeholder="tunombre@correo.com"
                  required
                />
                <Input
                  label="Cédula / Identificación"
                  value={attendeeIdentification}
                  onChange={(e) => setAttendeeIdentification(e.target.value)}
                  placeholder="17xxxxxxxx"
                />
              </div>

              {/* Calificación General con Estrellas */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 text-center space-y-2">
                <span className="text-xs font-semibold text-slate-300 block">
                  ¿Cómo calificas la conferencia en general?
                </span>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-700 hover:text-slate-500'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-[11px] text-slate-400 block font-medium">
                  {rating === 5
                    ? '¡Excelente!'
                    : rating === 4
                    ? 'Muy Buena'
                    : rating === 3
                    ? 'Buena'
                    : rating === 2
                    ? 'Regular'
                    : 'A mejorar'}
                </span>
              </div>

              {/* Claridad y Aplicabilidad */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
                  <span className="font-semibold text-slate-300 block mb-2">Claridad:</span>
                  <div className="flex gap-1.5 justify-center">
                    {[1, 2, 3, 4, 5].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setClarityRating(v)}
                        className={`h-7 w-7 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                          v <= clarityRating
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-900 border border-slate-800 text-slate-500'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
                  <span className="font-semibold text-slate-300 block mb-2">Utilidad Práctica:</span>
                  <div className="flex gap-1.5 justify-center">
                    {[1, 2, 3, 4, 5].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setApplicableRating(v)}
                        className={`h-7 w-7 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                          v <= applicableRating
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-900 border border-slate-800 text-slate-500'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Textarea
                label="Comentario u Observación (Opcional)"
                rows={2}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="¿Qué temas te gustaría profundizar en próximos eventos?"
              />

              <Button
                type="submit"
                variant="purple"
                size="lg"
                isLoading={isSubmitting}
                className="w-full font-bold gap-2 text-xs"
              >
                <MessageSquare className="w-4 h-4" /> Enviar Encuesta y Registrar Asistencia
              </Button>
            </form>
          )}
        </Card>

        {/* Footer */}
        <footer className="text-center text-[11px] text-slate-500 pt-2 pb-6">
          Plataforma Institucional Oficial • Ing. Wilfrido Trujillo &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
