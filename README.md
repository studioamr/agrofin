# AGROFIN 🌱

App para llevar el **control de tu invernadero**: gastos, producción (cortes), clientes, ventas, cobranza y bitácora — todo en el teléfono y **sin internet**.

## Qué hace
- **Resumen** — utilidad del mes (ventas − gastos), por cobrar, cortes, y desglose por categoría y cultivo.
- **Gastos** — agroquímicos, insumos, gasolina, equipos, mano de obra y otros, por categoría.
- **Cortes** — producción por fecha en kg o toneladas, con calidad (Primera/Segunda/Tercera).
- **Clientes** — pedidos → entregados, ventas y lo que te deben (pagos parciales y “por cobrar”).
- **Bitácora + Notas** — riegos, fumigaciones, incidencias y recordatorios.

## Privacidad
Todos los datos se guardan **solo en el dispositivo** del usuario (localStorage). No hay servidores ni cuentas. Cada usuario empieza desde cero.

## Tecnología
HTML + CSS + JavaScript vanilla, sin dependencias ni build. PWA instalable y offline (service worker).

## Cómo correrlo localmente
Al ser estático, sírvelo con cualquier servidor. Por ejemplo:

```bash
cd agrofin
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
  store.js          · persistencia (localStorage)
  data.js           · catálogos + datos de ejemplo (opcionales)
  ui.js             · iconos, formato, componentes
  q.js              · consultas/agregaciones
  forms.js          · formularios
  views-*.js        · pantallas
  app.js            · router + acciones
```

---
v1 · Beta · Hecho para el invernadero.
