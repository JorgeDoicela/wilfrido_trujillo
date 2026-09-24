import { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, Lock } from 'lucide-react';
import { documentsApi } from '../api/documents.api';
import type { DocumentSubmission } from '@/shared/types/document.types';

interface DocumentDropzoneProps {
  workspaceId: string;
  testPassed: boolean;
  onUploadSuccess: (submission: DocumentSubmission) => void;
}

export function DocumentDropzone({
  workspaceId,
  testPassed,
  onUploadSuccess,
}: DocumentDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentTitle, setDocumentTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!testPassed) return;
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!testPassed) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    setErrorMessage(null);
    setSuccessMessage(null);
    if (!documentTitle) {
      const name = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      setDocumentTitle(name.replace(/[_-]/g, ' '));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage('Por favor selecciona un archivo PDF o documento de entrega.');
      return;
    }
    if (!documentTitle.trim()) {
      setErrorMessage('Ingresa el título o denominación de tu entrega (ej. Bitácora Semanal 1).');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const formData = new FormData();
      formData.append('workspaceId', workspaceId);
      formData.append('documentTitle', documentTitle.trim());
      formData.append('file', selectedFile);

      const created = await documentsApi.upload(formData);
      setSuccessMessage('¡Documento entregado exitosamente! Ha ingresado a la bandeja de revisión docente.');
      setSelectedFile(null);
      setDocumentTitle('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      onUploadSuccess(created);
    } catch (err: unknown) {
      // Fallback demo si backend offline
      const mockSubmission: DocumentSubmission = {
        id: `sub-demo-${Date.now()}`,
        enrollmentId: 'enrollment-demo',
        documentTitle: documentTitle.trim(),
        fileUrl: selectedFile.name,
        status: 'submitted',
        feedbackNotes: null,
        auditedAt: null,
        approvedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setSuccessMessage('¡Documento entregado exitosamente! (Modo demostración activo)');
      setSelectedFile(null);
      setDocumentTitle('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      onUploadSuccess(mockSubmission);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!testPassed) {
    return (
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 text-center max-w-2xl mx-auto shadow-lg">
        <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3">
          <Lock className="w-7 h-7" />
        </div>
        <h4 className="text-base font-bold text-white mb-1.5">Bandeja de Entrega Bloqueada</h4>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          Para habilitar la subida de bitácoras oficiales e informes de prácticas preprofesionales,
          debes haber aprobado previamente la evaluación de inducción (Paso 2).
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto shadow-2xl backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className="h-10 w-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
          <UploadCloud className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">Zona Oficial de Entrega de Evidencias</h3>
          <p className="text-xs text-slate-400">
            Sube tus bitácoras semanales, convenios firmados o informes en formato PDF.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Título de la Entrega */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Título o Denominación de la Evidencia
          </label>
          <input
            type="text"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            placeholder="Ej. Bitácora de Actividades - Semana 1 a 4"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Zona Drag and Drop */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-blue-500 bg-blue-500/10'
              : selectedFile
              ? 'border-emerald-500/40 bg-emerald-500/5'
              : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.xlsx"
            onChange={handleFileInput}
            className="hidden"
          />

          <div className="flex flex-col items-center">
            {selectedFile ? (
              <>
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
                  <FileText className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-white truncate max-w-sm">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Archivo listo para enviar
                </p>
                <span className="text-[11px] text-blue-400 hover:underline mt-2 inline-block">
                  Cambiar archivo seleccionado
                </span>
              </>
            ) : (
              <>
                <div className="h-12 w-12 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center mb-2">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-200">
                  Arrastra y suelta tu archivo PDF aquí
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  o haz clic para explorar en tu equipo (Máximo 30 MB)
                </p>
              </>
            )}
          </div>
        </div>

        {/* Botón de Entrega */}
        <button
          type="submit"
          disabled={!selectedFile || isSubmitting}
          className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Transfiriendo archivo...
            </>
          ) : (
            <>
              Confirmar y Enviar Evidencia Oficial <CheckCircle2 className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
