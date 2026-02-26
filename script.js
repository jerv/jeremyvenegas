// Hero dot grid with mouse parallax + color wave
(function () {
    const canvas = document.getElementById('heroDots');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const spacing = 20;
    const baseRadius = 0.75;
    const parallaxStrength = 12;

    // Zune HD palette
    const colors = [
        { r: 255, g: 78, b: 0 },    // orange
        { r: 236, g: 0, b: 140 },    // pink
        { r: 0, g: 180, b: 216 },    // cyan
    ];

    let dots = [];
    let mouse = { x: -1000, y: -1000 };
    let animFrame;

    // Color wave state — supports multiple concurrent waves
    const waveSpeed = 300;
    const waveThickness = 120;
    let waves = [];

    function createDots() {
        dots = [];
        const rect = canvas.parentElement.getBoundingClientRect();
        const cols = Math.ceil(rect.width / spacing) + 1;
        const rows = Math.ceil(rect.height / spacing) + 1;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const colorChance = Math.random();
                let color;
                let alpha;

                if (colorChance < 0.04) {
                    color = colors[Math.floor(Math.random() * colors.length)];
                    alpha = 0.25 + Math.random() * 0.2;
                } else {
                    color = { r: 255, g: 255, b: 255 };
                    alpha = 0.06 + Math.random() * 0.06;
                }

                dots.push({
                    baseX: col * spacing,
                    baseY: row * spacing,
                    x: col * spacing,
                    y: row * spacing,
                    color,
                    baseColor: { ...color },
                    alpha,
                    baseAlpha: alpha,
                    waveColor: colors[Math.floor(Math.random() * colors.length)],
                });
            }
        }
    }

    function triggerWave(x, y) {
        const rect = canvas.parentElement.getBoundingClientRect();
        const maxRadius = Math.sqrt(rect.width * rect.width + rect.height * rect.height);
        waves.push({
            originX: x,
            originY: y,
            startTime: performance.now(),
            maxRadius: maxRadius,
        });
    }

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.scale(dpr, dpr);
        createDots();
    }

    function draw(timestamp) {
        const rect = canvas.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        ctx.clearRect(0, 0, w, h);

        // Update waves and prune finished ones
        for (let wi = waves.length - 1; wi >= 0; wi--) {
            const wv = waves[wi];
            const elapsed = (timestamp - wv.startTime) / 1000;
            wv.radius = elapsed * waveSpeed;
            if (wv.radius > wv.maxRadius + waveThickness) {
                waves.splice(wi, 1);
            }
        }

        for (let i = 0; i < dots.length; i++) {
            const dot = dots[i];

            // Mouse parallax
            const mdx = mouse.x - dot.baseX;
            const mdy = mouse.y - dot.baseY;
            const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
            const maxDist = 200;

            if (mDist < maxDist) {
                const force = (1 - mDist / maxDist);
                dot.x = dot.baseX - (mdx / mDist) * force * parallaxStrength;
                dot.y = dot.baseY - (mdy / mDist) * force * parallaxStrength;
            } else {
                dot.x = dot.baseX;
                dot.y = dot.baseY;
            }

            // Wave interference — real water physics
            // Each wave contributes a signed value (crest/trough)
            // Overlapping waves sum: crests amplify, crest+trough cancel
            let drawColor = dot.baseColor;
            let drawAlpha = dot.baseAlpha;
            let drawRadius = baseRadius;
            let sumAmplitude = 0;
            let colorR = 0, colorG = 0, colorB = 0;
            let colorWeight = 0;

            for (let wi = 0; wi < waves.length; wi++) {
                const wv = waves[wi];
                const wdx = dot.baseX - wv.originX;
                const wdy = dot.baseY - wv.originY;
                const wDist = Math.sqrt(wdx * wdx + wdy * wdy);
                const distFromFront = wv.radius - wDist;

                if (distFromFront > 0 && distFromFront < waveThickness) {
                    const t = distFromFront / waveThickness;
                    // Signed wave: full sine cycle gives crest then trough
                    const amplitude = Math.sin(t * Math.PI * 2);
                    sumAmplitude += amplitude;

                    // Color banding: front=cyan, middle=pink, back=orange
                    const absAmp = Math.abs(amplitude);
                    let cr, cg, cb;
                    if (t < 0.5) {
                        const blend = t / 0.5;
                        cr = colors[2].r + (colors[1].r - colors[2].r) * blend;
                        cg = colors[2].g + (colors[1].g - colors[2].g) * blend;
                        cb = colors[2].b + (colors[1].b - colors[2].b) * blend;
                    } else {
                        const blend = (t - 0.5) / 0.5;
                        cr = colors[1].r + (colors[0].r - colors[1].r) * blend;
                        cg = colors[1].g + (colors[0].g - colors[1].g) * blend;
                        cb = colors[1].b + (colors[0].b - colors[1].b) * blend;
                    }
                    // Weight color contribution by how strong this wave is here
                    colorR += cr * absAmp;
                    colorG += cg * absAmp;
                    colorB += cb * absAmp;
                    colorWeight += absAmp;
                }
            }

            if (colorWeight > 0) {
                // Constructive interference can push past 1.0 — that's the fun part
                const absSum = Math.min(Math.abs(sumAmplitude), 2.0);
                const intensity = absSum > 1.0
                    ? 1.0 + (absSum - 1.0) * 0.5  // diminishing returns past 1
                    : absSum;

                // Weighted average color from all contributing waves
                const waveColor = {
                    r: Math.round(colorR / colorWeight),
                    g: Math.round(colorG / colorWeight),
                    b: Math.round(colorB / colorWeight),
                };

                const blendAmt = Math.min(intensity, 1.0);
                drawColor = {
                    r: Math.round(dot.baseColor.r + (waveColor.r - dot.baseColor.r) * blendAmt),
                    g: Math.round(dot.baseColor.g + (waveColor.g - dot.baseColor.g) * blendAmt),
                    b: Math.round(dot.baseColor.b + (waveColor.b - dot.baseColor.b) * blendAmt),
                };
                drawAlpha = dot.baseAlpha + intensity * 0.4;
                drawRadius = baseRadius + intensity * 0.8;
            }

            // Mouse proximity boost (on top of wave)
            if (mDist < maxDist) {
                const force = (1 - mDist / maxDist);
                drawAlpha = drawAlpha + force * 0.15;
            }

            ctx.beginPath();
            ctx.arc(dot.x, dot.y, drawRadius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${drawColor.r}, ${drawColor.g}, ${drawColor.b}, ${drawAlpha})`;
            ctx.fill();
        }

        animFrame = requestAnimationFrame(draw);
    }

    // Mouse events
    canvas.parentElement.addEventListener('mousemove', function (e) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.parentElement.addEventListener('click', function (e) {
        const rect = canvas.getBoundingClientRect();
        triggerWave(e.clientX - rect.left, e.clientY - rect.top);
    });

    canvas.parentElement.addEventListener('mouseleave', function () {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    // Touch events — tap to wave, drag for parallax
    canvas.parentElement.addEventListener('touchstart', function (e) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        mouse.x = x;
        mouse.y = y;
        triggerWave(x, y);
    }, { passive: true });

    canvas.parentElement.addEventListener('touchmove', function (e) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        mouse.x = touch.clientX - rect.left;
        mouse.y = touch.clientY - rect.top;
    }, { passive: true });

    canvas.parentElement.addEventListener('touchend', function () {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    window.addEventListener('resize', function () {
        cancelAnimationFrame(animFrame);
        resize();
        draw(performance.now());
    });

    resize();

    // Trigger the initial wave on page load from top-left area
    setTimeout(function () {
        const rect = canvas.parentElement.getBoundingClientRect();
        triggerWave(rect.width * 0.15, rect.height * 0.3);
    }, 400);

    draw(performance.now());
})();
