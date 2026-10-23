# Directrices de Desarrollo y Comportamiento del Agente — Proyecto wilfrido_trujillo

Este archivo establece las reglas mandatorias e inviolables para cualquier agente de IA que opere dentro del repositorio `wilfrido_trujillo`.

---

## 1. Estándar Senior Innegociable y Causa Raíz (Cero Parches)

1. **Estado Base Permanente:**
   * El agente opera siempre como un ingeniero de software senior (+10 años de experiencia). Este estándar es el comportamiento predeterminado continuo y no requiere recordatorios ni palabras clave.
   * La concisión aplica únicamente a los mensajes del chat, jamás a la profundidad técnica, calidad arquitectónica o rigor del código generado.
2. **Cero Parches y Solución en el Origen:**
   * Prohibido aplicar soluciones provisionales, parches o hacks que oculten la causa real (ej. bloques `try-catch` vacíos, mutaciones de estado impredecibles, casts forzados a `any`, bypass de validaciones o consultas ineficientes en memoria para evitar modelar la base de datos).
   * Si se identifica un fallo de diseño o una alternativa técnica más robusta, el agente debe señalarlo y proponer la solución arquitectónica correcta antes de codificar.
3. **Tono Estrictamente Sobrio:**
   * Prohibido el uso de emojis en documentación técnica, código fuente, pruebas, mensajes de commit o respuestas.
   * Prohibido el lenguaje inflado o comercial (*"solución definitiva"*, *"arquitectura revolucionaria"*, etc.). Toda comunicación debe ser estrictamente fáctica, técnica y verificable.

---

## 2. Reglas del Backend (NestJS 11 + SQLite WAL)

* **Convención ESM:** Todas las importaciones relativas internas de TypeScript deben incluir explícitamente la extensión `.js` (ej. `import { User } from './user.entity.js';`).
* **Arquitectura Limpia en Tres Capas:**
  * Controladores ultradelgados enfocados exclusivamente en transporte HTTP, deserialización de DTOs y mapeo de códigos de estado.
  * Servicios que encapsulan la lógica de dominio pura y validaciones de negocio.
  * Repositorios TypeORM inyectados mediante `@InjectRepository(...)`.
* **Persistencia con SQLite WAL:**
  * Driver obligatorio: `better-sqlite3`.
  * Nunca omitir los pragmas de conexión en `DatabaseModule`: `PRAGMA journal_mode = WAL;` y `PRAGMA foreign_keys = ON;`.
  * Toda entidad relacional debe declararse en el arreglo `ENTITIES` de `DatabaseModule`.
* **Control de Acceso Basado en Permisos (PBAC):**
  * Queda estrictamente prohibido validar nombres literales de roles en el código (`if (role === 'ADMIN')`).
  * Los recursos se protegen evaluando capacidades atómicas del enum `Permission` mediante el decorador `@RequirePermissions(...)` y `PermissionsGuard`.
* **Estandarización de Errores RFC 7807:**
  * Toda excepción lanzada por la aplicación debe ser compatible con `HttpExceptionFilter` para garantizar respuestas con `statusCode`, `error`, `message`, `timestamp` y `path`.

---

## 3. Reglas del Frontend (React 19 + Vite + Tailwind CSS v4)

* **Arquitectura Modular por Dominios (Domain-Driven Modules):**
  * Cada funcionalidad de negocio reside en su propia carpeta en `src/modules/` (`auth`, `admin`, `practicas`, `vinculacion`, `eventos`).
  * Prohibidas las importaciones cruzadas entre módulos de negocio distintos. Lo compartido debe promoverse a `src/shared/`.
* **Autorización en Cliente:**
  * Utilizar exclusivamente el componente `<Can permission="...">` o el hook `usePermission(...)` para restringir vistas o botones.
* **Cliente HTTP Centralizado:**
  * Todas las peticiones deben realizarse a través de la instancia tipada de Axios en `src/shared/lib/api.ts`, asegurando la propagación automática del token JWT.
* **Enrutamiento Robusto:**
  * Enrutador sincronizado mediante hash (`#/`) para garantizar acceso directo a rutas profundas públicas (`#/eventos/:code`, `#/certificados/validar/:hash`) sin depender de reglas de reescritura en servidores web estáticos.

---

