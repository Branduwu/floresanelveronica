# Verificación y revisión visual

## Segunda iteración — v2 — 21 de septiembre de 2026

Trabajo local sobre `6d0ced7`, con estado inicial limpio y rama nueva `v2`. Versión del paquete: `2.0.0`. Se preservan los tres actos, la ilustración de la rosa, la máquina de estados y las evidencias de v1. No se publicó ni se modificó ningún remoto en esta iteración.

### Evidencia nueva

[Galería v2](output/playwright/v2/index.html), [recorrido funcional](output/playwright/v2/functional/report.json), [matriz responsive](output/playwright/v2/responsive/report.json), [transiciones e interrupciones](output/playwright/v2/motion/report.json). Las capturas originales continúan en `output/playwright/`. La nueva línea base previa a modificar la interfaz se conserva en `output/playwright/v2/before/` (54 capturas).

Se revisaron visualmente las galerías de introducción, rosa, jardín, nombre completo, las tres frases, inicio/final de la carta, altura reducida, crecimiento, siembra y escritura parcial. Los collages `*-review.png` proceden de esas capturas reales. También se inspeccionaron imágenes individuales a tamaño legible, incluidas 320 px y escritorio. Las capturas del diálogo usan el viewport para mostrar su desplazamiento interno; las del escenario usan página completa.

### Cambios y archivos

| Área | Implementación |
| --- | --- |
| Composición | `src/layout.css`, importado en `src/main.tsx`, convierte el marco en Grid/Flex. Narración, ilustración, invitación, frase y jardín tienen espacio propio. Las coordenadas absolutas quedan dentro de las ilustraciones. |
| Interacciones | `src/App.tsx` conserva las acciones originales; separa la estrella, alterna rosa/nombre dentro de la misma región y evita mostrar simultáneamente nombre y frase. Tres flores móviles permiten descubrir las tres frases; escritorio conserva seis. |
| Constelación | `src/components/NameConstellation.tsx`: A ✦ V, estrellas que se reúnen, escritura de contornos SVG con DrawSVG, estrella alineada mediante MotionPath, relleno progresivo y partícula final. Una línea con espacio suficiente; dos líneas si la región mide menos de 520 px. |
| Geometría tipográfica | `scripts/generate-name.py` y `src/data/nameGlyphs.ts`: contornos reales de Cormorant Garamond, incluido «ó». Generación previa; no se interpreta la fuente en el navegador. |
| Contenido | `src/content.ts`: se conservan las frases compatibles con el tono solicitado; se suavizan la segunda sorpresa, un párrafo de la carta y el cierre. Narración, pistas, invitación y detalles de carta quedan centralizados. |
| Carta | `src/components/Letter.tsx` y layout: texto más legible, altura limitada por `dvh`, papel desplazable y controles cómodos. Se conservan diálogo nativo, Escape, foco contenido y devolución al sobre. |
| Polen | `src/components/Sky.tsx`: coordenadas correctas después de desplazar la página, una sola emisión por interacción, menos partículas, exclusión de regiones de lectura y ResizeObserver con limpieza. |
| Accesibilidad | `src/styles.css`: enlace de salto oculto visualmente hasta recibir foco, conservando Tab/Enter; evita que aparezca fuera del viewport en capturas completas. La etiqueta de la estrella refleja su acción de volver. |
| Dependencias y mantenimiento | `package.json`/lock añaden GSAP y @gsap/react. README explica nuevas pruebas y regeneración del nombre. `SKILLS.md` y `MOTION_DESIGN.md` documentan la aplicación real. |
| Pruebas | `tests/browser.mjs` se amplía sin sustituir el método existente. Nuevos `tests/responsive.mjs` y `tests/motion.mjs`. |

La revisión previa identificó intersecciones del sobre con la rosa principal en los cinco tamaños móviles y competencia con frases en horizontal. La nueva distribución las elimina en las cajas verificadas. En pantallas pequeñas se permite desplazamiento natural: no se fuerza todo dentro de una pantalla ni se resuelve únicamente reduciendo letra. La identidad, tipografías, cartografía y flores siguen siendo las originales.

### Skills instaladas y utilizadas

Se reutilizaron `frontend-design`, `ui-ux-pro-max`, `vercel-react-best-practices` (carpeta `react-best-practices`), `web-design-guidelines` y `playwright`. Se consultaron sus instrucciones y las búsquedas UX de responsive, espaciado y legibilidad; se revisaron las guías actualizadas de Vercel.

