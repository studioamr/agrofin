/* ============ INVERNA · Formularios (alta / edición en sheet) ============ */
const Forms = (() => {
  const today = () => UI.todayISO();

  const f = (label, inner, hint) => `<label class="field"><span class="flbl">${label}</span>${inner}${hint ? `<span class="fhint">${hint}</span>` : ''}</label>`;
  const fblock = (label, inner, hint) => `<div class="field"><span class="flbl">${label}</span>${inner}${hint ? `<span class="fhint">${hint}</span>` : ''}</div>`;
  const inp = (id, attrs = '', val = '') => `<input class="input" id="${id}" ${attrs} value="${val != null && val !== '' ? UI.esc(val) : ''}">`;
  const ta = (id, val = '', ph = '') => `<textarea class="ta" id="${id}" placeholder="${ph}">${val ? UI.esc(val) : ''}</textarea>`;
  const dlist = () => `<datalist id="prods">${App.db.products.map(p => `<option value="${UI.esc(p)}"></option>`).join('')}</datalist>`;

  function pick(g, items, sel) {
    return `<div class="pick" data-g="${g}">${items.map(it =>
      `<button type="button" class="chip ${it.id === sel ? 'on' : ''}" data-pick="${g}" data-v="${it.id}"${it.color ? ` style="--c:${it.color}"` : ''}>${it.color ? UI.dot(it.color) : ''}${it.label}</button>`
    ).join('')}</div>`;
  }

  const head = (title, id, delAct) => `<div class="sheet-head"><div class="h2">${title}</div>${id && delAct ? `<button class="iconbtn danger" data-act="${delAct}" data-id="${id}">${UI.icon('trash')}</button>` : ''}</div>`;
  const saveBtn = (act, id, label) => `<button class="btn btn-primary mt8" data-act="${act}" data-id="${id || ''}">${UI.icon('check')} ${label}</button>`;

  /* ---------------- gasto ---------------- */
  function expense(e = {}) {
    const isEdit = !!e.id;
    return head(isEdit ? 'Editar gasto' : 'Nuevo gasto', e.id, 'delExpense')
      + fblock('Categoría', pick('cat', Data.CATS, e.cat || 'insumos'))
      + f('Fecha', inp('e-date', 'type="date"', e.date || today()))
      + f('Concepto', inp('e-concept', 'placeholder="Ej. Fertilizante NPK"', e.concept))
      + f('Monto (MXN)', inp('e-amount', 'type="number" inputmode="decimal" placeholder="0"', e.amount))
      + f('Nota (opcional)', ta('e-note', e.note, 'Detalle, lote, proveedor…'))
      + saveBtn('saveExpense', e.id, isEdit ? 'Guardar cambios' : 'Registrar gasto');
  }

  /* ---------------- corte / producción ---------------- */
  function harvest(h = {}) {
    const isEdit = !!h.id;
    return head(isEdit ? 'Editar corte' : 'Nuevo corte', h.id, 'delHarvest')
      + f('Fecha del corte', inp('h-date', 'type="date"', h.date || today()))
      + f('Cultivo', inp('h-product', 'list="prods" placeholder="Ej. Jitomate"', h.product || App.db.products[0] || '') + dlist())
      + fblock('Cantidad',
          `<div class="row gap8"><input class="input" id="h-qty" type="number" inputmode="decimal" placeholder="0" value="${h.kg != null ? h.kg : ''}" style="flex:1">${pick('unit', [{ id: 'kg', label: 'kg' }, { id: 't', label: 'ton' }], 'kg')}</div>`,
          'Anota en kilos o en toneladas.')
      + fblock('Calidad', pick('quality', Data.QUALITIES, h.quality || 'primera'))
      + f('Nota (opcional)', ta('h-note', h.note, 'Lote, observaciones…'))
      + saveBtn('saveHarvest', h.id, isEdit ? 'Guardar cambios' : 'Registrar corte');
  }

  /* ---------------- cliente ---------------- */
  function client(c = {}) {
    const isEdit = !!c.id;
    return head(isEdit ? 'Editar cliente' : 'Nuevo cliente', c.id, 'delClient')
      + f('Nombre', inp('c-name', 'placeholder="Ej. Central de Abastos"', c.name))
      + f('Teléfono / WhatsApp (opcional)', inp('c-phone', 'type="tel" inputmode="tel" placeholder="10 dígitos"', c.phone))
      + f('Nota (opcional)', ta('c-note', c.note, 'Dirección, bodega, condiciones…'))
      + saveBtn('saveClient', c.id, isEdit ? 'Guardar cambios' : 'Guardar cliente');
  }

  /* ---------------- pedido / venta ---------------- */
  function order(o = {}, fixedClient) {
    const isEdit = !!o.id;
    const cs = App.db.clients;
    if (!cs.length) {
      return head('Nuevo pedido') + UI.empty('users', 'Primero agrega un cliente', 'Necesitas al menos un cliente para registrar un pedido o venta.')
        + `<button class="btn btn-primary mt8" data-act="addClient">${UI.icon('plus')} Agregar cliente</button>`;
    }
    const cid = o.clientId || fixedClient || cs[0].id;
    const opts = cs.map(c => `<option value="${c.id}" ${c.id === cid ? 'selected' : ''}>${UI.esc(c.name)}</option>`).join('');
    const total = (o.kg && o.price) ? o.kg * o.price : 0;
    return head(isEdit ? 'Editar pedido' : 'Nuevo pedido', o.id, 'delOrder')
      + f('Cliente', `<select class="input" id="o-client" ${fixedClient ? 'disabled' : ''}>${opts}</select>`)
      + f('Fecha', inp('o-date', 'type="date"', o.date || today()))
      + f('Cultivo', inp('o-product', 'list="prods" placeholder="Ej. Jitomate"', o.product || App.db.products[0] || '') + dlist())
      + `<div class="row gap8">
          ${f('Cantidad (kg)', inp('o-kg', 'type="number" inputmode="decimal" placeholder="0"', o.kg))}
          ${f('Precio $/kg', inp('o-price', 'type="number" inputmode="decimal" placeholder="0"', o.price))}
        </div>`
      + `<div class="total-line"><span>Total</span><b id="o-total">${UI.money(total)}</b></div>`
      + fblock('Estado', pick('status', [{ id: 'pedido', label: 'Pedido', color: '#c4790f' }, { id: 'entregado', label: 'Entregado', color: '#178a4b' }], o.status || 'pedido'))
      + f('Nota (opcional)', ta('o-note', o.note, ''))
      + saveBtn('saveOrder', o.id, isEdit ? 'Guardar cambios' : 'Registrar pedido');
  }

  /* ---------------- pago / abono ---------------- */
  function payment(o) {
    const bal = Q.balance(o);
    return head('Registrar pago')
      + `<div class="paybox">
          <div class="row between"><span class="muted">${UI.esc(Q.clientName(o.clientId))}</span><span class="small muted">${UI.date(o.date)}</span></div>
          <div class="row between mt8"><span>Total</span><b>${UI.money(o.total)}</b></div>
          <div class="row between"><span>Ya pagado</span><b>${UI.money(o.paid || 0)}</b></div>
          <div class="row between saldo"><span>Saldo</span><b>${UI.money(bal)}</b></div>
        </div>`
      + f('Abono (MXN)', inp('p-amount', 'type="number" inputmode="decimal"', bal), 'Deja el saldo completo o anota un abono parcial.')
      + `<div class="btn-row mt8">
          <button class="btn btn-ghost" data-act="payFull" data-id="${o.id}">${UI.icon('checkc')} Saldar todo</button>
          <button class="btn btn-primary" data-act="savePayment" data-id="${o.id}">${UI.icon('check')} Registrar</button>
        </div>`;
  }

  /* ---------------- bitácora ---------------- */
  function log(l = {}) {
    const isEdit = !!l.id;
    return head(isEdit ? 'Editar registro' : 'Registro de bitácora', l.id, 'delLog')
      + f('Fecha', inp('l-date', 'type="date"', l.date || today()))
      + fblock('Tipo', pick('tag', Data.LOGTAGS, l.tag || 'nota'))
      + f('¿Qué pasó?', ta('l-text', l.text, 'Riego, fumigación, incidencia, observación…'))
      + saveBtn('saveLog', l.id, isEdit ? 'Guardar cambios' : 'Agregar a bitácora');
  }

  /* ---------------- nota ---------------- */
  function note(n = {}) {
    const isEdit = !!n.id;
    return head(isEdit ? 'Editar nota' : 'Nueva nota', n.id, 'delNote')
      + f('Título', inp('n-title', 'placeholder="Ej. Pendientes"', n.title))
      + f('Contenido', ta('n-text', n.text, 'Escribe lo que quieras recordar…'))
      + saveBtn('saveNote', n.id, isEdit ? 'Guardar cambios' : 'Guardar nota');
  }

  return { expense, harvest, client, order, payment, log, note };
})();