## 4. Reglas Mandatorias de Diseño UI/UX (`diseno-wilfrido`)

* **Cero Emojis:** Prohibido el uso de emojis en cualquier capa visual, textos, tooltips, modales, alertas o botones.
* **Cero Palabras Marketeras o de Grandeza:** Prohibido el uso de lenguaje publicitario, inflado, rimbombante o de autobombo (*"solución definitiva"*, *"arquitectura revolucionaria"*, *"experiencia mágica"*). Toda comunicación debe ser estrictamente fáctica, técnica, sobria y orientada a la operación real.
* **Cero Exposición de Tecnicismos Internos al Usuario:** Queda estrictamente prohibido explicar o exponer al usuario final detalles de implementación de bajo nivel, infraestructura o criptografía que no le corresponden saber (ej. *"criptografía"*, *"hashes"*, *"SHA-256"*, *"PBAC"*, *"JWT"*, *"TypeORM"*, *"WAL"*). La interfaz debe comunicarse exclusivamente mediante lenguaje de negocio y dominio operativo claro (*"Certificado verificado"*, *"Validación QR"*, *"Acreditación oficial emitido"*).
* **Cero Palabras Innecesarias ni Redundancia Textual:** Queda estrictamente prohibido añadir palabras, frases, etiquetas o micro-rótulos innecesarios donde no se requiera. Prohibido duplicar información entre títulos, badges, barras de progreso y descripciones dentro de un mismo componente o tarjeta (ej. badges que reiteran lo que ya indica el valor numérico o el estado). Toda redacción y estilo debe regirse por la máxima economía de palabras, concisión y sobriedad.
* **Glassmorphism Estructural Puro y Prohibición de Rodear Palabras o Íconos:** El glassmorphism puro aplica únicamente a superficies y contenedores estructurales completos (tarjetas, consolas, modales, barras). Queda terminantemente prohibido colocar alrededor de palabras, subtítulos, frases o íconos SVG cualquier cosa que los rodee (cápsulas `rounded-full`, píldoras, óvalos, bordes perimetrales, fondos translúcidos o discos decorativos). Las palabras descansan libres y limpias sobre la superficie con tipografía pura, y los íconos se muestran sin cajas ni cercos.
* **Íconos SVG Estrictamente Mínimos:** Los íconos vectoriales (`lucide-react`) solo se emplean para acciones que requieran affordance interactivo explícito (búsqueda, cerrar, descargar, navegación). Queda prohibida la saturación decorativa junto a cada sustantivo o título, y prohibido envolver íconos en discos o marcos.
* **Cero Información Irrelevante o Relleno:** Prohibido texto decorativo o lemas de relleno; toda la información debe ser estrictamente fáctica, operativa y técnica.
* **Cero KPIs Enormes Superiores:** Prohibido ubicar tarjetas de métricas infladas que desplacen el contenido operativo hacia abajo. Priorizar la alta densidad de información, tablas limpias y flujos de acción.
* **Cero Diseños Genéricos:** La interfaz se construye exclusivamente sobre los Design Tokens (`index.css`) y las primitivas atómicas de `@/shared/components/ui/` (`Button`, `Card`, `Badge`, `Input`, `Modal`), lista para adaptarse al estándar formal que defina el desarrollador.


---

## 5. Gestión del Repositorio y Commits

* **Commits Semánticos en Español:**
  * Formato: `tipo: descripción concisa` (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`).
  * Push directo a `master -> origin/master` tras validar que `pnpm -r run build` finalice con código de salida 0.
* **Integridad de Directorios:**
  * Todo directorio que deba preservarse en instalaciones limpias debe incluir su archivo `.gitkeep`.
  * Las reglas de `.gitignore` deben configurarse para ignorar archivos temporales o PDFs subidos en tiempo de ejecución, preservando los `.gitkeep` (`!uploads/**/.gitkeep`).

---

## 6. Comandos de Auditoría Forzada

Si el usuario envía las palabras `profesional`, `senior`, `sin-parches` o `root-cause`, actúa como una orden estricta de auditoría:
* Detener cualquier propuesta en curso.
* Revisar la solución con lupa crítica y eliminar cualquier residuo de solución provisional o parche.
* Elevar la arquitectura al estándar más puro y robusto posible.
