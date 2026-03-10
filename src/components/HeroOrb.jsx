'use client';

import { useEffect, useRef } from 'react';

export default function HeroOrb() {
  const canvasRef = useRef(null);

  useEffect(() => {
    let animFrameId;
    let cleanupFn;

    async function init() {
      const THREE = await import('three');
      const canvas = canvasRef.current;
      if (!canvas) return;

      const container = canvas.parentElement;

      /*
        MOBILE FIX: Use clientWidth/clientHeight instead of window.innerWidth.
        - clientWidth excludes scrollbar and is the true visible width on mobile
        - window.innerWidth on some mobile browsers includes the scrollbar gutter
          causing the canvas to render wider than the screen
      */
      const getW = () => container.clientWidth;
      const getH = () => container.clientHeight;

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(getW(), getH());
      renderer.setClearColor(0x010a14, 1);

      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, getW() / getH(), 0.1, 200);
      camera.position.z = 7;

      const isMobile = getW() < 768;

      /* ── 1. BACKGROUND PARTICLE FIELD ───────────────────────────── */
      const BGCOUNT = isMobile ? 500 : 1400;
      const bgPos   = new Float32Array(BGCOUNT * 3);
      const bgVel   = new Float32Array(BGCOUNT * 2);
      for (let i = 0; i < BGCOUNT; i++) {
        bgPos[i*3]   = (Math.random()-0.5) * 40;
        bgPos[i*3+1] = (Math.random()-0.5) * 28;
        bgPos[i*3+2] = (Math.random()-0.5) * 15 - 3;
        bgVel[i*2]   = (Math.random()-0.5) * 0.003;
        bgVel[i*2+1] = (Math.random()-0.5) * 0.003;
      }
      const bgGeo  = new THREE.BufferGeometry();
      const bgAttr = new THREE.BufferAttribute(bgPos, 3);
      bgAttr.setUsage(35048);
      bgGeo.setAttribute('position', bgAttr);
      const bgPts = new THREE.Points(bgGeo,
        new THREE.PointsMaterial({ color: 0x1a6699, size: 0.055, transparent: true, opacity: 0.65, sizeAttenuation: true })
      );
      scene.add(bgPts);

      /* ── 2. BACKGROUND LINES ────────────────────────────────────── */
      const nlMat = new THREE.LineBasicMaterial({ color: 0x0d4466, transparent: true, opacity: 0.35 });
      const nlGrp = new THREE.Group();
      for (let i = 0; i < (isMobile ? 12 : 40); i++) {
        const pts = Array.from({ length: 3 }, () =>
          new THREE.Vector3((Math.random()-0.5)*38, (Math.random()-0.5)*26, (Math.random()-0.5)*12-3)
        );
        nlGrp.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), nlMat));
      }
      scene.add(nlGrp);

      /* ── 3. OUTER GLOW SPHERE ───────────────────────────────────── */
      const outerGlow = new THREE.Mesh(
        new THREE.SphereGeometry(2.8, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0x003366, transparent: true, opacity: 0.07, side: THREE.BackSide })
      );
      scene.add(outerGlow);

      /* ── 4. DNA DOUBLE HELIX ────────────────────────────────────── */
      const helixGroup  = new THREE.Group();
      const helixPts1   = [];
      const helixPts2   = [];
      for (let i = 0; i <= 120; i++) {
        const t = (i / 120) * Math.PI * 4;
        const y = (i / 120) * 5.2 - 2.6;
        const r = 1.85;
        helixPts1.push(new THREE.Vector3(Math.cos(t) * r, y, Math.sin(t) * r));
        helixPts2.push(new THREE.Vector3(Math.cos(t + Math.PI) * r, y, Math.sin(t + Math.PI) * r));
      }
      helixGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(helixPts1),
        new THREE.LineBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.55 })));
      helixGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(helixPts2),
        new THREE.LineBasicMaterial({ color: 0x0055cc, transparent: true, opacity: 0.40 })));
      for (let i = 0; i <= 24; i++) {
        const t = (i / 24) * Math.PI * 4;
        const y = (i / 24) * 5.2 - 2.6;
        const r = 1.85;
        helixGroup.add(new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(Math.cos(t)*r, y, Math.sin(t)*r),
            new THREE.Vector3(Math.cos(t+Math.PI)*r, y, Math.sin(t+Math.PI)*r),
          ]),
          new THREE.LineBasicMaterial({ color: 0x005588, transparent: true, opacity: 0.25 })
        ));
      }
      scene.add(helixGroup);

      /* ── 5. CORE ICOSAHEDRON ────────────────────────────────────── */
      const core = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.0, 1),
        new THREE.MeshBasicMaterial({ color: 0x00aaff, wireframe: true, transparent: true, opacity: 0.45 })
      );
      scene.add(core);

      /* ── 6. INNER GLOW BALL ─────────────────────────────────────── */
      const innerGlow = new THREE.Mesh(
        new THREE.SphereGeometry(0.62, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0x003d66, transparent: true, opacity: 1.0 })
      );
      scene.add(innerGlow);

      /* ── 7. CENTER BRIGHT POINT ─────────────────────────────────── */
      const cGeo = new THREE.BufferGeometry();
      cGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0,0,0]), 3));
      const centerPt = new THREE.Points(cGeo,
        new THREE.PointsMaterial({ color: 0x88ddff, size: 0.45, transparent: true, opacity: 0.9 })
      );
      scene.add(centerPt);

      /* ── 8. ORBITING RINGS ──────────────────────────────────────── */
      function makeRing(r, col, op, rx, ry, rz) {
        const m = new THREE.Mesh(
          new THREE.TorusGeometry(r, 0.012, 8, 160),
          new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op })
        );
        m.rotation.x = rx; m.rotation.y = ry; m.rotation.z = rz;
        scene.add(m); return m;
      }
      const ring1 = makeRing(2.2,  0x00ccff, 0.60, Math.PI/2.5, 0,         0);
      const ring2 = makeRing(1.9,  0x0077cc, 0.40, Math.PI/4,   0,         Math.PI/6);
      const ring3 = makeRing(2.55, 0x003388, 0.28, Math.PI/1.8, Math.PI/5, Math.PI/3);
      const ring4 = makeRing(1.6,  0x00eeff, 0.20, Math.PI/3,   Math.PI/4, 0);

      /* ── 9. FIBONACCI DOTS ──────────────────────────────────────── */
      const N  = 280;
      const dp = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        const phi   = Math.acos(-1 + (2*i)/N);
        const theta = Math.sqrt(N*Math.PI) * phi;
        const rad   = 2.2 + (Math.random()-0.5) * 0.5;
        dp[i*3]   = rad * Math.sin(phi) * Math.cos(theta);
        dp[i*3+1] = rad * Math.sin(phi) * Math.sin(theta);
        dp[i*3+2] = rad * Math.cos(phi);
      }
      const fibGeo = new THREE.BufferGeometry();
      fibGeo.setAttribute('position', new THREE.BufferAttribute(dp, 3));
      const fibDots = new THREE.Points(fibGeo,
        new THREE.PointsMaterial({ color: 0x55ddff, size: 0.055, transparent: true, opacity: 0.9 })
      );
      scene.add(fibDots);

      /* ── INTERACTION ────────────────────────────────────────────── */
      let rotX = 0, rotY = 0, velX = 0, velY = 0;
      let isDragging = false, prevX = 0, prevY = 0;
      let mnx = 0, mny = 0;
      let dragIntensity = 0;

      const onMouseDown  = (e) => { isDragging = true;  prevX = e.clientX; prevY = e.clientY; };
      const onMouseUp    = ()  => { isDragging = false; };
      const onMouseMove  = (e) => {
        const rect = canvas.getBoundingClientRect();
        mnx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
        mny = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
        if (!isDragging) return;
        const dx = e.clientX - prevX, dy = e.clientY - prevY;
        velX = dx * 0.011; velY = dy * 0.011;
        dragIntensity = Math.min(Math.sqrt(dx*dx+dy*dy) * 0.04, 1.0);
        prevX = e.clientX; prevY = e.clientY;
      };
      const onTouchStart = (e) => {
        isDragging = true;
        prevX = e.touches[0].clientX; prevY = e.touches[0].clientY;
      };
      const onTouchEnd = () => { isDragging = false; };
      const onTouchMove = (e) => {
        e.preventDefault();
        const dx = e.touches[0].clientX - prevX, dy = e.touches[0].clientY - prevY;
        velX = dx * 0.011; velY = dy * 0.011;
        dragIntensity = Math.min(Math.sqrt(dx*dx+dy*dy) * 0.04, 1.0);
        prevX = e.touches[0].clientX; prevY = e.touches[0].clientY;
      };

      canvas.addEventListener('mousedown',  onMouseDown);
      canvas.addEventListener('touchstart', onTouchStart, { passive: true });
      canvas.addEventListener('touchend',   onTouchEnd);
      canvas.addEventListener('touchmove',  onTouchMove,  { passive: false });
      window.addEventListener('mouseup',    onMouseUp);
      window.addEventListener('mousemove',  onMouseMove);

      /*
        MOBILE FIX: ResizeObserver on the container (not window) catches
        orientation changes and address-bar hide/show on iOS/Android
        without reading window.innerWidth which can be unreliable
      */
      const ro = new ResizeObserver(() => {
        const w = getW(), h = getH();
        if (w === 0 || h === 0) return; // guard against zero dimensions
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      });
      ro.observe(container);

      /* ── ANIMATE ────────────────────────────────────────────────── */
      const orbParts = [helixGroup, fibDots, ring1, ring2, ring3, ring4, innerGlow, centerPt, outerGlow];

      function animate() {
        animFrameId = requestAnimationFrame(animate);
        const t = performance.now() * 0.001;

        for (let i = 0; i < BGCOUNT; i++) {
          bgPos[i*3]   += bgVel[i*2];
          bgPos[i*3+1] += bgVel[i*2+1];
          if (Math.abs(bgPos[i*3])   > 20) bgVel[i*2]   *= -1;
          if (Math.abs(bgPos[i*3+1]) > 14) bgVel[i*2+1] *= -1;
        }
        bgAttr.needsUpdate = true;

        bgPts.rotation.y += (mnx * 0.05 - bgPts.rotation.y) * 0.035;
        bgPts.rotation.x += (-mny * 0.03 - bgPts.rotation.x) * 0.035;
        nlGrp.rotation.y  = bgPts.rotation.y * 0.4;
        nlGrp.rotation.x  = bgPts.rotation.x * 0.4;

        if (isDragging) {
          rotY += velX; rotX += velY; dragIntensity *= 0.95;
        } else {
          velX *= 0.94; velY *= 0.94;
          rotY += velX + 0.004; rotX += velY * 0.3;
          dragIntensity *= 0.92;
        }

        const pulse = 1 + dragIntensity * 0.08 + Math.sin(t * 2.2) * 0.012;
        core.scale.setScalar(pulse);
        innerGlow.scale.setScalar(pulse * 0.95);
        centerPt.scale.setScalar(pulse);

        core.rotation.x = rotX; core.rotation.y = rotY;
        helixGroup.rotation.x = rotX * 0.6;
        helixGroup.rotation.y = rotY * 0.6 + t * 0.18;
        fibDots.rotation.y = rotY * 0.5 + t * 0.025;
        fibDots.rotation.x = rotX * 0.5;
        ring1.rotation.y  = t * 0.45 + dragIntensity * 0.5;
        ring2.rotation.x  = t * 0.32;
        ring3.rotation.z  = t * 0.22;
        ring4.rotation.y  = -t * 0.28;
        ring4.rotation.x  = t * 0.18;
        outerGlow.rotation.y = t * 0.08;

        const tx = mnx * 0.3, ty = -mny * 0.3;
        core.position.x += (tx - core.position.x) * 0.07;
        core.position.y += (ty - core.position.y) * 0.07;
        orbParts.forEach(obj => {
          obj.position.x += (tx - obj.position.x) * 0.07;
          obj.position.y += (ty - obj.position.y) * 0.07;
        });

        ring1.material.opacity  = 0.60 + dragIntensity * 0.35;
        fibDots.material.opacity = 0.9  + dragIntensity * 0.1;

        renderer.render(scene, camera);
      }
      animate();

      cleanupFn = () => {
        cancelAnimationFrame(animFrameId);
        ro.disconnect();
        canvas.removeEventListener('mousedown',  onMouseDown);
        canvas.removeEventListener('touchstart', onTouchStart);
        canvas.removeEventListener('touchend',   onTouchEnd);
        canvas.removeEventListener('touchmove',  onTouchMove);
        window.removeEventListener('mouseup',    onMouseUp);
        window.removeEventListener('mousemove',  onMouseMove);
        renderer.dispose();
      };
    }

    init();
    return () => { if (cleanupFn) cleanupFn(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0, left: 0,
        /*
          MOBILE FIX: Use 100% not 100vw.
          100vw = viewport width including scrollbar → causes horizontal overflow on mobile.
          100% = width of the parent element → always fits perfectly.
        */
        width: '100%',
        height: '100%',
        display: 'block',
        zIndex: 1,
        pointerEvents: 'auto',
        /* Prevent canvas itself from creating overflow */
        maxWidth: '100%',
      }}
      aria-hidden="true"
    />
  );
}