/* ================================================
   APP.JS — Lògica principal de l'Operació Especial
   ================================================
   Per editar contingut, busca les seccions marcades amb
   "*** EDITA AQUÍ ***". No has de tocar res més.
================================================ */

/* ================================================
   *** EDITA AQUÍ ***  DADES DE LES MISSIONS
   Cada missió té:
     - id: identificador intern (no canviar l'ordre)
     - label: text del número de missió
     - name: nom/ubicació que apareix a la targeta i al detall
     - time: hora de la missió
     - duration: (opcional) durada, deixa "" si no aplica
     - coords: coordenades en format "lat, lng" (edita-les!)
     - mapsUrl: URL de Google Maps (edita-la amb les coordenades reals!)
     - clue: pista breu
     - checklist: (opcional) array de coses a preparar/emportar-se.
                  Si no vols botó de llista en una missió, esborra
                  aquest camp o deixa'l com a array buit [].
                  Si hi ha almenys un ítem, apareixerà un botó
                  "QUÈ NECESSITO PER AVUI?" a aquella missió.
     - note: (opcional) frase curta que apareix sota el botó
             "MISSIÓ COMPLETADA". Esborra aquest camp si no
             la vols en una missió concreta.
   NOTA: la Missió Final utilitza els mateixos camps time,
   coords, mapsUrl i clue que la resta — es mostren igual.
================================================ */
const MISSIONS = [
  {
    id: 0,
    label: "MISSIÓ 01",
    name: "Esmorzar",
    time: "09:00",
    duration: "",
    coords: "41.8213464, 2.9022784",
    mapsUrl: "https://www.google.com/maps/place/Carrer+Fonollerons,+17,+17240+Llagostera,+Girona/@41.8213504,2.8997035,17z/data=!3m1!4b1!4m6!3m5!1s0x12bb1c8b7bc91ecd:0x79707eaa108d33aa!8m2!3d41.8213464!4d2.9022784!16s%2Fg%2F11f6fz9hwf?entry=ttu&g_ep=EgoyMDI2MDcxOS4wIKXMDSoASAFQAw%3D%3D",
    clue: "Primer de tot hem de començar be el dia :)",
    note: "T'hauràs de posar guapeton avui :)",
    checklist: [
      "Banyador",
      "Tovallola dutxa",
      "Xancletes",
      "Roba de recanvi"
    ]
  },
  {
    id: 1,
    label: "MISSIÓ 02",
    name: "Activitat creativa",
    time: "12:00",
    duration: "2 hores",
    coords: "41.973962, 2.821917",
    mapsUrl: "https://www.google.com/maps/place/Imagina+Art+-+Pintar+Ceràmica+i+Art+i+Vi/@41.9739663,2.8193421,17z/data=!3m1!4b1!4m6!3m5!1s0x12bae7586dfe7397:0x42cfe97141ea904e!8m2!3d41.9739623!4d2.821917!16s%2Fg%2F11ldq1j1bj?entry=ttu&g_ep=EgoyMDI2MDcxOS4wIKXMDSoASAFQAw%3D%3D",
    clue: "Anem a crear un record",
    note: "Hauriem de sortir cap a les 10.30"
  },
  {
    id: 2,
    label: "MISSIÓ 03",
    name: "Dinar",
    time: "14:45",
    duration: "",
    coords: "41.98293, 2.82432",
    mapsUrl: "https://www.google.com/maps/place/Vii,+Tapes+i+Platillos/@41.9829351,2.821711,17z/data=!3m1!4b1!4m6!3m5!1s0x12bae7c37246dce1:0xb164134d6f1bdf17!8m2!3d41.9829311!4d2.8242859!16s%2Fg%2F11w9gr4hpd?entry=ttu&g_ep=EgoyMDI2MDcxOS4wIKXMDSoASAFQAw%3D%3D",
    clue: "Un vinito? :)"
  },
  {
    id: 3,
    label: "MISSIÓ 04",
    name: "Activitat relaxant",
    time: "20:00",
    duration: "2 hores",
    coords: "41.846166, 2.671429",
    mapsUrl: "https://www.google.com/maps/?q=41.846166,2.671429",
    clue: "Hora de desconnectar"
  },
  {
    id: 4,
    label: "MISSIÓ FINAL",
    name: "Activitat final",       /* Nom/lloc que apareix com a títol gran */
    location: "Pisitoo upi",   /* Es manté per compatibilitat amb la pantalla final */
    time: "22:00",
    duration: "",
    coords: "41.6968716, 2.8333026",
    mapsUrl: "https://www.google.com/maps/place/Carrer+de+Riu+de+la+Plata,+17,+17310+Lloret+de+Mar,+Girona/@41.6968756,2.8307277,17z/data=!3m1!4b1!4m6!3m5!1s0x12bb17174f5aeec5:0x191868d60b218613!8m2!3d41.6968716!4d2.8333026!16s%2Fg%2F11c2gvzhrr?entry=ttu&g_ep=EgoyMDI2MDcxOS4wIKXMDSoASAFQAw%3D%3D",
    clue: "Hora de posar-se l'antifaç"
  }
];

