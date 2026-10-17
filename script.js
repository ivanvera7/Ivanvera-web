/* ============================================================
   Ivan Vera — comportamiento (vanilla JS, sin dependencias)
   Todo el contenido es visible sin JS; esto solo añade movimiento
   e interacción.
   ============================================================ */
(() => {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine   = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  if (fine) document.body.classList.add('pointer-fine');

  /* ----------------------------------------------------------
     1. Resaltado de sintaxis + números de línea
  ---------------------------------------------------------- */
  const GRAMMARS = {
    java: [
      ['c', /\/\/[^\n]*/y],
      ['s', /"(?:[^"\\\n]|\\.)*"/y],
      ['k', /\b(?:public|private|static|void|class|new|import|return|int|double|boolean|char|long|float|if|else|for|while)\b/y],
      ['t', /\b(?:String|Scanner|System|Main)\b/y],
      ['n', /\b\d+(?:\.\d+)?\b/y],
    ],
    json: [
      ['t', /"(?:[^"\\\n]|\\.)*"(?=\s*:)/y],
      ['s', /"(?:[^"\\\n]|\\.)*"/y],
      ['n', /\b\d+(?:\.\d+)?\b/y],
      ['k', /\b(?:true|false|null)\b/y],
    ],
  };
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const highlight = (src, rules) => {
    let out = '', plain = '', i = 0;
    const flush = () => { out += esc(plain); plain = ''; };
    while (i < src.length) {
      let hit = null;
      for (const [cls, re] of rules) {
        re.lastIndex = i;
        const m = re.exec(src);
        if (m) { hit = [cls, m[0]]; break; }
      }
      if (hit) {
        flush();
        out += `<span class="tk-${hit[0]}">${esc(hit[1])}</span>`;
        i += hit[1].length;
      } else {
        plain += src[i++];
      }
    }
    flush();
    return out;
  };

  $$('code[data-lang]').forEach(code => {
    const rules = GRAMMARS[code.dataset.lang];
    if (!rules) return;
    const src = code.textContent;
    code.dataset.raw = src;
    code.innerHTML = highlight(src, rules)
      .split('\n')
      .map(l => `<span class="line">${l}</span>`)
      .join('\n');
  });

  /* ----------------------------------------------------------
     2. Ejecutor de programas: escribe el comando y muestra la
        salida real. El de Scanner pide el nombre de verdad.
  ---------------------------------------------------------- */
  const makeRunner = scope => {
    const out = $('.console-out', scope);
    const btn = $('.run', scope);
    if (!out || !btn) return null;

    const cmd = $('.c-cmd', out);
    const prompt = $('.c-prompt', cmd);
    const cmdText = cmd.textContent.replace(prompt.textContent, '').trim();
    const typed = document.createElement('span');
    typed.className = 'c-typed';
    cmd.replaceChildren(prompt, ' ', typed);
    const lines = $$('.c-line', out);
    const interactive = out.dataset.interactive === 'true';
    let runId = 0;

    const addLine = (text, cls = '') => {
      const span = document.createElement('span');
      span.className = `c-line c-dyn ${cls}`.trim();
      span.textContent = text;
      out.append(Object.assign(document.createElement('span'), { className: 'c-dyn', textContent: '\n' }), span);
      requestAnimationFrame(() => span.classList.add('on'));
      return span;
    };

    /* Scanner.nextLine(): una línea de entrada editable */
    const askName = focus => {
      out.append(Object.assign(document.createElement('span'), { className: 'c-dyn', textContent: '\n' }));
      const wrap = document.createElement('span');
      wrap.className = 'c-input c-dyn';
      const input = document.createElement('input');
      input.type = 'text';
      input.maxLength = 30;
      input.autocomplete = 'off';
      input.spellcheck = false;
      input.placeholder = 'escribe tu nombre';
      input.setAttribute('aria-label', 'Escribe tu nombre y pulsa Enter');
      wrap.append(input, Object.assign(document.createElement('span'), { className: 'c-hint', textContent: '  Enter' }));
      out.append(wrap);
      input.addEventListener('keydown', e => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        const name = input.value;
        wrap.replaceWith(Object.assign(document.createElement('span'), { className: 'c-line c-echo c-dyn on', textContent: name }));
        addLine('Hola ' + name);
      });
      if (focus) input.focus({ preventScroll: true });
    };

    const run = async ({ focus = false } = {}) => {
      const id = ++runId;
      const stale = () => id !== runId;
      btn.disabled = true;
      $$('.c-dyn', out).forEach(n => n.remove());
      lines.forEach(l => l.classList.remove('on'));

      if (reduce) {
        typed.textContent = cmdText;
        lines.forEach(l => l.classList.add('on'));
      } else {
        typed.textContent = '';
        out.classList.add('is-typing');
        for (const ch of cmdText) {
          typed.textContent += ch;
          await wait(34 + Math.random() * 38);
          if (stale()) return;
        }
        await wait(240);
        if (stale()) return;
        out.classList.remove('is-typing');
        for (const l of lines) {
          l.classList.add('on');
          await wait(110);
          if (stale()) return;
        }
      }
      if (interactive) askName(focus);
      btn.disabled = false;
    };

    btn.addEventListener('click', () => run({ focus: true }));

    /* estado inicial: vacío hasta la primera ejecución (sin movimiento: completo) */
    if (reduce) {
      typed.textContent = cmdText;
      lines.forEach(l => l.classList.add('on'));
      if (interactive) askName(false);
    } else {
      typed.textContent = '';
      lines.forEach(l => l.classList.remove('on'));
    }
    return { run, scope };
  };

  const exRunners = new Map($$('.ex-panel').map(p => [p.id, makeRunner(p)]));

  /* ----------------------------------------------------------
     3. Hero: holograma 3D de partículas (WebGL puro, sin librerías).
        Miles de partículas forman "IV", "</>" o una esfera; el ratón
        las aparta e inclina el holograma, y un clic cambia la forma.
  ---------------------------------------------------------- */
  const hero = $('.hero');
  const holoCanvas = $('#holoGL');
  const chips = $$('.holo-chip');
  $$('[data-enter]').forEach((el, i) => el.style.setProperty('--i', i));

  const fontsReady = () => Promise.race([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    wait(1500),
  ]);

  /* PRNG con semilla: las formas salen iguales en cada visita */
  const mulberry = seed => () => {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const VERT = `
    attribute vec3 aA; attribute vec3 aB; attribute float aSeed;
    uniform float uT, uMorph, uScale, uAspect, uPx, uMouseOn, uFade;
    uniform vec2 uRot, uMouse, uOffset;
    varying float vA; varying float vHot;
    mat3 rotY(float a){ float c = cos(a), s = sin(a); return mat3(c,0.,-s, 0.,1.,0., s,0.,c); }
    mat3 rotX(float a){ float c = cos(a), s = sin(a); return mat3(1.,0.,0., 0.,c,s, 0.,-s,c); }
    void main(){
      /* cada partícula viaja con su propio retraso: el cambio de forma fluye */
      float d = clamp((uMorph - aSeed * 0.4) / 0.6, 0., 1.);
      float e = d < .5 ? 4. * d * d * d : 1. - pow(-2. * d + 2., 3.) / 2.;
      vec3 p = mix(aA, aB, e);
      p += normalize(p + 0.0001) * sin(e * 3.14159) * (0.18 + aSeed * 0.45);
      p += 0.014 * vec3(sin(uT * 1.3 + aSeed * 40.), cos(uT * 1.1 + aSeed * 31.), sin(uT * .9 + aSeed * 23.));
      p = rotX(uRot.x) * rotY(uRot.y) * p;
      p *= uScale;
      float persp = 2.6 / (3.2 - p.z);
      vec2 sp = p.xy * persp;
      sp.x /= uAspect;
      sp += uOffset;
      /* el ratón empuja las partículas cercanas (en espacio de pantalla) */
      vec2 dm = sp - uMouse; dm.x *= uAspect;
      float dist = length(dm);
      float f = uMouseOn * smoothstep(0.38, 0.0, dist);
      sp += normalize(dm + 0.0001) * f * 0.14 * vec2(1. / uAspect, 1.);
      gl_Position = vec4(sp, 0., 1.);
      gl_PointSize = (1.1 + aSeed * 1.7 + f * 2.2) * persp * uPx;
      /* banda de escaneo que recorre el holograma */
      float scan = smoothstep(0.05, 0.0, abs(fract(p.y * 0.42 - uT * 0.16) - 0.5));
      vA = (0.3 + 0.7 * clamp(persp - 0.55, 0., 1.)) * uFade;
      vHot = scan * 0.85 + f;
    }`;
  const FRAG = `
    precision mediump float;
    varying float vA; varying float vHot;
    uniform vec3 uColor, uHot;
    void main(){
      vec2 c = gl_PointCoord - 0.5;
      float a = smoothstep(0.5, 0.0, length(c)) * vA;
      vec3 col = mix(uColor, uHot, clamp(vHot, 0., 1.));
      gl_FragColor = vec4(col * a, a);
    }`;

  const makeHologram = (canvas, host, opts) => {
    if (!canvas || !host) return null;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: true });
    if (!gl) return null;

    const N = Math.round((innerWidth < 700 ? 4200 : innerWidth < 1200 ? 7000 : 9000) * (opts.density || 1));
    const RING = Math.floor(N * 0.08);           /* anillo base común a todas las formas */
    const rnd = mulberry(opts.seed || 7);

    const ringPoint = (out, i) => {
      const a = rnd() * Math.PI * 2, r = 0.92 + (rnd() - 0.5) * 0.05;
      out[i * 3] = Math.cos(a) * r; out[i * 3 + 1] = -1.18 + (rnd() - 0.5) * 0.02; out[i * 3 + 2] = Math.sin(a) * r;
    };
    const fromText = (txt, weight) => {
      const W = 512, H = 256;
      const c = document.createElement('canvas'); c.width = W; c.height = H;
      const x = c.getContext('2d');
      x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle';
      if ('fontStretch' in x) x.fontStretch = 'expanded';
      x.font = `${weight} 200px Archivo, sans-serif`;
      x.fillText(txt, W / 2, H / 2 + 10);
      const d = x.getImageData(0, 0, W, H).data, pts = [];
      for (let y = 0; y < H; y += 2) for (let xx = 0; xx < W; xx += 2) if (d[(y * W + xx) * 4 + 3] > 128) pts.push(xx, y);
      const out = new Float32Array(N * 3), n = pts.length / 2;
      for (let i = 0; i < N; i++) {
        if (i >= N - RING || !n) { ringPoint(out, i); continue; }
        const k = Math.floor(rnd() * n) * 2;
        out[i * 3] = (pts[k] - W / 2) / (H / 2) * 0.95 + (rnd() - 0.5) * 0.01;
        out[i * 3 + 1] = -(pts[k + 1] - H / 2) / (H / 2) * 0.95;
        out[i * 3 + 2] = (rnd() - 0.5) * 0.36;      /* volumen: letras extruidas */
      }
      return out;
    };
    const sphere = () => {
      const out = new Float32Array(N * 3), M = N - RING, g = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < N; i++) {
        if (i >= M) { ringPoint(out, i); continue; }
        const y = 1 - (i / (M - 1)) * 2, r = Math.sqrt(1 - y * y), th = g * i;
        const R = 1.1 + (rnd() < 0.12 ? rnd() * 0.12 : 0);
        out[i * 3] = Math.cos(th) * r * R; out[i * 3 + 1] = y * R; out[i * 3 + 2] = Math.sin(th) * r * R;
      }
      return out;
    };

    const shader = (type, src) => {
      const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    };
    let prog;
    try {
      prog = gl.createProgram();
      gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    } catch (err) { return null; }
    gl.useProgram(prog);

    const U = {};
    ['uT', 'uMorph', 'uScale', 'uAspect', 'uPx', 'uMouseOn', 'uFade', 'uRot', 'uMouse', 'uOffset', 'uColor', 'uHot']
      .forEach(n => { U[n] = gl.getUniformLocation(prog, n); });
    gl.uniform3f(U.uColor, 0.16, 0.95, 0.58);
    gl.uniform3f(U.uHot, 0.85, 1.0, 0.92);

    const buf = (name, data, size) => {
      const b = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
      const loc = gl.getAttribLocation(prog, name);
      gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
      return b;
    };
    const seeds = new Float32Array(N); for (let i = 0; i < N; i++) seeds[i] = rnd();
    let shapes = null, bufA, bufB;
    buf('aSeed', seeds, 1);

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);                /* luz aditiva: donde se juntan, brillan más */

    /* estado */
    let cur = 0, next = 0, morph = 0, morphing = false, pending = null, lastSwitch = 0;
    let W = 0, H = 0, aspect = 1, dpr = 1, raf = null, visible = true, t0 = performance.now();
    const m = { x: 0, y: 0, tx: 0, ty: 0, on: 0, ton: 0 };
    let yaw = 0, pitch = 0, scrollFade = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, fine ? 2 : 1.5);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      aspect = W / Math.max(H, 1);
      const L = opts.layout(W, aspect);
      gl.uniform1f(U.uAspect, aspect);
      gl.uniform1f(U.uScale, L.scale);
      gl.uniform1f(U.uPx, dpr * L.px);
      gl.uniform2f(U.uOffset, L.ox, L.oy);
    };

    const chips = opts.chips || [];
    const setChips = i => chips.forEach(c => c.setAttribute('aria-pressed', String(+c.dataset.shape === i)));
    const go = i => {
      if (!shapes) return;
      i = ((i % shapes.length) + shapes.length) % shapes.length;
      if (morphing) { pending = i; setChips(i); return; }
      if (i === cur) return;
      next = i; setChips(i);
      gl.bindBuffer(gl.ARRAY_BUFFER, bufB); gl.bufferSubData(gl.ARRAY_BUFFER, 0, shapes[next]);
      lastSwitch = performance.now();
      if (reduce) { finish(); draw(performance.now()); return; }
      morph = 0; morphing = true;
    };
    const finish = () => {
      cur = next; morph = 0; morphing = false;
      gl.bindBuffer(gl.ARRAY_BUFFER, bufA); gl.bufferSubData(gl.ARRAY_BUFFER, 0, shapes[cur]);
      if (pending !== null && pending !== cur) { const p = pending; pending = null; go(p); }
      else pending = null;
    };

    const draw = now => {
      const t = (now - t0) / 1000;
      /* el ratón se suaviza con inercia */
      m.x += (m.tx - m.x) * 0.12; m.y += (m.ty - m.y) * 0.12; m.on += (m.ton - m.on) * 0.08;
      /* balanceo en vez de giro completo: las letras se leen siempre */
      const autoYaw = reduce ? 0.35 : Math.sin(t * 0.35) * 0.6;
      yaw += ((autoYaw + m.x * 0.6 * m.on) - yaw) * 0.08;
      pitch += ((-m.y * 0.35 * m.on + (reduce ? 0.12 : Math.sin(t * 0.4) * 0.08)) - pitch) * 0.08;
      if (morphing) {
        morph = Math.min(1, morph + 1 / (1.7 * 60));
        if (morph >= 1) finish();
      }
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(U.uT, reduce ? 0 : t);
      gl.uniform1f(U.uMorph, morphing ? morph : 0);
      gl.uniform2f(U.uRot, pitch, yaw);
      gl.uniform2f(U.uMouse, m.x, m.y);
      gl.uniform1f(U.uMouseOn, m.on);
      gl.uniform1f(U.uFade, scrollFade * (0.94 + (reduce ? 0.06 : 0.06 * Math.sin(t * 23) * Math.sin(t * 7))));
      gl.drawArrays(gl.POINTS, 0, N);
    };
    const loop = now => {
      raf = requestAnimationFrame(loop);
      /* cambio automático de forma si nadie interactúa */
      if (!morphing && !reduce && now - lastSwitch > 7000) go(cur + 1);
      draw(now);
    };
    const start = () => { if (!raf && visible && !document.hidden && !reduce && shapes) { raf = requestAnimationFrame(loop); } };
    const stop = () => { if (raf) cancelAnimationFrame(raf); raf = null; };

    /* ratón y toque */
    const toNdc = e => {
      const r = canvas.getBoundingClientRect();
      return [((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1)];
    };
    host.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      [m.tx, m.ty] = toNdc(e); m.ton = 1;
    });
    host.addEventListener('pointerleave', () => { m.ton = 0; });
    canvas.addEventListener('pointerdown', e => {
      [m.tx, m.ty] = toNdc(e);
      if (e.pointerType !== 'mouse') { m.x = m.tx; m.y = m.ty; m.on = 1; m.ton = 0; }   /* el toque sacude y se calma */
      go(cur === next || !morphing ? cur + 1 : next + 1);
    });
    chips.forEach(c => c.addEventListener('click', () => go(+c.dataset.shape)));

    /* el holograma principal se desvanece al bajar */
    if (opts.scrollFade) window.addEventListener('scroll', () => {
      scrollFade = Math.max(0, 1 - window.scrollY / (innerHeight * 0.9));
      if (reduce && shapes) draw(performance.now());
    }, { passive: true });

    new IntersectionObserver(entries => {
      visible = entries.some(e => e.isIntersecting);
      visible ? start() : stop();
    }).observe(host);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { resize(); if (reduce && shapes) draw(performance.now()); }, 150); });

    return {
      begin() {
        shapes = [fromText('IV', 800), fromText('</>', 700), sphere()];
        cur = next = opts.start || 0;
        bufA = buf('aA', shapes[cur], 3);
        bufB = buf('aB', shapes[cur], 3);
        setChips(cur);
        resize();
        lastSwitch = performance.now();
        host.classList.add('has-holo');
        if (reduce) draw(performance.now()); else start();
      },
    };
  };

  /* hero: a la derecha del nombre en escritorio; en móvil, arriba, sobre el título */
  const hologram = makeHologram(holoCanvas, hero, {
    chips, scrollFade: true,
    layout: (W, aspect) => {
      const wide = W > 900;
      hero.style.setProperty('--hx', wide ? '68%' : '50%');
      return { scale: Math.min(wide ? 0.74 : 0.6, 0.62 * aspect), px: wide ? 1.15 : 1, ox: wide ? 0.38 : 0, oy: wide ? 0.1 : 0.5 };
    },
  });
  /* contacto: un segundo holograma más pequeño, empieza como esfera */
  const contactHolo = makeHologram($('#holoContact'), $('#contactHolo'), {
    density: 0.45, seed: 11, start: 2,
    layout: (W, aspect) => ({ scale: Math.min(0.68, 0.62 * aspect), px: 1, ox: 0, oy: 0.12 }),
  });

  if (!hologram) {
    holoCanvas && holoCanvas.remove();
    const ui = $('.holo-ui'); ui && ui.remove();
  }
  if (!contactHolo) { const c = $('#contactHolo'); c && c.remove(); }

  /* secuencia: fuentes listas → el nombre entra → el holograma se forma */
  fontsReady().then(() => {
    hero && hero.classList.add('is-loaded');
    hologram && hologram.begin();
    contactHolo && contactHolo.begin();
  });

  /* profundidad al hacer scroll: el texto del hero sube más rápido que el holograma */
  const heroCopy = $('.hero-grid');
  if (heroCopy && !reduce) {
    let tick = false;
    window.addEventListener('scroll', () => {
      if (tick) return; tick = true;
      requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, innerHeight);
        heroCopy.style.transform = `translate3d(0, ${(-y * 0.18).toFixed(1)}px, 0)`;
        heroCopy.style.opacity = String(Math.max(0, 1 - y / (innerHeight * 0.75)));
        tick = false;
      });
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     4. Títulos de sección: cada palabra sube desde su máscara
        y se ensancha (eje de anchura de Archivo)
  ---------------------------------------------------------- */
  if (!reduce) {
    $$('.sec-title').forEach(h => {
      h.setAttribute('aria-label', h.textContent.replace(/\s+/g, ' ').trim());
      let c = 0;
      const splitNode = node => {
        Array.from(node.childNodes).forEach(child => {
          if (child.nodeType === Node.TEXT_NODE) {
            const frag = document.createDocumentFragment();
            child.textContent.split(/(\s+)/).forEach(part => {
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.append(' '); return; }
              const word = document.createElement('span');
              word.className = 'word';
              word.setAttribute('aria-hidden', 'true');
              const inner = document.createElement('span');
              inner.className = 'wi';
              inner.style.setProperty('--c', c++);
              inner.textContent = part;
              word.append(inner);
              frag.append(word);
            });
            child.replaceWith(frag);
          } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
            splitNode(child);
          }
        });
      };
      splitNode(h);
      h.classList.add('split-title');
    });
  }

  /* ----------------------------------------------------------
     5. Reveal al entrar en pantalla (cascada corta por grupo)
  ---------------------------------------------------------- */
  const revealables = $$('.reveal');
  if (reduce) {
    revealables.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const sibs = e.target.parentElement ? $$(':scope > .reveal', e.target.parentElement) : [];
        const idx = Math.max(0, sibs.indexOf(e.target));
        e.target.style.transitionDelay = Math.min(idx * 70, 280) + 'ms';
        e.target.classList.add('in');
        obs.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealables.forEach(el => io.observe(el));
  }

  /* ----------------------------------------------------------
     6. Barras de nivel + contador del número (se observa la
        lista: una barra a escala 0 no tiene área visible)
  ---------------------------------------------------------- */
  const skills = $('.skills');
  if (skills) {
    const grow = () => $$('.skill', skills).forEach((row, i) => {
      const bar = $('.meter i', row);
      const num = $('em', row);
      bar.style.transitionDelay = i * 90 + 'ms';
      bar.classList.add('grow');
      if (reduce || !num) return;
      const target = parseInt(num.textContent, 10);
      const t0 = performance.now() + i * 90;
      num.textContent = '0';
      const step = now => {
        const p = Math.min(Math.max((now - t0) / 1100, 0), 1);
        num.textContent = Math.round(target * easeOut(p));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    if (reduce) grow();
    else new IntersectionObserver((entries, obs) => {
      if (!entries.some(e => e.isIntersecting)) return;
      obs.disconnect();
      grow();
    }, { threshold: 0.35 }).observe(skills);
  }

  /* ----------------------------------------------------------
     6b. Stack: cada logo es un holograma 3D de partículas con sus
         colores reales (sacados de los píxeles del propio SVG).
         Un solo lienzo WebGL para los nueve; al pasar el ratón, el
         logo gira y se abre, y las partículas se apartan del cursor.
  ---------------------------------------------------------- */
  const toolsStage = $('#toolsStage');
  const toolsCanvas = $('#toolsGL');
  (() => {
    if (!toolsStage || !toolsCanvas) return;
    const gl = toolsCanvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: true });
    if (!gl) return;
    const items = $$('.tools li', toolsStage);
    const COUNT = items.length;
    const K = innerWidth < 700 ? 520 : 1000;            /* partículas por logo */

    const VS = `
      attribute vec3 aPos; attribute vec2 aCenter; attribute vec3 aColor; attribute float aSeed; attribute float aIdx;
      uniform float uT, uR, uPx, uMouseOn;
      uniform vec2 uRes, uMouse;
      uniform float uHover[${COUNT}], uSpin[${COUNT}];
      varying vec3 vCol; varying float vA;
      void main(){
        int i = int(aIdx + 0.5);
        float h = uHover[i];
        vec3 p = aPos;
        p += 0.025 * vec3(sin(uT * 1.7 + aSeed * 40.), cos(uT * 1.3 + aSeed * 30.), sin(uT + aSeed * 20.));
        p *= 1. + h * 0.3 * (aSeed - 0.35);           /* al pasar el ratón el logo "respira" hacia fuera */
        float a = sin(uT * 0.7 + aIdx * 0.9) * 0.45 + uSpin[i];
        float c = cos(a), s = sin(a);
        p = vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
        float persp = 2.2 / (3.0 - p.z);
        vec2 px = aCenter + p.xy * persp * uR;
        vec2 d = px - uMouse;
        float f = uMouseOn * smoothstep(uR * 1.4, 0., length(d));
        px += normalize(d + 0.001) * f * uR * 0.4;
        gl_Position = vec4(px / uRes * 2. - 1., 0., 1.);
        gl_PointSize = (1.5 + aSeed * 1.5) * persp * uPx * (1. + h * 0.35);
        float scan = smoothstep(0.08, 0., abs(fract(p.y * 0.5 - uT * 0.25) - 0.5));
        vCol = aColor * (1.1 + 0.45 * h + 0.5 * scan);
        vA = 0.75 + 0.25 * clamp(persp - 0.6, 0., 1.);
      }`;
    const FS = `
      precision mediump float;
      varying vec3 vCol; varying float vA;
      void main(){
        float a = smoothstep(0.5, 0.0, length(gl_PointCoord - 0.5)) * vA;
        gl_FragColor = vec4(vCol * a, a);
      }`;
    const sh = (t, src) => { const o = gl.createShader(t); gl.shaderSource(o, src); gl.compileShader(o); return gl.getShaderParameter(o, gl.COMPILE_STATUS) ? o : null; };
    const vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const U = n => gl.getUniformLocation(prog, n);
    const uT = U('uT'), uR = U('uR'), uPx = U('uPx'), uMouseOn = U('uMouseOn'), uRes = U('uRes'), uMouse = U('uMouse'), uHover = U('uHover'), uSpin = U('uSpin');

    /* muestrea un logo: píxeles opacos y no demasiado oscuros, con su color */
    const SZ = 96;
    const sample = async imgs => {
      const c = document.createElement('canvas'); c.width = SZ * imgs.length; c.height = SZ;
      const x = c.getContext('2d', { willReadFrequently: true });
      await Promise.all(imgs.map((src, k) => new Promise(res => {
        const im = new Image();
        im.onload = () => { x.drawImage(im, k * SZ + 4, 4, SZ - 8, SZ - 8); res(); };
        im.onerror = res;
        im.src = src;
      })));
      const d = x.getImageData(0, 0, c.width, c.height).data, pts = [];
      for (let y = 0; y < SZ; y += 1) for (let xx = 0; xx < c.width; xx += 1) {
        const o = (y * c.width + xx) * 4;
        if (d[o + 3] < 150) continue;
        const r = d[o] / 255, g = d[o + 1] / 255, b = d[o + 2] / 255;
        if (0.2126 * r + 0.7152 * g + 0.0722 * b < 0.12) continue;
        pts.push([xx, y, r, g, b]);
      }
      return { pts, w: c.width };
    };

    const rnd = mulberry(23);
    const N = K * COUNT;
    const pos = new Float32Array(N * 3), col = new Float32Array(N * 3), seed = new Float32Array(N), idx = new Float32Array(N), ctr = new Float32Array(N * 2);
    const build = async () => {
      for (let i = 0; i < COUNT; i++) {
        const srcs = $$('img', items[i]).map(im => im.getAttribute('src'));
        const { pts, w } = await sample(srcs);
        const half = Math.max(w, SZ) / 2;
        for (let k = 0; k < K; k++) {
          const n = i * K + k;
          const p = pts.length ? pts[Math.floor(rnd() * pts.length)] : [w / 2, SZ / 2, .8, .8, .8];
          pos[n * 3] = (p[0] - w / 2) / half;
          pos[n * 3 + 1] = -(p[1] - SZ / 2) / half;
          pos[n * 3 + 2] = (rnd() - 0.5) * 0.3;           /* volumen */
          col[n * 3] = p[2]; col[n * 3 + 1] = p[3]; col[n * 3 + 2] = p[4];
          seed[n] = rnd(); idx[n] = i;
        }
      }
    };
    const attr = (name, data, size, usage = gl.STATIC_DRAW) => {
      const b = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, data, usage);
      const l = gl.getAttribLocation(prog, name);
      gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, size, gl.FLOAT, false, 0, 0);
      return b;
    };

    gl.disable(gl.DEPTH_TEST); gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);
    let ctrBuf, W = 0, H = 0, dpr = 1, raf = null, visible = false, t0 = performance.now(), last = 0;
    const hover = new Float32Array(COUNT), target = new Float32Array(COUNT), spin = new Float32Array(COUNT);
    const mouse = { x: -9999, y: -9999, on: 0, ton: 0 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, fine ? 2 : 1.5);
      W = toolsCanvas.clientWidth; H = toolsCanvas.clientHeight;
      toolsCanvas.width = Math.round(W * dpr); toolsCanvas.height = Math.round(H * dpr);
      gl.viewport(0, 0, toolsCanvas.width, toolsCanvas.height);
      gl.uniform2f(uRes, W, H);
      gl.uniform1f(uPx, dpr);
    };
    /* el centro de cada logo se lee del sitio que ocupa su <img> (sigue al reveal y al hover) */
    const place = () => {
      const base = toolsCanvas.getBoundingClientRect();
      let r0 = 26;
      for (let i = 0; i < COUNT; i++) {
        const box = ($('.tool-pair', items[i]) || $('img', items[i])).getBoundingClientRect();
        const cx = box.left + box.width / 2 - base.left, cy = H - (box.top + box.height / 2 - base.top);
        r0 = Math.min(box.height, 80) / 2;
        for (let k = 0; k < K; k++) { const n = (i * K + k) * 2; ctr[n] = cx; ctr[n + 1] = cy; }
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, ctrBuf); gl.bufferSubData(gl.ARRAY_BUFFER, 0, ctr);
      gl.uniform1f(uR, r0 * 1.1);
    };

    const draw = now => {
      const t = (now - t0) / 1000, dt = Math.min((now - (last || now)) / 1000, 0.1);
      last = now;
      for (let i = 0; i < COUNT; i++) {
        hover[i] += (target[i] - hover[i]) * 0.12;
        spin[i] += dt * hover[i] * 4;                      /* gira mientras el ratón está encima */
      }
      mouse.on += (mouse.ton - mouse.on) * 0.15;
      place();
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uT, reduce ? 0 : t);
      gl.uniform1fv(uHover, hover); gl.uniform1fv(uSpin, spin);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uMouseOn, mouse.on);
      gl.drawArrays(gl.POINTS, 0, N);
    };
    const loop = now => { raf = requestAnimationFrame(loop); draw(now); };
    const start = () => { if (!raf && visible && !document.hidden && !reduce && ctrBuf) raf = requestAnimationFrame(loop); };
    const stop = () => { if (raf) cancelAnimationFrame(raf); raf = null; };

    items.forEach((li, i) => {
      li.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') target[i] = 1; });
      li.addEventListener('pointerleave', () => { target[i] = 0; });
      /* en táctil, un toque hace girar el logo un momento */
      li.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') { target[i] = 1; setTimeout(() => { target[i] = 0; }, 700); } });
    });
    toolsStage.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const r = toolsCanvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = H - (e.clientY - r.top); mouse.ton = 1;
    });
    toolsStage.addEventListener('pointerleave', () => { mouse.ton = 0; });

    new IntersectionObserver(es => { visible = es.some(e => e.isIntersecting); visible ? start() : stop(); }, { rootMargin: '100px 0px' }).observe(toolsStage);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { resize(); if (reduce && ctrBuf) draw(performance.now()); }, 150); });

    build().then(() => {
      attr('aPos', pos, 3); attr('aColor', col, 3); attr('aSeed', seed, 1); attr('aIdx', idx, 1);
      ctrBuf = attr('aCenter', ctr, 2, gl.DYNAMIC_DRAW);
      toolsStage.classList.add('has-holo');
      resize();
      if (reduce) requestAnimationFrame(() => draw(performance.now()));
      else start();
    });
  })();

  /* ----------------------------------------------------------
     7. Pestañas de ejercicios (patrón ARIA tabs, con flechas).
        Al elegir un ejercicio, su programa se ejecuta.
  ---------------------------------------------------------- */
  const tabs = $$('.ex-tab');
  if (tabs.length) {
    const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));
    const select = (tab, focus) => {
      tabs.forEach((t, i) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        panels[i].hidden = !on;
        if (on && !reduce) {
          panels[i].classList.remove('is-entering');
          void panels[i].offsetWidth;
          panels[i].classList.add('is-entering');
        }
      });
      if (focus) tab.focus();
      const r = exRunners.get(tab.getAttribute('aria-controls'));
      if (r && !reduce) r.run();
    };
    tabs.forEach((t, i) => {
      panels[i].hidden = t.getAttribute('aria-selected') !== 'true';
      t.addEventListener('click', () => select(t, false));
      t.addEventListener('keydown', e => {
        const n = tabs.length;
        let j = null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') j = (i + 1) % n;
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') j = (i - 1 + n) % n;
        if (e.key === 'Home') j = 0;
        if (e.key === 'End') j = n - 1;
        if (j === null) return;
        e.preventDefault();
        select(tabs[j], true);
      });
    });

    /* primera ejecución del ejercicio visible al llegar a la sección */
    const tabsPanel = $('.panel--tabs');
    if (tabsPanel && !reduce) {
      new IntersectionObserver((entries, obs) => {
        if (!entries.some(e => e.isIntersecting)) return;
        obs.disconnect();
        const current = tabs.find(t => t.getAttribute('aria-selected') === 'true');
        const r = current && exRunners.get(current.getAttribute('aria-controls'));
        if (r) setTimeout(() => r.run(), 400);
      }, { threshold: 0.35 }).observe(tabsPanel);
    }
  }

  /* ----------------------------------------------------------
     8. Botones de copiar
  ---------------------------------------------------------- */
  const live = document.createElement('span');
  live.setAttribute('role', 'status');
  Object.assign(live.style, { position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' });
  document.body.append(live);

  const copyText = async text => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = Object.assign(document.createElement('textarea'), { value: text });
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.append(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    }
  };

  $$('.copy').forEach(btn => {
    const label = btn.textContent;
    let timer;
    btn.addEventListener('click', async () => {
      const target = btn.dataset.copyTarget && document.getElementById(btn.dataset.copyTarget);
      const text = btn.dataset.copy || (target && (target.dataset.raw || target.textContent)) || '';
      if (!(await copyText(text))) return;
      clearTimeout(timer);
      btn.textContent = 'Copiado';
      btn.classList.add('is-done');
      live.textContent = 'Copiado al portapapeles';
      timer = setTimeout(() => {
        btn.textContent = label;
        btn.classList.remove('is-done');
        live.textContent = '';
      }, 1600);
    });
  });

  /* ----------------------------------------------------------
     9. Nav: subrayado deslizante + scrollspy + progreso + menú
  ---------------------------------------------------------- */
  const menu     = $('#menu');
  const line     = $('#menuLine');
  const burger   = $('#burger');
  const links    = $$('.menu a');
  const topbar   = $('#topbar');
  const progress = $('#progress');
  const mobile = () => window.innerWidth <= 760;

  const moveLine = link => {
    if (!line || !link || mobile()) return;
    line.style.setProperty('--lx', link.offsetLeft + 'px');
    line.style.setProperty('--ls', String(link.offsetWidth / 100));
    line.classList.add('on');
  };

  const setActive = link => {
    links.forEach(a => {
      const on = a === link;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
    moveLine(link);
  };

  const sections = links
    .map(a => ({ link: a, el: $(a.getAttribute('href')) }))
    .filter(s => s.el);

  let ticking = false, lastY = window.scrollY;
  links.forEach((a, k) => a.style.setProperty('--k', k));
  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    /* la barra se esconde al bajar y vuelve al subir */
    if (topbar) {
      const down = y > lastY + 2, up = y < lastY - 2;
      if (down && y > innerHeight * 0.5 && !(menu && menu.classList.contains('open'))) topbar.classList.add('is-away');
      if (up || y < 80) topbar.classList.remove('is-away');
      lastY = y;
    }
    const probe = y + window.innerHeight * 0.35;
    let current = sections[0];
    for (const s of sections) if (s.el.offsetTop <= probe) current = s;
    /* al llegar al final, la última sección siempre queda activa */
    if (y >= max - 4) current = sections[sections.length - 1];
    if (current && !current.link.classList.contains('active')) setActive(current.link);
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });

  window.addEventListener('resize', () => moveLine($('.menu a.active')));

  if (burger && menu) {
    const setMenu = open => {
      menu.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    };
    burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
    links.forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); burger.focus(); }
    });
    document.addEventListener('click', e => {
      if (menu.classList.contains('open') && !menu.contains(e.target) && !burger.contains(e.target)) setMenu(false);
    });
  }

  /* los botones se rellenan desde el punto por donde entra el ratón */
  if (fine) {
    $$('.btn').forEach(btn => btn.addEventListener('pointerenter', e => {
      const r = btn.getBoundingClientRect();
      btn.style.setProperty('--fx', (e.clientX - r.left) + 'px');
      btn.style.setProperty('--fy', (e.clientY - r.top) + 'px');
    }));
  }

  /* ----------------------------------------------------------
     11. Capturas de proyectos: inclinación 3D + reflejo
  ---------------------------------------------------------- */
  if (fine && !reduce) {
    $$('.tilt').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.classList.add('is-tilting');
        card.style.setProperty('--ry', ((px - 0.5) * 7).toFixed(2) + 'deg');
        card.style.setProperty('--rx', ((0.5 - py) * 7).toFixed(2) + 'deg');
        card.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
      });
      card.addEventListener('pointerleave', () => {
        card.classList.remove('is-tilting');
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* botones magnéticos: se acercan un poco al cursor (máx. 6px).
     El transform lo anima la transición CSS, así que es interrumpible. */
  if (fine && !reduce) {
    $$('.btn').forEach(btn => {
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        btn.style.setProperty('--bx', (dx * 6).toFixed(2) + 'px');
        btn.style.setProperty('--by', (dy * 4).toFixed(2) + 'px');
      });
      btn.addEventListener('pointerleave', () => {
        btn.style.setProperty('--bx', '0px');
        btn.style.setProperty('--by', '0px');
      });
    });
  }

  /* ----------------------------------------------------------
     12. Instagram: embed.js solo cuando la sección se acerca
  ---------------------------------------------------------- */
  const igSection = $('#instagram');
  if (igSection) {
    const igio = new IntersectionObserver((entries, obs) => {
      if (!entries.some(e => e.isIntersecting)) return;
      const s = document.createElement('script');
      s.src = 'https://www.instagram.com/embed.js';
      s.async = true;
      document.body.appendChild(s);
      obs.disconnect();
    }, { rootMargin: '600px 0px' });
    igio.observe(igSection);
  }

  /* ----------------------------------------------------------
     13. Arranque: la línea del menú se coloca cuando ya hay fuentes
  ---------------------------------------------------------- */
  onScroll();
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => moveLine($('.menu a.active')));
})();
