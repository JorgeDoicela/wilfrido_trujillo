import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  Building2,
  ShieldCheck,
} from 'lucide-react';

export interface LandingDetailExplorerProps {
  onEnterPortal: () => void;
  onScrollToValidator: () => void;
}

export const LandingDetailExplorer: React.FC<LandingDetailExplorerProps> = ({
  onEnterPortal,
  onScrollToValidator,
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const roles = [
    {
      id: 'estudiantes',
      navTitle: 'Para Estudiantes',
      title: 'Acreditación Soberana y Gestión Transparente',
      description:
        'El estudiante cuenta con un entorno guiado paso a paso para enrolarse mediante código de espacio, cursar la inducción obligatoria, registrar bitácoras diarias y auditar su informe final antes del visado definitivo.',
      icon: GraduationCap,
      features: [
        {
          title: 'Enrolamiento Inmediato',
          description: 'Ingreso directo mediante código alfanumérico sin trámites burocráticos.',
        },
        {
          title: 'Inducción Audiovisual Guiada',
          description: 'Control estricto de reproducción obligatoria para habilitar el registro de horas.',
        },
        {
          title: 'Bitácoras con Cómputo Automático',
          description: 'Contabilización precisa de hasta 240 horas laborales según el RRA CES.',
        },
        {
          title: 'Pre-Dictamen Heurístico',
          description: 'Revisión algorítmica de la estructura del PDF antes de enviarlo al docente.',
        },
      ],
      interactiveScreen: (
        <div className="bg-[#f5f5f5] p-5 rounded-lg border border-[#edebe9] text-left select-none">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#e0e0e0]">
            <span className="text-xs font-semibold text-[#242424] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#107c10]" />
              Panel del Estudiante · Periodo 2026-1
            </span>
            <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-[#e0e0e0] font-mono text-[#616161]">
              ESTADO: EN CURSO
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="bg-white p-3 rounded border border-[#e0e0e0]">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-[#242424]">Inducción Audiovisual</span>
                <span className="text-[#107c10] font-bold">100% Superada</span>
              </div>
              <p className="text-[11px] text-[#616161]">
                3 de 3 cápsulas completadas sin saltos indebidos.
              </p>
            </div>

            <div className="bg-white p-3 rounded border border-[#e0e0e0]">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-[#242424]">Acumulado de Horas</span>
                <span className="text-[#0f6cbd] font-bold">240 / 240 Horas</span>
              </div>
              <div className="w-full bg-[#edebe9] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#0f6cbd] h-full rounded-full w-full" />
              </div>
            </div>

            <div className="bg-[#dff6dd] p-3 rounded border border-[#a3d9a5] flex items-center justify-between text-xs">
              <span className="text-[#107c10] font-semibold">Informe Final:</span>
              <span className="text-[#107c10] font-bold">Pre-Dictamen Favorable</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'docentes',
      navTitle: 'Para Docentes & Coordinador',
      title: 'Supervisión Centralizada y Calificación por Rúbricas',
      description:
        'El docente tutor y el coordinador de prácticas disponen de una matriz unificada para supervisar cohortes completas, aprobar bitácoras en lote, aplicar rúbricas oficiales y generar actas de acreditación definitivas.',
      icon: Users,
      features: [
        {
          title: 'Matriz de Seguimiento',
          description: 'Visibilidad completa del estado y progreso de cada estudiante asignado.',
        },
        {
          title: 'Rúbricas Ponderadas RRA',
          description: 'Evaluación objetiva según los criterios normativos del Consejo de Educación Superior.',
        },
        {
          title: 'Visado y Observaciones',
          description: 'Aprobación formal o retroalimentación técnica con trazabilidad de cambios.',
        },
        {
          title: 'Exportación de Actas',
          description: 'Generación de informes consolidados listos para auditorías institucionales.',
        },
      ],
      interactiveScreen: (
        <div className="bg-[#f5f5f5] p-5 rounded-lg border border-[#edebe9] text-left select-none">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#e0e0e0]">
            <span className="text-xs font-semibold text-[#242424] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0f6cbd]" />
              Matriz de Supervisión · Despacho Coordinación
            </span>
            <span className="text-[10px] bg-[#ebf3fc] px-2 py-0.5 rounded border border-[#cfe4fa] font-mono text-[#0f6cbd]">
              48 ESTUDIANTES
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="bg-white p-2.5 rounded border border-[#e0e0e0] flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#242424] block">Prácticas Laborales PPP</span>
                <span className="text-[11px] text-[#616161]">32 Activas · 16 Finalizadas</span>
              </div>
              <span className="px-2 py-1 rounded bg-[#dff6dd] text-[#107c10] font-bold text-[10px]">
                AL DÍA
              </span>
            </div>

            <div className="bg-white p-2.5 rounded border border-[#e0e0e0] flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#242424]">Informes por Visar</span>
                <span className="text-[11px] text-[#616161] block">Pre-calificados por el Auditor RRA</span>
              </div>
              <span className="px-2 py-1 rounded bg-[#ebf3fc] text-[#0f6cbd] font-bold text-[10px]">
                3 PENDIENTES
              </span>
            </div>

            <div className="bg-white p-2.5 rounded border border-[#e0e0e0] flex items-center justify-between">
              <span className="font-medium text-[#242424]">Actas Consolidadas Firmadas</span>
              <span className="font-semibold text-[#107c10]">100% Legalizadas</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'empresas',
      navTitle: 'Para Empresas & Tutores',
      title: 'Homologación de Convenios y Control de Desempeño',
      description:
        'Las instituciones receptoras y tutores empresariales formalizan la aceptación de practicantes, validan la asistencia semanal in situ y emiten la certificación empresarial requerida por la normativa universitaria.',
      icon: Building2,
      features: [
        {
          title: 'Convenios Registrados',
          description: 'Validación de convenios marco y cartas de compromiso interinstitucional.',
        },
        {
          title: 'Control de Asistencia',
          description: 'Validación de horas laboradas y actividades prácticas desarrolladas.',
        },
        {
          title: 'Evaluación Empresarial',
          description: 'Calificación de competencias técnicas y actitudinales en el entorno real.',
        },
        {
          title: 'Certificado de Culminación',
          description: 'Suscripción de constancias con valor legal para acreditación universitaria.',
        },
      ],
      interactiveScreen: (
        <div className="bg-[#f5f5f5] p-5 rounded-lg border border-[#edebe9] text-left select-none">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#e0e0e0]">
            <span className="text-xs font-semibold text-[#242424] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#107c10]" />
              Validación Empresarial · Entorno Productivo
            </span>
            <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-[#e0e0e0] font-mono text-[#616161]">
              CONVENIO ACTIVO
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="bg-white p-3 rounded border border-[#e0e0e0]">
              <span className="text-[11px] text-[#616161] block">Empresa Colaboradora:</span>
              <span className="font-semibold text-[#242424]">GAD Municipalidad / Sector Tecnológico</span>
            </div>

            <div className="bg-white p-3 rounded border border-[#e0e0e0] flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#242424] block">Evaluación de Desempeño</span>
                <span className="text-[11px] text-[#616161]">Rigor técnico, puntualidad y ética</span>
              </div>
              <span className="font-bold text-[#107c10] text-sm">9.8 / 10</span>
            </div>

            <div className="bg-[#eff6fc] p-2.5 rounded border border-[#9ec5fe] flex items-center justify-between">
              <span className="text-[#0078d4] font-medium">Certificado de Finiquito:</span>
              <span className="font-bold text-[#0078d4]">Firmado en Sede</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'auditoria',
      navTitle: 'Auditoría Pública & Validación QR',
      title: 'Transparencia Criptográfica y Consulta Abierta',
      description:
        'Cualquier ciudadano, institución empleadora o comité evaluador del CACES puede comprobar la autenticidad e inmutabilidad de los certificados emitidos sin necesidad de credenciales de acceso.',
      icon: ShieldCheck,
      features: [
        {
          title: 'Algoritmo SHA-256',
          description: 'Huella criptográfica inalterable generada al momento de la aprobación oficial.',
        },
        {
          title: 'Código QR Instantáneo',
          description: 'Escaneo directo desde cualquier teléfono móvil o lector de documentos.',
        },
        {
          title: 'Consulta Soberana',
          description: 'Sin intermediarios de terceros: verificación directa contra la base de datos oficial.',
        },
        {
          title: 'Auditoría RRA',
          description: 'Trazabilidad de fecha, hora, tutor responsable y periodo lectivo exacto.',
        },
      ],
      interactiveScreen: (
        <div className="bg-[#f5f5f5] p-5 rounded-lg border border-[#edebe9] text-left select-none">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#e0e0e0]">
            <span className="text-xs font-semibold text-[#242424] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#107c10]" />
              Validador Criptográfico Soberano
            </span>
            <span className="text-[10px] bg-[#dff6dd] px-2 py-0.5 rounded border border-[#a3d9a5] font-mono text-[#107c10] font-bold">
              VERIFICADO
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="bg-white p-2.5 rounded border border-[#e0e0e0]">
              <span className="text-[10px] text-[#616161] uppercase tracking-wider block font-semibold">
                Hash Único Criptográfico
              </span>
              <span className="font-mono text-[11px] text-[#0f6cbd] font-bold break-all block mt-0.5">
                a1b2c3d4e5f6789012345678abcdef9876543210fedcba0987654321
              </span>
            </div>

            <div className="bg-white p-2.5 rounded border border-[#e0e0e0] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#616161] block">Documento:</span>
                <span className="font-semibold text-[#242424]">Certificado de Aprobación de Prácticas</span>
              </div>
              <span className="font-bold text-[#107c10]">VÁLIDO</span>
            </div>

            <div className="bg-white p-2.5 rounded border border-[#e0e0e0] flex items-center justify-between">
              <span className="text-[#616161]">Emisión:</span>
              <span className="font-semibold text-[#242424]">Universidad Nacional de Chimborazo</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentRole = roles[activeTab];

  return (
    <section id="explorador" className="py-16 sm:py-24 bg-white border-b border-[#e0e0e0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera del Explorador */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#0f6cbd] block mb-1">
            Explorador por Rol y Perspectiva
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#242424]">
            Un Ecosistema Diseñado a la Medida de Cada Actor Académico
          </h2>
          <p className="text-sm text-[#616161] mt-2">
            Descubre las herramientas especializadas implementadas para estudiantes, docentes tutores, empresas aliadas y auditores de acreditación.
          </p>
        </div>

        {/* Pestañas de Selección de Rol */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {roles.map((r, idx) => {
            const isCurrent = idx === activeTab;
            const TabIcon = r.icon;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`px-4 py-2.5 rounded-lg border text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  isCurrent
                    ? 'bg-[#0f6cbd] border-[#0f6cbd] text-white shadow-xs'
                    : 'bg-white border-[#e0e0e0] text-[#424242] hover:bg-[#f5f5f5] hover:border-[#c7c7c7]'
                }`}
              >
                <TabIcon className="w-4 h-4 shrink-0" />
                <span>{r.navTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Contenedor Principal de Detalles del Rol */}
        <div className="m365-card p-6 sm:p-10 bg-[#fafafa] border border-[#e0e0e0] rounded-xl shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Lado Izquierdo: Descripción y Capacidades */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#242424] mb-3">
                  {currentRole.title}
                </h3>
                <p className="text-sm text-[#616161] leading-relaxed mb-6">
                  {currentRole.description}
                </p>

                {/* Sub-grilla de 4 capacidades clave */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
                  {currentRole.features.map((feat) => (
                    <div
                      key={feat.title}
                      className="p-3 bg-white rounded-md border border-[#edebe9] shadow-2xs"
                    >
                      <span className="text-xs font-semibold text-[#242424] block mb-0.5">
                        {feat.title}
                      </span>
                      <p className="text-[11px] text-[#616161] leading-relaxed">
                        {feat.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#edebe9] flex items-center gap-3">
                <button
                  type="button"
                  onClick={onEnterPortal}
                  className="px-4 py-2 rounded-md bg-[#0f6cbd] text-white font-semibold text-xs hover:bg-[#115ea3] transition-colors cursor-pointer shadow-2xs"
                >
                  Acceder al Módulo
                </button>
                <button
                  type="button"
                  onClick={onScrollToValidator}
                  className="px-4 py-2 rounded-md bg-white border border-[#e0e0e0] text-[#242424] font-semibold text-xs hover:bg-[#f0f0f0] transition-colors cursor-pointer shadow-2xs"
                >
                  Probar Validador
                </button>
              </div>
            </div>

            {/* Lado Derecho: Simulador / Pantalla Interactiva */}
            <div className="lg:col-span-5">
              {currentRole.interactiveScreen}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
