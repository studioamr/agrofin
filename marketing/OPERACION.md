# OPERACIÓN — La rutina de ABONO

> Cómo se opera este proyecto en el día a día, igual que la rutina de PARFECT.
> División de trabajo: **Claude produce, André manda/publica.** André nunca delega el envío de WhatsApps personales (warm mal hecho = spam).

---

## La rutina semanal (para agregar a tus rutinas programadas)

**Cadencia: 1 vez por semana** (ABONO no necesita el modo 10/día de PARFECT — su canal es WhatsApp warm + aliados, no TikTok. Más frecuencia = quemar la red).

Cuando corra la rutina de ABONO, Claude hace esto en orden:

1. **Revisar la app en vivo** — que https://parfectapp.github.io/agrofin/ cargue sin errores (curl a index + versiones). Si hay error: avisar a André de inmediato, es prioridad sobre todo lo demás.
2. **Revisar `seguimiento.csv`** — contar estados: cuántos `invitado`, `instaló`, `registró_algo`, `activo`. Compararlo contra los hitos del `PLAN-LANZAMIENTO.md` (día 10 → 4, día 20 → 7, día 30 → 10).
3. **Preparar la tanda de la semana** — según la fase del plan:
   - Semana 1–2: 3–5 mensajes 1:1 personalizados (nombres desde el CSV, plantilla de `MENSAJES.md`), listos para que André los copie/pegue.
   - Semana 2–3: el pitch para tiendas de agroquímicos + lista de 2–3 tiendas sugeridas de la zona.
   - Semana 3–4: el post de valor para grupos + los recordatorios de referido.
4. **Detectar rezagados** — del CSV, quién quedó en `instaló` sin `registró_algo` hace >4 días → preparar el follow-up personalizado de cada uno.
5. **Reporte corto a André** — 5 líneas máx: dónde vamos vs. la meta, qué mandar hoy (con los textos listos), y si hay algo roto o bloqueado.

**Lo que hace André después (10–20 min):**
- Copiar/pegar y mandar los mensajes (personalizándolos con lo que él sabe de cada persona).
- Actualizar el CSV con las respuestas que recibió en la semana.
- Si toca visita a tienda/aliado: agendarla.

---

## Cómo activar la rutina programada

Pídele a Claude en cualquier sesión:
> "Agrega la rutina semanal de ABONO: cada lunes a las 9:00 AM, corre la operación de marketing/OPERACION.md del proyecto ~/claude/inverna"

Claude la creará como tarea programada (igual que la de PARFECT de las 9:47 AM). La rutina lee este archivo, así que **si quieres cambiar qué hace la rutina, edita este archivo** — no hace falta tocar la tarea programada.

---

## Reglas vigentes (mismas que PARFECT, adaptadas)
- **Honestidad brutal:** no prometer lo que la app no hace (no es contable, no factura). No inventar métricas.
- **Claude nunca manda WhatsApps personales de André** — los deja listos para copiar/pegar. El envío es de André.
- **Claude nunca maneja credenciales** de Supabase/GitHub de André.
- Cada `git push` lo hace André (Claude deja los commits listos y avisa).
- El CSV es la única fuente de verdad del conteo — si no está en el CSV, no pasó.
- Si la app tiene un bug reportado por un usuario real (ej. el tío), **eso va antes que cualquier marketing**.

---

## Archivos de esta carpeta
| Archivo | Qué es |
|---|---|
| `BRAND.md` | Brand bible de 1 página (esencia, voz, paleta, lenguajes visuales, do/don't) |
| `MARCA.md` | Identidad extendida: posicionamiento, taglines, pilares, pitches |
| `INSTAGRAM.md` | Perfil, grid, 12 posts de lanzamiento, stories, highlights |
| `REELS-TIKTOK.md` | 12 guiones de video + perfil TikTok + reglas |
| `CALENDARIO-30-DIAS.md` | Plan día por día del primer mes en redes |
| `PLAN-LANZAMIENTO.md` | Playbook de 30 días para los primeros 10 invernaderos (WhatsApp warm) |
| `MENSAJES.md` | Todo el copy listo para copiar/pegar (1:1, grupos, tiendas, objeciones) |
| `OPERACION.md` | Este archivo — la rutina y las reglas |
| `seguimiento.csv` | El tablero: quién va en qué estado |
| `plantillas/` | SVG/PNG 1080×1080: avatar, post-dato, post-cita, post-drop |
| `../ABONO-MAESTRO.md` | Documento maestro del proyecto completo (producto + infra + negocio) |

**Nota para la rutina semanal:** si André ya abrió las cuentas (@abono.app), la tanda de la semana también incluye preparar los posts que tocan según `CALENDARIO-30-DIAS.md` (editar la plantilla SVG que corresponda, regenerar el PNG con `qlmanage -t -s 1080 -o . archivo.svg` y dejar caption listo). El arrastre/publicación es de André, como en PARFECT.