/* ================================================
   *** EDITA AQUÍ ***  TEXTOS DE LA PANTALLA FINAL
   Cada línia de l'array és un paràgraf independent.
================================================ */
const END_SCREEN_TEXTS = [
  "Espero que t'hagi agradat el dia",
  "M'ha agradat molt poder-lo passar amb tu :)",
  "Я тебя люблю"
];

/* ================================================
   ESTAT DE L'APLICACIÓ
================================================ */
let state = {
  unlockedCount: 1,        // Quantes missions estan desbloquejades (1 = només la primera)
  completedMissions: []    // Array de IDs de missions completades
};

/* ================================================
   PERSISTÈNCIA — localStorage
================================================ */
function saveState() {
  localStorage.setItem('operacio_state', JSON.stringify({
    unlockedCount: state.unlockedCount,
    completedMissions: state.completedMissions
  }));
}

function loadState() {
  try {
    const saved = localStorage.getItem('operacio_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      state.unlockedCount     = parsed.unlockedCount || 1;
      state.completedMissions = parsed.completedMissions || [];
    }
  } catch (e) {
    console.warn('No s\'ha pogut carregar el progrés:', e);
  }
}

/* ================================================
   NAVEGACIÓ ENTRE PANTALLES
================================================ */
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
  });
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    target.scrollTop = 0;
  }
}

/* ================================================
   PANTALLA 2 — MENÚ: renderitza les targetes
================================================ */
function renderMenu() {
  const list = document.getElementById('mission-list');
  list.innerHTML = '';

  MISSIONS.forEach((mission, i) => {
    const isUnlocked  = i < state.unlockedCount;
    const isCompleted = state.completedMissions.includes(i);

    const card = document.createElement('div');
    card.className = 'mission-card' +
      (isCompleted ? ' completed' : '') +
      (!isUnlocked ? ' locked' : '');

    card.innerHTML = `
      <div class="card-left">
        <span class="card-number">${mission.label}</span>
        <span class="card-name">${mission.name}</span>
        <span class="card-status ${isCompleted ? 'done' : ''}">
          ${isCompleted ? 'COMPLETADA' : (isUnlocked ? 'DISPONIBLE' : 'BLOQUEJADA')}
        </span>
      </div>
      <span class="card-arrow">&#8594;</span>
    `;

    if (isUnlocked) {
      card.addEventListener('click', () => openMission(i));
    }

    list.appendChild(card);
  });

  const done = state.completedMissions.length;
  document.getElementById('progress-text').textContent =
    `${done} / ${MISSIONS.length} completades`;
}

/* ================================================
   PANTALLA 3 — DETALL MISSIÓ (missions 01-04)
================================================ */
function openMission(index) {
  const mission = MISSIONS[index];

  // Missió Final té la seva pròpia pantalla
  if (index === MISSIONS.length - 1) {
    openFinalMission();
    return;
  }

  document.getElementById('detail-index').textContent = mission.label;
  document.getElementById('detail-name').textContent  = mission.name;

  // Hora (+ durada si n'hi ha)
  const timeText = mission.duration
    ? `${mission.time} · ${mission.duration}`
    : mission.time;
  document.getElementById('detail-time').textContent = timeText;

  document.getElementById('detail-clue').textContent = mission.clue;

  const coordEl = document.getElementById('detail-coords');
  coordEl.textContent = mission.coords;
  coordEl.href = mission.mapsUrl;

  // Botó "Què necessito per avui?" — només visible si la missió té checklist
  const btnChecklist = document.getElementById('btn-checklist');
  if (mission.checklist && mission.checklist.length > 0) {
    btnChecklist.classList.remove('hidden');
    btnChecklist.onclick = () => openChecklist(index);
  } else {
    btnChecklist.classList.add('hidden');
  }

  const btnComplete = document.getElementById('btn-complete');

  if (state.completedMissions.includes(index)) {
    btnComplete.textContent = 'MISSIÓ JA COMPLETADA';
    btnComplete.style.opacity = '0.5';
    btnComplete.onclick = () => showScreen('screen-menu');
  } else {
    btnComplete.textContent = 'MISSIÓ COMPLETADA';
    btnComplete.style.opacity = '1';
    btnComplete.onclick = () => completeMission(index);
  }

  // Nota opcional sota el botó de completar
  const noteEl = document.getElementById('detail-note');
  if (mission.note) {
    noteEl.textContent = mission.note;
    noteEl.classList.remove('hidden');
  } else {
    noteEl.classList.add('hidden');
  }

  showScreen('screen-mission');
}

