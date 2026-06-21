/* ============ INVERNA · Persistencia (localStorage) ============ */
const Store = (() => {
  const KEY = 'inverna_v1';

  const empty = () => ({
    meta: { name: 'Mi invernadero', area: '', entered: false },
    products: ['Jitomate', 'Pepino', 'Pimiento'], // cultivos (editables)
    expenses: [],   // gastos   {id,date,cat,concept,amount,note}
    harvests: [],   // cortes   {id,date,product,kg,quality,note}
    clients: [],    // clientes {id,name,phone,note,createdAt}
    orders: [],     // pedidos/ventas {id,clientId,date,product,kg,price,total,status,paid,note,createdAt}
    log: [],        // bitácora {id,date,text,tag}
    notes: [],      // notas    {id,title,text,updatedAt}
    seeded: false,  // marca si ya cargamos el ejemplo
  });

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return { ...empty(), ...JSON.parse(raw) };
    } catch (e) { /* corrupto → arranca limpio */ }
    return empty();
  }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function wipe() { try { localStorage.removeItem(KEY); } catch (e) {} }

  const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

  return { load, save, wipe, uid, empty };
})();
