const clientId = ('par défaut').trim();
const GAS_URL = "https://script.google.com/macros/s/AKfycbx2AC_cNpPndM772BH_DFG90Vzv8-Ahtp5PYjH0rOkcnwSWzYog0NLZU3Xa8c97tyJRKw/exec";

export const todayFR = () => {
  const d = new Date();
  return (
    String(d.getDate()).padStart(2, '0') +
    '/' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '/' +
    d.getFullYear()
  );
};

export const yesterdayFR = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1); // hier
  return String(d.getDate()).padStart(2,'0') + '/'
       + String(d.getMonth()+1).padStart(2,'0') + '/'
       + d.getFullYear();
}

export const sendBulk = (payload: any, cb: any) =>{
  const params =
    'bulk=' + encodeURIComponent(JSON.stringify(payload.bulk)) +
    '&date=' + encodeURIComponent(payload.date) +
    (payload.sheet ? '&sheet=' + encodeURIComponent(payload.sheet) : '') +
    (clientId ? '&id=' + encodeURIComponent(clientId) : '');

  const xhr = new XMLHttpRequest();
  xhr.open('POST', GAS_URL, true);
  xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded;charset=UTF-8');
  xhr.onreadystatechange = function(){
    if (xhr.readyState!==4) return;
    if (xhr.status>=200 && xhr.status<300){
      try{
        const d=JSON.parse(xhr.responseText);
        if(d&&d.ok) return cb(null);
        return cb(d.error||'Réponse Apps Script invalide');
      } catch(e: any){
        return cb('JSON parse error: '+ e.message);
      }
    }
    if (xhr.status===0){
      const url = GAS_URL + '?action=bulk'
        + '&date=' + encodeURIComponent(payload.date)
        + (payload.sheet ? '&sheet=' + encodeURIComponent(payload.sheet) : '')
        + (clientId ? '&id=' + encodeURIComponent(clientId) : '')
        + '&bulk=' + encodeURIComponent(JSON.stringify(payload.bulk));
      const x=new XMLHttpRequest();
      x.open('GET', url, true);
      x.onreadystatechange=function(){
        if (x.readyState!==4) return;
        if (x.status>=200 && x.status<300){
          try{
            const d=JSON.parse(x.responseText);
            if(d&&d.ok) return cb(null);
            return cb(d.error||'Réponse Apps Script invalide (GET)');
          } catch(e: any){
            return cb('JSON parse error (GET): '+ e.message);
          }
        }
        return cb('HTTP '+x.status+' — '+(x.responseText||''));
      };
      x.send(null);
      return;
    }
    return cb('HTTP '+xhr.status+' — '+(xhr.responseText||''));
  };
  xhr.send(params);
}

const hoursToLabel = (h: number) => {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return `${hh}h${String(mm).padStart(2,'0')}`;
}

export const loadYesterdaySummary = async () => {
  const yDate = yesterdayFR();

  let weight;
  let sleep;
  let steps;
  let energy;

  try {
    let url = GAS_URL
      + '?action=day_summary'
      + '&date=' + encodeURIComponent(yDate);

    if (clientId) {
      url += '&id=' + encodeURIComponent(clientId);
    }

    const res = await fetch(url);

    if (!res.ok) throw new Error('HTTP ' + res.status);

    const json = await res.json();

    if (!json.ok || !json.exists) {
      return; // on laisse les "—"
    }

    // 🟦 Poids
    if (typeof json.weight === 'number' && !isNaN(json.weight)) {
      weight =
        json.weight.toLocaleString('fr-FR', { maximumFractionDigits: 1 }) + ' kg';
    }

    // 😴 Sommeil
    if (typeof json.sleepHours === 'number' && !isNaN(json.sleepHours)) {
      if (typeof hoursToLabel === 'function') {
        sleep = hoursToLabel(json.sleepHours);
      } else {
        const hh = Math.floor(json.sleepHours);
        const mm = Math.round((json.sleepHours - hh) * 60);
        sleep = `${hh}h${String(mm).padStart(2, '0')}`;
      }
    }

    // 👟 Pas
    if (typeof json.steps === 'number' && !isNaN(json.steps)) {
      steps = json.steps.toLocaleString('fr-FR') + ' pas';
    }

    // ⚡ Énergie
    if (typeof json.energy === 'number' && !isNaN(json.energy)) {
      energy = json.energy.toLocaleString('fr-FR') + ' / 5';
    }

    return { weight, sleep, steps, energy };

  } catch (err) {
    return err;
  }
}

