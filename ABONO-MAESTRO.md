# ABONO — Documento maestro del proyecto
*Actualizado: 4 de julio de 2026. Autocontenido: sirve para dar contexto completo en cualquier conversación nueva.*

## 1. Qué es

**ABONO** es la app de André Macouzet (andremacouzetruiz@gmail.com) para el **control de invernaderos**: "Sabe si ganaste." Junta gastos, cortes (producción), ventas, cobranza, trabajos, riego y bitácora, y calcula la utilidad real del ciclo agrícola. En español, hecha para productores de Michoacán. El primer usuario real es el **tío de André** (jitomate saladet, semilla Mosquetero).

- **Nombre:** ABONO (doble sentido: fertilizante + pago a cuenta). Historia: INVERNA → AGROFIN → **ABONO** (definitivo, jul 2026).
- **App en vivo:** https://parfectapp.github.io/agrofin/ (URL heredada de AGROFIN — ver pendientes)
- **Repo:** github.com/parfectapp/agrofin (público, GitHub Pages auto-deploy en push)
- **Carpeta local:** `~/claude/inverna` (el id interno sigue siendo "inverna" — NO renombrar carpeta ni claves internas, romperia rutas)
- **Preview local:** puerto 4182 (`python3 -m http.server 4182`)

## 2. El producto (app)

**Stack:** vanilla JS puro, sin framework ni build. PWA real (manifest + service worker `sw.js`, cache `inverna-vNN`, funciona offline — clave: en el invernadero no siempre hay señal). Una sola dependencia: supabase-js por CDN. Cache busting manual `?v=N` por archivo en index.html + sw.js (bump SIEMPRE ambos al editar un js/css).

**Features:**
- **Resumen** — dashboard mensual: utilidad (ventas−gastos), cortes, por cobrar, desglose por categoría/cultivo, últimos movimientos.
- **Gastos** — 6 categorías (agroquímicos, insumos, gasolina, equipos, mano de obra, otros), con **fotos** (recibo/factura, comprimidas a JPEG ≤1100px, máx 6).
- **Cortes** — kg/toneladas por fecha, calidad Primera/Segunda/Tercera, con fotos.
- **Clientes** — pedidos → entregados, pagos parciales, "por cobrar".
- **Ciclo agrícola** (jul 2026, pedido del tío) — ciclos de **duración variable** (inicio–fin editable, fin vacío = en curso), utilidad del ciclo acotada por fechas, costo por kilo, margen, **historial de ciclos cerrados** (`db.cycles[]`), "Cerrar ciclo y empezar uno nuevo". `Q.cycleSummary(cycle)` filtra por rango de fechas.
- **Trabajos** (pendiente/proceso/hecho + costo), **Riego/fertirriego**, **Aplicaciones foliares**, **Inventario**, **Bitácora + Notas** (con fotos).
- **Export a Excel (.csv)** del ciclo activo (con BOM para acentos).

**Nube (Supabase):** proyecto `fnxifbddgjyzwrolprel` — email+password, tabla `public.greenhouse(user_id pk, data jsonb, updated_at)` con RLS (un documento JSON por usuario), publishable key hardcodeada en `js/cloud.js` (pública, segura). **Offline-first robusto:** caché local por cuenta (`abono_cache__<uid>`), `_savedAt` timestamp — al abrir gana la copia MÁS NUEVA (nube vs local); `Store.save` a prueba de cuota (si las fotos no caben, guarda sin fotos); `flushSync` al cerrar la app; recuperación de datos legacy (`inverna_v1`, `inverna_db__*`, `agrofin_cache__*`). Restablecer contraseña (pantalla `recovery`) y verificación de correo (pantalla `checkEmail`) implementadas — ver pendientes de config.

**Arquitectura:** módulos IIFE — `Store` (caché local), `Cloud` (Supabase), `Data` (catálogos+seed), `UI` (iconos/formato/sheet/modal/compressImage), `Q` (queries), `Forms`, `Views` (window.Views extendido por archivo), `App` (router + acciones, event delegation `data-act`). Rutas fullscreen: landing/auth/recovery/checkEmail; tabs: home/gastos/cortes/clientes/mas (hub → rentabilidad="Ciclo agrícola"/tareas/riego/aplicaciones/inventario/bitacora).

