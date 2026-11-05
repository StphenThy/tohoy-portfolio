// AVATAR: your 3D character on the about page. Its head follows the cursor.
// Every part is built here from code, so colours and sizes are easy to change.
// If the visitor's browser has no 3D support, your photo is shown instead.

(() => {
  THREE.ColorManagement.legacyMode = false;

  const COLORS = {
    skin: 0xc68e68,
    hair: 0x0f0f11,
    suit: 0x2b2b32,
    satin: 0x484853,
    shirt: 0xf3f3f5,
    bow: 0x121215,
    lipUpper: 0xa8604f,
    lipLower: 0xbf7a66,
    lipLine: 0x6b372d,
    rim: 0xff6a55,
  };

  const box = document.getElementById("avatar");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  } catch {
    box.classList.add("no-3d");
    return;
  }
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  box.append(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 1.15, 7.4);
  camera.lookAt(0, 1.15, 0);

  /* Lights: a soft main light with shadows, plus coral light from behind */
  scene.add(new THREE.HemisphereLight(0xffffff, 0x4a3a3a, 0.95));
  const key = new THREE.DirectionalLight(0xffffff, 1.0);
  key.position.set(2.2, 4.2, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -4;
  key.shadow.camera.right = 4;
  key.shadow.camera.top = 4;
  key.shadow.camera.bottom = -4;
  key.shadow.radius = 6;
  key.shadow.normalBias = 0.03;
  scene.add(key);
  const rimLeft = new THREE.DirectionalLight(COLORS.rim, 1.3);
  rimLeft.position.set(-4, 2, -4);
  scene.add(rimLeft);
  const rimRight = new THREE.DirectionalLight(COLORS.rim, 1);
  rimRight.position.set(4, 1, -3);
  scene.add(rimRight);

  /* Building blocks */
  const clay = (color, roughness = 0.68, extra = {}) =>
    new THREE.MeshStandardMaterial({ color, roughness, ...extra });
  const skin = clay(COLORS.skin, 0.66);
  const hair = clay(COLORS.hair, 0.72, { side: THREE.DoubleSide });
  const suit = clay(COLORS.suit, 0.74);
  const satin = clay(COLORS.satin, 0.34, { side: THREE.DoubleSide });
  const shirt = clay(COLORS.shirt, 0.72, { side: THREE.DoubleSide });
  const bow = clay(COLORS.bow, 0.55);
  const ball = new THREE.SphereGeometry(1, 48, 32);

  const part = (parent, geometry, mat, position, scale = [1, 1, 1], rotation = [0, 0, 0]) => {
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.position.set(...position);
    mesh.scale.set(...scale);
    mesh.rotation.set(...rotation);
    parent.add(mesh);
    return mesh;
  };

  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (a, b, x) => {
    const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
    return t * t * (3 - 2 * t);
  };

  const character = new THREE.Group();
  scene.add(character);

  /* Body: one smooth shape from the neck down, running off the bottom of the frame */
  const body = new THREE.Group();
  character.add(body);

  const DEPTH = 0.6;
  const shoulders = [
    [1.76, -5], [1.75, -3.5], [1.74, -2], [1.72, -1.2], [1.66, -0.3], [1.52, 0.18], [1.26, 0.52], [0.88, 0.74], [0.5, 0.88], [0.34, 0.96],
  ];
  const torso = new THREE.SplineCurve(shoulders.map(([r, y]) => new THREE.Vector2(r, y))).getPoints(80);
  part(body, new THREE.LatheGeometry(torso, 96), suit, [0, 0, 0], [1, 1, DEPTH]);
  part(body, new THREE.CylinderGeometry(0.33, 0.4, 0.9, 40), skin, [0, 0.86, -0.03]);

  // The body's width at a height, used to lay clothes along its curved front.
  const radiusAt = (y) => {
    for (let i = 1; i < torso.length; i += 1) {
      if (y <= torso[i].y) {
        const a = torso[i - 1];
        const b = torso[i];
        return lerp(a.x, b.x, (y - a.y) / (b.y - a.y || 1));
      }
    }
    return torso[torso.length - 1].x;
  };
  const frontAt = (x, y) => DEPTH * Math.sqrt(Math.max(radiusAt(y) ** 2 - x * x, 0));

  // A smooth sheet between two edges, draped over the front of the body.
  const draped = (edgeA, edgeB, lift) => {
    const across = 14;
    const down = 56;
    const points = [];
    const faces = [];
    for (let j = 0; j <= down; j += 1) {
      const [ax, ay] = edgeA(j / down);
      const [bx, by] = edgeB(j / down);
      for (let i = 0; i <= across; i += 1) {
        const x = lerp(ax, bx, i / across);
        const y = lerp(ay, by, i / across);
        points.push(x, y, frontAt(x, y) + lift);
      }
    }
    for (let j = 0; j < down; j += 1) {
      for (let i = 0; i < across; i += 1) {
        const a = j * (across + 1) + i;
        faces.push(a, a + 1, a + across + 1, a + 1, a + across + 2, a + across + 1);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    geometry.setIndex(faces);
    geometry.computeVertexNormals();
    return geometry;
  };

  const opening = (side) => (t) => [side * lerp(0.44, 0, t), lerp(0.78, -1.75, t)];
  const collarEdge = (side) => (t) => {
    const swell = Math.sin(t * Math.PI);
    return [side * (lerp(0.64, 0.05, t) + swell * 0.36), lerp(0.84, -1.8, t)];
  };
  part(body, draped(opening(-1), opening(1), 0.02), shirt, [0, 0, 0]);
  part(body, draped(opening(1), collarEdge(1), 0.05), satin, [0, 0, 0]);
  part(body, draped(collarEdge(-1), opening(-1), 0.05), satin, [0, 0, 0]);
  part(body, new THREE.TorusGeometry(0.39, 0.06, 16, 48), shirt, [0, 0.72, -0.02], [1, 1, 1], [Math.PI / 2 + 0.2, 0, 0]);

  [-0.25, -0.75].forEach((y) => part(body, ball, bow, [0, y, frontAt(0, y) + 0.05], [0.035, 0.035, 0.02]));

  const bowZ = frontAt(0, 0.56) + 0.08;
  const wing = new THREE.ConeGeometry(0.17, 0.46, 32);
  part(body, wing, bow, [-0.24, 0.56, bowZ], [1, 1, 0.45], [0, 0, -Math.PI / 2]);
  part(body, wing, bow, [0.24, 0.56, bowZ], [1, 1, 0.45], [0, 0, Math.PI / 2]);
  part(body, ball, bow, [0, 0.56, bowZ + 0.02], [0.075, 0.085, 0.07]);

  /* Head: turns as one group from a pivot at the neck */
  const head = new THREE.Group();
  head.position.set(0, 0.98, 0);
  character.add(head);

  // One smooth shape from chin to crown, so the face has no seams.
  const profile = new THREE.SplineCurve([
    [0, 0], [0.3, 0.03], [0.54, 0.2], [0.69, 0.48], [0.77, 0.82], [0.82, 1.12], [0.83, 1.36], [0.74, 1.62], [0.5, 1.8], [0, 1.87],
  ].map(([x, y]) => new THREE.Vector2(x, y)));
  part(head, new THREE.LatheGeometry(profile.getPoints(70), 96), skin, [0, -0.1, 0], [1, 1, 1.06]);

  // Nose: bridge, tip and the two sides blend together because they share a colour.
  part(head, ball, skin, [0, 0.76, 0.72], [0.06, 0.22, 0.09]);
  part(head, ball, skin, [0, 0.61, 0.8], [0.085, 0.075, 0.09]);
  part(head, ball, skin, [-0.07, 0.6, 0.76], [0.04, 0.034, 0.04]);
  part(head, ball, skin, [0.07, 0.6, 0.76], [0.04, 0.034, 0.04]);

  // Ears, with a soft inner fold.
  [-1, 1].forEach((side) => {
    part(head, ball, skin, [side * 0.83, 0.74, -0.03], [0.1, 0.23, 0.15], [0, side * 0.35, 0]);
    part(head, new THREE.TorusGeometry(0.09, 0.022, 12, 32), skin, [side * 0.91, 0.74, 0.0], [0.8, 1.45, 1], [0, side * 1.15, 0]);
  });

  const arc = (points, radius) =>
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(([x, y, z]) => new THREE.Vector3(x, y, z))), 32, radius, 10);

  // Eyes, with a lash line on top. The lids only appear during a blink.
  const lidShape = new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const eyes = [-0.31, 0.31].map((x) => {
    const eye = new THREE.Group();
    eye.position.set(x, 0.85, 0.765);
    head.add(eye);
    part(eye, ball, clay(0xf7f4f0, 0.3), [0, 0, 0], [0.165, 0.112, 0.055]);
    const iris = new THREE.Group();
    iris.position.z = 0.046;
    eye.add(iris);
    part(iris, ball, clay(0x20140f, 0.22), [0, 0, 0], [0.078, 0.078, 0.02]);
    part(iris, ball, clay(0xffffff, 0.2), [0.026, 0.028, 0.018], [0.019, 0.019, 0.01]);
    const lid = part(eye, lidShape, skin, [0, 0, 0], [0.178, 0.124, 0.07], [-0.62, 0, 0]);
    lid.visible = false;
    part(eye, arc([[-0.172, -0.012, 0.012], [-0.1, 0.082, 0.04], [0, 0.112, 0.052], [0.1, 0.082, 0.04], [0.172, -0.012, 0.012]], 0.0125), hair, [0, 0, 0]);
    return { eye, iris, lid };
  });

  // Brows: gently arched and rounded.
  [-1, 1].forEach((side) => {
    part(head, arc([[side * 0.14, 1.04, 0.82], [side * 0.3, 1.09, 0.81], [side * 0.48, 1.04, 0.73]], 0.034), hair, [0, 0, 0]);
  });

  /* Hair: laid over the head shape itself, so the hairline stays clean.
     It has a side part and extra volume at the front. */
  const skull = profile.getSpacedPoints(400);
  const onSkull = (t) => {
    const at = Math.min(t * 400, 399.999);
    const i = Math.floor(at);
    const a = skull[i];
    const b = skull[i + 1];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const length = Math.hypot(dx, dy) || 1;
    return { r: lerp(a.x, b.x, at - i), y: lerp(a.y, b.y, at - i), outR: dy / length, outY: -dx / length };
  };

  const around = 192;
  const down = 64;
  const hairPoints = [];
  const hairFaces = [];
  for (let j = 0; j <= down; j += 1) {
    const v = j / down;
    for (let i = 0; i < around; i += 1) {
      const phi = (i / around) * Math.PI * 2;
      const front = Math.max(0, Math.sin(phi));
      const back = Math.max(0, -Math.sin(phi));
      const hairline = 0.58 + 0.07 * front ** 1.5 - 0.28 * back ** 0.8;
      const p = onSkull(lerp(1, hairline, v));
      const sideX = -Math.cos(phi) * p.r;
      const lip = smooth(0, 0.16, 1 - v);
      const parting = Math.exp(-(((sideX + 0.4) / 0.07) ** 2)) * lip * smooth(0.3, 0.8, front + 0.3);
      const quiff = 0.19 * front ** 1.2 * lip * smooth(0.2, 0.75, v) * (0.75 + 0.25 * smooth(-0.4, 0.4, sideX));
      const thick = 0.025 + 0.1 * lip + quiff - parting * 0.05;
      const r = p.r + p.outR * thick;
      hairPoints.push(-Math.cos(phi) * r, p.y + p.outY * thick, Math.sin(phi) * r * 1.06);
    }
  }
  for (let j = 0; j < down; j += 1) {
    for (let i = 0; i < around; i += 1) {
      const next = (i + 1) % around;
      const a = j * around + i;
      const b = j * around + next;
      const c = (j + 1) * around + i;
      const d = (j + 1) * around + next;
      hairFaces.push(a, b, c, b, d, c);
    }
  }
  const hairShape = new THREE.BufferGeometry();
  hairShape.setAttribute("position", new THREE.Float32BufferAttribute(hairPoints, 3));
  hairShape.setIndex(hairFaces);
  hairShape.computeVertexNormals();
  part(head, hairShape, hair, [0, -0.1, 0]);

  /* Lips: two shapes laid on the face, curving up into a soft smile */
  const faceFront = (x, y) => {
    const point = skull.find((p, n) => n > 0 && p.y >= y + 0.1) || skull[skull.length - 1];
    return 1.06 * Math.sqrt(Math.max(point.x ** 2 - x * x, 0));
  };
  const LIP_WIDTH = 0.2;
  const smileLine = (x) => 0.345 + 0.95 * x * x;
  const fade = (x) => Math.max(1 - (x / LIP_WIDTH) ** 2, 0) ** 0.7;

  const lipShape = (edgeTop, edgeBottom, bulge) => {
    const across = 48;
    const down = 10;
    const points = [];
    const faces = [];
    for (let j = 0; j <= down; j += 1) {
      for (let i = 0; i <= across; i += 1) {
        const x = lerp(-LIP_WIDTH, LIP_WIDTH, i / across);
        const y = lerp(edgeTop(x), edgeBottom(x), j / down);
        const puff = Math.sin((j / down) * Math.PI) * fade(x) * bulge;
        points.push(x, y, faceFront(x, y) + 0.004 + puff);
      }
    }
    for (let j = 0; j < down; j += 1) {
      for (let i = 0; i < across; i += 1) {
        const a = j * (across + 1) + i;
        faces.push(a, a + across + 1, a + 1, a + 1, a + across + 1, a + across + 2);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    geometry.setIndex(faces);
    geometry.computeVertexNormals();
    return geometry;
  };

  const lipMaterial = (color) => clay(color, 0.48, { side: THREE.DoubleSide });
  const cupidsBow = (x) => 0.042 * fade(x) - 0.014 * Math.exp(-((x / 0.03) ** 2));
  const upperLip = part(head, lipShape((x) => smileLine(x) + cupidsBow(x), smileLine, 0.016), lipMaterial(COLORS.lipUpper), [0, 0, 0]);
  const lowerLip = part(head, lipShape(smileLine, (x) => smileLine(x) - 0.058 * fade(x), 0.026), lipMaterial(COLORS.lipLower), [0, 0, 0]);
  const lipLinePoints = [];
  for (let n = 0; n <= 12; n += 1) {
    const x = lerp(-LIP_WIDTH - 0.008, LIP_WIDTH + 0.008, n / 12);
    lipLinePoints.push([x, smileLine(x), faceFront(x, smileLine(x)) + 0.008]);
  }
  const lipLine = part(head, arc(lipLinePoints, 0.0065), clay(COLORS.lipLine, 0.6), [0, 0, 0]);

  /* Shadows. The small face details don't cast any, so they stay clean. */
  scene.traverse((mesh) => {
    if (!mesh.isMesh) return;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  });
  [upperLip, lowerLip, lipLine].forEach((mesh) => { mesh.castShadow = false; });
  eyes.forEach(({ eye }) => eye.traverse((mesh) => { mesh.castShadow = false; }));

  /* Following the cursor */
  const target = { x: 0, y: 0 };
  let lastMove = -Infinity;

  addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    const rect = box.getBoundingClientRect();
    const x = (event.clientX - (rect.left + rect.width / 2)) / (innerWidth / 2);
    const y = (event.clientY - (rect.top + rect.height * 0.35)) / (innerHeight / 2);
    target.x = Math.max(-1, Math.min(1, x));
    target.y = Math.max(-1, Math.min(1, y));
    lastMove = performance.now();
  }, { passive: true });

  const resize = () => {
    const { width, height } = box.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // Narrow boxes pull the camera back so the shoulders still fit.
    camera.position.z = 7.4 * Math.max(1, 1.36 / camera.aspect);
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(box);
  resize();

  const LID_OPEN = -0.62;
  const LID_SHUT = 1.25;
  const look = { x: 0, y: 0 };
  let nextBlink = 2500;
  let blinkStart = -1;

  const frameLoop = (now) => {
    requestAnimationFrame(frameLoop);
    const home = document.documentElement.classList.contains("is-home");
    if (!home || document.hidden) return;

    // After a few seconds without the cursor, look around gently.
    const idle = now - lastMove > 3000;
    const goalX = idle && !reduced ? Math.sin(now / 2400) * 0.35 : target.x;
    const goalY = idle && !reduced ? Math.sin(now / 3100) * 0.14 : target.y;
    look.x += (goalX - look.x) * 0.08;
    look.y += (goalY - look.y) * 0.08;

    head.rotation.y = look.x * 0.62;
    head.rotation.x = look.y * 0.32;
    head.rotation.z = -look.x * 0.05;
    body.rotation.y = look.x * 0.12;
    eyes.forEach(({ iris }) => {
      iris.position.x = look.x * 0.045;
      iris.position.y = -look.y * 0.022;
    });

    if (!reduced) {
      character.position.y = Math.sin(now / 1100) * 0.022;
      if (now > nextBlink && blinkStart < 0) blinkStart = now;
      if (blinkStart >= 0) {
        const t = (now - blinkStart) / 190;
        const shut = t >= 1 ? 0 : 1 - Math.abs(t * 2 - 1);
        eyes.forEach(({ lid }) => {
          lid.visible = shut > 0.02;
          lid.rotation.x = lerp(LID_OPEN, LID_SHUT, shut);
        });
        if (t >= 1) {
          blinkStart = -1;
          nextBlink = now + 2200 + Math.random() * 3200;
        }
      }
    }
    renderer.render(scene, camera);
  };
  requestAnimationFrame(frameLoop);
})();
