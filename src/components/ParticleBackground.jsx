'use client';

import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const startTimer = setTimeout(initThree, 120);
    let animFrameId;
    let cleanupFn;

    function initThree() {
      import('three').then((THREE) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        /*
          MOBILE FIX: document.documentElement.clientWidth is the gold standard
          for the true visible width on mobile — it never includes the scrollbar
          and correctly handles iOS Safari's dynamic viewport changes.
        */
        const getW = () => document.documentElement.clientWidth;
        const getH = () => window.innerHeight;

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setSize(getW(), getH());
        renderer.setClearColor(0x000000, 0);

        const scene  = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(70, getW() / getH(), 0.1, 200);
        camera.position.z = 32;

        const isMobile = getW() < 768;
        const COUNT    = isMobile ? 900 : 2200;
        const LCOUNT   = isMobile ? 25  : 65;

        /* ── Particles ────────────────────────────────────────────── */
        const ppos = new Float32Array(COUNT * 3);
        const pvel = new Float32Array(COUNT * 2);
        for (let i = 0; i < COUNT; i++) {
          ppos[i*3]   = (Math.random()-0.5) * 100;
          ppos[i*3+1] = (Math.random()-0.5) * 100;
          ppos[i*3+2] = (Math.random()-0.5) * 50;
          pvel[i*2]   = (Math.random()-0.5) * 0.005;
          pvel[i*2+1] = (Math.random()-0.5) * 0.005;
        }
        const geo   = new THREE.BufferGeometry();
        const pAttr = new THREE.BufferAttribute(ppos, 3);
        pAttr.setUsage(35048);
        geo.setAttribute('position', pAttr);

        const pts = new THREE.Points(geo,
          new THREE.PointsMaterial({
            color: 0x1a7acc,
            size: isMobile ? 0.28 : 0.20,
            transparent: true,
            opacity: 0.92,
            sizeAttenuation: true,
          })
        );
        scene.add(pts);

        /* ── Accent glow layer ────────────────────────────────────── */
        const GCOUNT = isMobile ? 180 : 450;
        const gpos   = new Float32Array(GCOUNT * 3);
        for (let i = 0; i < GCOUNT; i++) {
          gpos[i*3]   = (Math.random()-0.5) * 100;
          gpos[i*3+1] = (Math.random()-0.5) * 100;
          gpos[i*3+2] = (Math.random()-0.5) * 50;
        }
        const gGeo = new THREE.BufferGeometry();
        gGeo.setAttribute('position', new THREE.BufferAttribute(gpos, 3));
        const glowPts = new THREE.Points(gGeo,
          new THREE.PointsMaterial({
            color: 0x55aaff,
            size: isMobile ? 0.48 : 0.36,
            transparent: true,
            opacity: 0.70,
            sizeAttenuation: true,
          })
        );
        scene.add(glowPts);

        /* ── Connection lines ─────────────────────────────────────── */
        const lMat = new THREE.LineBasicMaterial({ color: 0x1a5c99, transparent: true, opacity: 0.28 });
        const lGrp = new THREE.Group();
        for (let i = 0; i < LCOUNT; i++) {
          const lp = Array.from({ length: 4 }, () =>
            new THREE.Vector3((Math.random()-0.5)*95, (Math.random()-0.5)*95, (Math.random()-0.5)*40)
          );
          lGrp.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(lp), lMat));
        }
        scene.add(lGrp);

        /* ── Mouse / touch ────────────────────────────────────────── */
        let tRX = 0, tRY = 0, cRX = 0, cRY = 0;
        const onMouseMove = (e) => {
          tRY = ((e.clientX / getW())  - 0.5) * 0.45;
          tRX = -((e.clientY / getH()) - 0.5) * 0.28;
        };
        let tpx = 0, tpy = 0, tdown = false;
        const onTouchStart = (e) => { tdown = true;  tpx = e.touches[0].clientX; tpy = e.touches[0].clientY; };
        const onTouchEnd   = ()  => { tdown = false; };
        const onTouchMove  = (e) => {
          if (!tdown) return;
          tRY += (e.touches[0].clientX - tpx) * 0.002;
          tRX -= (e.touches[0].clientY - tpy) * 0.002;
          tpx = e.touches[0].clientX; tpy = e.touches[0].clientY;
        };

        window.addEventListener('mousemove',  onMouseMove);
        window.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('touchend',   onTouchEnd);
        window.addEventListener('touchmove',  onTouchMove,  { passive: true });

        /*
          MOBILE FIX: Listen for orientationchange in addition to resize.
          On iOS, orientationchange fires before resize completes, so we wait 200ms
          after it fires to get the correct new dimensions.
        */
        const onResize = () => {
          const w = getW(), h = getH();
          if (w === 0 || h === 0) return;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        };
        const onOrientationChange = () => setTimeout(onResize, 200);

        window.addEventListener('resize',            onResize);
        window.addEventListener('orientationchange', onOrientationChange);

        /* ── Animate ──────────────────────────────────────────────── */
        function animate() {
          animFrameId = requestAnimationFrame(animate);
          for (let i = 0; i < COUNT; i++) {
            ppos[i*3]   += pvel[i*2];
            ppos[i*3+1] += pvel[i*2+1];
            if (Math.abs(ppos[i*3])   > 50) pvel[i*2]   *= -1;
            if (Math.abs(ppos[i*3+1]) > 50) pvel[i*2+1] *= -1;
          }
          pAttr.needsUpdate = true;

          cRY += (tRY - cRY) * 0.05;
          cRX += (tRX - cRX) * 0.05;
          pts.rotation.y     = cRY; pts.rotation.x     = cRX;
          glowPts.rotation.y = cRY * 1.1; glowPts.rotation.x = cRX * 1.1;
          lGrp.rotation.y    = cRY * 0.5; lGrp.rotation.x    = cRX * 0.5;
          pts.rotation.z    += 0.0003;
          glowPts.rotation.z += 0.0005;

          renderer.render(scene, camera);
        }
        animate();

        cleanupFn = () => {
          cancelAnimationFrame(animFrameId);
          window.removeEventListener('mousemove',         onMouseMove);
          window.removeEventListener('touchstart',        onTouchStart);
          window.removeEventListener('touchend',          onTouchEnd);
          window.removeEventListener('touchmove',         onTouchMove);
          window.removeEventListener('resize',            onResize);
          window.removeEventListener('orientationchange', onOrientationChange);
          renderer.dispose();
        };
      });
    }

    return () => {
      clearTimeout(startTimer);
      if (cleanupFn) cleanupFn();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        /*
          MOBILE FIX: width/height use explicit pixel-like declarations
          that don't exceed the viewport. Never use 100vw here — on mobile
          browsers 100vw can exceed the layout viewport and cause a horizontal
          scrollbar / the blank-space-on-right issue you were seeing.
        */
        width: '100%',
        height: '100%',
        maxWidth: '100%',
        display: 'block',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
}