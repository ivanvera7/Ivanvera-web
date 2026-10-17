---
name: Ivan Vera — web personal
description: Portfolio de un estudiante de FP DAM en negro y verde, con hologramas 3D de partículas.
colors:
  black: "#000000"
  panel: "#111215"
  panel-bar: "#17181c"
  panel-raised: "#1f2125"
  console: "#0c0d0f"
  hairline: "#1e2024"
  hairline-strong: "#2a2c31"
  hairline-hover: "#3b3e45"
  text: "#ededef"
  text-muted: "#a9a9b0"
  text-subtle: "#86868e"
  line-number: "#4b5263"
  phosphor-green: "#3dffa0"
  phosphor-green-hover: "#8dffc8"
  green-ink: "#02170c"
  editor-tab: "#528bff"
  code: "#abb2bf"
  syntax-keyword: "#c678dd"
  syntax-type: "#e5c07b"
  syntax-string: "#98c379"
  syntax-number: "#d19a66"
  syntax-comment: "#7f848e"
typography:
  display:
    fontFamily: "Archivo, Hubot Sans, -apple-system, sans-serif"
    fontSize: "clamp(3.6rem, 11vw, 8.6rem)"
    fontWeight: 820
    lineHeight: 0.86
    letterSpacing: "-0.05em"
    fontStretch: "125%"
  headline:
    fontFamily: "Archivo, Hubot Sans, -apple-system, sans-serif"
    fontSize: "clamp(2.1rem, 4.6vw, 3.6rem)"
    fontWeight: 760
    lineHeight: 1
    letterSpacing: "-0.04em"
    fontStretch: "115%"
  title:
    fontFamily: "Archivo, Hubot Sans, -apple-system, sans-serif"
    fontSize: "clamp(2rem, 3.6vw, 2.9rem)"
    fontWeight: 760
    lineHeight: 1
    letterSpacing: "-0.04em"
    fontStretch: "112%"
  body:
    fontFamily: "Hubot Sans, -apple-system, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Hubot Sans, -apple-system, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
  code:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.75
rounded:
  control: "8px"
  tile: "14px"
  panel: "16px"
  pill: "999px"
spacing:
  gutter: "clamp(1.25rem, 4vw, 2.5rem)"
  section: "clamp(6rem, 12vw, 10rem)"
  split-gap: "clamp(2.5rem, 5.5vw, 5.5rem)"
  nav-height: "72px"
components:
  button-primary:
    backgroundColor: "{colors.phosphor-green}"
    textColor: "{colors.green-ink}"
    rounded: "{rounded.pill}"
    height: "50px"
    padding: "0 1.5rem"
  button-primary-hover:
    backgroundColor: "{colors.phosphor-green-hover}"
  button-ghost:
    backgroundColor: "rgba(12,12,14,.5)"
    textColor: "{colors.text}"
    rounded: "{rounded.pill}"
    height: "50px"
  nav-pill:
    backgroundColor: "rgba(12,12,14,.62)"
    rounded: "{rounded.pill}"
    height: "38px"
  nav-pill-active:
    backgroundColor: "{colors.phosphor-green}"
    textColor: "{colors.green-ink}"
  panel:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.panel}"
  panel-bar:
    backgroundColor: "{colors.panel-bar}"
    typography: "{typography.code}"
    height: "46px"
  panel-button:
    textColor: "{colors.text-muted}"
    rounded: "{rounded.control}"
    height: "32px"
  tool-tile:
    backgroundColor: "rgba(14,14,16,.7)"
    rounded: "{rounded.tile}"
---

# Design System: Ivan Vera — web personal

## Overview

**Creative North Star: "Hologramas de partículas sobre negro".** La web es negra y el movimiento lo pone la luz: tres hologramas 3D de partículas hechos con WebGL propio (el del hero, el de Contacto y los logos del stack) que reaccionan al ratón. Todo lo demás es sobrio: texto claro, un único acento verde fósforo y código con los colores de un editor oscuro de verdad. Debe sentirse vivo, no estático, y nunca como una plantilla de IA.

Pedido explícito de Iván (17-10-2026): negro y verde, hologramas 3D de partículas con efectos al pasar el ratón, mejores animaciones, profundidad, tipografía y navegación. Rechazados en el mismo proceso: la paleta rosa, morado y turquesa, el cursor personalizado, los puntos y el grano del fondo, el brillo verde que bajaba sobre las tarjetas de proyecto y los paneles de código teñidos de verde.

## Colors

