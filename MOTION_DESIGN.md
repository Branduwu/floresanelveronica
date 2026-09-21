# Una flor hasta donde estés — sistema de movimiento

## Ampliación v2

Se conservan las secuencias originales de rosa, llegada de estrella y jardín. Nueva interacción: la estrella del jardín aumenta de brillo; puntos cercanos convergen en A ✦ V (0.8 s), un trazo enlaza con la escritura del nombre (0.4 s), sus contornos se dibujan y adquieren relleno en orden (3.5–4.5 s), dos motas recorren las últimas letras (.7 s). Nombre final persistente hasta cerrar o descubrir una frase. Sin bucle.

El nombre usa una región visual independiente: una línea cuando el contenedor tiene espacio y dos líneas realmente recompuestas en móvil. Cambiar el ancho cancela la timeline anterior y presenta la nueva geometría completa si la secuencia ya empezó; no hay doble escritura. Reducir/pausar movimiento completa el dibujo; pestaña oculta o carta abierta suspenden la timeline. useGSAP revierte al desmontar. Abrir una frase cierra la constelación; abrir la carta limpia la frase. El polen se recorta fuera de regiones de lectura y corrige sus coordenadas al desplazar la página.

Documento previo a la implementación. Materiales: luz ligera, tallo flexible, pétalos de seda, carta de papel. La estrella y la flor ocupan el mismo anclaje: no hay cambio de página.

Curva de escena: cubic-bezier(.22,.61,.36,1). Crecimiento: cubic-bezier(.4,0,.2,1). Ambiente: seno suave. Respuesta táctil: 180 ms. Revelación: 800 ms. Cambio de escena: 1400 ms.

| Movimiento | Razón / disparador | Duración / conexión | Profundidad y móvil | Movimiento reducido |
| --- | --- | --- | --- | --- |
| Oscuridad → estrellas → nombre | Entrada; dirigir atención sin mostrar todo de golpe | Cielo 1 s, nombre 1.2 s, invitación 1.6 s | Canvas 3 planos; menor densidad móvil | Aparecen inmediatamente |
| Estrella desciende en arco y deja trazo | Tocar estrella o Enter; transporta la luz al tallo | 1.8 s, conecta con crecimiento | Camera shift leve; mismo anclaje adaptable | Estado floral final, sin viaje |
| Tallo dibujado, hojas desplegadas | Inicio de floración | 1.8 s; hojas a .8 y 1.1 s | Paths SVG, trazos de nervaduras | Geometría completa |
| Pétalos trazados, rellenos y desplegados | La luz llega al capullo | 20 capas escalonadas; fin a 5.4 s | Geometría curva original, degradados y pliegues | Rosa completa sin stagger |
| Brisa / estrellas / polen | Flor completa; continuidad de vida | Brisa 7 s, estrellas lentas | Amplitud <1 grado; Canvas DPR <=1.75 | Estático, sin RAF sostenido |
| Pétalo asciende y se contrae en estrella | Tocar rosa; creación del jardín | 1.8 s, luego jardín en 2.2 s | Trayectoria con punto intermedio; zoom .9 | Jardín inmediato |
| Constelaciones → flores | Estrella del pétalo llega al cielo | Cascada 120 ms entre 6 variantes | Variantes de geometría, escala, orientación y luz | Todas visibles |
| Polen y luz al tocar | Cada flor responde a la intención | .9 s de partículas, .6 s de luz | Máximo 36 partículas de interacción | Mensaje y énfasis estático |
| A ✦ V | Estrella especial activada | Trazo de constelación 1 s | SVG escalable; control táctil 48 px | Letras visibles directamente |
| Frases escondidas | Tocar tres flores señaladas | .4 s entrada, 5 s lectura, .5 s salida | Texto en cielo despejado, aria-live | Texto durante el mismo tiempo |
| Estrella → sobre → papel | Carta disponible siempre en jardín | Sobre .9 s; papel .7 s, cierre .3 s | Origen visual en sobre; papel con scroll propio | Sin transformación espacial |

## Interrupción y recursos

Máquina: intro → growing → bloom → seeding → garden ↔ letter. Skip desde cualquier transición inicial lleva a bloom. Replay restablece intro. Cada efecto temporal se cancela al abandonar su estado. Pulsaciones repetidas no crean transiciones paralelas. Pausar movimiento completa transiciones narrativas para no bloquear la historia y detiene el ambiente. El cambio del sistema a reduced-motion hace lo mismo. Pestaña oculta: suspende Canvas y CSS ambientales. Desmontaje: cancela RAF, timeouts y listeners. Canvas mantiene datos fuera de React; el puntero se interpola sin renders por frame.

## Criterio de revisión

Verificar escritorio y 390 px, formato móvil corto y landscape; flor completa, letra legible, foco conservado y carta accesible. Medir intervalos RAF en móvil emulado y comunicar límites: no equivalen a un teléfono físico ni certifican 60 FPS.
