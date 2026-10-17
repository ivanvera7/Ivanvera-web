<div align="center">

# Iván Vera — Web personal

**Portafolio personal en negro y verde con hologramas 3D de partículas hechos en WebGL, programas Java que se ejecutan y código real. Cero dependencias.**

[![Web en vivo](https://img.shields.io/badge/web-en%20línea-3dffa0?style=flat-square)](https://ivanvera7.github.io/Ivanvera-web/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=fff)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=fff)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=flat-square&logo=githubpages&logoColor=fff)](https://pages.github.com/)
[![0 dependencias](https://img.shields.io/badge/npm-0%20dependencias-6f42c1?style=flat-square)](#-ejecutar-en-local)

<br>

**[Web en vivo](https://ivanvera7.github.io/Ivanvera-web/)** · **[LinkedIn](https://www.linkedin.com/in/ivanvera7/)** · **[Instagram](https://www.instagram.com/ivanvera7_/)** · **[GitHub](https://github.com/ivanvera7)** · **[Email](mailto:ivan99vera1@gmail.com)**

<img src="docs/hero.webp" alt="Animación del hero: el nombre Ivan Vera entra, el holograma 3D de partículas verdes forma IV, se aparta del ratón y cambia a </> y a una esfera al hacer clic" width="900">

<sub>Grabación real de la web: el holograma reacciona al ratón y cambia de forma con cada clic</sub>

</div>

---

## 📄 Sobre el proyecto

Sitio personal **estático** (HTML + CSS + JavaScript) que presenta mi perfil, mi
formación en **FP DAM**, mi stack y mis proyectos, con un feed de Instagram
incrustado y vías de contacto directo.

- **Sin frameworks ni build**: no hay `package.json`, ni `npm install`, ni paso de
  compilación. Lo que ves en los tres archivos es lo que se sirve.
- **Autocontenido**: la única llamada externa son los *embeds* oficiales de Instagram.
- **Publicado en GitHub Pages**: cada `push` a `main` vuelve a desplegarse solo.

## 🎨 Identidad visual

Negro puro, un único acento verde fósforo y luz en movimiento: hologramas 3D de
partículas que reaccionan al ratón. Todo lo demás es sobrio para que se lea bien.
El sistema completo está en [`DESIGN.md`](DESIGN.md).

| Elemento | Valor |
| --- | --- |
| **Fondo** | `#000000`, negro puro, sin degradados ni texturas |
| **Acento** | Verde fósforo `#3dffa0` (texto encima `#02170c`): botones, menú activo, barras de nivel, marca «IV» y hologramas |
| **Texto** | `#ededef` · `#a9a9b0` · `#86868e` (contraste AA sobre negro y paneles) |
| **Paneles** | Grises neutros de editor: `#111215`, `#17181c`, `#1f2125` |
| **Código** | Tema oscuro One Dark: palabras clave `#c678dd`, tipos `#e5c07b`, cadenas `#98c379`, números `#d19a66`, comentarios `#7f848e` |
| **Tipografía** | **Archivo** variable (titulares; el eje de anchura se anima), **Hubot Sans** (texto) y **JetBrains Mono** (solo código). Todas autoalojadas, licencia OFL |
| **Formas** | Píldoras en botones y navegación, 16 px en paneles, 14 px en las baldosas del stack |
| **Marca** | «IV» en verde, la misma en el menú y en el favicon |

### Hologramas

Tres hologramas de partículas, escritos a mano en **WebGL** (sin Three.js ni otras librerías):

1. **Hero**: hasta 9.000 partículas verdes forman «IV», «</>» o una esfera. Cambian de forma solas cada 7 s, con un clic o con los botones. El ratón aparta las partículas e inclina el holograma, y una banda de escaneo lo recorre.
2. **Contacto**: un segundo holograma, más pequeño, bajo «Disponible para proyectos».
3. **Stack**: cada logo de herramienta es un holograma con **sus colores reales**, sacados de los píxeles del SVG original (Claude naranja, SQL verde, Java rojo y azul…). Al pasar el ratón, gira y se abre.

<div align="center">
<img src="docs/stack.webp" alt="Animación del stack: el ratón recorre los logos de Java, SQL, TypeScript, HTML/CSS, Claude, ChatGPT, opencode, GitHub e IntelliJ, convertidos en hologramas de partículas con sus colores reales, y cada uno gira al pasar por encima" width="900">
<br>
<sub>Stack · cada logo es un holograma de partículas con sus colores reales y gira al pasar el ratón</sub>
</div>

## ✨ Características

| Área | Detalle |
| --- | --- |
| **Paneles de código** | Todo el código mostrado es real, sacado de mis repos, con resaltado de sintaxis propio, números de línea y colores de editor oscuro. |
| **Interacción** | Los 5 ejercicios de Java se exploran como pestañas y se ejecutan; botones para copiar el email y los datos; hologramas que responden al ratón y al toque. |
| **Proyectos** | Capturas reales de las dos webs publicadas (Servitek y Solca) y el banner del Kit VibeCoding Pro. |
| **Navegación** | Barra flotante con píldora verde que se desliza a la sección activa; se esconde al bajar y vuelve al subir. En móvil, menú a pantalla completa. |
| **Responsive** | Módulo prosa \| panel que pasa a una columna en `900px`; menú a pantalla completa en `760px`; ajustes finos en `560px`. |
| **Accesibilidad** | HTML semántico, contraste AA, *skip link*, foco visible, pestañas ARIA con teclado, botones alternativos para los hologramas, menú móvil con Esc, contenido legible sin JavaScript y soporte de `prefers-reduced-motion`. |
| **SEO / Social** | `title`, `meta description`, `theme-color`, Open Graph y Twitter Card, favicon + apple-touch-icon. |
| **Rendimiento** | Sin librerías externas; los hologramas se pausan fuera de pantalla o con la pestaña oculta y usan menos partículas en móvil; imágenes con `loading="lazy"`. |

### Movimiento

1. **Entrada del hero**: «Ivan» y «Vera» suben desde su máscara mientras se ensanchan; después aparecen la presentación y los botones.
2. **Profundidad al bajar**: el texto del hero se aleja más rápido que el holograma, que se desvanece.
3. **Títulos**: cada palabra sube y se ensancha (eje de anchura de Archivo); los paneles entran inclinados en 3D y se enderezan.
4. **Programas ejecutables**: los 5 ejercicios escriben `java Main.java` y muestran su salida real; el de `Scanner` te pide el nombre y te saluda. Al cambiar de ejercicio, el panel se revela de abajo arriba.
5. Barras de nivel con contador, barra de progreso de lectura y menú con *scrollspy*.
6. Capturas de proyectos y foto con inclinación 3D y reflejo que sigue al ratón.
7. Microinteracciones: botones magnéticos que se rellenan desde el punto por donde entra el ratón, flechas externas, confirmación de «Copiado».

> Con «movimiento reducido» no hay desplazamientos: los hologramas quedan quietos y todo aparece ya completo.

## 📁 Estructura

```text
Ivanvera-web/
├── index.html          # Estructura y todos los contenidos
├── styles.css          # Sistema visual, componentes y responsive
├── script.js           # Hologramas WebGL, resaltado, ejercicios ejecutables, pestañas, copiar, nav (IIFE, vanilla JS)
├── scripts/check.mjs   # Verificación sin dependencias (también en CI)
├── AGENTS.md           # Contexto para agentes de IA (CLAUDE.md lo importa)
├── PRODUCT.md          # A quién va dirigida la web y qué no se debe inventar
├── DESIGN.md           # Identidad visual: colores, tipografía, hologramas y componentes
├── assets/
│   ├── avatar.jpg      # Foto de perfil (también usada como og:image)
│   ├── fonts/          # Archivo, Hubot Sans y JetBrains Mono (woff2 + licencias OFL)
│   ├── projects/       # Capturas de Servitek y Solca, banner del Kit VibeCoding Pro
│   └── logos/          # SVG de las herramientas del stack
├── favicon/
│   ├── favicon.svg             # Icono de pestaña (vectorial)
│   ├── favicon-32.png          # Respaldo PNG 32×32
│   ├── favicon.png             # Versión grande (512×512)
│   └── apple-touch-icon.png    # Icono para iOS (180×180)
├── docs/
│   ├── hero.webp               # Animación del hero con el holograma (este README)
│   ├── stack.webp              # Animación del stack con los logos en holograma
│   └── superpowers/specs/      # Especificación de diseño
└── .gitignore
```

## 🛠 Stack

- **HTML5** semántico
- **CSS3**: variables, grid/flex, `clamp()`, fuentes variables (peso y anchura), `@font-face` autoalojado
- **JavaScript ES6+** sin dependencias (DOM, `IntersectionObserver`, `requestAnimationFrame`)
- **WebGL 1** escrito a mano para los hologramas de partículas (shaders propios, sin librerías)
- **Embeds oficiales de Instagram** (`instagram.com/embed.js`)

### Iconos y favicon

- **Logos del stack**: [Devicon](https://devicon.dev/), [Simple Icons](https://simpleicons.org/), [Lucide](https://lucide.dev/) y el SVG oficial de opencode — servidos como archivos locales en `assets/logos/` (la web no hace peticiones a CDNs en tiempo de ejecución).
- **Favicon**: «IV» en verde sobre una pieza negra, dibujado en SVG (`favicon/favicon.svg`).

| Archivo | Uso | Tamaño |
| --- | --- | --- |
| `favicon/favicon.svg` | Icono de pestaña principal (`rel="icon"`, vectorial) | < 1 KB |
| `favicon/favicon-32.png` | Respaldo para navegadores sin SVG | 32×32 |
| `favicon/favicon.png` | Versión grande del icono | 512×512 · ~12 KB |
| `favicon/apple-touch-icon.png` | Icono táctil en iOS (sin esquinas: iOS las redondea) | 180×180 |

## 🚀 Ejecutar en local

No hay instalación: solo hace falta un servidor estático (los *embeds* de
Instagram **no cargan** si abres el archivo con `file://`).

```bash
git clone https://github.com/ivanvera7/Ivanvera-web.git
cd Ivanvera-web
python3 -m http.server 8099
```

Abre **http://localhost:8099**

> Cualquier otro servidor sirve: `npx serve`, `php -S localhost:8099`, etc.

Para verificar el sitio (sintaxis JS, archivos referenciados, `alt`, IDs/anclas y variables CSS) solo hace falta Node:

```bash
node scripts/check.mjs
```

## 🌐 Despliegue

La web está publicada en **GitHub Pages** desde la rama `main` (raíz del repo):

**https://ivanvera7.github.io/Ivanvera-web/**

Para publicar cambios:

```bash
git add .
git commit -m "Descripción del cambio"
git push origin main
```

GitHub Pages reconstruye el sitio automáticamente (1–2 minutos).

## 🗂 Proyectos incluidos

| # | Proyecto | Stack | Repositorio | En vivo |
| - | -------- | ----- | ----------- | ------- |
| 01 | Hola Mundo | Java | [repo](https://github.com/ivanvera7/Ejercicio1-HolaMundo) | — |
| 02 | Variables | Java | [repo](https://github.com/ivanvera7/Ejercicio2-Variables) | — |
| 03 | Sumar | Java | [repo](https://github.com/ivanvera7/Ejercicio3-Sumar) | — |
| 04 | Calculadora | Java | [repo](https://github.com/ivanvera7/Ejercicio4-Calculadora) | — |
| 05 | Info de usuario | Java | [repo](https://github.com/ivanvera7/Ejercicio5-Info-de-usuario) | — |
| 06 | Servitek-web | Next.js · TypeScript · Tailwind | [repo](https://github.com/ivanvera7/servitek-web) | [servitek.pages.dev](https://servitek.pages.dev) |
| 07 | Solca Decoraciones | React · TypeScript | [repo](https://github.com/ivanvera7/Solca-decoraciones) | [solca-decoraciones.vercel.app](https://solca-decoraciones.vercel.app) |
| 08 | Kit VibeCoding Pro | Prompts y método para Claude Code | [repo](https://github.com/ivanvera7/kit-vibecoding-pro) | — |

## ✏️ Personalización

| Qué cambiar | Dónde |
| --- | --- |
| Textos, proyectos, enlaces y embeds | `index.html` |
| Colores, tipografía y animación CSS | `styles.css` → bloque `:root` (documentado en `DESIGN.md`) |
| Comportamiento de las animaciones | `script.js` |
| Formas y tamaño de los hologramas | `script.js` → `makeHologram` (formas «IV», «</>», esfera) y sección 6b (logos del stack) |
| Foto de perfil | `assets/avatar.jpg` (misma usada en `og:image`) |
| Logos del stack | `assets/logos/*.svg` (lista en `index.html` → `.tools`) |
| Favicon | `favicon/favicon.svg` → regenerar los PNG de `favicon/` a partir de él |
| Contacto (email / LinkedIn / WhatsApp / Instagram / GitHub) | `index.html` → sección `#contacto` |

## 📬 Contacto

- **Email:** [ivan99vera1@gmail.com](mailto:ivan99vera1@gmail.com)
- **LinkedIn:** [in/ivanvera7](https://www.linkedin.com/in/ivanvera7/)
- **WhatsApp:** [+34 683 224 002](https://wa.me/34683224002)
- **Instagram:** [@ivanvera7_](https://www.instagram.com/ivanvera7_/)
- **GitHub:** [@ivanvera7](https://github.com/ivanvera7)

---

<div align="center">
<sub>© 2026 Iván Vera · Madrid · Hecho con HTML, CSS, JS y Claude.</sub>
</div>
