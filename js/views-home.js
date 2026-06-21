/* ============ AGROFIN · Vista Resumen (dashboard) ============ */
window.Views = window.Views || {};

(function (V) {
  function monthNav() {
    return `<div class="monthnav">
      <button class="mn-btn" data-act="prevMonth" aria-label="Mes anterior">${UI.icon('chevL')}</button>
      <div class="mn-lbl">${UI.monthLabel(App.period)}</div>
      <button class="mn-btn" data-act="nextMonth" aria-label="Mes siguiente">${UI.icon('chevron')}</button>
    </div>`;
  }
  V.monthNav = monthNav;

  function statTile(ic, label, value, color, sub, act) {
    return `<div class="stat" ${act ? `data-act="${act}"` : ''} style="--c:${color}">
      <div class="stat-ic">${UI.icon(ic, '', 18)}</div>
      <div class="stat-val">${value}</div>
      <div class="stat-lbl">${label}</div>
      ${sub ? `<div class="stat-sub">${sub}</div>` : ''}
    </div>`;
  }

  function recent() {
    const items = [];
    App.db.expenses.forEach(e => { const c = Data.catOf(e.cat); items.push({ date: e.date, icon: c.icon, color: c.color, title: e.concept || c.label, sub: c.label, right: '−' + UI.money(e.amount), rcls: 'neg' }); });
    App.db.harvests.forEach(h => { const q = Data.qualOf(h.quality); items.push({ date: h.date, icon: 'sprout', color: q.color, title: h.product, sub: 'Corte · ' + q.label, right: UI.weight(h.kg), rcls: '' }); });
    App.db.orders.forEach(o => { items.push({ date: o.date, icon: 'cart', color: o.status === 'entregado' ? '#178a4b' : '#c4790f', title: Q.clientName(o.clientId), sub: (o.status === 'entregado' ? 'Venta' : 'Pedido') + ' · ' + o.product, right: UI.money(o.total), rcls: 'pos' }); });
    return items.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)).slice(0, 6);
  }

  /* ---------------- landing / pantalla de inicio ---------------- */
  V.landing = function () {
    const feat = (ic, color, t, d) => `<div class="lnd-feat">
      <span class="lnd-fic" style="--c:${color}">${UI.icon(ic, '', 20)}</span>
      <div><div class="lnd-ft">${t}</div><div class="lnd-fd">${d}</div></div></div>`;

    const star = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.6 5.7 6.2.6-4.7 4.1 1.4 6.1L12 16.9 6.5 19.6l1.4-6.1L3.2 9.3l6.2-.6Z" fill="#ffce3a"/></svg>`;
    const stars = star.repeat(5);

    const apple = `<svg class="sb-ic" viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M17.05 12.7c-.03-2.6 2.13-3.85 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.12.94-3.93.94-.81 0-2.06-.92-3.39-.89-1.74.03-3.35 1.01-4.25 2.57-1.81 3.14-.46 7.79 1.3 10.34.86 1.25 1.88 2.65 3.22 2.6 1.29-.05 1.78-.83 3.34-.83 1.55 0 1.99.83 3.35.81 1.38-.02 2.26-1.27 3.11-2.53.98-1.45 1.38-2.85 1.4-2.93-.03-.01-2.69-1.03-2.72-4.09ZM14.79 5.3c.71-.86 1.19-2.05 1.06-3.24-1.02.04-2.26.68-2.99 1.54-.66.76-1.23 1.97-1.08 3.13 1.14.09 2.3-.58 3.01-1.43Z"/></svg>`;
    const play = `<svg class="sb-ic" viewBox="0 0 24 24" aria-hidden="true"><path fill="#00d7fe" d="M3.6 1.8C3.4 2 3.3 2.3 3.3 2.7v18.6c0 .4.1.7.3.9l10.4-10.2L3.6 1.8Z"/><path fill="#00f076" d="M3.6 1.8 14 12l3.2-3.2L5.9.9C5.1.5 4.2.9 3.6 1.8Z"/><path fill="#ffce00" d="M14 12l3.2 3.2 3.5-2c.9-.5.9-1.6 0-2.1l-3.5-2L14 12Z"/><path fill="#ff3b30" d="M3.6 22.2c.6.9 1.5 1.2 2.3.8l11.3-6.6L14 12 3.6 22.2Z"/></svg>`;
    const badge = (ic, top, name) => `<a class="store-badge" data-act="enterApp" role="button">${ic}<span class="sb-tx"><small>${top}</small><b>${name}</b></span></a>`;

    const medal = `<svg viewBox="0 0 36 36" aria-hidden="true"><path d="M11 3 17 15 13 17 8 6Z" fill="#3a92e0"/><path d="M25 3 28 6 23 17 19 15Z" fill="#e0703a"/><circle cx="18" cy="23" r="11" fill="#ffd45e"/><circle cx="18" cy="23" r="11" fill="none" stroke="#e8a92a" stroke-width="1.6"/><path d="M18 17l1.8 3.9 4.3.4-3.2 2.8 1 4.2L18 26.9l-3.9 1.4 1-4.2-3.2-2.8 4.3-.4Z" fill="#fff"/></svg>`;
    const award = (b, s) => `<div class="award">${medal}<b>${b}</b><span>${s}</span></div>`;

    return `<div class="lnd">
      <section class="lnd-hero">
        <div class="lnd-badge">${UI.logo(84)}</div>
        <h1 class="lnd-logo">AGROFIN</h1>
        <div class="lnd-tag">Control de tu invernadero</div>
        <div class="lnd-meta">Gastos · Producción · Clientes · Cobranza</div>
        <span class="lnd-beta">Beta</span>
        <button class="btn btn-primary lnd-cta" data-act="enterApp">${UI.icon('sprout')} Entrar a mi invernadero</button>

        <div class="lnd-stores">
          ${badge(apple, 'Descárgala en', 'App Store')}
          ${badge(play, 'Disponible en', 'Google Play')}
        </div>
        <div class="lnd-rating"><span class="lr-stars">${stars}</span><span class="lr-txt">4.9 · productores la usan</span></div>

        <div class="lnd-hint">Desliza para conocer más ${UI.icon('chevDown', '', 16)}</div>
      </section>

      <section class="lnd-body">
        <div class="lnd-eyebrow">Todo tu invernadero, en un lugar</div>
        <h2 class="lnd-h2">Lleva el control sin complicarte</h2>
        <div class="lnd-feats">
          ${feat('money', '#c4790f', 'Gastos', 'Agroquímicos, insumos, gasolina, equipos y sueldos, ordenados por categoría.')}
          ${feat('sprout', '#178a4b', 'Cortes', 'Tu producción por fecha en kg o toneladas, con calidad Primera/Segunda/Tercera.')}
          ${feat('users', '#3a92e0', 'Clientes', 'Pedidos, ventas y lo que te deben: siempre sabes cuánto tienes por cobrar.')}
          ${feat('book', '#8a6df0', 'Bitácora', 'Riegos, fumigaciones, incidencias y notas, día con día.')}
        </div>

        <div class="lnd-awards-eyebrow">Reconocimientos</div>
        <div class="lnd-awards">
          ${award('100%', 'Funciona sin internet')}
          ${award('Privado', 'Tus datos solo en tu equipo')}
          ${award('Morelia', 'Hecho en México')}
        </div>

        <div class="lnd-card2">
          <div class="lnd-c2-t">${UI.icon('trendUp')} Sabe si ganaste</div>
          <p class="lnd-c2-d">AGROFIN junta tus ventas y tus gastos del mes y te muestra tu <b>utilidad</b> de un vistazo.</p>
        </div>

        <button class="btn btn-primary lnd-cta2" data-act="enterApp">${UI.icon('check')} Empezar ahora</button>

        <div class="lnd-foot">
          ${UI.logo(30)}
          <div class="lnd-foot-t">AGROFIN · v1 · Hecho para tu invernadero</div>
          <div class="lnd-foot-s">${UI.icon('info', '', 13)} Tus datos se guardan solo en este teléfono.</div>
        </div>
      </section>
    </div>`;
  };

  V.home = function () {
    const key = App.period;
    const s = Q.monthSummary(key);
    const byCat = Q.expensesByCat(key);
    const maxCat = byCat.length ? byCat[0].total : 0;
    const byProd = Q.harvestByProduct(key);
    const maxProd = byProd.length ? byProd[0].kg : 0;
    const name = App.db.meta.name || 'Mi invernadero';
    const profitColor = s.profit >= 0 ? 'var(--brand)' : 'var(--danger)';

    return `
    <div class="topbar">
      <div class="row gap10">${UI.logo(34)}<div><h1>AGROFIN</h1><div class="sub">${UI.esc(name)}</div></div></div>
      <div class="spacer"></div>
      <button class="iconbtn" data-act="openSettings" aria-label="Ajustes">${UI.icon('settings')}</button>
    </div>

    ${monthNav()}

    <div class="balance-card mt12">
      <div class="bc-head"><span class="eyebrow">Utilidad del mes</span></div>
      <div class="bc-big" style="color:${profitColor}">${s.profit < 0 ? '−' : ''}${UI.money(Math.abs(s.profit))}</div>
      <div class="bc-split">
        <div><div class="bc-k">${UI.icon('trendUp')} Ventas</div><div class="bc-v pos">${UI.money(s.sales)}</div></div>
        <div class="bc-div"></div>
        <div><div class="bc-k">${UI.icon('money')} Gastos</div><div class="bc-v neg">${UI.money(s.exp)}</div></div>
      </div>
    </div>

    <div class="stat-grid mt12">
      ${statTile('sprout', 'Cortes del mes', UI.weight(s.kg), '#178a4b', byProd.length ? byProd.length + ' cultivo' + (byProd.length > 1 ? 's' : '') : 'Sin cortes', 'goCortes')}
      ${statTile('wallet', 'Por cobrar', UI.money(s.receivable), '#c4790f', s.receivable > 0 ? 'Toca para ver' : 'Al corriente', 'goReceivable')}
    </div>

    <div class="section-head mt20"><h3 class="h3">Gastos por categoría</h3><button class="link" data-act="go" data-route="gastos">Ver todos</button></div>
    ${byCat.length ? `<div class="card mt8">${byCat.map(r => UI.bar(r.total, maxCat, r.cat.color, `${UI.dot(r.cat.color)}${r.cat.label}`, UI.money(r.total))).join('')}</div>`
      : `<div class="card mt8">${UI.empty('money', 'Sin gastos este mes', 'Registra tu primer gasto con el botón +.')}</div>`}

    <div class="section-head mt20"><h3 class="h3">Producción por cultivo</h3><button class="link" data-act="go" data-route="cortes">Ver cortes</button></div>
    ${byProd.length ? `<div class="card mt8">${byProd.map(r => UI.bar(r.kg, maxProd, '#178a4b', `${UI.icon('sprout', '', 15)} ${UI.esc(r.product)}`, UI.weight(r.kg))).join('')}</div>`
      : `<div class="card mt8">${UI.empty('sprout', 'Sin cortes este mes', 'Anota tu primer corte con el botón +.')}</div>`}

    <div class="section-head mt20"><h3 class="h3">Últimos movimientos</h3></div>
    <div class="card mt8 list">
      ${recent().length ? recent().map(it => `
        <div class="lrow">
          <span class="lic" style="color:${it.color};background:${UI.hexA(it.color, .12)}">${UI.icon(it.icon, '', 17)}</span>
          <div class="grow"><div class="lt">${UI.esc(it.title)}</div><div class="ls">${UI.esc(it.sub)} · ${UI.date(it.date)}</div></div>
          <div class="lr ${it.rcls}">${it.right}</div>
        </div>`).join('')
      : UI.empty('list', 'Aún no hay movimientos', 'Empieza registrando un gasto, corte o venta.')}
    </div>
    `;
  };

  /* ---------------- ajustes ---------------- */
  V.settings = function () {
    const p = App.db.products;
    return `<div class="h2 mb4">Ajustes</div>
      <p class="small muted mb16">Todo se guarda solo en este teléfono.</p>

      ${`<div class="field"><span class="flbl">Nombre del invernadero</span>
        <div class="row gap8"><input class="input" id="set-name" value="${UI.esc(App.db.meta.name)}" style="flex:1"><button class="btn btn-sm btn-primary" data-act="saveName" style="width:auto">${UI.icon('check')}</button></div></div>`}

      <div class="flbl mt8">Cultivos</div>
      <div class="prod-wrap">
        ${p.map(x => `<span class="prod-chip">${UI.esc(x)}<button data-act="delProduct" data-v="${UI.esc(x)}" aria-label="Quitar">${UI.icon('x', '', 13)}</button></span>`).join('') || '<span class="small muted">Aún no hay cultivos.</span>'}
      </div>
      <div class="row gap8 mt8"><input class="input" id="set-prod" placeholder="Agregar cultivo" style="flex:1"><button class="btn btn-sm btn-ghost" data-act="addProduct" style="width:auto">${UI.icon('plus')}</button></div>

      <div class="divider"></div>
      <button class="btn btn-ghost" data-act="seeLanding">${UI.icon('home')} Ver pantalla de inicio</button>
      <button class="btn btn-ghost mt8" data-act="exportData">${UI.icon('download')} Exportar mis datos (.json)</button>
      <button class="btn btn-ghost mt8" data-act="resetDemo">${UI.icon('info')} Cargar datos de ejemplo</button>
      <button class="btn btn-danger mt8" data-act="wipeAll">${UI.icon('trash')} Borrar todo y empezar de cero</button>

      <div class="center mt20">${UI.logo(28)}<div class="tiny muted mt4">AGROFIN · v1 · Hecho para tu invernadero</div></div>
      <button class="btn btn-ghost mt12" data-act="closeSheet">Cerrar</button>`;
  };
})(window.Views);