/* ================================================
   COMPLETAR UNA MISSIÓ (01-04)
================================================ */
function completeMission(index) {
  if (!state.completedMissions.includes(index)) {
    state.completedMissions.push(index);
  }

  const nextUnlock = index + 2;
  if (nextUnlock > state.unlockedCount) {
    state.unlockedCount = nextUnlock;
  }

  saveState();
  renderMenu();
  showScreen('screen-menu');
}

/* ================================================
   PANTALLA 4 — MISSIÓ FINAL
   Ara mostra hora, coordenades i pista igual que
   la resta de missions (abans es quedava buida
   perquè buscava un camp "message" que ja no existeix).
================================================ */
function openFinalMission() {
  const mission = MISSIONS[MISSIONS.length - 1];

  document.getElementById('final-location').textContent = mission.location || mission.name;

  const timeText = mission.duration
    ? `${mission.time} · ${mission.duration}`
    : mission.time;
  document.getElementById('final-time').textContent = timeText;

  document.getElementById('final-clue').textContent = mission.clue;

  const finalCoordEl = document.getElementById('final-coords');
  finalCoordEl.textContent = mission.coords;
  finalCoordEl.href = mission.mapsUrl;

  showScreen('screen-final-mission');
}

/* ================================================
   COMPLETAR LA MISSIÓ FINAL
   Mostra primer una pantalla de confirmació
   ("Missió Completada") abans de la pantalla final.
================================================ */
function completeFinalMission() {
  const lastIndex = MISSIONS.length - 1;

  if (!state.completedMissions.includes(lastIndex)) {
    state.completedMissions.push(lastIndex);
  }
  state.unlockedCount = MISSIONS.length + 1;

  saveState();
  showScreen('screen-final-confirm');
}

/* ================================================
   PANTALLA 5 — FINAL: renderitza els textos editables
================================================ */
function renderEndScreen() {
  const container = document.getElementById('end-texts');
  container.innerHTML = '';
  END_SCREEN_TEXTS.forEach((text, i) => {
    const p = document.createElement('p');
    p.className = 'end-text' + (i === END_SCREEN_TEXTS.length - 1 ? ' end-text--accent' : '');
    p.textContent = text;
    container.appendChild(p);
  });
}

/* ================================================
   PANTALLA — QUÈ NECESSITO PER AVUI? (llista de preparació)
================================================ */
let currentChecklistMissionIndex = null;

function getChecklistStorageKey(missionIndex) {
  return `operacio_checklist_${missionIndex}`;
}

function loadChecklistChecked(missionIndex) {
  try {
    const saved = localStorage.getItem(getChecklistStorageKey(missionIndex));
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

function saveChecklistChecked(missionIndex, checkedArray) {
  localStorage.setItem(getChecklistStorageKey(missionIndex), JSON.stringify(checkedArray));
}

function openChecklist(missionIndex) {
  currentChecklistMissionIndex = missionIndex;
  const mission = MISSIONS[missionIndex];
  const checkedItems = loadChecklistChecked(missionIndex);

  document.getElementById('checklist-title').textContent = mission.name;

  const list = document.getElementById('checklist-list');
  list.innerHTML = '';

  mission.checklist.forEach((item, i) => {
    const row = document.createElement('div');
    row.className = 'checklist-item' + (checkedItems.includes(i) ? ' checked' : '');
    row.innerHTML = `
      <span class="checklist-box"></span>
      <span class="checklist-label">${item}</span>
    `;
    row.addEventListener('click', () => toggleChecklistItem(i, row));
    list.appendChild(row);
  });

  showScreen('screen-checklist');
}

function toggleChecklistItem(itemIndex, rowEl) {
  const checkedItems = loadChecklistChecked(currentChecklistMissionIndex);
  const pos = checkedItems.indexOf(itemIndex);

  if (pos === -1) {
    checkedItems.push(itemIndex);
    rowEl.classList.add('checked');
  } else {
    checkedItems.splice(pos, 1);
    rowEl.classList.remove('checked');
  }

  saveChecklistChecked(currentChecklistMissionIndex, checkedItems);
}

/* ================================================
   INICIALITZACIÓ — s'executa quan la pàgina carrega
================================================ */
function init() {
  loadState();
  renderMenu();
  renderEndScreen();

  document.getElementById('btn-start').addEventListener('click', () => {
    showScreen('screen-menu');
  });

  document.getElementById('btn-back').addEventListener('click', () => {
    showScreen('screen-menu');
  });

  document.getElementById('btn-back-checklist').addEventListener('click', () => {
    showScreen('screen-mission');
  });

  document.getElementById('btn-back-final').addEventListener('click', () => {
    showScreen('screen-menu');
  });

  document.getElementById('btn-final-complete').addEventListener('click', completeFinalMission);

  document.getElementById('btn-final-confirm-continue').addEventListener('click', () => {
    renderEndScreen();
    showScreen('screen-end');
  });
}

document.addEventListener('DOMContentLoaded', init);
