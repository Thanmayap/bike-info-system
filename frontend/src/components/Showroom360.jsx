import { useEffect, useRef, useState } from 'react';
import { RotateCw, Compass, Shield, Maximize2, Zap, Play } from 'lucide-react';

export default function Showroom360({ bike, selectedColor }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [rotation, setRotation] = useState(0); // 0 to 360 degrees
  const [pitch, setPitch] = useState(0.2); // vertical angle
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const [mode, setMode] = useState('photo'); // 'photo' or '3d'
  const [autoSpin, setAutoSpin] = useState(true);

  // Colors
  const activeColorHex = selectedColor?.hex || '#10b981'; // default neon emerald

  // Photo mode 3D parallax offsets
  const rotateYStyle = `rotateY(${rotation}deg) rotateX(${pitch * 20}deg)`;
  
  // HTML5 Canvas 3D Engine for "3D Scanner" Mode
  useEffect(() => {
    if (mode !== '3d' || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let localRotation = (rotation * Math.PI) / 180;
    let localPitch = pitch;

    // Define 3D vertices for a motorcycle wireframe model
    // Coordinate system: X=left/right, Y=up/down (negative is up), Z=front/back
    const vertices = [
      // Rear wheel (Z = -60)
      ...Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return { x: -60, y: 20 + Math.sin(angle) * 20, z: Math.cos(angle) * 20, group: 'rear-wheel' };
      }),
      // Front wheel (Z = 60)
      ...Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return { x: 60, y: 20 + Math.sin(angle) * 20, z: Math.cos(angle) * 20, group: 'front-wheel' };
      }),
      
      // Main Frame
      { x: -60, y: 20, z: 0, id: 'rear-hub' },
      { x: -30, y: 20, z: 0, id: 'swingarm-joint' },
      { x: -10, y: 0, z: 0, id: 'seat-front' },
      { x: -40, y: -5, z: 0, id: 'seat-rear' },
      { x: 10, y: -15, z: 0, id: 'tank-front' },
      { x: -15, y: -10, z: 0, id: 'tank-rear' },
      { x: 40, y: -25, z: 0, id: 'headstock' },
      { x: 60, y: 20, z: 0, id: 'front-hub' },
      
      // Engine Block
      { x: -5, y: 15, z: -8, id: 'eng-tl' },
      { x: 15, y: 15, z: -8, id: 'eng-tr' },
      { x: 15, y: 30, z: -6, id: 'eng-br' },
      { x: -5, y: 30, z: -6, id: 'eng-bl' },
      { x: -5, y: 15, z: 8, id: 'eng-tl-r' },
      { x: 15, y: 15, z: 8, id: 'eng-tr-r' },
      { x: 15, y: 30, z: 6, id: 'eng-br-r' },
      { x: -5, y: 30, z: 6, id: 'eng-bl-r' },

      // Handlebars
      { x: 38, y: -35, z: -18, id: 'handle-left' },
      { x: 42, y: -35, z: 18, id: 'handle-right' },
      
      // Exhaust
      { x: -15, y: 25, z: 10, id: 'exhaust-start' },
      { x: -55, y: 10, z: 14, id: 'exhaust-end' }
    ];

    // Define lines connecting the 3D vertices
    const edges = [
      // Rear wheel hub to joint
      ['rear-hub', 'swingarm-joint'],
      // Swingarm to frame
      ['swingarm-joint', 'seat-front'],
      ['swingarm-joint', 'eng-bl'],
      // Seat profile
      ['seat-rear', 'seat-front'],
      ['seat-front', 'tank-rear'],
      ['tank-rear', 'tank-front'],
      ['tank-front', 'headstock'],
      ['seat-front', 'eng-tl'],
      ['tank-rear', 'eng-tl'],
      // Headstock down to engine
      ['headstock', 'eng-tr'],
      ['headstock', 'front-hub'], // forks
      
      // Handlebars
      ['headstock', 'handle-left'],
      ['headstock', 'handle-right'],

      // Engine cube left
      ['eng-tl', 'eng-tr'], ['eng-tr', 'eng-br'], ['eng-br', 'eng-bl'], ['eng-bl', 'eng-tl'],
      // Engine cube right
      ['eng-tl-r', 'eng-tr-r'], ['eng-tr-r', 'eng-br-r'], ['eng-br-r', 'eng-bl-r'], ['eng-bl-r', 'eng-tl-r'],
      // Engine cross links
      ['eng-tl', 'eng-tl-r'], ['eng-tr', 'eng-tr-r'], ['eng-br', 'eng-br-r'], ['eng-bl', 'eng-bl-r'],
      
      // Exhaust line
      ['eng-bl', 'exhaust-start'],
      ['exhaust-start', 'exhaust-end']
    ];

    const resize = () => {
      canvas.width = containerRef.current?.clientWidth || 500;
      canvas.height = 350;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid floor / pedestal
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      const floorY = 70;
      const numLines = 14;
      for (let i = -numLines; i <= numLines; i++) {
        // Horizontal grid lines projected
        ctx.beginPath();
        for (let j = -numLines; j <= numLines; j++) {
          const x3d = j * 12;
          const z3d = i * 12;
          
          // Rotate around Y axis
          const rotX = x3d * Math.cos(localRotation) - z3d * Math.sin(localRotation);
          const rotZ = x3d * Math.sin(localRotation) + z3d * Math.cos(localRotation);
          
          // Rotate around X axis (pitch)
          const finalY = floorY * Math.cos(localPitch) - rotZ * Math.sin(localPitch);
          const finalZ = floorY * Math.sin(localPitch) + rotZ * Math.cos(localPitch);
          
          // Project
          const scale = 280 / (finalZ + 300);
          const scrX = canvas.width / 2 + rotX * scale;
          const scrY = canvas.height / 2 + finalY * scale + 30;
          
          if (j === -numLines) ctx.moveTo(scrX, scrY);
          else ctx.lineTo(scrX, scrY);
        }
        ctx.stroke();
      }

      // Project vertices to 2D screen
      const projected = {};
      
      // Draw wheels
      const drawWheel = (groupName, color) => {
        const wheelVerts = vertices.filter(v => v.group === groupName);
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 3.5;
        
        const projWheelPoints = wheelVerts.map(v => {
          // Rotate around Y axis
          const rotX = v.x * Math.cos(localRotation) - v.z * Math.sin(localRotation);
          const rotZ = v.x * Math.sin(localRotation) + v.z * Math.cos(localRotation);
          
          // Rotate around X axis (pitch)
          const finalY = v.y * Math.cos(localPitch) - rotZ * Math.sin(localPitch);
          const finalZ = v.y * Math.sin(localPitch) + rotZ * Math.cos(localPitch);
          
          const scale = 280 / (finalZ + 300);
          return {
            x: canvas.width / 2 + rotX * scale,
            y: canvas.height / 2 + finalY * scale + 30
          };
        });
        
        projWheelPoints.forEach((p, idx) => {
          if (idx === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();
        ctx.stroke();
      };
      
      drawWheel('rear-wheel', 'rgba(255,255,255,0.4)');
      drawWheel('front-wheel', 'rgba(255,255,255,0.4)');

      // Project and store standard vertices
      vertices.forEach(v => {
        if (v.id) {
          const rotX = v.x * Math.cos(localRotation) - v.z * Math.sin(localRotation);
          const rotZ = v.x * Math.sin(localRotation) + v.z * Math.cos(localRotation);
          
          const finalY = v.y * Math.cos(localPitch) - rotZ * Math.sin(localPitch);
          const finalZ = v.y * Math.sin(localPitch) + rotZ * Math.cos(localPitch);
          
          const scale = 280 / (finalZ + 300);
          projected[v.id] = {
            x: canvas.width / 2 + rotX * scale,
            y: canvas.height / 2 + finalY * scale + 30,
            depth: finalZ
          };
        }
      });

      // Draw Edges / Chassis Frame
      ctx.lineWidth = 2.5;
      edges.forEach(([v1, v2]) => {
        const p1 = projected[v1];
        const p2 = projected[v2];
        if (p1 && p2) {
          // Color based on part
          if (v1.startsWith('eng') || v2.startsWith('eng')) {
            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
          } else if (v1.startsWith('exhaust') || v2.startsWith('exhaust')) {
            ctx.strokeStyle = '#94a3b8';
          } else {
            ctx.strokeStyle = activeColorHex; // custom selected color for active frame highlights!
          }
          
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });

      // Draw soft glowing dots at junctions
      Object.keys(projected).forEach(id => {
        const p = projected[id];
        ctx.fillStyle = activeColorHex;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Auto-rotation handling
      if (autoSpin && !isDragging) {
        localRotation += 0.008;
        // setRotation((localRotation * 180 / Math.PI) % 360);
      } else {
        localRotation = (rotation * Math.PI) / 180;
      }
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [mode, rotation, pitch, autoSpin, isDragging, activeColorHex]);

  // Mouse drag handles
  const onMouseDown = (e) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    setAutoSpin(false);
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;
    dragStart.current = { x: e.clientX, y: e.clientY };

    setRotation((prev) => (prev + deltaX * 0.7 + 360) % 360);
    setPitch((prev) => Math.max(-0.4, Math.min(0.6, prev - deltaY * 0.003)));
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const reset = () => {
    setRotation(0);
    setPitch(0.2);
    setAutoSpin(true);
  };

  const bikeImg = bike.image.startsWith('http') 
    ? bike.image.replace(/&amp;/g, '&')
    : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${bike.image}`;

  return (
    <div className="flex flex-col h-full bg-ink-950/40 relative overflow-hidden" ref={containerRef}>
      
      {/* Showroom Header */}
      <div className="p-4 flex justify-between items-center bg-ink-900/60 border-b border-white/5 z-10">
        <div className="flex items-center gap-2">
          <Compass className="text-neon" size={16} />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">360° Interactive Showroom</span>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={() => setMode('photo')} 
            className={`px-3 py-1 text-xs rounded-full border transition-all ${mode === 'photo' ? 'bg-neon border-neon text-ink-950 font-bold' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
          >
            Studio Photo
          </button>
          <button 
            onClick={() => setMode('3d')} 
            className={`px-3 py-1 text-xs rounded-full border transition-all ${mode === '3d' ? 'bg-neon border-neon text-ink-950 font-bold' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
          >
            3D Wireframe
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div 
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        className="flex-1 flex items-center justify-center p-6 min-h-[300px] cursor-grab active:cursor-grabbing relative select-none"
      >
        {mode === 'photo' ? (
          <div className="w-full h-full flex flex-col items-center justify-center relative">
            
            {/* Holographic Pedestal Floor Shadow & Glow */}
            <div 
              style={{
                boxShadow: `0 0 100px 30px ${activeColorHex}2b`,
                borderColor: `${activeColorHex}2b`
              }}
              className="absolute bottom-6 w-72 h-14 bg-neon/5 border-2 rounded-[100%] blur-[2px] transform scale-y-50 flex items-center justify-center"
            >
              <div 
                style={{ backgroundColor: activeColorHex }}
                className="w-4 h-4 rounded-full filter blur-[1px] animate-ping opacity-60"
              />
            </div>

            {/* Projected Bike Image using CSS 3D Transformation! */}
            <div 
              style={{
                transform: rotateYStyle,
                transformStyle: 'preserve-3d',
                transition: isDragging ? 'none' : 'transform 0.4s ease-out'
              }}
              className="relative w-full max-w-[420px] max-h-[300px] flex items-center justify-center pointer-events-none"
            >
              <img
                src={bikeImg}
                alt={bike.model}
                className="w-full max-h-[250px] object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] filter brightness-105"
                onError={e => { e.target.onerror=null; e.target.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'; }}
              />
            </div>
            
            {/* Showroom Interactive Guide */}
            <div className="absolute top-4 left-4 bg-ink-900/80 px-2.5 py-1.5 rounded border border-white/5 text-[10px] text-slate-400 flex items-center gap-1.5 pointer-events-none">
              <RotateCw size={10} className="animate-spin text-neon" /> Drag to rotate, feel the perspective!
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <canvas ref={canvasRef} className="w-full h-full" />
            <div className="absolute top-4 left-4 bg-ink-900/80 px-2.5 py-1.5 rounded border border-white/5 text-[10px] text-slate-400 flex items-center gap-1.5 pointer-events-none">
              <Zap size={10} className="text-neon" /> Drag to spin, dynamic chassis color highlight active!
            </div>
          </div>
        )}
      </div>

      {/* Showroom Footer Controls */}
      <div className="p-4 bg-ink-950/80 border-t border-white/5 flex items-center justify-between z-10 gap-4">
        <div className="flex-1 max-w-xs flex items-center gap-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Angle:</span>
          <input 
            type="range" 
            min="0" 
            max="359" 
            value={Math.round(rotation)} 
            onChange={(e) => {
              setRotation(parseInt(e.target.value));
              setAutoSpin(false);
            }}
            className="flex-1 accent-neon bg-white/10 h-1.5 rounded-lg outline-none cursor-pointer"
          />
          <span className="text-[11px] text-neon font-mono font-bold">{Math.round(rotation)}°</span>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setAutoSpin(!autoSpin)} 
            className={`btn px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-all ${autoSpin ? 'bg-neon/10 text-neon border border-neon/30' : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'}`}
          >
            {autoSpin ? <Play size={12} className="text-neon animate-pulse" /> : <RotateCw size={12} />}
            {autoSpin ? 'Auto-spin ON' : 'Auto-spin OFF'}
          </button>
          <button onClick={reset} className="btn bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs text-slate-300 font-semibold border border-white/10 transition-all">
            Reset Stage
          </button>
        </div>
      </div>
    </div>
  );
}
