const INFO_FIELDS = [
  ['jarak', 'Jarak dari Matahari'],
  ['revolusi', 'Periode revolusi'],
  ['rotasi', 'Periode rotasi'],
  ['bulan', 'Jumlah bulan'],
];

export function setupUI({ state, solar, interaction }) {
  const speedInput = document.querySelector('#speed');
  const speedValue = document.querySelector('#speedValue');
  const pauseButton = document.querySelector('#pause');
  const resetButton = document.querySelector('#reset');
  const orbitToggle = document.querySelector('#orbits');
  const labelToggle = document.querySelector('#labels');
  const hint = document.querySelector('.hint');

  const infoPanel = document.querySelector('#info');
  const infoName = document.querySelector('#infoName');
  const infoRows = document.querySelector('#infoRows');
  const infoFact = document.querySelector('#infoFact');
  const infoClose = document.querySelector('#infoClose');

  function renderInfo(data) {
    if (!data) {
      infoPanel.classList.add('hidden');
      return;
    }

    infoName.textContent = data.name;
    infoRows.replaceChildren(
      ...INFO_FIELDS.map(([key, label]) => {
        const row = document.createElement('div');
        const term = document.createElement('dt');
        const value = document.createElement('dd');
        term.textContent = label;
        value.textContent = data.info[key] ?? '—';
        row.append(term, value);
        return row;
      }),
    );
    infoFact.textContent = data.info.fakta;
    infoPanel.classList.remove('hidden');
  }

  interaction.setSelectHandler(renderInfo);

  speedInput.addEventListener('input', () => {
    state.speed = Number(speedInput.value);
    speedValue.textContent = `${state.speed.toFixed(1)}×`;
  });

  function setPaused(paused) {
    state.paused = paused;
    pauseButton.textContent = paused ? 'Lanjut' : 'Jeda';
    pauseButton.setAttribute('aria-pressed', String(paused));
  }

  pauseButton.addEventListener('click', () => setPaused(!state.paused));

  resetButton.addEventListener('click', () => {
    interaction.reset();
    renderInfo(null);
  });

  infoClose.addEventListener('click', () => {
    interaction.clearSelection();
    renderInfo(null);
  });

  orbitToggle.addEventListener('change', () => {
    solar.setOrbitsVisible(orbitToggle.checked);
  });

  labelToggle.addEventListener('change', () => {
    solar.setLabelsVisible(labelToggle.checked);
  });

  window.addEventListener('keydown', (event) => {
    const tag = event.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    if (event.code === 'Space') {
      event.preventDefault();
      setPaused(!state.paused);
    }

    if (event.key === 'Escape') {
      interaction.clearSelection();
      renderInfo(null);
    }
  });

  if (hint) {
    const hideHint = () => hint.classList.add('dim');
    window.addEventListener('pointerdown', hideHint, { once: true });
    window.setTimeout(hideHint, 9000);
  }
}