### Primary
- **Phosphor Green** (#3dffa0): el único acento (≈15:1 sobre negro; texto Green Ink #02170c encima). Botón principal, píldora activa del menú, barras de nivel, índice del ejercicio activo, punto de "Disponible", estado "Copiado", marca "IV" y partículas de los hologramas del hero y Contacto. Nunca como fondo de grandes superficies.

### Neutral
- **Black** (#000000): fondo de toda la página, sin degradados, puntos ni grano.
- **Panel** (#111215), **Panel Bar** (#17181c), **Panel Raised** (#1f2125), **Console** (#0c0d0f): grises neutros de editor para los paneles.
- **Hairline** (#1e2024), **Hairline Strong** (#2a2c31), **Hairline Hover** (#3b3e45): separaciones de 1px.
- **Text** (#ededef), **Text Muted** (#a9a9b0), **Text Subtle** (#86868e): todos ≥4.5:1 sobre negro y sobre los paneles. **Line Number** (#4b5263) es solo decorativo.

### Code (tema One Dark)
- Texto **#abb2bf**, palabras clave **#c678dd**, tipos y claves JSON **#e5c07b**, cadenas **#98c379**, números **#d19a66**, comentarios **#7f848e** en cursiva. Pestaña activa del panel subrayada en **#528bff**, como en un editor. El `$` de la consola usa el verde de cadenas.

### Hologramas de logos
- Los logos del stack no usan la paleta: cada partícula toma el color real del píxel del SVG original (Claude naranja, SQL verde, Java rojo y azul, TypeScript azul, HTML naranja, CSS azul, GitHub y ChatGPT blancos).

### Named Rules
**The Black Ground Rule.** El fondo es negro puro. La profundidad la dan la luz aditiva de las partículas y las capas de los paneles, no los degradados.

**The Editor Rule.** El código se ve como en un editor oscuro real, nunca teñido del color de marca.

## Typography

**Display/Headline:** Archivo (OFL), variable en peso y anchura, autoalojada.
**Body/Label:** Hubot Sans (GitHub, OFL), autoalojada.
**Code:** JetBrains Mono (la tipografía de IntelliJ, OFL), autoalojada.

### Hierarchy
- **Display** (820, anchura 125%, clamp(3.6rem, 11vw, 8.6rem), 0.86): el nombre del hero. "Ivan" en Text; "Vera" en peso 260 y verde.
- **Headline** (760, anchura 115%, clamp(2.1rem, 4.6vw, 3.6rem)): títulos de sección. `¿Hablamos?` usa una variante mayor (clamp(2.8rem, 7vw, 5.6rem)).
- **Title** (760, anchura 112%): nombres de proyecto. Los subtítulos (1.2rem, 680) y los valores de contacto también usan Archivo.
- **Body** (400, 1.0625rem, 1.65, máx. 62ch): prosa en Text Muted, énfasis en Text.
- **Label** (500, 0.8125rem): metadatos, etiquetas de contacto, ayuda de los hologramas.
- **Code** (JetBrains Mono 400, 0.8125rem, 1.75): solo código real, rutas, URLs y comandos.

### Named Rules
**The Width Axis Rule.** El eje de anchura de Archivo es parte del movimiento: los títulos entran estrechos (62–70%) y se ensanchan hasta su anchura final mientras suben desde su máscara.

## Layout

Contenedor de 1240px con gutter `clamp(1.25rem, 4vw, 2.5rem)`. El hero ocupa toda la pantalla (100svh): nombre, presentación y botones abajo a la izquierda; el holograma a la derecha (en móvil, arriba, sobre el nombre); los botones de forma abajo a la derecha. El resto de secciones repite el módulo `.split` (prosa | panel, `1fr | 1.12fr`), con paneles sticky en escritorio. El stack es una rejilla de 9 baldosas (3 por fila por debajo de 1100px). Secciones con padding vertical `clamp(6rem, 12vw, 10rem)`.

Por debajo de 900px el módulo pasa a una columna; por debajo de 760px el menú pasa a pantalla completa; por debajo de 560px los botones del hero ocupan el ancho y el código baja a 0.75rem con scroll horizontal dentro del panel.

## Elevation & Depth

Fondo negro plano. La profundidad viene de:
- **Hologramas WebGL** (luz aditiva): las partículas brillan más donde se acumulan, con perspectiva real, balanceo y una banda de escaneo que las recorre.
- **Paneles**: capas tonales (panel, barra, consola) con borde de 1px, brillo interior superior y una sombra negra desplazada hacia abajo.
- **Scroll**: el texto del hero sube más rápido que el holograma, que se desvanece al bajar; los paneles entran inclinados en 3D (`rotateX(8deg)`) y se enderezan.
- **Hover**: capturas y foto con inclinación 3D y un reflejo que sigue al ratón.

## Shapes

Radios: 8px en controles de panel, 14px en las baldosas del stack, 16px en paneles, fotos y embeds, y píldora (999px) en botones, navegación, etiquetas y selector de forma. La marca es "IV" dibujado en SVG (barra + V), en verde; el favicon (`favicon/favicon.svg`) es la misma "IV" verde sobre una pieza negra con borde Hairline Strong.

## Components

### Holograma 3D (signature)
WebGL1 escrito a mano, sin librerías (`makeHologram` en `script.js`). Partículas que forman "IV", "</>" o una esfera, con un anillo base común. Cambian de forma solas cada 7 s, con un clic en el holograma o con los botones de forma (`aria-pressed`). El ratón aparta las partículas cercanas e inclina el holograma; en táctil, un toque cambia la forma. Hero: hasta 9.000 partículas (4.200 en móvil). Contacto: 45% de esa densidad, empieza como esfera. Se pausa fuera de pantalla y con la pestaña oculta. Sin WebGL, el lienzo y los controles se eliminan y queda el texto.

### Logos del stack en holograma
Un solo lienzo WebGL para los nueve logos: cada uno se muestrea de su SVG en `assets/logos/` (1.000 partículas, 520 en móvil) con el color real de cada píxel. Al pasar el ratón, el logo gira, se abre un poco y aparta las partículas del cursor; en táctil gira un momento al tocarlo. Sin WebGL se ven los SVG originales.

### Buttons
- **Primary:** píldora verde, texto Green Ink, 50px (44px en proyectos). Hover: un relleno más claro crece desde el punto por donde entra el ratón, sube 2px y proyecta una sombra verde desplazada hacia abajo.
- **Ghost:** píldora con borde Hairline Hover; en hover, borde verde y relleno verde al 14%.
- **Magnético:** con ratón, cada botón se acerca al cursor hasta 6px; todo el movimiento es un único `transform` interrumpible. Active: `scale(.96)`.
- **Panel buttons:** «Ejecutar» pasa a un cuadrado que parpadea mientras el programa corre; «Copiar» confirma con una marca de verificación.

### Code Panel
Barra de 46px con la pestaña de archivo activa subrayada en azul editor, la ruta en Text Subtle y botones a la derecha. Cuerpo con números de línea y resaltado propio (One Dark). Variantes: con consola (ejercicios, con el `Scanner` interactivo), con captura (proyectos) y con pestañas de ejercicios (ARIA tabs; al cambiar, el panel se revela de abajo arriba).

### Navigation
Marca "IV" en una píldora a la izquierda; enlaces en otra píldora a la derecha con un indicador verde que se desliza bajo la sección activa (scrollspy). La barra se esconde al bajar y vuelve al subir. En móvil, botón circular que abre un menú a pantalla completa con un círculo que crece desde el botón y enlaces grandes en Archivo que entran escalonados (Esc y clic fuera lo cierran).

### Contact rows
Filas separadas por líneas de 1px, icono en un círculo de 46px, etiqueta en Label y valor en Archivo. En hover, la fila se desplaza 6px, el icono se rellena de verde y el valor pasa a verde. Email con botón Copiar y anuncio para lectores de pantalla.

## Do's and Don'ts

### Do:
- **Do** mantener el fondo negro puro y el verde como único acento de la interfaz.
- **Do** mostrar el código con colores de editor oscuro reales y solo código de los repos de Iván.
- **Do** escribir los hologramas a mano en WebGL (sin dependencias) y pausarlos fuera de pantalla.
- **Do** ofrecer alternativa accesible a cada interacción del holograma (botones de forma con `aria-pressed`, toque en móvil).
- **Do** respetar `prefers-reduced-motion`: hologramas estáticos, sin desplazamientos, solo fundidos.
- **Do** usar el puntero normal del sistema.

### Don't:
- **Don't** volver a puntos, grano, rejillas o resplandores en el fondo.
- **Don't** teñir de verde los paneles de código ni poner franjas o barridos de luz sobre las capturas.
- **Don't** usar cursor personalizado.
- **Don't** usar etiquetas tipo "eyebrow" sobre los títulos.
- **Don't** usar glifos Unicode o emoji como iconos; los iconos son SVG.
- **Don't** inventar experiencia, clientes, métricas ni tecnologías.

## Provenance

- `assets/projects/servitek.jpg`: captura de servitek.pages.dev hecha con Playwright a 1440×900 el 30-09-2026 y reducida a 1200px.
- `assets/projects/solca.jpg`: captura de solca-decoraciones.vercel.app hecha con Playwright a 1440×900 el 17-10-2026 y reducida a 1200×750.
- `assets/projects/kit-vibecoding-pro.jpg`: el banner `assets/hero.svg` del repositorio github.com/ivanvera7/kit-vibecoding-pro, renderizado con Chromium a 1600×1000 sobre negro el 17-10-2026 y reducido a 1200×750.
- `favicon/*.png`: generados el 17-10-2026 renderizando `favicon/favicon.svg` en Chromium headless (Playwright); el apple-touch-icon va sin radio de esquina.
- `assets/fonts/`: Archivo (Fontsource vía jsDelivr, 17-10-2026), Hubot Sans y JetBrains Mono (Fontsource), todas SIL OFL 1.1 con licencias incluidas.