## 3. Marketing y lanzamiento (todo en `marketing/`)

- `MARCA.md` — identidad completa: tagline maestro **"Sabe si ganaste."**, posicionamiento ("la libreta digital de tu invernadero"), 3 pilares (control sin esfuerzo / sabe si ganaste / cobra lo que te deben), voz de productor a productor, tokens visuales reales (verde `#168a4b` + ámbar `#c4790f`, fondo claro `#eef3ea`, Inter, radio 18px, ícono brote).
- `PLAN-LANZAMIENTO.md` — playbook 30 días → **10 invernaderos** con ≥1 registro real. Canal: WhatsApp warm + tiendas de agroquímicos/viveros + grupos de productores. El tío = caso de éxito demo.
- `MENSAJES.md` — copy listo: kit de instalación, 1:1, grupos, pitch a tiendas, referidos, objeciones.
- `OPERACION.md` — **la rutina semanal** (revisar app viva → contar CSV → preparar tanda de mensajes → detectar rezagados → reporte 5 líneas). Claude produce, André manda. Para activarla: pedir a Claude "agrega la rutina semanal de ABONO" (tarea programada, como la de PARFECT 9:47 AM).
- `seguimiento.csv` — tablero manual: pendiente → invitado → instaló → registró_algo (el que cuenta) → activo.

## 4. Negocio

- **Modelo:** por definir tras validar con los primeros 10. Idea inicial: gratis para los primeros (afinar producto), luego venta directa sencilla (pago único o mensualidad chica ~$100–200 MXN/mes por invernadero — el tío es quien pregunta "en cuánto me la vendes").
- **North Star actual:** 10 productores con ≥1 registro real en 30 días; salud = cuántos vuelven en un segundo ciclo.
- Posible sinergia futura con [[raiz-venture]] (agtech Michoacán) — ABONO puede ser la puerta de entrada del dato de invernadero, pero HOY es un producto independiente y simple. No mezclar mensajes.

## 5. Qué falta (el pendiente real)

**Solo André puede (bloqueadores):**
1. **Supabase URL Configuration** (2 min): Authentication → URL Configuration → Site URL + Redirect URLs = `https://parfectapp.github.io/agrofin/`. Sin esto, los correos de restablecer contraseña y confirmación NO abren la app.
2. **git push** después de cada tanda de cambios de Claude (remote ya configurado).
3. Borrar usuarios de prueba en Supabase: `agrofin.v13test@gmail.com`, `agrofin.demo2@gmail.com`, `agrofin.prueba@gmail.com`.
4. Decidir sobre la **URL**: ¿renombrar repo a "abono"? (rompería el link instalado del tío — avisar antes) ¿o dominio propio?
5. **IMPI:** buscar "ABONO" antes de invertir más en la marca.
6. Decidir si activar verificación de correo (Confirm email ON en Supabase) — recomendación: OFF por simplicidad para los tíos/productores.
7. **Arrancar el plan de lanzamiento** — llenar `seguimiento.csv` con nombres reales y mandar los primeros 1:1.

**Claude (calendarizado o esperando señal):**
- Rutina semanal de ABONO (cuando André la active como tarea programada).
- Rebrand visual completo si André pide nuevo logo/ícono para ABONO (el brote actual funciona — "abono hace crecer el brote").
- Capturas de la app con datos demo para `marketing/shots/` (cuando haya slot de preview libre).

**Reglas de trabajo vigentes:** honestidad brutal (no vender humo — regla que viene de NorthPoint/VETA); Claude nunca maneja credenciales de André; los WhatsApps personales los manda André; cada push es de André; los datos del tío son sagrados (cualquier bug de guardado es prioridad 1); bump de `?v=` + `sw.js` CACHE en cada cambio de js/css.
