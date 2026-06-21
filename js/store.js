/* ============ INVERNA · Persistencia (localStorage) ============ */
const Store = (() => {
  const KEY = 'inverna_v1';

  const empty = () => ({
    meta: { name: 'Mi invernadero', area: '', entered: false, cleared: false },
    cycle: { crop: 'Jitomate saladet', variety: 'Mosquetero', start: '', name: 'Ciclo actual' },
    products: ['Jitomate saladet'],               // cultivos (editables)
    expenses: [],     // gastos / compras  {id,date,cat,concept,amount,note}
    harvests: [],     // cortes   {id,date,product,kg,quality,note}
    clients: [],      // clientes {id,name,phone,note,createdAt}
    orders: [],       // pedidos/ventas {id,clientId,date,product,kg,price,total,status,paid,note,createdAt}
    tasks: [],        // trabajos {id,title,date,status,cost,note}
    irrigations: [],  // riegos   {id,date,minutes,water,wunit,fert,funit,note}
    applications: [], // foliares {id,date,product,dose,cost,note}
    inventory: [],    // inventario {id,name,kind,qty,unit,note}
    log: [],          // bitácora {id,date,text,tag}
    notes: [],        // notas    {id,title,text,updatedAt}
    seeded: false,    // marca si ya cargamos el ejemplo
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
