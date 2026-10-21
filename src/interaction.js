import * as THREE from 'three';

const CLICK_TOLERANCE = 6;

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Interaksi kamera: hover, klik untuk fokus ke benda langit, dan kembali ke
 * tampilan awal. Kamera tetap mengikuti planet yang sedang dipilih.
 */
export function setupInteraction({ renderer, camera, controls, bodies, home }) {
  const domElement = renderer.domElement;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  const byMesh = new Map();
  const clickable = [];

  for (const body of bodies) {
    const target = body.hitMesh ?? body.mesh;
    byMesh.set(target, body);
    byMesh.set(body.mesh, body);
    clickable.push(target);
  }

  let selectHandler = null;
  let selected = null;
  let hovered = null;
  let pointerDown = null;
  let tween = null;
  let homeTween = null;
  let follow = null;

  const tmpPosition = new THREE.Vector3();
  const tmpOffset = new THREE.Vector3();

  function updatePointer(event) {
    const rect = domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function pick(event) {
    updatePointer(event);
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(clickable, false);
    return hits.length ? byMesh.get(hits[0].object) : null;
  }

  function setHovered(body) {
    if (hovered === body) return;

    if (hovered?.label) {
      hovered.label.userData.hoverScale = 1;
      hovered.label.material.color.set('#ffffff');
    }

    hovered = body;

    if (hovered?.label) {
      hovered.label.userData.hoverScale = 1.18;
      hovered.label.material.color.set('#ffe9a8');
    }

    domElement.style.cursor = hovered ? 'pointer' : 'grab';
  }

  function select(body) {
    selected = body;
    homeTween = null;

    body.focus.getWorldPosition(tmpPosition);
    const distance = body.focusDistance ?? 12;
    const direction = camera.position.clone().sub(tmpPosition);

    if (direction.lengthSq() < 0.0001) direction.set(0, 0.4, 1);
    direction.normalize();
    direction.y = Math.max(direction.y, 0.16);
    direction.normalize();

    tween = {
      t: 0,
      duration: 1.05,
      fromPosition: camera.position.clone(),
      fromTarget: controls.target.clone(),
      offset: direction.multiplyScalar(distance),
    };

    follow = { object: body.focus, lastPosition: tmpPosition.clone() };
    selectHandler?.(body.data);
  }

  function clearSelection({ notify = true } = {}) {
    selected = null;
    follow = null;
    tween = null;
    if (notify) selectHandler?.(null);
  }

  function reset() {
    clearSelection();
    homeTween = {
      t: 0,
      duration: 1.1,
      fromPosition: camera.position.clone(),
      fromTarget: controls.target.clone(),
    };
  }

  function update(delta) {
    if (homeTween) {
      homeTween.t = Math.min(1, homeTween.t + delta / homeTween.duration);
      const e = easeInOutCubic(homeTween.t);
      camera.position.lerpVectors(homeTween.fromPosition, home, e);
      controls.target.lerp(new THREE.Vector3(0, 0, 0), e);
      if (homeTween.t >= 1) homeTween = null;
      return;
    }

    if (!follow) return;

    follow.object.getWorldPosition(tmpPosition);
    const movement = tmpPosition.clone().sub(follow.lastPosition);
    follow.lastPosition.copy(tmpPosition);

    if (tween) {
      tween.t = Math.min(1, tween.t + delta / tween.duration);
      const e = easeInOutCubic(tween.t);

      tween.fromPosition.add(movement);
      tween.fromTarget.add(movement);

      tmpOffset.copy(tmpPosition).add(tween.offset);
      camera.position.lerpVectors(tween.fromPosition, tmpOffset, e);
      controls.target.lerpVectors(tween.fromTarget, tmpPosition, e);

      if (tween.t >= 1) tween = null;
      return;
    }

    // Setelah animasi fokus selesai, kamera ikut bergerak bersama planet
    // tanpa mengubah jarak atau sudut yang dipilih pengguna.
    camera.position.add(movement);
    controls.target.add(movement);
  }

  domElement.addEventListener('pointerdown', (event) => {
    pointerDown = { x: event.clientX, y: event.clientY };
  });

  domElement.addEventListener('pointerup', (event) => {
    if (!pointerDown) return;
    const moved = Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y);
    pointerDown = null;
    if (moved > CLICK_TOLERANCE) return;

    const body = pick(event);
    if (body) {
      select(body);
    } else if (selected) {
      clearSelection();
    }
  });

  domElement.addEventListener('pointermove', (event) => {
    if (pointerDown) return;
    setHovered(pick(event));
  });

  domElement.addEventListener('pointerleave', () => {
    setHovered(null);
  });

  controls.addEventListener('start', () => {
    tween = null;
  });

  return {
    update,
    reset,
    clearSelection,
    setSelectHandler(handler) {
      selectHandler = handler;
    },
    get selected() {
      return selected;
    },
  };
}
