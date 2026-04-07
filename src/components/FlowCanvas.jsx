import React, { useEffect, useRef } from 'react';

const FlowCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight; // Full viewport height
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // ⭐ NODES (Spread logically across full viewport)
    const getNodes = () => [
      { x: canvas.width * 0.15, y: canvas.height * 0.3, label: "Citizen", color: "#3b82f6" },
      { x: canvas.width * 0.40, y: canvas.height * 0.6, label: "Authority", color: "#6366f1" },
      { x: canvas.width * 0.65, y: canvas.height * 0.4, label: "Officer", color: "#f59e0b" },
      { x: canvas.width * 0.85, y: canvas.height * 0.7, label: "Resolved", color: "#10b981" }
    ];

    let nodes = getNodes();
    let particles = [];

    // ⭐ COMPLAINT FLOW CREATION
    const spawnParticle = () => {
      if (particles.length < 50) { // Performance cap
        particles.push({
          t: 0,
          speed: 0.002 + Math.random() * 0.003,
          size: 3 + Math.random() * 3
        });
      }
    };

    const interval = setInterval(spawnParticle, 800);

    // ⭐ BEZIER CURVE LOGIC
    const getPoint = (t, nodes) => {
      const p0 = nodes[0];
      const p1 = { x: canvas.width * 0.3, y: canvas.height * 0.1 };
      const p2 = { x: canvas.width * 0.7, y: canvas.height * 0.9 };
      const p3 = nodes[3];

      const x =
        Math.pow(1 - t, 3) * p0.x +
        3 * Math.pow(1 - t, 2) * t * p1.x +
        3 * (1 - t) * t * t * p2.x +
        t * t * t * p3.x;

      const y =
        Math.pow(1 - t, 3) * p0.y +
        3 * Math.pow(1 - t, 2) * t * p1.y +
        3 * (1 - t) * t * t * p2.y +
        t * t * t * p3.y;

      return { x, y };
    };

    const drawNodes = () => {
      nodes.forEach(n => {
        // ✨ Static Glow
        ctx.shadowBlur = 20;
        ctx.shadowColor = n.color;

        ctx.beginPath();
        ctx.arc(n.x, n.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();

        ctx.shadowBlur = 0; // Reset for text
        ctx.fillStyle = "rgba(148, 163, 184, 0.6)"; // Blue-gray
        ctx.font = "bold 13px 'Inter', sans-serif";
        ctx.fillText(n.label.toUpperCase(), n.x - 30, n.y + 30);
      });
    };

    const drawParticles = () => {
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#38bdf8";

      particles.forEach((p, i) => {
        p.t += p.speed;

        if (p.t >= 1) {
          particles.splice(i, 1);
          return;
        }

        const pos = getPoint(p.t, nodes);

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "#38bdf8";
        ctx.fill();
      });
      ctx.shadowBlur = 0;
    };

    const drawPath = () => {
      ctx.beginPath();
      ctx.moveTo(nodes[0].x, nodes[0].y);
      ctx.bezierCurveTo(
        canvas.width * 0.3, canvas.height * 0.1, 
        canvas.width * 0.7, canvas.height * 0.9, 
        nodes[3].x, nodes[3].y
      );
      ctx.strokeStyle = "rgba(67, 97, 238, 0.1)"; // Very subtle flow lane
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update nodes on each frame for responsiveness
      nodes = getNodes();

      drawPath();
      drawNodes();
      drawParticles();

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(interval);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      id="flowCanvas"
      style={{ 
        position: "absolute", 
        top: 0, 
        left: 0, 
        width: "100%", 
        height: "100%", 
        zIndex: 1, 
        opacity: 0.4, 
        pointerEvents: "none" 
      }} 
    />
  );
};

export default FlowCanvas;