Se instalaron desde el repositorio oficial de GreenSock las cinco skills pertinentes: `gsap-core`, `gsap-timeline`, `gsap-plugins`, `gsap-react` y `gsap-performance`, usando el instalador oficial de Codex previamente inspeccionado. Se aplicaron sus instrucciones: registro único de plugins, timeline con etiquetas, `useGSAP` acotado, `revertOnUpdate`, limpieza al desmontar, geometría adaptable y ausencia de estado React por fotograma. El catálogo de esta sesión incorporó los cinco nombres: activación observada sin reiniciar. Rutas y procedencia completas en [SKILLS.md](SKILLS.md). `skill-installer` se utilizó para la instalación y `openai-docs` para consultar la carga de skills.

### Pruebas ejecutadas en v2

| Comando / alcance | Resultado de esta iteración |
| --- | --- |
| `npm run build` | TypeScript estricto y Vite correctos; 52 módulos. JS inicial 247.72 kB / 78.61 kB gzip; constelación diferida 116.40 kB / 43.21 kB gzip; CSS 33.61 kB / 8.39 kB gzip. |
| `npm test` | 4 pruebas de estados correctas, ejecutadas de nuevo. |
| `npm run test:browser` | 28 comprobaciones correctas: floración real, escritura parcial, nombre completo, una/dos líneas, mensajes, tacto, Tab/Enter, enlace de salto, foco, carta, Escape, repetir, salto, pausa y movimiento reducido. Sin errores de consola ni excepciones. |
| axe | 9 auditorías sin infracciones: las 7 escenas del alcance histórico y nombre de escritorio/móvil. WCAG 2 A/AA y 2.1 AA. |
| `npm run test:responsive` | 90 capturas/comprobaciones: 10 estados por cada uno de 9 tamaños. Sin overflow horizontal ni intersecciones detectadas entre los textos controlados y pétalos visibles, invitación/frase o controles/marca. Final de carta accesible mediante desplazamiento en todos. |
| `npm run test:motion` | 27 capturas de crecimiento, siembra y escritura en los mismos 9 tamaños; 14 comprobaciones correctas de letras completas, giro durante escritura, pausa, repetición durante escritura, preferencia reducida y ausencia de excepciones. |
| `git diff --check` | Sin errores de espacios. El repositorio no tiene lint configurado. |

Tamaños: **320×568, 360×640, 375×667, 390×844, 414×896, 768×1024, 1024×768, 1440×900 y 844×390**. En cada uno se reduce además la altura 90 px para verificar reorganización ante cambios de espacio disponible. Esto simula la variación geométrica; no reproduce la interfaz real de la barra de Safari.

Las mediciones usan `getBoundingClientRect` de narración, pétalos, invitación, frases, región del nombre y cabecera. Se excluyen elementos ocultos y órbitas transparentes para evitar falsos positivos. La revisión visual complementa esas cajas. En las nueve muestras de escritura, la estrella queda a menos de 0.002 px del extremo del contorno activo medido; no es una medición de todos los fotogramas.

La escritura se cancela al desmontar; al cambiar de geometría durante su ejecución se muestra el nombre completo en su nueva composición. Pausa y preferencia reducida completan la secuencia; la carta y la pestaña oculta suspenden el movimiento ambiental. No se reemplazó la animación CSS/SVG de la rosa por GSAP.

### Límites y pendientes

No se observaron problemas funcionales pendientes en el alcance probado. Sigue pendiente validación en dispositivo físico y Safari/iOS real. axe no certifica accesibilidad completa. La muestra final de 120 intervalos RAF con CPU ×4 dio mediana 13.4 ms, p95 26.7 ms y 0 intervalos mayores de 33.4 ms; describe Chrome headless en este equipo, no garantiza 60 FPS en teléfonos. Los valores exactos están en el reporte funcional. No existe configuración de lint; se utilizó el chequeo estricto de TypeScript.

## Historial de la primera versión — resultados previos

Los apartados siguientes se conservan como registro de v1. Sus cifras, constelación A ✦ V y referencias a capturas corresponden a esa versión; la suite actual escribe sus nuevos resultados dentro de `v2/`.

## Evidencias

Abrir [galería de capturas](output/playwright/index.html) y [reporte reproducible](output/playwright/report.json). Las imágenes proceden de Chrome real controlado por Playwright, no de mockups. La suite `tests/browser.mjs` vuelve a generarlas.

## Iteraciones realizadas

