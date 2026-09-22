# Una flor hasta donde estés

Un observatorio botánico interactivo para Esmeralda Flores, en la rama `esmeralda-flores`. Tres actos en un mismo cielo: una estrella llega, dibuja una rosa amarilla y da vida a un jardín de tulipanes y girasoles con mensajes y una carta. Las versiones anteriores se conservan en `v2` (Anel) y `karen-estephania` (Karen).

## Ejecutar

Requiere Node.js 22.12+ o 24 y npm.

```sh
npm ci
npm run dev -- --port 3000
```

Abrir http://127.0.0.1:3000/ . En Windows puede usarse `npm.cmd` si PowerShell bloquea `npm.ps1`.

## Producción

```sh
npm run build
npm run preview -- --port 4173
```

Publicar el contenido de `dist/` en cualquier hosting estático con HTTPS. `base: './'` permite servirlo también desde una subcarpeta. No requiere backend, claves, cuentas ni variables de entorno. Las fuentes se sirven localmente; la experiencia no realiza solicitudes a terceros.

## Personalizar

Editar `src/content.ts`: nombre, dedicatoria, frases ocultas y carta. La identidad está en `src/styles.css`; la distribución adaptable de v2 en `src/layout.css`. La coreografía se documenta en `MOTION_DESIGN.md`.

El nombre dibujado utiliza contornos de la fuente local Cormorant Garamond. Si cambia `recipient`, actualizar también su etiqueta en `content.constellation.label`, el monograma y los trazos de iniciales en `NameConstellation.tsx`, y regenerar `src/data/nameGlyphs.ts` con `python scripts/generate-name.py` (requiere Python y `fonttools[woff]`). Este paso es solo de mantenimiento; el navegador no convierte fuentes en tiempo de ejecución.

## Interacciones

1. Tocar la estrella o activarla con Enter/Espacio.
2. Ver nacer la rosa o utilizar «Saltar intro».
3. Tocar los pétalos para sembrar el jardín.
4. Explorar los tulipanes y girasoles para descubrir tres frases y la estrella para dibujar E ✦ F → Esmeralda Flores.
5. Abrir la carta desde el sobre; volver con su control de cierre o Escape.

«Pausar» detiene el ambiente y permite avanzar sin las secuencias largas. Se respeta la preferencia del sistema de movimiento reducido. «Repetir» limpia los descubrimientos y vuelve al principio. No hay audio.

## Arquitectura

```text
src/
  App.tsx                 Composición y acciones narrativas
  scene.ts                Máquina de estados pura
  content.ts              Textos editables
  hooks/useMotion.ts      Preferencias y visibilidad de pestaña
  components/
    Rose.tsx              Ilustración SVG original, 20 pétalos y variantes
    GardenFlower.tsx      Tulipanes y girasoles SVG del jardín, con variantes y semillas
    Sky.tsx               Canvas, profundidad y polen; un único RAF
    Observatory.tsx       Cartografía astronómica
    Letter.tsx            Papel, diálogo nativo, cierre y foco
    NameConstellation.tsx Escritura SVG con GSAP, cargada al descubrir la estrella
    Icons.tsx             Estrella y sobre vectoriales
  styles.css              Sistema visual, coreografía y responsive
  layout.css              Regiones y composición adaptable de v2
  data/nameGlyphs.ts       Contornos generados de la tipografía local
tests/
  scene.test.ts           Transiciones válidas, repetición y callbacks tardíos
  browser.mjs             Recorrido real, tacto, foco, capturas y axe
  responsive.mjs          Matriz de tamaños, estados y límites reales
  motion.mjs              Escenas transitorias, interrupciones y cambio de geometría
```

SVG/CSS construyen realmente la flor: dibujo de trazos, rellenos escalonados, despliegue de hojas y capas con sombra. El pétalo que asciende interpola su geometría hacia una estrella. Canvas mantiene partículas fuera de React; su densidad y resolución se limitan en móvil. GSAP, DrawSVG y MotionPath se cargan por separado al abrir la constelación; no forman parte del JavaScript inicial. Sin WebGL.

## Pruebas

```sh
npm test
# Con el servidor de desarrollo abierto en el puerto 3000:
npm run test:browser
npm run test:responsive
npm run test:motion
```

La prueba de navegador utiliza Google Chrome instalado. Para Edge en PowerShell:

```powershell
$env:PLAYWRIGHT_CHANNEL = 'msedge'
npm run test:browser
```

Puede indicarse otra URL mediante `TEST_URL`. Para conservar evidencia separada de esta rama, usar `$env:EVIDENCE_DIR = 'output/playwright/esmeralda-flores'` antes de las pruebas en PowerShell. Si no se indica, la ruta predeterminada sigue siendo `output/playwright/v2/`. Consultar `VERIFICATION.md` para las revisiones visuales y las limitaciones de la medición.

En pantallas muy bajas u horizontales se permite desplazamiento vertical dentro del mismo escenario para preservar la flor y el texto. No se fuerza una composición comprimida ni se desactiva el zoom.

## Preparación

`SKILLS.md` registra las habilidades utilizadas, las cinco nuevas skills oficiales de GSAP, sus fuentes y la activación observada. `MOTION_DESIGN.md` conserva la dirección original y añade la coreografía de v2.
