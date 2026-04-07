import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const SystemFlow = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 🌐 Floating motion for the entire SVG
      gsap.to(".system-svg", {
        y: -15,
        duration: 4,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut"
      });

      // ✨ Stagger node appearance
      gsap.from(".node", {
        opacity: 0,
        scale: 0,
        duration: 1,
        stagger: 0.2,
        ease: "back.out(1.7)"
      });

      // 🏎️ Vehicle motion refinement
      gsap.to(".patrol-unit", {
        x: 1540,
        duration: 8,
        repeat: -1,
        ease: "none"
      });
    }, svgRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={svgRef}>
      <svg viewBox="0 0 1440 320" className="system-svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0 L0 0 0 40" fill="none" stroke="#64748b" strokeWidth="0.5" />
          </pattern>
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4361ee" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" opacity="0.1" />

        {/* 🔗 Flow Line (The Path) */}
        <path id="flowPath"
              d="M200 160 Q350 40 450 120 T700 140 T950 160 T1200 120"
              stroke="rgba(67, 97, 238, 0.2)"
              strokeWidth="2.5"
              fill="none"
              strokeDasharray="10,8" />

        {/* 🚀 Moving Data Packet */}
        <circle r="6" fill="#4361ee">
          <animateMotion dur="4s" repeatCount="indefinite">
            <mpath href="#flowPath" />
          </animateMotion>
        </circle>

        {/* 🔵 Citizen Node */}
        <circle cx="200" cy="160" r="26" fill="#4361ee" className="node" />
        <text x="175" y="210" fill="#94a3b8" fontSize="14" fontWeight="700">CITIZEN</text>

        {/* 🔴 Issue Node */}
        <circle cx="450" cy="120" r="10" fill="#ef4444" className="node pulse" />
        <text x="430" y="100" fill="#ef4444" fontSize="13" fontWeight="900" letterSpacing="1px">ISSUE</text>

        {/* 🟣 Authority Node */}
        <rect x="670" y="110" width="80" height="80" rx="18" fill="#7209b7" className="node" />
        <text x="655" y="215" fill="#94a3b8" fontSize="14" fontWeight="700">AUTHORITY</text>

        {/* 🟠 Officer Node */}
        <circle cx="950" cy="160" r="26" fill="#f72585" className="node" />
        <text x="925" y="210" fill="#94a3b8" fontSize="14" fontWeight="700">OFFICER</text>

        {/* 🟢 Resolved Node */}
        <circle cx="1200" cy="120" r="12" fill="#10b981" className="node pulse" />
        <text x="1165" y="100" fill="#10b981" fontSize="13" fontWeight="900" letterSpacing="1px">RESOLVED</text>

        {/* 🚓 Patrol Unit (Moving Vehicle) */}
        <g className="patrol-unit">
           <rect x="-100" y="270" width="70" height="20" rx="6" fill="rgba(67, 97, 238, 0.5)" />
           <rect x="-80" y="260" width="30" height="10" rx="3" fill="rgba(67, 97, 238, 0.3)" />
           <circle cx="-90" cy="290" r="6" fill="#000" />
           <circle cx="-40" cy="290" r="6" fill="#000" />
        </g>
      </svg>
    </div>
  );
};

export default SystemFlow;
