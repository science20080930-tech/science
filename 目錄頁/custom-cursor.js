(function() {
    function detectDeviceType() {
        const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
        const finePointer = window.matchMedia('(pointer: fine)').matches;
        const width = Math.min(window.innerWidth || 0, window.screen?.width || window.innerWidth || 0);
        const userAgent = navigator.userAgent || '';
        const mobileUA = /Android.*Mobile|iPhone|iPod|Windows Phone/i.test(userAgent);
        const tabletUA = /iPad|Tablet|Android(?!.*Mobile)/i.test(userAgent) || (navigator.maxTouchPoints > 1 && /Macintosh/i.test(userAgent));

        if (mobileUA || (coarsePointer && width <= 640)) return 'phone';
        if (tabletUA || (coarsePointer && width <= 1180)) return 'tablet';
        if (finePointer) return 'desktop';
        return coarsePointer ? 'tablet' : 'desktop';
    }

    const deviceType = detectDeviceType();
    const isTouchDevice = deviceType === 'phone' || deviceType === 'tablet';
    document.documentElement.dataset.device = deviceType;
    document.documentElement.classList.add(`device-${deviceType}`);

    function createStarSvg(className, gradientId) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', className);
        svg.setAttribute('viewBox', '0 0 32 32');
        svg.setAttribute('aria-hidden', 'true');
        svg.innerHTML = `
            <defs>
                <radialGradient id="${gradientId}" cx="50%" cy="50%" r="50%">
                    <stop offset="0" stop-color="#ffffff"/>
                    <stop offset="0.45" stop-color="#ddffff"/>
                    <stop offset="0.78" stop-color="#7effe7" stop-opacity="0.82"/>
                    <stop offset="1" stop-color="#7effe7" stop-opacity="0"/>
                </radialGradient>
            </defs>
            <g class="polaris-star-core">
                <circle cx="16" cy="16" r="10" fill="url(#${gradientId})" opacity="0.72"/>
                <path d="M16 1.5 L18.3 13.7 L30.5 16 L18.3 18.3 L16 30.5 L13.7 18.3 L1.5 16 L13.7 13.7 Z" fill="#ffffff"/>
                <path d="M16 7.5 L17.6 14.4 L24.5 16 L17.6 17.6 L16 24.5 L14.4 17.6 L7.5 16 L14.4 14.4 Z" fill="#76ffe2" opacity="0.9"/>
                <circle cx="16" cy="16" r="2.1" fill="#ffffff"/>
            </g>
        `;
        return svg;
    }

    if (isTouchDevice) {
        const touchStyle = document.createElement('style');
        touchStyle.textContent = `
            .polaris-tap {
                position: fixed;
                width: 28px;
                height: 28px;
                pointer-events: none;
                z-index: 10000;
                mix-blend-mode: screen;
                filter: drop-shadow(0 0 10px rgba(173, 255, 244, 0.95));
                animation: polarisTap 0.58s ease-out forwards;
                will-change: transform, opacity;
            }

            .polaris-star-core {
                transform-origin: 16px 16px;
            }

            @keyframes polarisTap {
                0% { opacity: 1; transform: translate(-50%, -50%) scale(0.72); }
                45% { opacity: 0.92; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(1.35); }
            }
        `;
        document.head.appendChild(touchStyle);

        let tapId = 0;
        window.addEventListener('pointerdown', event => {
            if (!event.isPrimary) return;
            const tap = createStarSvg('polaris-tap', `starCoreTap${tapId++}`);
            tap.style.left = `${event.clientX}px`;
            tap.style.top = `${event.clientY}px`;
            document.body.appendChild(tap);
            tap.addEventListener('animationend', () => tap.remove(), { once: true });
        }, { passive: true });

        return;
    }

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

    const cursor = createStarSvg('polaris-cursor', 'starCoreCursor');

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
