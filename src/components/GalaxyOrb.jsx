"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

const GalaxyOrb = forwardRef(function GalaxyOrb(_, ref) {
  const containerRef = useRef(null);
  const zoomFnsRef   = useRef({ zoomIn: null, zoomOut: null, reset: null });

  useImperativeHandle(ref, () => ({
    zoomIn:  () => zoomFnsRef.current.zoomIn?.(),
    zoomOut: () => zoomFnsRef.current.zoomOut?.(),
    reset:   () => zoomFnsRef.current.reset?.(),
  }));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let animId, cleanupFn;

    async function init() {
      const THREE = await import("three");

      /* ── Renderer ─────────────────────────────────────────────── */
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, logarithmicDepthBuffer: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setClearColor(0x00010a, 1);
      renderer.toneMapping         = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;
      container.appendChild(renderer.domElement);
      Object.assign(renderer.domElement.style, {
        position: "absolute", inset: "0",
        width: "100%", height: "100%", display: "block",
        pointerEvents: "none",
      });

      /* ── Scene / Camera ───────────────────────────────────────── */
      const scene  = new THREE.Scene();
      scene.fog    = new THREE.FogExp2(0x00010a, 0.006);

      const camera = new THREE.PerspectiveCamera(52, container.clientWidth / container.clientHeight, 0.01, 2000);

      const CAM_DEFAULT = 38;
      const CAM_MIN     = 4;
      const CAM_MAX     = 80;
      let   camDist     = CAM_DEFAULT;
      let   camTarget   = CAM_DEFAULT;
      const ZOOM_STEP   = 9;

      /*
        GALAXY POSITION SHIFT: move the galaxy group UP in world space (+Y)
        so the core sits in the upper half of the viewport, leaving the lower
        half clear for the hero text. The text elements below the name become
        fully readable.
      */
      const GALAXY_OFFSET_Y = 5; // units upward

      function updateCamera(d) {
        // Camera sits upper-right, looks at galaxy centre offset
        camera.position.set(d * 0.50, d * 0.42, d * 0.76);
        camera.lookAt(0, GALAXY_OFFSET_Y * 0.4, 0);
      }
      updateCamera(camDist);

      /* Wire zoom fns — these are the working implementations */
      zoomFnsRef.current = {
        zoomIn:  () => { camTarget = Math.max(CAM_MIN, camTarget - ZOOM_STEP); },
        zoomOut: () => { camTarget = Math.min(CAM_MAX, camTarget + ZOOM_STEP); },
        reset:   () => { camTarget = CAM_DEFAULT; },
      };

      /* ── Helpers ──────────────────────────────────────────────── */
      const rng = (a, b) => a + Math.random() * (b - a);

      /*
        SCATTER PARTICLES:
        Each particle stores its base position + a small random velocity.
        Outer particles (r > SCATTER_THRESHOLD) get stronger velocity so
        they visually "drift" as the galaxy rotates — simulating the loose
        outer stars that scatter in a real galaxy.
      */
      const SCATTER_THRESHOLD = 12; // galaxy units; beyond this = scattering zone

      function makeDriftPoints(positions, colors, size, opacity,
                               blending = THREE.AdditiveBlending) {
        const geo = new THREE.BufferGeometry();
        const N = positions.length / 3;

        // Velocity per particle (x,z only — scatter in disk plane)
        const vel = new Float32Array(N * 2);
        for (let i = 0; i < N; i++) {
          const px = positions[i * 3];
          const pz = positions[i * 3 + 2];
          const r  = Math.sqrt(px * px + pz * pz);
          // Outer particles drift faster
          const mag = r > SCATTER_THRESHOLD
            ? (0.0003 + (r - SCATTER_THRESHOLD) * 0.00005) * (Math.random() < 0.5 ? 1 : -1)
            : 0;
          vel[i * 2]     = mag * (Math.random() - 0.5) * 2;
          vel[i * 2 + 1] = mag * (Math.random() - 0.5) * 2;
        }

        const posAttr = new THREE.Float32BufferAttribute(positions.slice(), 3);
        posAttr.setUsage(THREE.DynamicDrawUsage);
        geo.setAttribute("position", posAttr);
        geo.setAttribute("color",    new THREE.Float32BufferAttribute(colors, 3));

        const pts = new THREE.Points(geo, new THREE.PointsMaterial({
          size, vertexColors: true, transparent: true,
          opacity, blending, depthWrite: false, sizeAttenuation: true,
        }));
        pts.userData = { vel, posAttr, basePos: positions.slice() };
        return pts;
      }

      function makePts(positions, colors, size, opacity,
                       blending = THREE.AdditiveBlending) {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        geo.setAttribute("color",    new THREE.Float32BufferAttribute(colors, 3));
        return new THREE.Points(geo, new THREE.PointsMaterial({
          size, vertexColors: true, transparent: true,
          opacity, blending, depthWrite: false, sizeAttenuation: true,
        }));
      }

      /* ══════════════════════════════════════════════════════════
         LAYER 1 — Deep star field (8 000)
      ══════════════════════════════════════════════════════════ */
      {
        const N = 8000, p = [], c = [];
        for (let i = 0; i < N; i++) {
          const r = rng(120, 550), th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
          p.push(r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th), r * Math.cos(ph));
          const t = Math.random();
          if      (t < 0.45) c.push(0.74, 0.86, 1.00);
          else if (t < 0.70) c.push(1.00, 1.00, 0.90);
          else if (t < 0.88) c.push(1.00, 0.80, 0.55);
          else               c.push(1.00, 0.55, 0.55);
        }
        scene.add(makePts(p, c, 0.10, 0.60, THREE.NormalBlending));
      }

      /* ══════════════════════════════════════════════════════════
         GALAXY GROUP — shifted upward
      ══════════════════════════════════════════════════════════ */
      const galaxy = new THREE.Group();
      galaxy.rotation.x =  0.52;
      galaxy.rotation.z = -0.22;
      galaxy.position.y = GALAXY_OFFSET_Y; // ← shift up
      scene.add(galaxy);

      const driftObjects = []; // collect scatter objects for animation

      /* ── 2a. Spiral arms — 44 000 pts, 5 arms ─────────────────── */
      {
        const N = 44000, p = [], c = [];
        const ARMS = 5, TWIST = 4.5;
        const armCols = [
          [0.18, 0.55, 1.00], [0.68, 0.28, 1.00], [0.08, 0.82, 1.00],
          [1.00, 0.58, 0.28], [0.52, 0.18, 1.00],
        ];
        for (let i = 0; i < N; i++) {
          const arm = i % ARMS, t = Math.pow(Math.random(), 0.65);
          const ang = (arm / ARMS) * Math.PI * 2 + t * TWIST;
          const rad = 0.8 + t * 19;
          const sp  = 0.70 * (1 - t * 0.38);
          p.push(Math.cos(ang)*rad + rng(-sp,sp)*2.5, rng(-0.1,0.1)*Math.exp(-t*3.5), Math.sin(ang)*rad + rng(-sp,sp)*2.5);
          const [r,g,b] = armCols[arm], core = Math.exp(-t*2.4)*0.9, bright = 0.22+t*0.48+Math.random()*0.28;
          c.push(Math.min(1,r*bright+core*0.9), Math.min(1,g*bright+core*0.8), Math.min(1,b*bright+core*0.7));
        }
        // Use drift points for spiral arms (the outer parts will scatter)
        const obj = makeDriftPoints(new Float32Array(p), c, 0.09, 0.88);
        galaxy.add(obj);
        driftObjects.push(obj);
      }

      /* ── 2b. Inner dense disk ────────────────────────────────── */
      {
        const N = 12000, p = [], c = [];
        for (let i = 0; i < N; i++) {
          const r = Math.pow(Math.random(),1.8)*7, a = Math.random()*Math.PI*2;
          p.push(Math.cos(a)*r, rng(-0.12,0.12)*Math.exp(-r*0.5), Math.sin(a)*r);
          const hot = 1-r/7; c.push(0.8+hot*0.2, 0.7+hot*0.25, 1.0);
        }
        galaxy.add(makePts(p, c, 0.11, 0.92));
      }

      /* ── 2c. Galactic core + nucleus ─────────────────────────── */
      {
        const N = 5000, p = [], c = [];
        for (let i = 0; i < N; i++) {
          const r=Math.pow(Math.random(),3)*2.8, th=Math.random()*Math.PI*2, phi=Math.acos(2*Math.random()-1);
          p.push(r*Math.sin(phi)*Math.cos(th), r*Math.sin(phi)*Math.sin(phi)*0.12, r*Math.cos(phi));
          const h=0.7+Math.random()*0.3; c.push(h*0.95,h*0.88,1.0);
        }
        galaxy.add(makePts(p, c, 0.16, 1.0));
        const cp=[],cc=[];
        for (let i=0;i<700;i++){
          const r=Math.pow(Math.random(),5)*0.5, a=Math.random()*Math.PI*2;
          cp.push(Math.cos(a)*r,rng(-0.03,0.03),Math.sin(a)*r); cc.push(1,1,1);
        }
        galaxy.add(makePts(cp,cc,0.25,1.0));
      }

      /* ── 2d. Dust lanes ──────────────────────────────────────── */
      {
        const N=5500, p=[], c=[];
        for (let i=0;i<N;i++){
          const arm=Math.floor(Math.random()*5), t=Math.random();
          const ang=(arm/5)*Math.PI*2+t*3.9+0.28, rad=2.5+t*15;
          p.push(Math.cos(ang)*rad+rng(-1.1,1.1), rng(-0.15,0.15), Math.sin(ang)*rad+rng(-1.1,1.1));
          c.push(0.015,0.015,0.04);
        }
        galaxy.add(makePts(p,c,0.25,0.36,THREE.NormalBlending));
      }

      /* ── 2e. Nebula blobs (8) ────────────────────────────────── */
      for (const nd of [
        {a:0.4,r:8,  col:[0.15,0.52,1.00],n:750},{a:1.9,r:11,col:[0.82,0.18,1.00],n:700},
        {a:3.5,r:7,  col:[0.08,0.82,1.00],n:550},{a:5.1,r:13,col:[1.00,0.42,0.18],n:650},
        {a:1.0,r:5,  col:[0.52,0.72,1.00],n:450},{a:4.0,r:10,col:[0.82,0.52,1.00],n:600},
        {a:2.7,r:15, col:[0.18,0.92,0.72],n:520},{a:0.8,r:17,col:[1.00,0.72,0.28],n:460},
      ]){
        const p=[],c=[];
        for(let i=0;i<nd.n;i++){
          p.push(Math.cos(nd.a)*nd.r+rng(-2.7,2.7), rng(-0.6,0.6), Math.sin(nd.a)*nd.r+rng(-2.7,2.7));
          const b=0.35+Math.random()*0.45; c.push(nd.col[0]*b,nd.col[1]*b,nd.col[2]*b);
        }
        const obj = makeDriftPoints(new Float32Array(p), c, 0.30, 0.60);
        galaxy.add(obj);
        driftObjects.push(obj);
      }

      /* ── 2f. Outer halo ──────────────────────────────────────── */
      {
        const N=3800,p=[],c=[];
        for(let i=0;i<N;i++){
          const r=14+Math.pow(Math.random(),0.4)*24, th=Math.random()*Math.PI*2, ph=(Math.random()-0.5)*0.85;
          p.push(Math.cos(th)*r, ph*r*0.32, Math.sin(th)*r);
          const b=0.10+Math.random()*0.20; c.push(b*0.60,b*0.72,b);
        }
        const obj = makeDriftPoints(new Float32Array(p), c, 0.07, 0.42, THREE.NormalBlending);
        galaxy.add(obj);
        driftObjects.push(obj);
      }

      /* ── 2g. Star clusters ───────────────────────────────────── */
      for(const[cx,cy,cz] of [[10,0,4],[-8,0,9],[5,0,-12],[-14,0,-5]]){
        const p=[],c=[];
        for(let i=0;i<320;i++){
          const r=Math.pow(Math.random(),2)*1.6, th=Math.random()*Math.PI*2, ph=Math.acos(2*Math.random()-1);
          p.push(cx+r*Math.sin(ph)*Math.cos(th), cy+r*Math.sin(ph)*Math.sin(th)*0.28, cz+r*Math.cos(ph));
          const b=0.55+Math.random()*0.45; c.push(b,b*0.90,b*0.72);
        }
        galaxy.add(makePts(p,c,0.13,0.95));
      }

      /* ══════════════════════════════════════════════════════════
         SOLAR SYSTEM at (10, 0.05, 4) — visible when zoomed in
      ══════════════════════════════════════════════════════════ */
      const solarSystem = new THREE.Group();
      solarSystem.position.set(10,0.05,4);
      galaxy.add(solarSystem);
      solarSystem.add(new THREE.PointLight(0xfff8e7,10,14));
      scene.add(new THREE.AmbientLight(0x112244,0.55));

      function sph(radius,color,emissive,ei){
        return new THREE.Mesh(new THREE.SphereGeometry(radius,24,24),
          new THREE.MeshStandardMaterial({color,emissive,emissiveIntensity:ei,roughness:0.75,metalness:0}));
      }
      const sun=sph(0.24,0xfff5b0,0xffcc22,3.8);
      solarSystem.add(sun);
      const coronaMat=new THREE.MeshBasicMaterial({color:0xffaa22,transparent:true,opacity:0.13,side:THREE.BackSide});
      solarSystem.add(new THREE.Mesh(new THREE.SphereGeometry(0.36,32,32),coronaMat));

      const planets=[];
      for(const[name,dist,radius,col,em,ei,spd] of [
        ["Mercury",0.38,0.022,0xaaaaaa,0x555555,0.3,2.1],["Venus",0.56,0.038,0xeecc88,0xaa6600,0.5,1.35],
        ["Earth",0.78,0.043,0x2266ee,0x0033aa,0.6,1.0],["Mars",1.04,0.031,0xcc4422,0x881100,0.4,0.72],
        ["Jupiter",1.58,0.092,0xddaa77,0x885522,0.3,0.40],["Saturn",2.14,0.074,0xccbb88,0x887744,0.25,0.24],
        ["Uranus",2.70,0.055,0x88ddee,0x224455,0.3,0.15],["Neptune",3.15,0.051,0x3355cc,0x112277,0.35,0.11],
      ]){
        const orb=new THREE.Mesh(new THREE.TorusGeometry(dist,0.003,6,128),
          new THREE.MeshBasicMaterial({color:0x334466,transparent:true,opacity:0,depthWrite:false}));
        orb.rotation.x=Math.PI/2; orb.userData.isOrbit=true; solarSystem.add(orb);
        const planet=sph(radius,col,em,ei);
        const a0=Math.random()*Math.PI*2;
        planet.position.set(Math.cos(a0)*dist,0,Math.sin(a0)*dist);
        planet.userData={dist,spd,angle:a0}; solarSystem.add(planet); planets.push(planet);
        if(name==="Saturn"){
          const ring=new THREE.Mesh(new THREE.TorusGeometry(radius*1.85,radius*0.55,4,64),
            new THREE.MeshBasicMaterial({color:0xddcc99,transparent:true,opacity:0.55,side:THREE.DoubleSide}));
          ring.rotation.x=Math.PI/2.4; planet.add(ring);
        }
        if(name==="Earth"){
          const moon=sph(0.013,0xcccccc,0x888888,0.2); moon.userData.isMoon=true; planet.add(moon);
          planet.add(new THREE.Mesh(new THREE.SphereGeometry(0.052,24,24),
            new THREE.MeshBasicMaterial({color:0x4488ff,transparent:true,opacity:0.18,side:THREE.BackSide})));
        }
      }

      /* ── Pinch zoom (mobile) ──────────────────────────────────── */
      let pinchDist=0;
      const onTouchMove=(e)=>{
        if(e.touches.length!==2)return;
        e.preventDefault();
        const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
        if(pinchDist) camTarget=Math.max(CAM_MIN,Math.min(CAM_MAX,camTarget-(d-pinchDist)*0.10));
        pinchDist=d;
      };
      const onTouchEnd=()=>{pinchDist=0;};
      container.addEventListener("touchmove",onTouchMove,{passive:false});
      container.addEventListener("touchend",onTouchEnd);

      /* ── Resize ───────────────────────────────────────────────── */
      const ro=new ResizeObserver(()=>{
        const w=container.clientWidth,h=container.clientHeight;
        if(!w||!h)return;
        camera.aspect=w/h; camera.updateProjectionMatrix(); renderer.setSize(w,h);
      });
      ro.observe(container);

      /* ── Animate ──────────────────────────────────────────────── */
      const t0=performance.now();
      let scatterFrame=0;

      function animate(){
        animId=requestAnimationFrame(animate);
        const t=(performance.now()-t0)*0.001;

        galaxy.rotation.y+=0.00018;

        // Smooth zoom
        camDist+=(camTarget-camDist)*0.07;
        updateCamera(camDist);

        // Scatter animation: every 2 frames update drift positions
        // so outer particles visibly spread as galaxy rotates
        scatterFrame++;
        if(scatterFrame%2===0){
          for(const obj of driftObjects){
            const{vel,posAttr,basePos}=obj.userData;
            const N=vel.length/2;
            const pos=posAttr.array;
            for(let i=0;i<N;i++){
              pos[i*3]  +=vel[i*2];
              pos[i*3+2]+=vel[i*2+1];
              // Soft restore — particles drift out then slowly return
              pos[i*3]  +=(basePos[i*3]   - pos[i*3])   * 0.0008;
              pos[i*3+2]+=(basePos[i*3+2] - pos[i*3+2]) * 0.0008;
            }
            posAttr.needsUpdate=true;
          }
        }

        // Sun pulse
        sun.material.emissiveIntensity=3.2+Math.sin(t*2.2)*0.55;
        coronaMat.opacity=0.11+Math.sin(t*1.7)*0.04;

        // Planet orbits
        for(const planet of planets){
          const{dist,spd}=planet.userData;
          planet.userData.angle=(planet.userData.angle||0)+spd*0.006;
          planet.position.x=Math.cos(planet.userData.angle)*dist;
          planet.position.z=Math.sin(planet.userData.angle)*dist;
          planet.rotation.y+=spd*0.012;
        }
        const moon=planets[2]?.children.find(c=>c.userData.isMoon);
        if(moon){const ma=t*2.6; moon.position.set(Math.cos(ma)*0.075,0,Math.sin(ma)*0.075);}

        // Orbit rings fade
        const showOrbits=camDist<22;
        solarSystem.traverse(obj=>{
          if(obj.isMesh&&obj.userData.isOrbit)
            obj.material.opacity=showOrbits?Math.min(0.38,(22-camDist)/22):0;
        });

        renderer.render(scene,camera);
      }
      animate();

      cleanupFn=()=>{
        cancelAnimationFrame(animId); ro.disconnect();
        container.removeEventListener("touchmove",onTouchMove);
        container.removeEventListener("touchend",onTouchEnd);
        renderer.dispose();
        renderer.domElement.parentNode?.removeChild(renderer.domElement);
      };
    }

    init().catch(console.error);
    return ()=>{if(cleanupFn)cleanupFn();};
  },[]);

  return (
    <div ref={containerRef} style={{
      position:"absolute", inset:0,
      width:"100%", height:"100%", overflow:"hidden",
      pointerEvents:"none", userSelect:"none", WebkitUserSelect:"none",
    }}/>
  );
});

export default GalaxyOrb;