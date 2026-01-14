export interface Question {
    col: string;
    label: string;
    type: string;
    step?: string;
    min?: string;
    options?: string[];
    validate: (v: string) => boolean;
}

export const questionsList = [
    { col: 'E', label: "Poids (kg) ?", type: "number", step: "0.1", validate: (v: string) => v !== '' },
    { col: 'F', label: "Sommeil (note sur 5)", type: "select", options:["1","2","3","4","5"], validate: (v: string) => ["1","2","3","4","5"].includes(v) },
    { col: 'G', label: "Heure du coucher ?", type: "time", step:"60", validate: (v: string) => isHHMM(v) },
    { col: 'H', label: "Heure du lever ?",   type: "time", step:"60", validate: (v: string) => isHHMM(v) },
    { col: 'J', label: "Énergie (note sur 5)", type: "select", options:["1","2","3","4","5"], validate: (v: string) => ["1","2","3","4","5"].includes(v) },
    { col: 'K', label: "Adhésion à la diète (note sur 5)", type: "select", options:["1","2","3","4","5"], validate: (v: string) => ["1","2","3","4","5"].includes(v) },
    { col: 'L', label: "Nutrition non trackée (texte libre)", type: "text", validate: (v: string) => v !== '' },
    { col: 'M', label: "Digestion (note sur 5)", type: "select", options:["1","2","3","4","5"], validate: (v: string) => ["1","2","3","4","5"].includes(v) },
    { col: 'N', label: "Séance", type: "select", options:["BOF","MOYEN","BIEN","SUPER","REPOS"], validate: (v: string) => ["BOF","MOYEN","BIEN","SUPER","REPOS"].includes(v) },
    { col: 'O', label: "Nombre de pas (steps)", type: "number", step:"1", min:"0", validate: (v: string) => String(v) !== '' }
];

const isHHMM = (v: string) => {
    return /^([01]\d|2[0-3]):[0-5]\d$/.test(String(v||'').trim())
}