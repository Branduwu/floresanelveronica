# Una flor hasta donde estés

Un observatorio botánico interactivo para Anel Verónica. Tres actos en un mismo cielo: una estrella llega, dibuja una rosa amarilla y da vida a un jardín con mensajes y una carta.

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

Editar `src/content.ts`: nombre, dedicatoria, frases ocultas y carta. La identidad y los breakpoints están en `src/styles.css`; la coreografía se documenta en `MOTION_DESIGN.md`.

## Interacciones

1. Tocar la estrella o activarla con Enter/Espacio.
2. Ver nacer la rosa o utilizar «Saltar intro».
3. Tocar los pétalos para sembrar el jardín.
4. Explorar las flores para descubrir tres frases y la estrella para revelar A ✦ V.
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
    Sky.tsx               Canvas, profundidad y polen; un único RAF
    Observatory.tsx       Cartografía astronómica
    Letter.tsx            Papel, diálogo nativo, cierre y foco
    Icons.tsx             Estrella y sobre vectoriales
  styles.css              Sistema visual, coreografía y responsive
tests/
  scene.test.ts           Transiciones válidas, repetición y callbacks tardíos
  browser.mjs             Recorrido real, tacto, foco, capturas y axe
```

SVG/CSS construyen realmente la flor: dibujo de trazos, rellenos escalonados, despliegue de hojas y capas con sombra. El pétalo que asciende interpola su geometría hacia una estrella. Canvas mantiene partículas fuera de React; su densidad y resolución se limitan en móvil. Sin WebGL ni bibliotecas pesadas de motion.

## Pruebas

```sh
npm test
# Con el servidor de desarrollo abierto en el puerto 3000:
npm run test:browser
```

La prueba de navegador utiliza Google Chrome instalado. Para Edge en PowerShell:

```powershell
$env:PLAYWRIGHT_CHANNEL = 'msedge'
npm run test:browser
```

Puede indicarse otra URL mediante `TEST_URL`. Evidencias y resultados se guardan en `output/playwright/`. Consultar `VERIFICATION.md` para las revisiones visuales y las limitaciones de la medición.

En pantallas muy bajas u horizontales se permite desplazamiento vertical dentro del mismo escenario para preservar la flor y el texto. No se fuerza una composición comprimida ni se desactiva el zoom.

## Preparación

`SKILLS.md` registra las cinco habilidades instaladas, fuentes comprobadas y su aplicación real. `MOTION_DESIGN.md` se escribió antes de los componentes.
