# Createam Static v2 — Guía para Agentes de Código

> Este documento describe la estructura, convenciones y detalles operativos del sitio estático de CREATEAM. Está escrito para quienes no conocen el proyecto y necesitan modificarlo o mantenerlo.

---

## 1. Resumen del proyecto

CREATEAM es el sitio web público de una agencia de desarrollo de software con sede en Lima, Perú. El sitio es **completamente estático**: no hay backend, base de datos ni generación de páginas en tiempo de ejecución.

- **Dominio de producción:** `https://createam.io/`
- **Idioma del contenido:** español (Perú, `es_PE`)
- **Público objetivo:** startups y empresas que buscan desarrollo web, apps móviles, arquitectura cloud, diseño UX/UI y presencia digital.

### Páginas principales

| Archivo | Propósito |
|---------|-----------|
| `index.html` | Página de inicio completa (hero, servicios, SaaS, proyectos, proceso, equipo, testimonios, métricas, planes, contacto, footer). |
| `servicios.html` | Página de servicios. |
| `proyectos.html` | Portfolio de proyectos. |
| `nosotros.html` | Sobre el equipo y la empresa. |
| `blog.html` | Blog/artículos. |
| `contacto.html` | Formulario y datos de contacto. |

> **Nota importante:** `blog.html`, `contacto.html`, `nosotros.html`, `proyectos.html` y `servicios.html` comparten el mismo patrón de marcado y scripts que `index.html`. Cualquier cambio en la navegación, el footer o los estilos globales debe replicarse en todos los archivos HTML o centralizarse en `css/bundle.css` y `js/animations.js`.

---

## 2. Stack tecnológico

- **HTML5** semántico, con atributos de accesibilidad básicos (`aria-label`, `aria-hidden`, `role`, etc.).
- **Tailwind CSS** compilado en un solo archivo: `css/bundle.css`. El CSS utiliza las variables `--tw-*` y clases utilitarias de Tailwind. No se debe editar `bundle.css` directamente para agregar clases nuevas; en su lugar, usa clases de Tailwind ya presentes o añade estilos en línea/etiquetas `<style>` dentro del HTML.
- **JavaScript vanilla** en `js/animations.js`.
- **GSAP 3.12.5** con el plugin **ScrollTrigger**, cargado desde CDN (`cdnjs.cloudflare.com`). Si el CDN falla, las animaciones simplemente no se ejecutan; el contenido sigue siendo visible.
- **Iconos Lucide** embebidos como SVG inline; no hay librería de iconos externa.
- **Fuentes de Google:** Space Grotesk, Inter e IBM Plex Mono.

### Dependencias externas (CDN)

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```

No hay `package.json`, `node_modules`, `pyproject.toml`, `composer.json` ni ningún otro manifiesto de paquetes en este repositorio.

---

## 3. Estructura de archivos

```
Createam_Static_v2/
├── index.html              # Página principal
├── servicios.html
├── proyectos.html
├── blog.html
├── nosotros.html
├── contacto.html
├── css/
│   └── bundle.css          # Tailwind CSS compilado y minificado
├── js/
│   └── animations.js       # Animaciones GSAP/ScrollTrigger y utilidades
├── images/                 # Recursos gráficos (JPG, PNG)
│   ├── hero_photo_a.jpg
│   ├── mockup-*.jpg
│   └── ...
├── logo.png                # Favicon y logo del sitio
├── _redirects              # Reglas de redirección para el host (estilo Netlify)
├── robots.txt              # Permitir todo; apunta al sitemap
└── sitemap.xml             # Sitemap para SEO
```

### Archivos de configuración/deployment

- **`_redirects`**: contiene redirecciones 301 de URLs limpias (`/servicios` → `/servicios.html`, etc.). No hay catch-all SPA; las rutas inexistentes deben servir `404.html` (Netlify lo hace automáticamente).
- **`robots.txt`**: permite todo a todos los user-agents y señala `https://createam.io/sitemap.xml`.
- **`sitemap.xml`**: lista todas las páginas del sitio (principales, servicios, blog y legal) con prioridades y frecuencias de cambio. Mantenlo sincronizado al crear páginas.

---

