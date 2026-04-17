/* 共用背景粒子 + 故障特效 */
(function() {
    // 建立 canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-particles';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9998;pointer-events:none;';
    document.body.prepend(canvas);

    // 建立掃描線
    const scanlines = document.createElement('div');
    scanlines.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,100,255,0.008) 2px,rgba(0,100,255,0.008) 4px);z-index:-1;pointer-events:none;';
    document.body.prepend(scanlines);

    // 建立故障閃爍層
    const glitchEl = document.createElement('div');
    glitchEl.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;pointer-events:none;opacity:0;mix-blend-mode:screen;';
    document.body.appendChild(glitchEl);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };

    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    window.addEventListener('resize', () => { resize(); init(); });
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    resize();

    // 讀取頁面主色
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#0078ff';

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.baseSize = Math.random() * 2 + 0.5;
            this.size = this.baseSize;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            const hue = 200 + Math.random() * 40;
            const light = 50 + Math.random() * 30;
            this.color = `hsla(${hue}, 100%, ${light}%, `;
            this.pulse = Math.random() * Math.PI * 2;
            this.pulseSpeed = 0.02 + Math.random() * 0.02;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.pulse += this.pulseSpeed;
            this.size = this.baseSize + Math.sin(this.pulse) * 0.5;
            if (mouse.x !== null) {
                const dx = this.x - mouse.x, dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const force = (150 - dist) / 150 * 0.3;
                    this.x += (dx / dist) * force;
                    this.y += (dy / dist) * force;
                }
            }
            if (this.x > canvas.width + 10) this.x = -10;
            else if (this.x < -10) this.x = canvas.width + 10;
            if (this.y > canvas.height + 10) this.y = -10;
            else if (this.y < -10) this.y = canvas.height + 10;
        }
        draw() {
            const alpha = 0.3 + Math.sin(this.pulse) * 0.15;
            ctx.fillStyle = this.color + alpha + ')';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = this.color + (alpha * 0.3) + ')';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        particles = [];
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 150);
        for (let i = 0; i < count; i++) particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 160) {
                    const alpha = 0.12 * (1 - dist / 160);
                    ctx.strokeStyle = `rgba(0, 120, 255, ${alpha})`;
                    ctx.lineWidth = 0.6;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        if (mouse.x !== null) {
            particles.forEach(p => {
                const dx = p.x - mouse.x, dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    const alpha = 0.2 * (1 - dist / 200);
                    ctx.strokeStyle = `rgba(0, 180, 255, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            });
        }
        requestAnimationFrame(animate);
    }
    init();
    animate();

    // 故障特效
    const style = document.createElement('style');
    style.textContent = `
        @keyframes bgGlitchFlash {
            0% { opacity: 0; }
            20% { opacity: 1; background: linear-gradient(90deg, transparent 30%, rgba(0,100,255,0.08) 30.5%, transparent 31%); }
            40% { opacity: 0; }
            60% { opacity: 1; background: linear-gradient(0deg, transparent 60%, rgba(0,200,255,0.05) 60.5%, transparent 61%); }
            80% { opacity: 0; }
            100% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    function triggerGlitch() {
        glitchEl.style.animation = 'none';
        void glitchEl.offsetWidth;
        glitchEl.style.animation = 'bgGlitchFlash 0.15s steps(2) forwards';
        setTimeout(triggerGlitch, 3000 + Math.random() * 5000);
    }
    setTimeout(triggerGlitch, 2000);
})();
