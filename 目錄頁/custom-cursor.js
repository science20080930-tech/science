(function() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const style = document.createElement('style');
    style.textContent = `
        html, body, a, button, [role="button"] {
            cursor: none !important;
        }

        .polaris-cursor {
            position: fixed;
            top: 0;
            left: 0;
            width: 150px;
            height: 104px;
            pointer-events: none;
            z-index: 10000;
            opacity: 0;
            transform: translate(-76px, -52px);
            transform-origin: 76px 52px;
            transition: opacity 0.18s ease, width 0.18s ease, height 0.18s ease;
            mix-blend-mode: screen;
        }

        .polaris-cursor.is-visible {
            opacity: 1;
        }

        .polaris-cursor.is-hover {
            width: 172px;
            height: 120px;
        }

        .polaris-cursor.is-down {
            width: 132px;
            height: 92px;
        }

        .polaris-ribbon-a {
            animation: auroraDriftA 2.8s ease-in-out infinite;
        }

        .polaris-ribbon-b {
            animation: auroraDriftB 3.4s ease-in-out infinite;
        }

        .polaris-star {
            animation: polarisPulse 1.75s ease-in-out infinite;
            transform-origin: 112px 50px;
        }

        .polaris-spark {
            animation: sparkBlink 2.2s ease-in-out infinite;
        }

        .polaris-spark:nth-of-type(2n) {
            animation-delay: -0.9s;
        }

        @keyframes polarisPulse {
            0%, 100% { transform: scale(0.94); filter: brightness(1); }
            50% { transform: scale(1.08); filter: brightness(1.35); }
        }

        @keyframes auroraDriftA {
            0%, 100% { transform: translate(0, 0) scaleY(1); opacity: 0.72; }
            50% { transform: translate(-4px, -3px) scaleY(1.18); opacity: 0.95; }
        }

        @keyframes auroraDriftB {
            0%, 100% { transform: translate(0, 0) scaleY(1); opacity: 0.52; }
            50% { transform: translate(3px, 4px) scaleY(0.9); opacity: 0.82; }
        }

        @keyframes sparkBlink {
            0%, 100% { opacity: 0.22; transform: scale(0.8); }
            50% { opacity: 0.9; transform: scale(1.25); }
        }
    `;
    document.head.appendChild(style);

    const cursor = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    cursor.setAttribute('class', 'polaris-cursor');
    cursor.setAttribute('viewBox', '0 0 150 104');
    cursor.setAttribute('aria-hidden', 'true');
    cursor.innerHTML = `
        <defs>
            <linearGradient id="auroraGreen" x1="8" y1="48" x2="122" y2="48" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="#35ffc3" stop-opacity="0"/>
                <stop offset="0.28" stop-color="#35ffc3" stop-opacity="0.72"/>
                <stop offset="0.58" stop-color="#66d9ff" stop-opacity="0.58"/>
                <stop offset="1" stop-color="#b88cff" stop-opacity="0"/>
            </linearGradient>
            <linearGradient id="auroraViolet" x1="0" y1="58" x2="126" y2="58" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="#7dffda" stop-opacity="0"/>
                <stop offset="0.36" stop-color="#69f7ff" stop-opacity="0.54"/>
                <stop offset="0.72" stop-color="#bb79ff" stop-opacity="0.58"/>
                <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
            </linearGradient>
            <radialGradient id="starCore" cx="50%" cy="50%" r="50%">
                <stop offset="0" stop-color="#ffffff"/>
                <stop offset="0.34" stop-color="#dffcff"/>
                <stop offset="0.72" stop-color="#83fff0" stop-opacity="0.9"/>
                <stop offset="1" stop-color="#83fff0" stop-opacity="0"/>
            </radialGradient>
            <filter id="softGlow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="4.5" result="blur"/>
                <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
            <filter id="ribbonBlur" x="-30%" y="-80%" width="170%" height="260%">
                <feGaussianBlur stdDeviation="3"/>
            </filter>
        </defs>

        <g filter="url(#ribbonBlur)">
            <path class="polaris-ribbon-a" d="M4 62 C24 28, 42 77, 62 43 C78 16, 94 34, 118 46 C94 50, 80 76, 58 70 C38 65, 26 51, 4 62 Z" fill="url(#auroraGreen)"/>
            <path class="polaris-ribbon-b" d="M0 72 C22 50, 36 80, 58 61 C80 42, 96 58, 126 35 C106 72, 86 86, 62 82 C38 78, 23 65, 0 72 Z" fill="url(#auroraViolet)"/>
        </g>

        <g class="polaris-spark" filter="url(#softGlow)">
            <circle cx="35" cy="33" r="1.4" fill="#ffffff"/>
            <circle cx="52" cy="80" r="1.2" fill="#a7fff0"/>
            <circle cx="72" cy="22" r="1.1" fill="#d9f7ff"/>
        </g>

        <g class="polaris-star" filter="url(#softGlow)">
            <circle cx="112" cy="50" r="18" fill="url(#starCore)" opacity="0.72"/>
            <path d="M112 12 L117.8 42.2 L148 50 L117.8 57.8 L112 88 L106.2 57.8 L76 50 L106.2 42.2 Z" fill="#ffffff"/>
            <path d="M112 28 L116 46 L134 50 L116 54 L112 72 L108 54 L90 50 L108 46 Z" fill="#7dffe3" opacity="0.88"/>
            <circle cx="112" cy="50" r="4.8" fill="#ffffff"/>
        </g>
    `;
    document.body.appendChild(cursor);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let renderX = mouseX;
    let renderY = mouseY;
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
        cursor.classList.add('is-visible');
    }

    function animateCursor() {
        renderX += (mouseX - renderX) * 0.38;
        renderY += (mouseY - renderY) * 0.38;
        cursor.style.transform = `translate(${renderX - 112}px, ${renderY - 50}px) rotate(${angle}deg)`;
        requestAnimationFrame(animateCursor);
    }

    function setHoverState(event) {
        const target = event.target.closest('a, button, [role="button"], input, textarea, select, .subject-card, .return-btn');
        cursor.classList.toggle('is-hover', Boolean(target));
    }

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousemove', setHoverState);
    window.addEventListener('mouseenter', () => cursor.classList.add('is-visible'));
    window.addEventListener('mouseleave', () => cursor.classList.remove('is-visible'));
    window.addEventListener('mousedown', () => cursor.classList.add('is-down'));
    window.addEventListener('mouseup', () => cursor.classList.remove('is-down'));

    animateCursor();
})();
