# Verificación y revisión visual

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
