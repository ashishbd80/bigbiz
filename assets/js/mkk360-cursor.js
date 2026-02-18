// function initCustomCursor() {
//     const cursor = document.getElementById("customCursor");
//     let mouseX = 0, mouseY = 0;
//     let posX = 0, posY = 0;
//     const speed = 0.15;

//     document.addEventListener("mousemove", (e) => {
//         mouseX = e.clientX;
//         mouseY = e.clientY;
//     });

//     function animateCursor() {
//         posX += (mouseX - posX) * speed;
//         posY += (mouseY - posY) * speed;
//         cursor.style.left = `${posX}px`;
//         cursor.style.top = `${posY}px`;
//         requestAnimationFrame(animateCursor);
//     }
//     animateCursor();

//     document.querySelectorAll("[data-cursor-text]").forEach((el) => {
//         el.addEventListener("mouseenter", () => {
//             const text = el.getAttribute("data-cursor-text") || "";
//             const bg = el.getAttribute("data-cursor-bg") ||
//                 getComputedStyle(document.documentElement).getPropertyValue("--cursor-bg");
//             const color = el.getAttribute("data-cursor-text-color") ||
//                 getComputedStyle(document.documentElement).getPropertyValue("--cursor-text-color");
//             const size = el.getAttribute("data-cursor-size") ||
//                 getComputedStyle(document.documentElement).getPropertyValue("--cursor-size");
//             const fontSize = el.getAttribute("data-cursor-font-size") ||
//                 getComputedStyle(document.documentElement).getPropertyValue("--cursor-font-size");

//             cursor.textContent = text;
//             cursor.style.width = size;
//             cursor.style.height = size;
//             cursor.style.backgroundColor = bg;
//             cursor.style.color = color;
//             cursor.style.fontSize = fontSize;
//             cursor.style.transform = "translate(-50%, -50%) scale(1.2)";
//         });

//         el.addEventListener("mouseleave", () => {
//             cursor.textContent = "";
//             cursor.style.width = getComputedStyle(document.documentElement).getPropertyValue("--cursor-size");
//             cursor.style.height = getComputedStyle(document.documentElement).getPropertyValue("--cursor-size");
//             cursor.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--cursor-bg");
//             cursor.style.color = getComputedStyle(document.documentElement).getPropertyValue("--cursor-text-color");
//             cursor.style.fontSize = getComputedStyle(document.documentElement).getPropertyValue("--cursor-font-size");
//             cursor.style.transform = "translate(-50%, -50%) scale(1)";
//         });
//     });
// }
// initCustomCursor();


// document.addEventListener("DOMContentLoaded", () => {
//     const cursor = document.getElementById("customCursor");
//     let mouseX = 0, mouseY = 0, posX = 0, posY = 0, speed = 0.15;

//     // Mouse tracking
//     document.addEventListener("mousemove", e => {
//         mouseX = e.clientX; mouseY = e.clientY;
//     });

//     // Smooth follow
//     (function animate() {
//         posX += (mouseX - posX) * speed;
//         posY += (mouseY - posY) * speed;
//         cursor.style.left = posX + "px";
//         cursor.style.top = posY + "px";
//         requestAnimationFrame(animate);
//     })();

//     // Helper: get attribute or CSS var
//     const getVal = (el, attr, varName) =>
//         el.getAttribute(attr) ||
//         getComputedStyle(document.documentElement).getPropertyValue(varName);

//     // Reset to defaults
//     function reset() {
//         const root = getComputedStyle(document.documentElement);
//         cursor.innerHTML = "";
//         cursor.style.width = root.getPropertyValue("--cursor-size");
//         cursor.style.height = root.getPropertyValue("--cursor-size");
//         cursor.style.fontSize = root.getPropertyValue("--cursor-font-size");
//         cursor.style.backgroundColor = root.getPropertyValue("--cursor-bg");
//         cursor.style.color = root.getPropertyValue("--cursor-text-color");
//         cursor.style.borderRadius = root.getPropertyValue("--cursor-border-radius");
//         cursor.style.mixBlendMode = cursor.getAttribute("data-cursor-blend") || root.getPropertyValue("--cursor-blend");
//         cursor.style.transform = "translate(-50%, -50%) scale(1)";
//     }

