# PLAN DE LANZAMIENTO — 30 días para los primeros 10 invernaderos

> **Objetivo:** 10 productores de invernadero en Michoacán que **instalaron ABONO y registraron ≥1 gasto o corte real**.
> (Instalar no cuenta. Anotar algo real = sí lo usó.)
> **Estrategia:** red cercana (tu tío ya es la prueba) + aliados del ramo (agroquímicas, viveros) + grupos de productores. Mensaje líder = **"sabe si ganaste"**.
> **Hitos:** Día 10 → **4** · Día 20 → **7** · Día 30 → **10**.

> Nota honesta: 10 en 30 días para un invernadero es lo equivalente a los "50 en 14 días" de una app masiva — el círculo de productores que conoces es más chico y más warm que un círculo de golf, así que la meta es menor pero la conversión por contacto es más alta si acompañas en persona.

---

## La idea central (en 20 segundos)
Un productor no instala una app de finanzas por un post — la instala porque **otro productor que conoce ya la usa y le funcionó**. Tu tío es ese primer caso real. El motor de los 10 eres **tú, mostrando el ciclo real de tu tío (o el tuyo)**, con dos palancas:

1. **Demo 1:1 con datos reales** → "mira, esto es lo que le dice a mi tío de su ciclo" (enseñar utilidad, costo por kilo, por cobrar — con números de verdad, no de ejemplo).
2. **Aliados del ramo** → tiendas de agroquímicos, viveros, o la asociación/unión de productores de tu zona: ellos ven a muchos productores y pueden recomendarte con una palabra.

---

## ⚠️ Antes de invitar a nadie — leer esto
- ABONO ya tiene **cuentas reales en la nube** (Supabase): cada quien crea su cuenta con correo y contraseña, y sus datos se respaldan — no se pierden si cambia de teléfono. Esto SÍ lo puedes prometer (ya no es como en la v1 local).
- **No hay panel que cuente los 10 por ti.** Lleva el conteo a mano en `seguimiento.csv` (en esta misma carpeta). Cada persona la registras tú.
- Sé honesto sobre lo que falta: no hace facturación fiscal, no reemplaza a un contador. Es control interno del día a día.

---

## Día 0 — Montaje (2–3 h, una sola vez)
- [ ] **Carga los datos reales de tu tío (o los tuyos) como tu demo.** Es tu mejor argumento de venta: números de verdad, no de ejemplo.
- [ ] **Toma 5 capturas** de la app: Resumen del mes, Ciclo agrícola (utilidad, costo por kilo), Gastos por categoría, Cortes, un Cliente con "por cobrar". Son tu munición para mostrar en WhatsApp.
- [ ] **Abre `seguimiento.csv`** y anota los productores de invernadero que conoces (familia, vecinos, contactos de tu tío, de [[raiz-venture]] si aplica). Apunta también 2–3 tiendas de agroquímicos/viveros de tu zona.
- [ ] **Prepara el "kit de instalación"** — copy en `MENSAJES.md`. La fricción #1 es que no sepan instalarla en su teléfono.
- [ ] **Verifica con tu tío** que su cuenta esté guardando bien (ya lo probamos, pero confírmalo con él una vez más) — es tu caso de éxito, tiene que estar impecable antes de mostrarlo a nadie más.

---

## Semana 1–2 — Núcleo caliente (meta: 4 invernaderos)
### Familia y conocidos directos
- Manda el **mensaje 1:1 personalizado** (`MENSAJES.md` → "WhatsApp 1:1") a los productores que conoces directamente. Uno por uno, mencionando su cultivo si lo sabes.
- A cada "sí": manda el **kit de instalación** y **acompáñalo hasta que registre algo real** (su último gasto, su último corte). Márcalo en el CSV solo cuando lo haga.
- Regla de oro: **no sueltes el link y ya.** Un dato registrado = se queda; un link sin abrir = se pierde.

---

## Semana 2–3 — Aliados del ramo (meta: llegar a 7)
- Visita 2–3 **tiendas de agroquímicos o viveros** de tu zona (`MENSAJES.md` → "Pitch a tienda de agroquímicos"). Pide dejar un **cartel o QR** en el mostrador — ellos ven productores todos los días.
- Si conoces alguna **asociación o unión de productores** local, ofrece enseñarles la app en una reunión — un grupo así puede ser tu mejor fuente de una sola vez.

---

## Semana 3–4 — Grupos y referidos (meta: completar 10)
- En grupos de WhatsApp de productores de tu región, **post de valor primero** (`MENSAJES.md` → "WhatsApp a grupo"): comparte un dato real de tu ciclo (ej. tu costo por kilo), y *después* el CTA.
- A tus primeros usuarios, pídeles **una sola cosa**: que recomienden ABONO a **otro productor que conozcan** (`MENSAJES.md` → "Referido").
- **Día 30:** cuenta los registrados en el CSV. Si vas corto, el hueco casi siempre es "instaló pero no anotó nada real" — vuelve con esos y acompáñalos.

---

## Cómo medir (a mano, sin backend)
Tu tablero es `seguimiento.csv`. Estados:
`pendiente` → `invitado` → `instaló` → `registró_algo` (← **este es el que cuenta**) → `activo` (volvió a anotar en un ciclo distinto).

**North Star de los 30 días:** 10 en estado `registró_algo` o mejor.
**Métrica de salud:** cuántos llegan a `activo`. Si se quedan en un solo registro y no vuelven, el problema es de producto (¿es tedioso anotar?), no de venta — y es señal para revisar la app, no el mensaje.

---

## Reglas para no quemar tu red
- **Nunca el mismo copy a todos.** Personaliza con su nombre y su cultivo.
- **Acompaña hasta el primer registro real.** El handoff "aquí está el link, suerte" mata la conversión.
- **Aporta antes de pedir.** En grupos: un dato de valor primero, CTA después.
- **Una pedida por persona.** Si no entró, déjalo y vuelve cuando tengas una mejora real que enseñarle.