function formatProfileDateFR(raw: any) {
  if (!raw) return '—';

  // Si c'est déjà au format JJ/MM/AAAA
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(String(raw))) {
    return String(raw);
  }

  // Si c'est un ISO genre "2025-11-14T23:00:00.000Z"
  try {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return String(raw);

    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  } catch (e) {
    return String(raw);
  }
}

async function loadProfileHealthPoints(scoreEl: any, ptsTextEl: any, barEl: any) {
  try {
    // ✅ nouveau endpoint unifié
    let url = GAS_URL + '?action=healthpoints';
    if (clientId) url += '&id=' + encodeURIComponent(clientId);

    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);

    const json = await res.json();
    console.log('healthPoints JSON = ', json);  // debug

    if (!json.ok) throw new Error(json.error || 'Réponse Apps Script invalide');

    // 🧮 Total points = base (journal) + bonus TODO list
    const totalNum = Number(json.totalHealthPoints ?? json.total ?? 0);
    if (!Number.isFinite(totalNum)) {
      console.warn('totalHealthPoints invalide :', json.totalHealthPoints);
      return;
    }

    console.log(
      'HP calculés => base =', json.basePoints,
      'todoBonus =', json.todoBonus,
      'total =', totalNum
    );

    // 🔢 Score santé = total // 100
    const level = Math.floor(totalNum / 100);

    // 🎯 Points santé = reste (0–99)
    const remainder = totalNum % 100;

    // 🔁 Fallback DOM si les éléments ne sont pas passés en paramètre
    if (!scoreEl) {
      scoreEl =
        document.getElementById('profileHealthScore') ||
        document.getElementById('profileScore');
    }

    if (!ptsTextEl) {
      ptsTextEl =
        document.getElementById('healthBarText') ||   // texte dans la barre
        document.getElementById('profileHealthPoints') ||
        document.getElementById('profilePoints');
    }

    if (!barEl) {
      barEl = document.getElementById('healthBar');
    }

    // ✅ Met à jour le score santé (niveau)
    if (scoreEl) {
      scoreEl.textContent = String(level);
    }

    // ✅ Met à jour le texte des points santé (ex : "34 / 100")
    if (ptsTextEl) {
      ptsTextEl.textContent = `${remainder} / 100`;
    }

    // ✅ Met à jour la barre au chargement
    if (barEl) {
      const pct = Math.max(0, Math.min(100, remainder)); // clamp 0–100
      barEl.style.width = pct + '%';
    }

  } catch (err) {
    console.error('loadProfileHealthPoints error:', err);
    // on laisse les anciennes valeurs si erreur
  }
}

export const loadProfileData = async () => {
  try {
    let url = GAS_URL + '?action=Profile (WIP)';
    if (clientId) url += '&id=' + encodeURIComponent(clientId);

    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);

    const json = await res.json();
    if (!json.ok) throw new Error(json.error || 'Réponse Apps Script invalide');

    const p = json.data || {};
    console.log(json)

    const name = p.name || '—';
    const startDate = formatProfileDateFR(p.startDate) || '—';
    const age = (p.age ?? '').toString().trim() || '—';

    // 🔹 Puis on va chercher le total de points santé côté Apps Script
    //await loadProfileHealthPoints(scoreEl, ptsTextEl, barEl);

    return { name, startDate, age };
  } catch (err) {
    console.error('loadProfileData error:', err);
    return err;
  }
}

export const loadChart = async (name: string) => {
  const SHEET_TAB = "Journal";
  try {
    const url = GAS_URL + `?action=${name}`
      + (SHEET_TAB ? ('&sheet=' + encodeURIComponent(SHEET_TAB)) : '')
      + (clientId ? ('&id=' + encodeURIComponent(clientId)) : '');
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('HTTP ' + response.status);
    }

    const json = await response.json();
    if (json && json.ok && Array.isArray(json.data)) {
      return {
        success: true,
        data: json.data
      };
    }

    return {
      success: false,
      message: 'Invalid response data'
    };
  } catch (err) {
    console.error('Error loading ' + name + ' chart data, error:', err);
    return {
      success: false,
      message: err instanceof Error ? err.message : String(err)
    }
  }
}