## 4. Arquitectura y organización del código

### HTML

Cada página HTML sigue la misma estructura general:

1. `<head>` con metaetiquetas SEO/OG, fuentes y `css/bundle.css`.
2. `<body>` con `<div id="root">`.
3. Navegación fija (`<nav>`) + menú móvil (`#mobile-menu`).
4. `<main>` con secciones identificables por `id` (ej. `#servicios`, `#saas`, `#proyectos`, `#proceso`, `#contacto`).
5. `<footer>`.
6. Scripts al final del body: GSAP, ScrollTrigger, `js/animations.js` y un script inline para el menú móvil.

### CSS

- `css/bundle.css` es la única hoja de estilos global. Está minificada.
- Estilos adicionales específicos de página viven dentro de etiquetas `<style>` en el propio HTML (por ejemplo, animaciones del hero y el marquee de servicios en `index.html`).
- Paleta de colores principal:
  - Verde principal: `#22c55e`
  - Verde lima: `#84cc16`
  - Azul claro: `#38bdf8`
  - Fondo oscuro: `#081208`
  - Tarjetas: `#0d1f0d`

### JavaScript

`js/animations.js` contiene toda la lógica de animación basada en GSAP:

- Animación de entrada del hero (palabras del `h1`, contenido e ilustración).
- Animaciones de scroll para encabezados de sección (`.section-header`), tarjetas de servicios (`.service-card`), tarjetas SaaS (`.saas-card`), proyectos (`.project-item`), pasos del proceso (`.step-item`), testimonios (`.testimonial-card`), métricas (`.metric-card`), precios (`.pricing-card`) y formulario de contacto.
- Animación de contadores para números grandes (150+, 8+, 98%, etc.).
- Efecto de navbar al hacer scroll (fondo oscuro con blur).
- Botón "volver arriba".
- Carga condicional de GSAP desde CDN si no está disponible.

Además, cada página HTML incluye un script inline que:

- Intercepta clics en enlaces con hash-router (`#/ruta`) y los redirige a las páginas estáticas correspondientes.
- Maneja el envío de formularios de forma simulada (`e.preventDefault()` + mensaje de éxito).
- Controla el menú móvil.

---

## 5. Cómo ejecutar y probar

No hay proceso de build. Para ver el sitio localmente, sirve la carpeta raíz con cualquier servidor estático.

### Opciones rápidas

Con Python:

```bash
# Python 3
python -m http.server 8000
```

Con Node.js (si tienes `npx`):

```bash
npx serve .
```

Con PHP:

```bash
php -S localhost:8000
```

Luego abre `http://localhost:8000`.

### Verificación manual recomendada

1. Abre `index.html` y revisa que el hero, el menú móvil y las animaciones de scroll funcionen.
2. Navega entre páginas usando los enlaces del menú.
3. Verifica en herramientas de desarrollo que no haya errores 404 en `css/bundle.css`, `js/animations.js`, `logo.png` ni las imágenes de `images/`.
4. Comprueba la vista responsive (móvil, tablet y escritorio).

---

## 6. Convenciones de estilo

- **Idioma:** todo el contenido visible, metaetiquetas y comentarios clave están en español.
- **Clases utilitarias:** se usan clases de Tailwind extensamente. Las clases personalizadas más importantes son:
  - `.btn-brutal` y `.btn-brutal-outline`: botones con estilo "neobrutalista".
  - `.section-header`: encabezados animados por ScrollTrigger.
  - `.service-card`, `.saas-card`, `.project-item`, `.testimonial-card`, `.metric-card`, `.pricing-card`: elementos con animaciones asociadas.
- **Colores:** se aplican principalmente con clases de Tailwind (ej. `text-[#22c55e]`, `bg-[#081208]`) y ocasionalmente con atributos `style` para valores dinámicos.
- **Iconos:** todos son SVG inline de Lucide. No uses fuentes de iconos.
- **Imágenes:** formato JPG para fotos, PNG para el logo. Se almacenan en `images/` y se referencian con rutas relativas (`images/...`).

---

## 7. Estrategia de testing

No hay suite de tests automatizados en este proyecto. El testing es manual:

