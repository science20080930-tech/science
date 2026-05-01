(function() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const style = document.createElement('style');
    style.textContent = `
        html, body, a, button, [role="button"] {
            cursor: none !important;
        }

        .polaris-cursor,
        .polaris-tail {
            position: fixed;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 10000;
            opacity: 0;
            mix-blend-mode: screen;
            transition: opacity 0.16s ease, width 0.14s ease, height 0.14s ease;
        }

        .polaris-cursor {
            width: 24px;
            height: 24px;
            filter: drop-shadow(0 0 7px rgba(173, 255, 244, 0.95));
        }

        .polaris-tail {
            width: 82px;
            height: 42px;
            filter: blur(1.6px);
            z-index: 9999;
        }

        .polaris-cursor.is-visible,
        .polaris-tail.is-visible {
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

        .polaris-tail.is-hover {
            width: 92px;
            height: 48px;
        }

        .polaris-star-core {
            animation: polarisGlow 1.8s ease-in-out infinite;
            transform-origin: 16px 16px;
        }

        .polaris-tail-a {
            animation: tailWaveA 2.5s ease-in-out infinite;
        }

        .polaris-tail-b {
            animation: tailWaveB 3.1s ease-in-out infinite;
        }

        @keyframes polarisGlow {
            0%, 100% { opacity: 0.86; transform: scale(0.96); }
            50% { opacity: 1; transform: scale(1.06); }
        }

        @keyframes tailWaveA {
            0%, 100% { transform: translateY(0) scaleY(1); opacity: 0.72; }
            50% { transform: translateY(-2px) scaleY(1.16); opacity: 0.94; }
        }

        @keyframes tailWaveB {
            0%, 100% { transform: translateY(1px) scaleY(0.96); opacity: 0.5; }
            50% { transform: translateY(3px) scaleY(1.08); opacity: 0.78; }
        }
    `;
    document.head.appendChild(style);

    const tail = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    tail.setAttribute('class', 'polaris-tail');
    tail.setAttribute('viewBox', '0 0 82 42');
    tail.setAttribute('aria-hidden', 'true');
    tail.innerHTML = `
        <defs>
            <linearGradient id="tailGreen" x1="0" y1="19" x2="82" y2="19" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="#3dffc2" stop-opacity="0"/>
                <stop offset="0.28" stop-color="#3dffc2" stop-opacity="0.58"/>
                <stop offset="0.62" stop-color="#62dcff" stop-opacity="0.42"/>
                <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
            </linearGradient>
            <linearGradient id="tailViolet" x1="0" y1="25" x2="82" y2="25" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="#61ffd8" stop-opacity="0"/>
                <stop offset="0.38" stop-color="#66eaff" stop-opacity="0.36"/>
                <stop offset="0.72" stop-color="#b889ff" stop-opacity="0.46"/>
                <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
            </linearGradient>
        </defs>
        <path class="polaris-tail-a" d="M2 23 C18 6, 31 32, 46 17 C57 6, 66 15, 80 20 C63 22, 54 36, 38 32 C24 29, 15 20, 2 23 Z" fill="url(#tailGreen)"/>
        <path class="polaris-tail-b" d="M0 30 C17 18, 29 35, 44 27 C57 20, 66 28, 82 14 C70 36, 55 40, 38 37 C22 34, 13 27, 0 30 Z" fill="url(#tailViolet)"/>
    `;

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

    document.body.append(tail, cursor);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let tailX = mouseX;
    let tailY = mouseY;

    function moveCursor(event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
        cursor.classList.add('is-visible');
        tail.classList.add('is-visible');
    }

    function animateCursor() {
        tailX += (mouseX - tailX) * 0.22;
        tailY += (mouseY - tailY) * 0.22;
        cursor.style.transform = `translate(${mouseX - 16}px, ${mouseY - 16}px)`;
        tail.style.transform = `translate(${tailX - 74}px, ${tailY - 21}px)`;
        requestAnimationFrame(animateCursor);
    }

    function setHoverState(event) {
        const target = event.target.closest('a, button, [role="button"], input, textarea, select, .subject-card, .return-btn');
        cursor.classList.toggle('is-hover', Boolean(target));
        tail.classList.toggle('is-hover', Boolean(target));
    }

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousemove', setHoverState);
    window.addEventListener('mouseenter', () => {
        cursor.classList.add('is-visible');
        tail.classList.add('is-visible');
    });
    window.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-visible');
        tail.classList.remove('is-visible');
    });
    window.addEventListener('mousedown', () => cursor.classList.add('is-down'));
    window.addEventListener('mouseup', () => cursor.classList.remove('is-down'));

    animateCursor();
})();