//     // Attach hover handlers
//     document.querySelectorAll("[data-cursor-style]").forEach(el => {
//         el.addEventListener("mouseenter", () => {
//             const style = el.getAttribute("data-cursor-style");
//             const size = getVal(el, "data-cursor-size", "--cursor-size");
//             const fsize = getVal(el, "data-cursor-font-size", "--cursor-font-size");
//             const bg = getVal(el, "data-cursor-bg", "--cursor-bg");
//             const color = getVal(el, "data-cursor-text-color", "--cursor-text-color");
//             const blend = getVal(el, "data-cursor-blend", "--cursor-blend");
//             const radius = getVal(el, "data-cursor-border-radius", "--cursor-border-radius");

//             cursor.style.width = size;
//             cursor.style.height = size;
//             cursor.style.fontSize = fsize;
//             cursor.style.backgroundColor = bg;
//             cursor.style.color = color;
//             cursor.style.mixBlendMode = blend;
//             cursor.style.borderRadius = radius;
//             cursor.style.transform = "translate(-50%, -50%) scale(1.2)";
//             cursor.innerHTML = (style === "icon")
//                 ? getVal(el, "data-cursor-icon", "--cursor-icon")
//                 : getVal(el, "data-cursor-text", "--cursor-text");
//         });
//         el.addEventListener("mouseleave", reset);
//     });

//     reset();
// });

document.addEventListener("DOMContentLoaded", () => {
    const cursor = document.getElementById("customCursor");
    let mouseX = 0, mouseY = 0, posX = 0, posY = 0, speed = 0.15;

    document.addEventListener("mousemove", e => {
        mouseX = e.clientX; mouseY = e.clientY;
    });

    (function animate() {
        posX += (mouseX - posX) * speed;
        posY += (mouseY - posY) * speed;
        cursor.style.left = posX + "px";
        cursor.style.top = posY + "px";
        requestAnimationFrame(animate);
    })();

    const getVal = (el, attr, varName) =>
        el.getAttribute(attr) ||
        getComputedStyle(document.documentElement).getPropertyValue(varName);

    function reset() {
        const root = getComputedStyle(document.documentElement);
        cursor.innerHTML = "";
        cursor.style.width = root.getPropertyValue("--cursor-size");
        cursor.style.height = root.getPropertyValue("--cursor-size");
        cursor.style.fontSize = root.getPropertyValue("--cursor-font-size");
        cursor.style.backgroundColor = root.getPropertyValue("--cursor-bg");
        cursor.style.color = root.getPropertyValue("--cursor-text-color");
        cursor.style.borderRadius = root.getPropertyValue("--cursor-border-radius");
        cursor.style.mixBlendMode = root.getPropertyValue("--cursor-blend");
        cursor.style.transform = "translate(-50%, -50%) scale(1)";
        cursor.style.setProperty('--cursor-icon-gap', '0');
    }

    document.querySelectorAll("[data-cursor-style]").forEach(el => {
        el.addEventListener("mouseenter", () => {
            const style = el.getAttribute("data-cursor-style");
            const size = getVal(el, "data-cursor-size", "--cursor-size");
            const fsize = getVal(el, "data-cursor-font-size", "--cursor-font-size");
            const bg = getVal(el, "data-cursor-bg", "--cursor-bg");
            const color = getVal(el, "data-cursor-text-color", "--cursor-text-color");
            const blend = getVal(el, "data-cursor-blend", "--cursor-blend");
            const radius = getVal(el, "data-cursor-border-radius", "--cursor-border-radius");
            const iconGap = el.getAttribute("data-cursor-icon-gap") || "0";

            cursor.style.width = size;
            cursor.style.height = size;
            cursor.style.fontSize = fsize;
            cursor.style.backgroundColor = bg;
            cursor.style.color = color;
            cursor.style.mixBlendMode = blend;
            cursor.style.borderRadius = radius;
            cursor.style.transform = "translate(-50%, -50%) scale(1.2)";
            cursor.style.setProperty('--cursor-icon-gap', iconGap);

            if (style === "icon") {
                const iconHTML = getVal(el, "data-cursor-icon", "--cursor-icon");
                // Wrap icons in a flex container for gap support
                cursor.innerHTML = `<span class="cursor-icon-group">${iconHTML}</span>`;
            } else {
                cursor.innerHTML = getVal(el, "data-cursor-text", "--cursor-text");
            }
        });
        el.addEventListener("mouseleave", reset);
    });

    reset();
});