1. **Primer escritorio:** se verificó la composición asimétrica en el cielo continuo. La primera flor parecía una copa demasiado simétrica; se redibujó su silueta y seis pétalos internos para crear una espiral de rosa. Se conservaron nervaduras, rellenos y pliegues vectoriales.
2. **Primer móvil:** el sobre cruzaba la flor principal. Se trasladó a un espacio vacío del cielo y se ajustaron tamaño y posición de flores próximas. Se aumentó el texto narrativo móvil y el área táctil de pausa.
3. **Horizontal:** se detectó cruce entre el texto, el sobre y las flores próximas. Se aumentó la altura mínima del escenario en formatos compactos; la página permite desplazarse en pantallas bajas. Captura final `responsive-844x390.png` sin ese solapamiento.
4. **Móvil bajo:** después de aumentar el texto se midió la separación entre mensaje y pétalos; se reajustó el anclaje de la rosa. En 390 × 760, movimiento reducido, la comprobación final encontró 22.7 px de separación. Se inspeccionó la nueva captura.
5. Se revisaron las capturas finales de introducción, floración, jardín, secretos y carta, además de movimiento reducido y tableta. El anillo visible en algunas imágenes de escritorio corresponde al foco de teclado probado.

## Pruebas

- `npm run build`: TypeScript estricto y Vite correctos. JavaScript de producción: aproximadamente 245 kB sin comprimir / 77.8 kB gzip. CSS: 24.4 kB / 6.6 kB gzip. Fuentes WOFF2 locales; sin peticiones a terceros.
- `npm test`: 4 pruebas de la máquina de estados correctas. Recorrido completo, doble pulsación, saltos, repetición y eventos tardíos.
- `npm run test:browser`: recorrido real de los tres actos; comprueba distintas opacidades durante la construcción de los pétalos, foco, constelación, tres mensajes, carta, Escape, skip durante crecimiento, pausa, tacto y movimiento reducido. Resultados exactos en `report.json`.
- axe WCAG 2 A/AA y 2.1 AA: introducción, rosa, jardín y carta de escritorio; rosa, jardín y carta de móvil. Siete auditorías sin infracciones detectadas en las ejecuciones completadas.
- Emulación móvil con tacto; viewport principal 390 × 844. Revisión adicional a 320 × 568, 375 × 667, 844 × 390 y 768 × 1024. Sin desbordamiento horizontal.
- No se observaron errores de consola ni excepciones de la aplicación en los recorridos automatizados.

## Auditoría de código con web-design-guidelines

Fuente consultada: [reglas vigentes de Vercel](https://github.com/vercel-labs/web-interface-guidelines/blob/main/command.md).

- `src/App.tsx`: controles nativos y etiquetados, regiones de anuncio, skip link, contenidos reales, navegación por teclado. Correcto.
- `src/components/Letter.tsx`: diálogo nativo, foco contenido, Escape, devolución al sobre, papel desplazable, limpieza de timeout. Correcto.
- `src/components/Sky.tsx`: un RAF cancelable, coordenadas fuera del estado React, listeners limpiados, DPR y densidad limitados, suspensión en pestaña oculta y modo quieto. Correcto.
- `src/styles.css`: foco visible, zonas seguras, alternativa de movimiento reducido, sin `transition: all`, sin bloqueo de zoom. Correcto tras ajustes de solapamiento.

Las animaciones de trazos, relleno SVG y morphing son excepciones deliberadas al consejo general de animar solo transform/opacity: construyen la ilustración pedida, son acotadas y se eliminan en modo reducido. La mayor parte del ambiente utiliza transform y opacity.

## Rendimiento y límites

Se muestrearon 120 intervalos de requestAnimationFrame con emulación de iPhone 13 y ralentización de CPU ×4 en Chrome headless. Mediana, percentil 95 y cuadros >33.4 ms están en `report.json`. Es una medición del entorno emulado, no un certificado de 60 FPS ni una medición del tiempo GPU de cada efecto.

No se probó en un teléfono físico ni en Safari/iOS real. axe es una auditoría automatizada parcial, complementada aquí con pruebas de foco, tacto, preferencias y revisión visual; no equivale a certificación completa WCAG. En teléfonos de poca altura y horizontal se conserva la legibilidad mediante desplazamiento vertical. El fondo sigue siendo un solo escenario.

## Criterios del brief

- [x] Composición inmersiva original, sin tarjeta de felicitación ni secciones convencionales.
- [x] Rosa SVG construida por trazos y rellenos, con pétalos curvos superpuestos.
- [x] Estrella viajera, pétalo transformado y constelaciones vinculadas al jardín.
- [x] Tres actos conectados con máquina de estados y transiciones cancelables.
- [x] Polen y respuesta luminosa, constelación A ✦ V, tres frases ocultas y carta.
- [x] Carta disponible sin resolver secretos.
- [x] Escritorio, móvil, tacto, teclado, repetición, skip y pausa.
- [x] Preferencia del sistema de movimiento reducido.
- [x] Build, pruebas y capturas reales revisadas y corregidas.
- [x] Contenido editable separado y salida estática lista para desplegar.
