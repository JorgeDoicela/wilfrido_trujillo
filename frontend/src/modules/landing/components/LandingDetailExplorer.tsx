import React, { useState } from 'react';

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
      navTitle: 'Estudiantes',
      title: 'Acreditación y Seguimiento para Estudiantes',
      description:
        'Entorno de trabajo para enrolarse mediante código de espacio, cursar la inducción obligatoria, registrar bitácoras diarias y verificar el informe final antes de remitirlo al docente.',
      features: [
        {
          title: 'Enrolamiento Inmediato',
          description: 'Acceso directo mediante código de asignatura o periodo.',
        },
        {
          title: 'Inducción Audiovisual',
          description: 'Visualización certificada de directrices normativas.',
        },
        {
          title: 'Registro de Bitácoras',
          description: 'Cómputo progresivo de hasta 240 horas de prácticas laborales.',
        },
        {
          title: 'Pre-Dictamen Estructural',
          description: 'Verificación del informe en PDF antes del visado definitivo.',
        },
      ],
      interactiveScreen: (
        <div className="bg-white p-5 rounded-lg border border-[#e0e0e0] text-left select-none">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#edebe9]">
            <span className="text-xs font-semibold text-[#242424]">
              Panel Estudiantil · Periodo Lectivo Activo
            </span>
            <span className="text-xs text-[#616161]">
              En Curso
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded border border-[#e0e0e0]">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-[#242424]">Inducción Audiovisual</span>
                <span className="text-[#0f6cbd] font-semibold">Completada (3/3)</span>
              </div>
              <p className="text-xs text-[#616161]">
                Cápsulas de inducción aprobadas.
              </p>
            </div>

            <div className="p-3 rounded border border-[#e0e0e0]">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-[#242424]">Horas Registradas</span>
                <span className="text-[#242424] font-semibold">240 / 240 Horas</span>
              </div>
              <div className="w-full bg-[#edebe9] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#0f6cbd] h-full rounded-full w-full" />
              </div>
            </div>

            <div className="p-3 rounded border border-[#e0e0e0] flex items-center justify-between text-xs">
              <span className="text-[#242424]">Informe Final:</span>
              <span className="text-[#0f6cbd] font-semibold">Estructura Validada</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'docentes',
      navTitle: 'Docentes & Coordinación',
      title: 'Supervisión y Calificación por Rúbricas',
      description:
        'Control de cohortes asignadas, aprobación de bitácoras de actividades, aplicación de rúbricas oficiales y consolidación de actas para archivo institucional.',
      features: [
        {
          title: 'Matriz de Seguimiento',
          description: 'Control consolidado de estudiantes matriculados.',
        },
        {
          title: 'Rúbricas Ponderadas',
          description: 'Evaluación según criterios del Régimen Académico.',
        },
        {
          title: 'Visado Técnico',
          description: 'Aprobación formal con registro de observaciones.',
        },
        {
          title: 'Actas Oficiales',
          description: 'Exportación de matrices para acreditación de carrera.',
        },
      ],
      interactiveScreen: (
        <div className="bg-white p-5 rounded-lg border border-[#e0e0e0] text-left select-none">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#edebe9]">
            <span className="text-xs font-semibold text-[#242424]">
              Matriz de Supervisión · Despacho
            </span>
            <span className="text-xs text-[#616161]">
              48 Estudiantes
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded border border-[#e0e0e0] flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#242424] block">Prácticas Laborales</span>
                <span className="text-[#616161]">32 Activas · 16 Finalizadas</span>
              </div>
              <span className="text-[#0f6cbd] font-semibold">Al Día</span>
            </div>

            <div className="p-2.5 rounded border border-[#e0e0e0] flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#242424]">Informes por Visar</span>
                <span className="text-[#616161] block">Pre-calificados por el Auditor</span>
              </div>
              <span className="text-[#242424] font-semibold">3 Pendientes</span>
            </div>

            <div className="p-2.5 rounded border border-[#e0e0e0] flex items-center justify-between">
              <span className="text-[#242424]">Actas Consolidadas</span>
              <span className="font-semibold text-[#0f6cbd]">Legalizadas</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'empresas',
      navTitle: 'Empresas & Entidades Receptoras',
      title: 'Convenios y Control de Desempeño Laboral',
      description:
        'Formalización de aceptación de practicantes, supervisión in situ de horas trabajadas y suscripción de certificados de culminación empresarial.',
      features: [
        {
          title: 'Convenios Vigentes',
          description: 'Registro de acuerdos marco interinstitucionales.',
        },
        {
          title: 'Asistencia en Sede',
          description: 'Control de permanencia y puntualidad.',
        },
        {
          title: 'Evaluación Empresarial',
          description: 'Calificación de competencias aplicadas.',
        },
        {
          title: 'Certificación Final',
          description: 'Constancias de cumplimiento con valor universitario.',
        },
      ],
      interactiveScreen: (
        <div className="bg-white p-5 rounded-lg border border-[#e0e0e0] text-left select-none">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#edebe9]">
            <span className="text-xs font-semibold text-[#242424]">
              Entidad Receptora · Sector Productivo
            </span>
            <span className="text-xs text-[#616161]">
              Convenio Vigente
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded border border-[#e0e0e0]">
              <span className="text-[#616161] block">Entidad Colaboradora:</span>
              <span className="font-semibold text-[#242424]">Institución Pública / Empresa de Software</span>
            </div>

            <div className="p-3 rounded border border-[#e0e0e0] flex items-center justify-between">
              <span className="font-semibold text-[#242424]">Evaluación de Desempeño:</span>
              <span className="font-semibold text-[#0f6cbd]">9.8 / 10</span>
            </div>

            <div className="p-2.5 rounded border border-[#e0e0e0] flex items-center justify-between">
              <span className="text-[#242424]">Certificado de Finiquito:</span>
              <span className="font-semibold text-[#242424]">Suscrito</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'auditoria',
      navTitle: 'Validación Pública & Auditoría',
      title: 'Verificación Criptográfica y Consulta Abierta',
      description:
        'Comprobación de legitimidad de constancias y certificados emitidos mediante código QR o hash SHA-256 sin requerir inicio de sesión.',
      features: [
        {
          title: 'Algoritmo SHA-256',
          description: 'Huella digital única por cada certificado expedido.',
        },
        {
          title: 'Lectura QR',
          description: 'Acceso inmediato desde cualquier lector estándar.',
        },
        {
          title: 'Consulta Directa',
          description: 'Verificación contra el registro oficial de la carrera.',
        },
        {
          title: 'Trazabilidad RRA',
          description: 'Registro de fecha, periodo y tutor responsable.',
        },
      ],
      interactiveScreen: (
        <div className="bg-white p-5 rounded-lg border border-[#e0e0e0] text-left select-none">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#edebe9]">
            <span className="text-xs font-semibold text-[#242424]">
              Verificador Criptográfico
            </span>
            <span className="text-xs text-[#0f6cbd] font-semibold">
              Auténtico
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded border border-[#e0e0e0]">
              <span className="text-[10px] text-[#616161] uppercase tracking-wider block">
                Hash SHA-256 Registrado
              </span>
              <span className="font-mono text-xs text-[#242424] break-all block mt-0.5">
                a1b2c3d4e5f6789012345678abcdef9876543210fedcba0987654321
              </span>
            </div>

            <div className="p-2.5 rounded border border-[#e0e0e0] flex items-center justify-between">
              <span className="text-[#616161]">Documento:</span>
              <span className="font-semibold text-[#242424]">Certificado de Prácticas</span>
            </div>

            <div className="p-2.5 rounded border border-[#e0e0e0] flex items-center justify-between">
              <span className="text-[#616161]">Emisor:</span>
              <span className="font-semibold text-[#242424]">Universidad Nacional de Chimborazo</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentRole = roles[activeTab];

  return (
    <section id="explorador" className="py-14 sm:py-20 bg-white border-b border-[#e0e0e0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera del Explorador */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#616161] block mb-1">
            Perspectivas de Uso
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#242424]">
            Herramientas por Rol Académico
          </h2>
          <p className="text-sm text-[#616161] mt-1.5">
            Acceso adaptado para estudiantes, docentes tutores, entidades colaboradoras y auditores de acreditación.
          </p>
        </div>

        {/* Pestañas de Selección */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {roles.map((r, idx) => {
            const isCurrent = idx === activeTab;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`px-3.5 py-2 rounded border text-xs font-semibold transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-[#0f6cbd] border-[#0f6cbd] text-white'
                    : 'bg-white border-[#d1d1d1] text-[#242424] hover:bg-[#f5f5f5]'
                }`}
              >
                <span>{r.navTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Contenedor Principal */}
        <div className="bg-[#f5f5f5] border border-[#e0e0e0] rounded-lg p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Lado Izquierdo: Descripción y Capacidades */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#242424] mb-2">
                  {currentRole.title}
                </h3>
                <p className="text-sm text-[#616161] leading-relaxed mb-6">
                  {currentRole.description}
                </p>

                {/* Sub-grilla de 4 capacidades clave */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {currentRole.features.map((feat) => (
                    <div
                      key={feat.title}
                      className="p-3 bg-white rounded border border-[#e0e0e0]"
                    >
                      <span className="text-xs font-semibold text-[#242424] block mb-0.5">
                        {feat.title}
                      </span>
                      <p className="text-xs text-[#616161] leading-relaxed">
                        {feat.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#e0e0e0] flex items-center gap-3">
                <button
                  type="button"
                  onClick={onEnterPortal}
                  className="px-4 py-2 rounded bg-[#0f6cbd] text-white font-semibold text-xs hover:bg-[#115ea3] transition-colors cursor-pointer"
                >
                  Acceder al Módulo
                </button>
                <button
                  type="button"
                  onClick={onScrollToValidator}
                  className="px-4 py-2 rounded bg-white border border-[#d1d1d1] text-[#242424] font-semibold text-xs hover:bg-[#f5f5f5] transition-colors cursor-pointer"
                >
                  Probar Validador
                </button>
              </div>
            </div>

            {/* Lado Derecho: Maqueta Limpia */}
            <div className="lg:col-span-5">
              {currentRole.interactiveScreen}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