- Revisión visual en navegadores principales (Chrome, Firefox, Safari, Edge).
- Validación de markup con el [W3C Validator](https://validator.w3.org/).
- Validación de CSS con el [W3C CSS Validator](https://jigsaw.w3.org/css-validator/).
- Pruebas de rendimiento con Lighthouse.
- Verificación de enlaces rotos.

Si en el futuro se añade un framework o build tool, se recomienda introducir tests de accesibilidad (axe-core) y snapshots visuales.

---

## 8. Proceso de deployment

El proyecto está preparado para desplegarse como sitio estático:

1. Copia todos los archivos y carpetas al servicio de hosting estático (Netlify, Vercel, Cloudflare Pages, GitHub Pages, AWS S3, etc.).
2. Asegúrate de que `_redirects` se respete si usas Netlify.
3. Configura el dominio personalizado (`createam.io`).
4. Verifica que `robots.txt` y `sitemap.xml` sean accesibles en la raíz.
5. Actualiza las URLs canónicas y el `sitemap.xml` si cambias el dominio o añades páginas.

### Consideraciones de SEO

- Cada página tiene `title`, `meta description`, `canonical`, Open Graph y Twitter Cards.
- Las metaetiquetas geo apuntan a `Lima, Perú` (`PE-LIM`).
- El sitemap debe mantenerse sincronizado con las páginas reales.

---

## 9. Consideraciones de seguridad

- El sitio es estático, por lo que no hay superficie de ataque de backend.
- **Los formularios se envían vía WhatsApp, sin backend.** El handler en `js/main.js` intercepta el submit de `#contact-form` (index y contacto), arma el mensaje con los campos y abre `wa.me/51945111310` con el texto precargado. No hay servicio de terceros ni costo. Ambos formularios incluyen checkbox de consentimiento que enlaza a `politica-privacidad.html` (Ley 29733). Si algún día se quiere envío por email, integrar Formspree/Netlify Forms y quitar el handler.
- No se detectan credenciales, claves API ni archivos `.env` en el repositorio.
- Los scripts se cargan desde CDNs públicos. Si se requiere mayor control, considera descargar GSAP y servirlo localmente.

---

## 10. Notas para mantenedores

- **No edites `css/bundle.css` a mano** a menos que sea absolutamente necesario. Si necesitas nuevas utilidades, preferiblemente usa clases de Tailwind ya existentes o añade bloques `<style>` en el HTML correspondiente.
- **Mantén la coherencia entre páginas:** la navegación, el footer y los scripts inline se repiten en los 6 archivos HTML. Si modificas uno, actualiza los demás.
- **Cuidado con los identificadores de sección:** `animations.js` usa `id` como `#servicios`, `#saas`, `#proyectos`, `#proceso`, `#contacto` para disparar animaciones. No los cambies sin actualizar el JS.
- **Imágenes nuevas:** colócalas en `images/` y usa nombres descriptivos en minúsculas con guiones.
- **Subpáginas:** existen `servicios/*.html` (7 páginas, incluida `integracion-ia.html`) y `blog/*.html` (4 artículos), más `politica-privacidad.html` y `404.html` en la raíz. Todas comparten nav/footer; mantenlas sincronizadas. El servicio de IA aparece como tarjeta destacada "NUEVO" (ancho completo, `lg:col-span-2`) en `index.html` y `servicios.html`.
- **Botones flotantes:** el botón "volver arriba" tiene `id="back-to-top"` (posición `bottom-24 right-6`, controlado por `animations.js`) y el botón de WhatsApp ocupa `bottom-6 right-6`. No los superpongas.
- **Métricas canónicas del sitio:** 150+ proyectos, 9+ años (fundación 2017), 98% satisfacción, 99.9% uptime, 50+ apps. Si cambias una, cámbiala en todas las páginas (incluido el SVG del hero en `index.html`).

---

## 11. Comandos útiles

```bash
# Servir localmente
python -m http.server 8000

# Contar líneas y tamaño de archivos principales
wc -l *.html css/bundle.css js/animations.js

# Listar imágenes
ls -la images/
```

---

Última actualización: basado en el contenido real del repositorio `Createam_Static_v2`.
