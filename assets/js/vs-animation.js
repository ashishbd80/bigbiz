/**
 * Enhanced GSAP ScrollTrigger Animation System
 * Supports: fade-in-up, fade-in-down, fade-in-left, fade-in-right, 
 * zoom-in, zoom-out, slide-up, slide-down, slide-left, slide-right,
 * rotate-in, flip-x, flip-y, bounce-in
 */

// Animation configurations
const animationConfigs = {
    'vs-fade-in-up': {
        initial: { opacity: 0, y: 60, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 }
    },
    'vs-fade-in-down': {
        initial: { opacity: 0, y: -60, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 }
    },
    'vs-fade-in-left': {
        initial: { opacity: 0, x: -60, scale: 0.95 },
        animate: { opacity: 1, x: 0, scale: 1 }
    },
    'vs-fade-in-right': {
        initial: { opacity: 0, x: 60, scale: 0.95 },
        animate: { opacity: 1, x: 0, scale: 1 }
    },
    'vs-zoom-in': {
        initial: { opacity: 0, scale: 0.5 },
        animate: { opacity: 1, scale: 1 }
    },
    'vs-zoom-out': {
        initial: { opacity: 0, scale: 1.5 },
        animate: { opacity: 1, scale: 1 }
    },
    'vs-slide-up': {
        initial: { y: 100, opacity: 0.8 },
        animate: { y: 0, opacity: 1 }
    },
    'vs-slide-down': {
        initial: { y: -100, opacity: 0.8 },
        animate: { y: 0, opacity: 1 }
    },
    'vs-slide-left': {
        initial: { x: -100, opacity: 0.8 },
        animate: { x: 0, opacity: 1 }
    },
    'vs-slide-right': {
        initial: { x: 100, opacity: 0.8 },
        animate: { x: 0, opacity: 1 }
    },
    'vs-rotate-in': {
        initial: { opacity: 0, rotation: -180, scale: 0.5 },
        animate: { opacity: 1, rotation: 0, scale: 1 }
    },
    'vs-flip-x': {
        initial: { opacity: 0, rotationX: -90, transformPerspective: 1000 },
        animate: { opacity: 1, rotationX: 0 }
    },
    'vs-flip-y': {
        initial: { opacity: 0, rotationY: -90, transformPerspective: 1000 },
        animate: { opacity: 1, rotationY: 0 }
    },
    'vs-bounce-in': {
        initial: { opacity: 0, scale: 0.3, y: 50 },
        animate: { opacity: 1, scale: 1, y: 0 }
    },
    'vs-elastic-in': {
        initial: { opacity: 0, scale: 0, rotation: -180 },
        animate: { opacity: 1, scale: 1, rotation: 0 }
    },
    'vs-blur-in': {
        initial: { opacity: 0, filter: 'blur(10px)', scale: 1.1 },
        animate: { opacity: 1, filter: 'blur(0px)', scale: 1 }
    }
};

// Initialize all animation classes
Object.keys(animationConfigs).forEach(className => {
    const elements = document.querySelectorAll(`.${className}`);

    if (elements.length === 0) return;

    // Set initial states
    elements.forEach(item => {
        const config = animationConfigs[className];
        const initialState = { ...config.initial };

        // Override with custom data attributes
        if (item.dataset.scale !== undefined) {
            initialState.scale = parseFloat(item.dataset.scale);
        }
        if (item.dataset.xPosition !== undefined) {
            initialState.x = parseFloat(item.dataset.xPosition);
        }
        if (item.dataset.yPosition !== undefined) {
            initialState.y = parseFloat(item.dataset.yPosition);
        }
        if (item.dataset.rotation !== undefined) {
            initialState.rotation = parseFloat(item.dataset.rotation);
        }

        gsap.set(item, initialState);
    });

    // Create ScrollTrigger batch animation
    ScrollTrigger.batch(`.${className}`, {
        start: "top 95%",
        once: false,
        interval: 0.1,

        onEnter: batch => {
            batch.forEach(item => {
                const config = animationConfigs[className];
                const delay = parseFloat(item.dataset.delay) || 0;
                const duration = parseFloat(item.dataset.duration) || 0.6;
                let ease = item.dataset.ease || "power2.out";

                // Special eases for specific animations
                if (className === 'vs-bounce-in') {
                    ease = item.dataset.ease || "back.out(1.7)";
                } else if (className === 'vs-elastic-in') {
                    ease = item.dataset.ease || "elastic.out(1, 0.5)";
                }

                const animateState = { ...config.animate };

                // Override with custom data attributes for final state
                if (item.dataset.finalX !== undefined) {
                    animateState.x = parseFloat(item.dataset.finalX);
                }
                if (item.dataset.finalY !== undefined) {
                    animateState.y = parseFloat(item.dataset.finalY);
                }

                gsap.to(item, {
                    ...animateState,
                    duration: duration,
                    delay: delay,
                    ease: ease
                });
            });
        },

        onLeaveBack: batch => {
            batch.forEach(item => {
                const config = animationConfigs[className];
                const delay = parseFloat(item.dataset.delay) || 0;
                const duration = parseFloat(item.dataset.duration) || 0.4;
                const ease = item.dataset.ease || "power2.in";

                const resetState = { ...config.initial };

                // Override with custom data attributes
                if (item.dataset.scale !== undefined) {
                    resetState.scale = parseFloat(item.dataset.scale);
                }
                if (item.dataset.xPosition !== undefined) {
                    resetState.x = parseFloat(item.dataset.xPosition);
                }
                if (item.dataset.yPosition !== undefined) {
                    resetState.y = parseFloat(item.dataset.yPosition);
                }
                if (item.dataset.rotation !== undefined) {
                    resetState.rotation = parseFloat(item.dataset.rotation);
                }

                gsap.to(item, {
                    ...resetState,
                    duration: duration,
                    delay: delay,
                    ease: ease
                });
            });
        }
    });
});

// Stagger animation utility for groups
function createStaggerAnimation(selector, staggerAmount = 0.1) {
    ScrollTrigger.batch(selector, {
        start: "top 95%",
        once: false,

        onEnter: batch => {
            gsap.fromTo(batch,
                { opacity: 0, y: 60, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    ease: "power2.out",
                    stagger: staggerAmount
                }
            );
        },

        onLeaveBack: batch => {
            gsap.to(batch, {
                opacity: 0,
                y: 60,
                scale: 0.95,
                duration: 0.4,
                ease: "power2.in",
                stagger: staggerAmount
            });
        }
    });
}

// Advanced morphing animation
function createMorphAnimation(selector) {
    ScrollTrigger.batch(selector, {
        start: "top 95%",
        once: false,

        onEnter: batch => {
            batch.forEach(item => {
                gsap.fromTo(item,
                    {
                        opacity: 0,
                        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)"
                    },
                    {
                        opacity: 1,
                        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                        duration: 0.8,
                        ease: "power2.out"
                    }
                );
            });
        }
    });
}
