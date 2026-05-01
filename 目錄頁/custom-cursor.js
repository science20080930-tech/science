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
            pointer-events: none;
            z-index: 10000;
            opacity: 0;
            mix-blend-mode: screen;
            transition: opacity 0.16s ease, width 0.14s ease, height 0.14s ease;
            width: 24px;
            height: 24px;
            filter: drop-shadow(0 0 7px rgba(173, 255, 244, 0.95));
        }

        .polaris-cursor.is-visible {
            opacity: 1;
        }

        .polaris-cursor.is-hover {
            width: 28px;
            height: 28px;
        }

        .polaris-cursor.is-down {
            width: 20px;
            height: 20px;
        }

        .polaris-star-core {
            animation: polarisGlow 1.8s ease-in-out infinite;
            transform-origin: 16px 16px;
        }

        @keyframes polarisGlow {
            0%, 100% { opacity: 0.86; transform: scale(0.96); }
            50% { opacity: 1; transform: scale(1.06); }
        }
    `;
    document.head.appendChild(style);

    const cursor = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    cursor.setAttribute('class', 'polaris-cursor');
    cursor.setAttribute('viewBox', '0 0 32 32');
    cursor.setAttribute('aria-hidden', 'true');
    cursor.innerHTML = `
        <defs>
            <radialGradient id="starCore" cx="50%" cy="50%" r="50%">
                <stop offset="0" stop-color="#ffffff"/>
                <stop offset="0.45" stop-color="#ddffff"/>
                <stop offset="0.78" stop-color="#7effe7" stop-opacity="0.82"/>
                <stop offset="1" stop-color="#7effe7" stop-opacity="0"/>
            </radialGradient>
        </defs>
        <g class="polaris-star-core">
            <circle cx="16" cy="16" r="10" fill="url(#starCore)" opacity="0.72"/>
            <path d="M16 1.5 L18.3 13.7 L30.5 16 L18.3 18.3 L16 30.5 L13.7 18.3 L1.5 16 L13.7 13.7 Z" fill="#ffffff"/>
            <path d="M16 7.5 L17.6 14.4 L24.5 16 L17.6 17.6 L16 24.5 L14.4 17.6 L7.5 16 L14.4 14.4 Z" fill="#76ffe2" opacity="0.9"/>
            <circle cx="16" cy="16" r="2.1" fill="#ffffff"/>
        </g>
    `;

    document.body.appendChild(cursor);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    function moveCursor(event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
        cursor.classList.add('is-visible');
    }

    function animateCursor() {
        cursor.style.transform = `translate(${mouseX - 16}px, ${mouseY - 16}px)`;
        requestAnimationFrame(animateCursor);
    }

    function setHoverState(event) {
        const target = event.target.closest('a, button, [role="button"], input, textarea, select, .subject-card, .return-btn');
        cursor.classList.toggle('is-hover', Boolean(target));
    }

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousemove', setHoverState);
    window.addEventListener('mouseenter', () => {
        cursor.classList.add('is-visible');
    });
    window.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-visible');
    });
    window.addEventListener('mousedown', () => cursor.classList.add('is-down'));
    window.addEventListener('mouseup', () => cursor.classList.remove('is-down'));

    animateCursor();
})();
