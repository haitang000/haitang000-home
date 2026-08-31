/**
 * Skills Physics Engine — powered by Matter.js
 * Creates a physics sandbox for the skill shapes in the geo-canvas.
 */
(function () {
    // Matter.js module aliases
    const {
        Engine, Render, Runner, Bodies, Body, Composite, Mouse, MouseConstraint,
        Events, Common, Vector
    } = Matter;

    // Wait for loading to finish
    window.addEventListener('loading-finished', () => {
        const canvas = document.querySelector('.geo-canvas');
        if (!canvas) return;

        // --- Configuration ---
        const SKILL_DATA = [
            { label: 'Figma', color: '#3ddc84', textColor: '#0a2e14', shape: 'roundedRect', w: 110, h: 110 },
            { label: 'HTML', color: '#1a1a1a', textColor: '#ffffff', shape: 'roundedRect', w: 110, h: 110 },
            { label: 'Minecraft', color: '#1a1a1a', textColor: '#ffffff', shape: 'roundedRect', w: 210, h: 210, bgImage: 'assets/minecraft.png' },
            { label: 'CSS', color: '#e0e0e0', textColor: '#888888', shape: 'polygon', sides: 5, radius: 58 },
            { label: 'JS', color: '#e8e8e8', textColor: '#4a4a4a', shape: 'roundedRect', w: 110, h: 110 },
            { label: 'GSAP', color: '#3ddc84', textColor: '#0a2e14', shape: 'polygon', sides: 3, radius: 52 },
        ];

        // Clear existing shapes
        canvas.innerHTML = '';

        // Make the canvas a positioning context
        const isMobile = window.innerWidth < 768;
        const scaleFactor = isMobile ? 0.75 : 1;

        canvas.style.position = 'relative';
        canvas.style.overflow = 'hidden';
        canvas.style.cursor = 'grab';
        canvas.style.minHeight = isMobile ? '350px' : '400px';
        canvas.style.touchAction = 'none';

        // Size
        const getCanvasSize = () => ({
            w: canvas.clientWidth,
            h: canvas.clientHeight
        });

        let { w: canvasW, h: canvasH } = getCanvasSize();

        // --- Create Engine ---
        const engine = Engine.create({
            gravity: { x: 0, y: 1.2 }
        });
        const world = engine.world;

        // --- Create invisible Renderer (only for physics, we render with DOM) ---
        const render = Render.create({
            element: canvas,
            engine: engine,
            options: {
                width: canvasW,
                height: canvasH,
                wireframes: false,
                background: 'transparent',
                pixelRatio: window.devicePixelRatio || 1
            }
        });

        // Hide the matter canvas — we use DOM overlays
        render.canvas.style.position = 'absolute';
        render.canvas.style.top = '0';
        render.canvas.style.left = '0';
        render.canvas.style.width = '100%';
        render.canvas.style.height = '100%';
        render.canvas.style.pointerEvents = 'none';
        render.canvas.style.opacity = '0'; // fully invisible, we render DOM instead

        Render.run(render);
        const runner = Runner.create();
        Runner.run(runner, engine);

        // --- Create Walls ---
        const wallThickness = 60;
        const wallOptions = {
            isStatic: true,
            render: { visible: false },
            friction: 0.3,
            restitution: 0.4
        };

        let walls = createWalls(canvasW, canvasH);

        function createWalls(w, h) {
            return [
                // bottom
                Bodies.rectangle(w / 2, h + wallThickness / 2, w + wallThickness * 2, wallThickness, wallOptions),
                // left
                Bodies.rectangle(-wallThickness / 2, h / 2, wallThickness, h * 2, wallOptions),
                // right
                Bodies.rectangle(w + wallThickness / 2, h / 2, wallThickness, h * 2, wallOptions),
            ];
        }

        Composite.add(world, walls);

        // --- Create Skill Bodies + DOM Elements ---
        const skillBodies = [];
        const skillElements = [];

        SKILL_DATA.forEach((skill, i) => {
            // Create DOM element
            const el = document.createElement('div');
            el.className = 'physics-skill-shape';
            el.innerHTML = `<span>${skill.label}</span>`;

            // Style
            el.style.position = 'absolute';
            el.style.display = 'flex';
            el.style.alignItems = 'center';
            el.style.justifyContent = 'center';
            el.style.fontWeight = '700';
            el.style.fontSize = '0.85rem';
            el.style.letterSpacing = '0.5px';
            el.style.textTransform = 'uppercase';
            el.style.pointerEvents = 'none';
            el.style.userSelect = 'none';
            el.style.willChange = 'transform';
            el.style.zIndex = '5';
            el.style.transition = 'box-shadow 0.3s ease';

            if (skill.shape === 'roundedRect') {
                el.style.width = (skill.w * scaleFactor) + 'px';
                el.style.height = (skill.h * scaleFactor) + 'px';
                el.style.borderRadius = (24 * scaleFactor) + 'px';
                el.style.backgroundColor = skill.color;
                el.style.color = skill.textColor;

                if (skill.bgImage) {
                    el.style.backgroundImage = `url('${skill.bgImage}')`;
                    el.style.backgroundSize = 'cover';
                    el.style.backgroundPosition = 'center';
                    el.style.backgroundRepeat = 'no-repeat';
                    el.style.textShadow = '1px 1px 3px rgba(0,0,0,0.8), -1px -1px 3px rgba(0,0,0,0.8)';
                    // Optional: make the text bolder to stand out against background
                    el.style.fontWeight = '900';
                }

                if (skill.color === '#1a1a1a') {
                    el.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
                } else if (skill.color === '#3ddc84') {
                    el.style.boxShadow = '0 12px 40px rgba(61,220,132,0.25)';
                } else {
                    el.style.boxShadow = '0 8px 30px rgba(0,0,0,0.06)';
                }
            } else if (skill.shape === 'polygon') {
                // Triangle rendered via CSS
                const triSize = skill.radius * 2 * scaleFactor;
                el.style.width = triSize + 'px';
                el.style.height = triSize + 'px';
                el.style.backgroundColor = 'transparent';
                el.style.color = skill.textColor;
                el.style.overflow = 'visible';

                // Create triangle SVG overlay
                const svgNS = 'http://www.w3.org/2000/svg';
                const svg = document.createElementNS(svgNS, 'svg');
                svg.setAttribute('width', triSize);
                svg.setAttribute('height', triSize);
                svg.setAttribute('viewBox', `0 0 ${triSize} ${triSize}`);
                svg.style.position = 'absolute';
                svg.style.top = '0';
                svg.style.left = '0';

                const polygon = document.createElementNS(svgNS, 'polygon');
                const cx = triSize / 2;
                const points = `${cx},6 ${triSize - 6},${triSize - 6} 6,${triSize - 6}`;
                polygon.setAttribute('points', points);
                polygon.setAttribute('fill', skill.color);
                polygon.setAttribute('rx', '4');
                svg.appendChild(polygon);
                el.insertBefore(svg, el.firstChild);

                el.querySelector('span').style.position = 'relative';
                el.querySelector('span').style.zIndex = '2';
                el.querySelector('span').style.marginTop = (triSize * 0.3) + 'px';
            }

            canvas.appendChild(el);
            skillElements.push(el);

            // Create physics body
            const startX = Common.random(80, canvasW - 80);
            const startY = Common.random(-300, -50);
            let body;

            if (skill.shape === 'roundedRect') {
                body = Bodies.rectangle(startX, startY, skill.w * scaleFactor, skill.h * scaleFactor, {
                    chamfer: { radius: 24 * scaleFactor },
                    restitution: 0.4,
                    friction: 0.3,
                    frictionAir: 0.02,
                    density: 0.002,
                    render: { visible: false }
                });
            } else {
                body = Bodies.polygon(startX, startY, 3, skill.radius * scaleFactor, {
                    restitution: 0.4,
                    friction: 0.3,
                    frictionAir: 0.02,
                    density: 0.002,
                    render: { visible: false }
                });
            }

            // Add slight initial rotation for visual variety
            Body.setAngle(body, Common.random(-0.3, 0.3));
            // Give initial angular velocity for playful feel
            Body.setAngularVelocity(body, Common.random(-0.05, 0.05));

            skillBodies.push(body);
            Composite.add(world, body);
        });

        // --- Mouse Interaction ---
        const mouse = Mouse.create(canvas);
        // Fix for high-DPI screens
        mouse.pixelRatio = window.devicePixelRatio || 1;

        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.6,
                damping: 0.1,
                render: { visible: false }
            }
        });

        Composite.add(world, mouseConstraint);

        // Update cursor on mouse events
        Events.on(mouseConstraint, 'startdrag', () => {
            canvas.style.cursor = 'grabbing';
        });
        Events.on(mouseConstraint, 'enddrag', () => {
            canvas.style.cursor = 'grab';
        });

        // --- Sync DOM elements with physics bodies ---
        Events.on(engine, 'afterUpdate', () => {
            for (let i = 0; i < skillBodies.length; i++) {
                const body = skillBodies[i];
                const el = skillElements[i];
                const skill = SKILL_DATA[i];

                let elW, elH;
                if (skill.shape === 'roundedRect') {
                    elW = skill.w * scaleFactor;
                    elH = skill.h * scaleFactor;
                } else {
                    elW = skill.radius * 2 * scaleFactor;
                    elH = skill.radius * 2 * scaleFactor;
                }

                const x = body.position.x - elW / 2;
                const y = body.position.y - elH / 2;
                const angle = body.angle;

                el.style.transform = `translate(${x}px, ${y}px) rotate(${angle}rad)`;
            }
        });

        // --- Responsive resize ---
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const { w: newW, h: newH } = getCanvasSize();
                if (newW === canvasW && newH === canvasH) return;

                canvasW = newW;
                canvasH = newH;

                // Update render size
                render.options.width = canvasW;
                render.options.height = canvasH;
                render.canvas.width = canvasW * (window.devicePixelRatio || 1);
                render.canvas.height = canvasH * (window.devicePixelRatio || 1);

                // Recreate walls
                Composite.remove(world, walls);
                walls = createWalls(canvasW, canvasH);
                Composite.add(world, walls);
            }, 200);
        });

        // --- Optional: Gravity tilt on scroll (parallax-like) ---
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            const scrollDelta = window.scrollY - lastScrollY;
            lastScrollY = window.scrollY;

            // Slight horizontal gravity response on scroll
            engine.gravity.x = Math.max(-0.5, Math.min(0.5, scrollDelta * 0.01));

            // Reset gravity.x after a moment
            clearTimeout(window._gravResetTimeout);
            window._gravResetTimeout = setTimeout(() => {
                engine.gravity.x = 0;
            }, 150);
        });

        // --- IntersectionObserver: Pause when off-screen ---
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    runner.enabled = true;
                } else {
                    runner.enabled = false;
                }
            });
        }, { threshold: 0.1 });
        observer.observe(canvas);

        // --- Shake on hover title ---
        const heading = document.querySelector('.skills-heading');
        if (heading) {
            heading.addEventListener('mouseenter', () => {
                // Apply burst force to all bodies
                skillBodies.forEach(body => {
                    Body.applyForce(body, body.position, {
                        x: Common.random(-0.05, 0.05),
                        y: Common.random(-0.08, -0.03)
                    });
                });
            });
        }
    });
})();
