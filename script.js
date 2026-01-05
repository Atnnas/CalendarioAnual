document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Animate Hero Section on Load
    const tl = gsap.timeline();

    tl.from("header h1", {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
    })
        .from("header p", {
            y: 20,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        }, "-=0.8")
        .from("header .rounded-full", {
            scale: 0.8,
            opacity: 0,
            duration: 1.5,
            ease: "elastic.out(1, 0.5)"
        }, "-=1.0");

    // 2. Center Line Animation
    // The line fills up as we scroll down
    gsap.to(".line-progress", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
            trigger: ".timeline-line",
            start: "top 20%", // Start when top of line hits 80% viewport height
            end: "bottom 80%",
            scrub: 1, // Smooth syncing with scroll
            markers: false
        }
    });

    // 3. Event Cards Animation
    const eventBlocks = document.querySelectorAll(".event-block");

    eventBlocks.forEach((block) => {
        const card = block.querySelector(".event-card");
        const marker = block.querySelector(".date-marker");
        const connector = block.querySelector(".connector-line");

        const isNational = card.classList.contains("national");
        const xOffset = isNational ? -100 : 100; // Slide from left or right

        const blockTl = gsap.timeline({
            scrollTrigger: {
                trigger: block,
                start: "top 80%", // When top of block hits 80% of viewport
                toggleActions: "play none none reverse"
            }
        });

        // Animate Marker Pop
        blockTl.from(marker, {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            ease: "back.out(1.7)"
        })
            // Draw Connector Line
            .to(connector, {
                scaleX: 1,
                duration: 0.4,
                ease: "power2.inOut"
            }, "-=0.2")
            // Slide Card In
            .to(card, {
                x: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out"
            }, "-=0.2");

    }); // End eventBlocks.forEach

    // 4. Mini Calendar Logic
    function generateMiniCalendar(containerId, monthIndex, year, startDay, endDay, type) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Days of week headers
        const days = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
        let html = '<div class="mini-calendar-grid">';

        // Headers
        days.forEach(d => html += `<div class="calendar-day-header">${d}</div>`);

        // Logic to find first day of month
        const firstDay = new Date(year, monthIndex, 1).getDay();
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

        // Empty slots
        for (let i = 0; i < firstDay; i++) {
            html += `<div class="calendar-day empty"></div>`;
        }

        // Days
        for (let i = 1; i <= daysInMonth; i++) {
            let activeClass = '';
            if (i >= startDay && i <= endDay) {
                activeClass = type === 'national' ? 'active-national' : 'active-international';
            }
            html += `<div class="calendar-day ${activeClass}">${i}</div>`;
        }

        html += '</div>';
        container.innerHTML = html;
    }

    // Initialize Calendars
    // Month is 0-indexed (Jan = 0, Sept = 8, Oct = 9)
    generateMiniCalendar('cal-juegos', 0, 2026, 18, 22, 'national');
    generateMiniCalendar('cal-kuma', 4, 2026, 3, 3, 'national'); // Added Copa Kuma
    generateMiniCalendar('cal-kurobi', 5, 2026, 27, 28, 'national'); // Added Copa Kurobi
    generateMiniCalendar('cal-sarchi', 7, 2026, 9, 9, 'national'); // Added Copa Sarchi
    generateMiniCalendar('cal-youth', 8, 2026, 17, 20, 'international');
    generateMiniCalendar('cal-iskf', 9, 2026, 23, 25, 'international'); // Added ISKF event

});
