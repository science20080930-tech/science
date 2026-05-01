(function() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const style = document.createElement('style');
    style.textContent = `
        html, body, a, button, [role="button"] {
            cursor: none !important;
        }

        .custom-cursor,
        .custom-cursor-trail,
        .custom-cursor-aurora {
            position: fixed;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 10000;
            opacity: 0;
            transform: translate(-50%, -50%);
            transition: opacity 0.2s ease, width 0.18s ease, height 0.18s ease;
        }

        .custom-cursor {
            width: 34px;
            height: 34px;
            mix-blend-mode: screen;
            filter: drop-shadow(0 0 12px rgba(142, 255, 236, 0.95));
        }

        .custom-cursor::before,
        .custom-cursor::after {
            content: "";
            position: absolute;
            inset: 50% auto auto 50%;
            transform: translate(-50%, -50%);
            border-radius: 999px;
        }

        .custom-cursor::before {
            width: 6px;
            height: 6px;
            background: #ffffff;
            box-shadow:
                0 0 8px #ffffff,
                0 0 18px #92fff0,
                0 0 34px #62d9ff;
        }

        .custom-cursor::after {
            width: 34px;
            height: 34px;
            background:
                linear-gradient(#ffffff, #ffffff) center / 2px 34px no-repeat,
                linear-gradient(90deg, #ffffff, #ffffff) center / 34px 2px no-repeat,
                linear-gradient(45deg, transparent 42%, rgba(157, 255, 234, 0.9) 48%, #ffffff 50%, rgba(169, 199, 255, 0.9) 52%, transparent 58%) center / 24px 24px no-repeat,
                linear-gradient(-45deg, transparent 42%, rgba(180, 139, 255, 0.85) 48%, #ffffff 50%, rgba(91, 255, 190, 0.85) 52%, transparent 58%) center / 24px 24px no-repeat;
            animation: polarStarPulse 1.8s ease-in-out infinite;
        }

        .custom-cursor-trail {
            width: 72px;
            height: 72px;
            border-radius: 50%;
            background:
                radial-gradient(circle, rgba(255, 255, 255, 0.35), transparent 18%),
                conic-gradient(from 140deg, rgba(69, 255, 180, 0.38), rgba(80, 190, 255, 0.24), rgba(188, 112, 255, 0.34), rgba(69, 255, 180, 0.38));
            filter: blur(2px);
            transition: opacity 0.2s ease, width 0.2s ease, height 0.2s ease;
        }

        .custom-cursor.is-visible,
        .custom-cursor-trail.is-visible,
        .custom-cursor-aurora.is-visible {
            opacity: 1;
        }

        .custom-cursor.is-hover {
            width: 42px;
            height: 42px;
        }

        .custom-cursor.is-down {
            width: 28px;
            height: 28px;
        }

        .custom-cursor-trail.is-hover {
            width: 92px;
            height: 92px;
        }

        .custom-cursor-aurora {
            width: 92px;
            height: 34px;
            border-radius: 999px 12px 999px 12px;
            background:
                linear-gradient(90deg, rgba(86, 255, 190, 0), rgba(86, 255, 190, 0.45), rgba(85, 206, 255, 0.32), rgba(185, 115, 255, 0.28), rgba(185, 115, 255, 0));
            filter: blur(8px);
            mix-blend-mode: screen;
            transform-origin: 78% 50%;
            animation: auroraWave 2.4s ease-in-out infinite;
        }

        @keyframes polarStarPulse {
            0%, 100% { transform: translate(-50%, -50%) scale(0.92) rotate(0deg); opacity: 0.84; }
            50% { transform: translate(-50%, -50%) scale(1.08) rotate(8deg); opacity: 1; }
        }

        @keyframes auroraWave {
            0%, 100% { border-radius: 999px 12px 999px 12px; }
            50% { border-radius: 12px 999px 12px 999px; }
        }
    `;
    document.head.appendChild(style);

    const cursor = document.createElement('div');
    const trail = document.createElement('div');
    const aurora = document.createElement('div');
    cursor.className = 'custom-cursor';
    trail.className = 'custom-cursor-trail';
    aurora.className = 'custom-cursor-aurora';
    document.body.append(aurora, trail, cursor);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let trailX = mouseX;
    let trailY = mouseY;
    let auroraX = mouseX;
    let auroraY = mouseY;
    let lastX = mouseX;
    let lastY = mouseY;
    let angle = 0;

    function moveCursor(event) {
        const dx = event.clientX - lastX;
        const dy = event.clientY - lastY;
        if (Math.abs(dx) + Math.abs(dy) > 0.5) {
            angle = Math.atan2(dy, dx) * 180 / Math.PI;
            lastX = event.clientX;
            lastY = event.clientY;
        }
        mouseX = event.clientX;
        mouseY = event.clientY;
        cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        cursor.classList.add('is-visible');
        trail.classList.add('is-visible');
        aurora.classList.add('is-visible');
    }

    function animateTrail() {
        trailX += (mouseX - trailX) * 0.18;
        trailY += (mouseY - trailY) * 0.18;
        auroraX += (mouseX - auroraX) * 0.1;
        auroraY += (mouseY - auroraY) * 0.1;
        trail.style.transform = `translate(${trailX}px, ${trailY}px) translate(-50%, -50%)`;
        aurora.style.transform = `translate(${auroraX}px, ${auroraY}px) translate(-80%, -50%) rotate(${angle}deg)`;
        requestAnimationFrame(animateTrail);
    }

    function setHoverState(event) {
        const target = event.target.closest('a, button, [role="button"], input, textarea, select, .subject-card, .return-btn');
        cursor.classList.toggle('is-hover', Boolean(target));
        trail.classList.toggle('is-hover', Boolean(target));
        aurora.classList.toggle('is-hover', Boolean(target));
    }

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousemove', setHoverState);
    window.addEventListener('mouseenter', () => {
        cursor.classList.add('is-visible');
        trail.classList.add('is-visible');
        aurora.classList.add('is-visible');
    });
    window.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-visible');
        trail.classList.remove('is-visible');
        aurora.classList.remove('is-visible');
    });
    window.addEventListener('mousedown', () => cursor.classList.add('is-down'));
    window.addEventListener('mouseup', () => cursor.classList.remove('is-down'));

    animateTrail();
})();
