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

export const sendBulk = (payload: any, cb: any) =>{
  const clientId = ('par défaut').trim();
  const GAS_URL = "https://script.google.com/macros/s/AKfycbx2AC_cNpPndM772BH_DFG90Vzv8-Ahtp5PYjH0rOkcnwSWzYog0NLZU3Xa8c97tyJRKw/exec";

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