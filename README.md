# ABONO 🌱

App para llevar el **control de tu invernadero**: gastos, producción (cortes), clientes, ventas, cobranza, ciclo agrícola y bitácora — desde el teléfono, con o sin internet.

## Qué hace
- **Resumen** — utilidad del mes (ventas − gastos), por cobrar, cortes, y desglose por categoría y cultivo.
- **Gastos** — agroquímicos, insumos, gasolina, equipos, mano de obra y otros, por categoría (con foto del recibo).
- **Cortes** — producción por fecha en kg o toneladas, con calidad (Primera/Segunda/Tercera).
- **Clientes** — pedidos → entregados, ventas y lo que te deben (pagos parciales y "por cobrar").
- **Ciclo agrícola** — ciclos de duración variable (fecha inicio–fin editable), utilidad del ciclo, costo por kilo, margen, e historial de ciclos cerrados.
- **Trabajos, riego y aplicaciones foliares** — costos y bitácora de labores del invernadero.
- **Bitácora + Notas** — riegos, fumigaciones, incidencias y recordatorios (con foto).

## Cuentas y respaldo
Cada usuario crea su cuenta (correo + contraseña) y sus datos se **respaldan en la nube** (Supabase): funciona sin internet (guarda local primero) y sincroniza al recuperar señal, para poder entrar desde cualquier teléfono sin perder nada. Incluye recuperación de contraseña y verificación de correo.

## Tecnología
HTML + CSS + JavaScript vanilla, sin build. PWA instalable y offline-first (service worker + caché local + Supabase como respaldo en la nube).

## Cómo correrlo localmente
Al ser estático, sírvelo con cualquier servidor. Por ejemplo:

```bash
cd abono
python3 -m http.server 4182
# abre http://localhost:4182
```

## Cómo subirlo (hosting gratis)
Es 100% estático, así que sirve tal cual en cualquier hosting:

- **Netlify / Vercel**: arrastra la carpeta (o conecta el repo). Listo.
- **GitHub Pages**: sube el repo y activa Pages sobre la rama principal (carpeta raíz).
- **Cloudflare Pages**: conecta el repo, sin build command, output = raíz.

> El service worker y la instalación PWA requieren **HTTPS** (cualquiera de los de arriba lo da). En `http://localhost` también funciona para probar.

## Estructura
```
index.html          · shell + escenario de fondo
manifest.json       · PWA
sw.js               · service worker (offline)
icon.svg            · ícono / logo
css/styles.css      · diseño
js/
  store.js          · caché local (localStorage)
  cloud.js          · nube (Supabase: auth + respaldo de datos)
  data.js           · catálogos + datos de ejemplo (opcionales)
  ui.js             · iconos, formato, componentes
  q.js              · consultas/agregaciones
  forms.js          · formularios
  views-*.js        · pantallas
  app.js            · router + acciones
marketing/          · identidad de marca, playbook de lanzamiento y mensajes
```

---
v1 · Beta · Hecho para el invernadero.
