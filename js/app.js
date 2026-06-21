/* ============ INVERNA · App shell, router y acciones ============ */
const App = (() => {
  const db = Store.load();
  // usuario nuevo: muestra datos de ejemplo para previsualizar (a menos que haya vaciado a propósito)
  if (!db.seeded && !db.meta.cleared) { Data.seed(db); Store.save(db); }

  const state = { period: UI.todayKey(), gastoCat: '', cliSeg: 'clientes', pedFilter: 'todos', bitSeg: 'bitacora', taskFilter: 'todos', invKind: 'insumo' };
  let route = db.meta.entered ? 'home' : 'landing';

  function save() { Store.save(db); }
  function go(r) { route = r; window.scrollTo(0, 0); render(); }

  function shiftMonth(key, d) { let [y, m] = key.split('-').map(Number); m += d; while (m < 1) { m += 12; y--; } while (m > 12) { m -= 12; y++; } return y + '-' + String(m).padStart(2, '0'); }

  const MAS_ROUTES = ['mas', 'tareas', 'riego', 'aplicaciones', 'inventario', 'bitacora'];
  function tabbar() {
    const on = r => ((r === 'mas' ? MAS_ROUTES.includes(route) : route === r) ? 'on' : '');
    const t = (r, ic, lb) => `<button class="${on(r)}" data-act="go" data-route="${r}">${UI.icon(ic)}<span>${lb}</span></button>`;
    return `<nav class="tabbar t5">
      ${t('home', 'home', 'Resumen')}
      ${t('gastos', 'money', 'Gastos')}
      ${t('cortes', 'sprout', 'Cortes')}
      ${t('clientes', 'users', 'Clientes')}
      ${t('mas', 'list', 'Más')}
    </nav>`;
  }

  function render() {
    const root = document.getElementById('root');
    document.body.classList.toggle('landing', route === 'landing');
    if (route === 'landing') { root.innerHTML = `<div class="fadein">${Views.landing()}</div>`; return; }
    const view = Views[route] || Views.home;
    root.innerHTML = `<div class="screen"><div class="fadein">${view()}</div></div>` + tabbar();
  }

  // ---- lectura de campos ----
  const val = id => (document.getElementById(id)?.value || '').trim();
  const numv = id => { const v = parseFloat(document.getElementById(id)?.value); return isNaN(v) ? 0 : v; };
  const sheetPick = g => document.querySelector(`.pick[data-g="${g}"] .chip.on`)?.dataset.v;
  const addProductIfNew = p => { if (p && !db.products.includes(p)) db.products.push(p); };
  const find = (k, id) => db[k].find(x => x.id === id);

  function confirmDel(kind, id, label) {
    UI.modal(`<div class="h3 mb8">¿Eliminar ${label}?</div><p class="muted small mb16">No se puede deshacer.</p>
      <div class="btn-row"><button class="btn btn-ghost" data-act="closeSheet">Cancelar</button>
      <button class="btn btn-danger" data-act="doDelete" data-kind="${kind}" data-id="${id}">Eliminar</button></div>`);
  }

  /* ============ acciones ============ */
  const A = {
    go: el => go(el.dataset.route),
    enterApp: () => { db.meta.entered = true; save(); go('home'); },
    seeLanding: () => { UI.closeSheet(); go('landing'); },
    goCortes: () => go('cortes'),
    goReceivable: () => { state.cliSeg = 'pedidos'; state.pedFilter = 'cobrar'; go('clientes'); },
    closeSheet: () => UI.closeSheet(),
    closeBg: (el, ev) => { if (ev.target === el) UI.closeSheet(); },
    pick: el => { const g = el.closest('.pick'); if (!g) return; g.querySelectorAll('[data-pick]').forEach(b => b.classList.remove('on')); el.classList.add('on'); },

    prevMonth: () => { state.period = shiftMonth(state.period, -1); render(); },
    nextMonth: () => { state.period = shiftMonth(state.period, 1); render(); },
    setGastoCat: el => { state.gastoCat = el.dataset.v; render(); },
    setCliSeg: el => { state.cliSeg = el.dataset.v; render(); },
    setPedFilter: el => { state.pedFilter = el.dataset.v; render(); },
    setBitSeg: el => { state.bitSeg = el.dataset.v; render(); },
    openSettings: () => UI.sheet(Views.settings()),

    /* ---- gastos ---- */
    addExpense: () => UI.sheet(Forms.expense()),
    editExpense: el => { const e = find('expenses', el.dataset.id); if (e) UI.sheet(Forms.expense(e)); },
    saveExpense(el) {
      const id = el.dataset.id;
      const amount = numv('e-amount');
      if (amount <= 0) return UI.toast('Anota el monto del gasto');
      const data = { cat: sheetPick('cat') || 'otros', date: val('e-date') || UI.todayISO(), concept: val('e-concept'), amount, note: val('e-note') };
      if (id) Object.assign(find('expenses', id), data);
      else db.expenses.push({ id: Store.uid(), ...data });
      save(); UI.closeSheet(); UI.toast(id ? 'Gasto actualizado' : 'Gasto registrado'); render();
    },
    delExpense: el => confirmDel('expenses', el.dataset.id, 'este gasto'),

    /* ---- cortes ---- */
    addHarvest: () => UI.sheet(Forms.harvest()),
    editHarvest: el => { const h = find('harvests', el.dataset.id); if (h) UI.sheet(Forms.harvest(h)); },
    saveHarvest(el) {
      const id = el.dataset.id;
      const product = val('h-product');
      const qty = numv('h-qty');
      if (!product) return UI.toast('¿Qué cultivo cortaste?');
      if (qty <= 0) return UI.toast('Anota la cantidad');
      const kg = (sheetPick('unit') === 't') ? qty * 1000 : qty;
      addProductIfNew(product);
      const data = { date: val('h-date') || UI.todayISO(), product, kg, quality: sheetPick('quality') || 'primera', note: val('h-note') };
      if (id) Object.assign(find('harvests', id), data);
      else db.harvests.push({ id: Store.uid(), ...data });
      save(); UI.closeSheet(); UI.toast(id ? 'Corte actualizado' : 'Corte registrado'); render();
    },
    delHarvest: el => confirmDel('harvests', el.dataset.id, 'este corte'),

    /* ---- clientes ---- */
    addClient: () => UI.sheet(Forms.client()),
    editClient: el => { const c = find('clients', el.dataset.id); if (c) UI.sheet(Forms.client(c)); },
    openClient: el => UI.sheet(Views.clientSheet(el.dataset.id)),
    saveClient(el) {
      const id = el.dataset.id;
      const name = val('c-name');
      if (name.length < 2) return UI.toast('Escribe el nombre del cliente');
      const data = { name, phone: val('c-phone'), note: val('c-note') };
      if (id) Object.assign(find('clients', id), data);
      else db.clients.push({ id: Store.uid(), ...data, createdAt: Date.now() });
      save(); UI.closeSheet(); UI.toast(id ? 'Cliente actualizado' : 'Cliente guardado'); render();
    },
    delClient: el => confirmDel('clients', el.dataset.id, 'este cliente'),

    /* ---- pedidos / ventas ---- */
    addOrder: () => UI.sheet(Forms.order()),
    addOrderFor: el => UI.sheet(Forms.order({}, el.dataset.id)),
    editOrder: el => { const o = find('orders', el.dataset.id); if (o) UI.sheet(Forms.order(o)); },
    openOrder: el => UI.sheet(Views.orderSheet(el.dataset.id)),
    saveOrder(el) {
      const id = el.dataset.id;
      const clientId = document.getElementById('o-client')?.value;
      const product = val('o-product');
      const kg = numv('o-kg'), price = numv('o-price');
      if (!clientId) return UI.toast('Elige un cliente');
      if (!product) return UI.toast('¿Qué cultivo?');
      if (kg <= 0) return UI.toast('Anota la cantidad');
      if (price <= 0) return UI.toast('Anota el precio por kg');
      addProductIfNew(product);
      const total = Math.round(kg * price);
      const data = { clientId, date: val('o-date') || UI.todayISO(), product, kg, price, total, status: sheetPick('status') || 'pedido', note: val('o-note') };
      if (id) Object.assign(find('orders', id), data);
      else db.orders.push({ id: Store.uid(), ...data, paid: 0, createdAt: Date.now() });
      save(); UI.closeSheet(); UI.toast(id ? 'Pedido actualizado' : 'Pedido registrado'); render();
    },
    delOrder: el => confirmDel('orders', el.dataset.id, 'este pedido'),
    markDelivered(el) { const o = find('orders', el.dataset.id); if (!o) return; o.status = 'entregado'; save(); UI.toast('Marcado como entregado'); UI.sheet(Views.orderSheet(o.id)); render(); },

    /* ---- pagos ---- */
    openPayment: el => { const o = find('orders', el.dataset.id); if (o) UI.sheet(Forms.payment(o)); },
    savePayment(el) {
      const o = find('orders', el.dataset.id); if (!o) return;
      const amt = numv('p-amount');
      if (amt <= 0) return UI.toast('Anota el abono');
      o.paid = Math.min(o.total, (o.paid || 0) + amt);
      save(); UI.closeSheet(); UI.toast('Pago registrado'); render();
    },
    payFull(el) { const o = find('orders', el.dataset.id); if (!o) return; o.paid = o.total; save(); UI.closeSheet(); UI.toast('Saldo liquidado'); render(); },

    /* ---- bitácora ---- */
    addLog: () => UI.sheet(Forms.log()),
    editLog: el => { const l = find('log', el.dataset.id); if (l) UI.sheet(Forms.log(l)); },
    saveLog(el) {
      const id = el.dataset.id;
      const text = val('l-text');
      if (!text) return UI.toast('Escribe qué pasó');
      const data = { date: val('l-date') || UI.todayISO(), tag: sheetPick('tag') || 'nota', text };
      if (id) Object.assign(find('log', id), data);
      else db.log.push({ id: Store.uid(), ...data });
      save(); UI.closeSheet(); UI.toast(id ? 'Registro actualizado' : 'Agregado a la bitácora'); render();
    },
    delLog: el => confirmDel('log', el.dataset.id, 'este registro'),

    /* ---- notas ---- */
    addNote: () => UI.sheet(Forms.note()),
    editNote: el => { const n = find('notes', el.dataset.id); if (n) UI.sheet(Forms.note(n)); },
    saveNote(el) {
      const id = el.dataset.id;
      const title = val('n-title'), text = val('n-text');
      if (!title && !text) return UI.toast('Escribe algo en la nota');
      if (id) Object.assign(find('notes', id), { title, text, updatedAt: Date.now() });
      else db.notes.push({ id: Store.uid(), title, text, updatedAt: Date.now() });
      save(); UI.closeSheet(); UI.toast(id ? 'Nota actualizada' : 'Nota guardada'); render();
    },
    delNote: el => confirmDel('notes', el.dataset.id, 'esta nota'),

    /* ---- ciclo ---- */
    openCycle: () => UI.sheet(Forms.cycle(db.cycle || {})),
    saveCycle() { db.cycle = { name: val('cy-name') || 'Ciclo actual', crop: val('cy-crop'), variety: val('cy-variety'), start: val('cy-start') }; save(); UI.closeSheet(); UI.toast('Ciclo guardado'); render(); },

    /* ---- trabajos ---- */
    setTaskFilter: el => { state.taskFilter = el.dataset.v; render(); },
    addTask: () => UI.sheet(Forms.task()),
    editTask: el => { const t = find('tasks', el.dataset.id); if (t) UI.sheet(Forms.task(t)); },
    saveTask(el) {
      const id = el.dataset.id;
      const title = val('t-title'); if (!title) return UI.toast('¿Qué trabajo es?');
      const data = { title, status: sheetPick('status') || 'pendiente', date: val('t-date') || UI.todayISO(), cost: numv('t-cost'), note: val('t-note') };
      if (id) Object.assign(find('tasks', id), data); else db.tasks.push({ id: Store.uid(), ...data });
      save(); UI.closeSheet(); UI.toast(id ? 'Trabajo actualizado' : 'Trabajo agregado'); render();
    },
    delTask: el => confirmDel('tasks', el.dataset.id, 'este trabajo'),

    /* ---- riego ---- */
    addIrrig: () => UI.sheet(Forms.irrigation()),
    editIrrig: el => { const r = find('irrigations', el.dataset.id); if (r) UI.sheet(Forms.irrigation(r)); },
    saveIrrig(el) {
      const id = el.dataset.id;
      const data = { date: val('r-date') || UI.todayISO(), minutes: numv('r-min'), water: numv('r-water'), wunit: sheetPick('wunit') || 'm³', fert: numv('r-fert'), funit: sheetPick('funit') || 'L', note: val('r-note') };
      if (id) Object.assign(find('irrigations', id), data); else db.irrigations.push({ id: Store.uid(), ...data });
      save(); UI.closeSheet(); UI.toast(id ? 'Riego actualizado' : 'Riego registrado'); render();
    },
    delIrrig: el => confirmDel('irrigations', el.dataset.id, 'este riego'),

    /* ---- aplicaciones foliares ---- */
    addApp: () => UI.sheet(Forms.application()),
    editApp: el => { const a = find('applications', el.dataset.id); if (a) UI.sheet(Forms.application(a)); },
    saveApp(el) {
      const id = el.dataset.id;
      const product = val('a-product'); if (!product) return UI.toast('¿Qué producto aplicaste?');
      const data = { date: val('a-date') || UI.todayISO(), product, dose: val('a-dose'), cost: numv('a-cost'), note: val('a-note') };
      if (id) Object.assign(find('applications', id), data); else db.applications.push({ id: Store.uid(), ...data });
      save(); UI.closeSheet(); UI.toast(id ? 'Aplicación actualizada' : 'Aplicación registrada'); render();
    },
    delApp: el => confirmDel('applications', el.dataset.id, 'esta aplicación'),

    /* ---- inventario ---- */
    setInvKind: el => { state.invKind = el.dataset.v; render(); },
    addInv: () => UI.sheet(Forms.invItem({ kind: state.invKind })),
    editInv: el => { const i = find('inventory', el.dataset.id); if (i) UI.sheet(Forms.invItem(i)); },
    saveInv(el) {
      const id = el.dataset.id;
      const name = val('i-name'); if (!name) return UI.toast('Escribe el nombre');
      const data = { name, kind: sheetPick('kind') || 'insumo', qty: numv('i-qty'), unit: val('i-unit'), note: val('i-note') };
      if (id) Object.assign(find('inventory', id), data); else db.inventory.push({ id: Store.uid(), ...data });
      save(); UI.closeSheet(); UI.toast(id ? 'Artículo actualizado' : 'Artículo guardado'); render();
    },
    delInv: el => confirmDel('inventory', el.dataset.id, 'este artículo'),

    /* ---- borrado genérico ---- */
    doDelete(el) { const k = el.dataset.kind; db[k] = db[k].filter(x => x.id !== el.dataset.id); save(); UI.closeSheet(); UI.toast('Eliminado'); render(); },

    /* ---- ajustes ---- */
    saveName() { db.meta.name = val('set-name') || 'Mi invernadero'; save(); UI.toast('Nombre guardado'); render(); },
    addProduct() { const v = val('set-prod'); if (!v) return; addProductIfNew(v); save(); UI.sheet(Views.settings()); },
    delProduct(el) { db.products = db.products.filter(x => x !== el.dataset.v); save(); UI.sheet(Views.settings()); },
    exportData() {
      try {
        const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'inverna-datos.json'; a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
        UI.toast('Datos exportados');
      } catch (e) { UI.toast('No se pudo exportar'); }
    },
    resetDemo: () => UI.modal(`<div class="h3 mb8">¿Cargar datos de ejemplo?</div><p class="muted small mb16">Reemplaza lo que tengas ahora por datos de muestra para que veas cómo funciona la app.</p>
      <div class="btn-row"><button class="btn btn-ghost" data-act="closeSheet">Cancelar</button><button class="btn btn-danger" data-act="doReset">Cargar ejemplo</button></div>`),
    doReset() { Object.assign(db, Store.empty()); Data.seed(db); save(); UI.closeSheet(); state.period = UI.todayKey(); go('home'); UI.toast('Ejemplo recargado'); },
    wipeAll: () => UI.modal(`<div class="h3 mb8">¿Borrar todo?</div><p class="muted small mb16">Se eliminan todos tus gastos, cortes, clientes y notas de este teléfono. No se puede deshacer.</p>
      <div class="btn-row"><button class="btn btn-ghost" data-act="closeSheet">Cancelar</button><button class="btn btn-danger" data-act="doWipe">Borrar todo</button></div>`),
    doWipe() { Object.assign(db, Store.empty()); db.meta.cleared = true; save(); UI.closeSheet(); state.period = UI.todayKey(); go('landing'); UI.toast('Listo, empezamos de cero'); },
  };

  /* ---- delegación de eventos ---- */
  document.addEventListener('click', ev => {
    const pk = ev.target.closest('[data-pick]');
    if (pk) { A.pick(pk); return; }
    const el = ev.target.closest('[data-act]');
    if (!el) return;
    const fn = A[el.dataset.act];
    if (fn) { ev.preventDefault(); fn(el, ev); }
  });

  // total en vivo del pedido
  document.addEventListener('input', ev => {
    if (ev.target.id === 'o-kg' || ev.target.id === 'o-price') {
      const kg = parseFloat(document.getElementById('o-kg')?.value) || 0;
      const pr = parseFloat(document.getElementById('o-price')?.value) || 0;
      const t = document.getElementById('o-total'); if (t) t.textContent = UI.money(kg * pr);
    }
  });

  document.addEventListener('DOMContentLoaded', render);
  if (document.readyState !== 'loading') render();

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }

  return {
    db, save, go, render,
    get route() { return route; },
    get period() { return state.period; },
    get gastoCat() { return state.gastoCat; },
    get cliSeg() { return state.cliSeg; },
    get pedFilter() { return state.pedFilter; },
    get bitSeg() { return state.bitSeg; },
    get taskFilter() { return state.taskFilter; },
    get invKind() { return state.invKind; },
  };
})();
