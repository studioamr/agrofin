/* ============ INVERNA · Consultas y agregaciones ============ */
const Q = (() => {
  const db = () => App.db;

  const inMonth = (arr, key) => arr.filter(x => UI.monthKey(x.date) === key);
  const byDateDesc = arr => arr.slice().sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  // ---- gastos ----
  const sum = (arr, f) => arr.reduce((s, x) => s + (f ? f(x) : x), 0);
  function expensesMonth(key) { return byDateDesc(inMonth(db().expenses, key)); }
  function expensesTotal(arr) { return sum(arr, x => x.amount); }
  function expensesByCat(key) {
    const m = inMonth(db().expenses, key);
    return Data.CATS.map(c => ({ cat: c, total: sum(m.filter(e => e.cat === c.id), x => x.amount) }))
      .filter(r => r.total > 0).sort((a, b) => b.total - a.total);
  }

  // ---- cortes / producción ----
  function harvestsMonth(key) { return byDateDesc(inMonth(db().harvests, key)); }
  function harvestKg(arr) { return sum(arr, x => x.kg); }
  function harvestByQuality(key) {
    const m = inMonth(db().harvests, key);
    return Data.QUALITIES.map(q => ({ q, kg: sum(m.filter(h => h.quality === q.id), x => x.kg) })).filter(r => r.kg > 0);
  }
  function harvestByProduct(key) {
    const m = inMonth(db().harvests, key);
    const map = {};
    m.forEach(h => { map[h.product] = (map[h.product] || 0) + h.kg; });
    return Object.entries(map).map(([product, kg]) => ({ product, kg })).sort((a, b) => b.kg - a.kg);
  }

  // ---- clientes / pedidos / ventas ----
  const balance = o => Math.max(0, (o.total || 0) - (o.paid || 0));
  const isReceivable = o => o.status === 'entregado' && balance(o) > 0;
  function ordersDesc() { return byDateDesc(db().orders); }
  function pendingOrders() { return byDateDesc(db().orders.filter(o => o.status === 'pedido')); }
  function salesMonth(key) { return sum(inMonth(db().orders.filter(o => o.status === 'entregado'), key), x => x.total); }
  function receivableTotal() { return sum(db().orders.filter(isReceivable), balance); }
  function clientOrders(cid) { return byDateDesc(db().orders.filter(o => o.clientId === cid)); }
  function clientBalance(cid) { return sum(db().orders.filter(o => o.clientId === cid && isReceivable(o)), balance); }
  function clientTotalSold(cid) { return sum(db().orders.filter(o => o.clientId === cid && o.status === 'entregado'), x => x.total); }
  const clientById = cid => db().clients.find(c => c.id === cid);
  const clientName = cid => { const c = clientById(cid); return c ? c.name : 'Cliente'; };

  // ---- resumen del mes ----
  function monthSummary(key) {
    const exp = expensesTotal(inMonth(db().expenses, key));
    const sales = salesMonth(key);
    const kg = harvestKg(inMonth(db().harvests, key));
    return { exp, sales, kg, profit: sales - exp, receivable: receivableTotal() };
  }

  return {
    db, inMonth, byDateDesc, sum,
    expensesMonth, expensesTotal, expensesByCat,
    harvestsMonth, harvestKg, harvestByQuality, harvestByProduct,
    balance, isReceivable, ordersDesc, pendingOrders, salesMonth, receivableTotal,
    clientOrders, clientBalance, clientTotalSold, clientById, clientName,
    monthSummary,
  };
})();
