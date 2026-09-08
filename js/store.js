/* ============ ABONO · Caché local por cuenta (offline). La auth/respaldo va por la nube (cloud.js) ============ */
const Store = (() => {
  const dkey = uid => 'abono_cache__' + uid;
  const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

  const empty = () => ({
    meta: { name: 'Mi invernadero', area: '', cleared: false },
    cycle: { id: uid(), crop: 'Jitomate saladet', variety: 'Mosquetero', start: '', end: '', name: 'Ciclo actual' },
    cycles: [],                                                // ciclos cerrados (historial): {id,name,crop,variety,start,end}
    products: ['Jitomate saladet'],
    expenses: [], harvests: [], clients: [], orders: [],
    tasks: [], irrigations: [], applications: [], inventory: [],
    log: [], notes: [],
    seeded: false,
  });

  function load(uid) {
    try { const raw = localStorage.getItem(dkey(uid)); if (raw) return { ...empty(), ...JSON.parse(raw) }; } catch (e) {}
    return null;                                              // null = no hay nada en este dispositivo
  }
  // Quita las fotos (pesadas) para una copia ligera de respaldo local.
  const PHOTO_KEYS = ['expenses', 'harvests', 'log'];
  function stripPhotos(s) {
    const c = { ...s };
    for (const k of PHOTO_KEYS) if (Array.isArray(c[k])) c[k] = c[k].map(r => (r && r.photos && r.photos.length) ? { ...r, photos: [] } : r);
    return c;
  }
  // Guarda en caché; si no cabe (fotos), guarda al menos los datos sin fotos para no perderlos.
  function save(uid, s) {
    try { localStorage.setItem(dkey(uid), JSON.stringify(s)); return true; }
    catch (e) {
      try { localStorage.setItem(dkey(uid), JSON.stringify(stripPhotos(s))); } catch (e2) {}
      return false;
    }
  }
  function wipe(uid) { try { localStorage.removeItem(dkey(uid)); } catch (e) {} }

  // Re-inyecta las fotos locales (por id de registro) en un objeto que viene SIN fotos (de la nube).
  function mergePhotos(target, source) {
    if (!source) return target;
    const t = { ...target }, byId = {};
    PHOTO_KEYS.forEach(k => (source[k] || []).forEach(r => { if (r && r.photos && r.photos.length) byId[k + ':' + r.id] = r.photos; }));
    PHOTO_KEYS.forEach(k => { if (Array.isArray(t[k])) t[k] = t[k].map(r => { const p = byId[k + ':' + r.id]; return p ? { ...r, photos: p } : r; }); });
    return t;
  }

  return { empty, load, save, wipe, uid, stripPhotos, mergePhotos };
})();
