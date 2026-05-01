(function() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const style = document.createElement('style');
    style.textContent = `
        html, body, a, button, [role="button"] {
            cursor: none !important;
        }

        .custom-cursor,
        .custom-cursor-trail {
            position: fixed;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 10000;
            opacity: 0;
            transform: translate(-50%, -50%);
            transition: opacity 0.2s ease, width 0.18s ease, height 0.18s ease, border-color 0.18s ease, background 0.18s ease;
        }

        .custom-cursor {
            width: 28px;
            height: 28px;
            border: 1px solid var(--accent, #00e5ff);
            border-radius: 50%;
            background:
                linear-gradient(var(--accent, #00e5ff), var(--accent, #00e5ff)) center / 2px 12px no-repeat,
                linear-gradient(90deg, var(--accent, #00e5ff), var(--accent, #00e5ff)) center / 12px 2px no-repeat;
            box-shadow: 0 0 14px color-mix(in srgb, var(--accent, #00e5ff) 70%, transparent);
            mix-blend-mode: screen;
        }

        .custom-cursor-trail {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            border: 1px solid color-mix(in srgb, var(--accent, #00e5ff) 35%, transparent);
            background: radial-gradient(circle, color-mix(in srgb, var(--accent, #00e5ff) 18%, transparent), transparent 65%);
            transition: opacity 0.2s ease, width 0.2s ease, height 0.2s ease;
        }

        .custom-cursor.is-visible,
        .custom-cursor-trail.is-visible {
            opacity: 1;
        }

        .custom-cursor.is-hover {
            width: 38px;
            height: 38px;
            border-color: #ffffff;
            background:
                linear-gradient(#ffffff, #ffffff) center / 2px 16px no-repeat,
                linear-gradient(90deg, #ffffff, #ffffff) center / 16px 2px no-repeat;
        }

        .custom-cursor.is-down {
            width: 22px;
            height: 22px;
        }

        .custom-cursor-trail.is-hover {
            width: 60px;
            height: 60px;
        }
    `;
    document.head.appendChild(style);

    const cursor = document.createElement('div');
    const trail = document.createElement('div');
    cursor.className = 'custom-cursor';
    trail.className = 'custom-cursor-trail';
    document.body.append(trail, cursor);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let trailX = mouseX;
    let trailY = mouseY;

    function moveCursor(event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
        cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        cursor.classList.add('is-visible');
        trail.classList.add('is-visible');
    }

    function animateTrail() {
        trailX += (mouseX - trailX) * 0.18;
        trailY += (mouseY - trailY) * 0.18;
        trail.style.transform = `translate(${trailX}px, ${trailY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animateTrail);
    }

    function setHoverState(event) {
        const target = event.target.closest('a, button, [role="button"], input, textarea, select, .subject-card, .return-btn');
        cursor.classList.toggle('is-hover', Boolean(target));
        trail.classList.toggle('is-hover', Boolean(target));
    }

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousemove', setHoverState);
    window.addEventListener('mouseenter', () => {
        cursor.classList.add('is-visible');
        trail.classList.add('is-visible');
    });
    window.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-visible');
        trail.classList.remove('is-visible');
    });
    window.addEventListener('mousedown', () => cursor.classList.add('is-down'));
    window.addEventListener('mouseup', () => cursor.classList.remove('is-down'));

    animateTrail();
})();
