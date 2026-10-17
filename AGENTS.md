# AGENTS.md

Web personal de Iván Vera: sitio estático de una página en GitHub Pages
(https://ivanvera7.github.io/Ivanvera-web/). Contenido en español.

## Comandos

```bash
python3 -m http.server 8099   # servir en local → http://localhost:8099 (los embeds de Instagram no cargan con file://)
node scripts/check.mjs        # verificación: sintaxis JS, archivos referenciados, alt, IDs/anclas, variables CSS
```

Ejecuta `node scripts/check.mjs` antes de dar un cambio por terminado. La CI
(`.github/workflows/check.yml`) lo ejecuta en cada push a `main` y en cada PR.

No hay instalación, build ni tests unitarios. Despliegue: push a `main`
(GitHub Pages sirve la raíz de la rama tal cual).

## Estructura

| Ruta | Contenido |
| --- | --- |
| `index.html` | Toda la estructura y el contenido (6 secciones: Inicio, Sobre mí, Stack, Proyectos, Instagram, Contacto) |
| `styles.css` | Tokens en `:root`, componentes y responsive (900px / 760px / 560px) |
| `script.js` | Una IIFE vanilla: resaltado, programas "ejecutables", pestañas, copiar, nav, fondo canvas |
| `scripts/check.mjs` | Verificación sin dependencias |
| `assets/`, `favicon/` | Fuentes autoalojadas, logos, capturas, avatar, iconos |
| `PRODUCT.md` | Audiencia, posicionamiento y qué no se puede inventar |
| `DESIGN.md` | Sistema de diseño (fuente de verdad visual) |

## Reglas

- **Cero dependencias.** No añadas `package.json`, frameworks, CDNs ni paso de
  build. Herramientas solo con lo que trae Node.
- **No inventes datos.** Sin experiencia laboral, clientes, testimonios,
  certificaciones ni métricas que no estén en `PRODUCT.md` → "Evidence on Hand".
- **Fondo oscuro obligatorio.** Para colores, tipografía y componentes, sigue
  `DESIGN.md` y usa los tokens de `:root`, no valores sueltos.
- **Todo el código mostrado en la web es real** (sacado de los repos de Iván).
- **El contenido debe verse sin JS**: `script.js` solo añade movimiento e interacción.
- **Accesibilidad WCAG 2.2 AA**: contraste, teclado, foco visible y `prefers-reduced-motion`.
- **Cuida el rendimiento en móvil**: el fondo se pausa con la pestaña oculta y
  va a 30 fps en móvil. Instagram se carga bajo demanda.
- Si cambias la estructura o las funciones, actualiza `README.md`.
