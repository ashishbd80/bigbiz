(function ($) {
  'use strict';

  class InfiniteCarousel {
    constructor(selector, options = {}) {
      this.config = {
        itemSpacing: 20,
        scrollSpeed: 50,
        dragSensitivity: 0.8,
        autoplaySpeed: 1,
        animationDuration: 1,
        animationEase: "power2.out",
        direction: "left",
        autoplay: false,
        ...options
      };

      this.carousel = typeof selector === 'string'
        ? document.querySelector(selector)
        : selector;
      this.wrapper = this.carousel?.querySelector('.it-carousel__wrapper');

      if (!this.carousel || !this.wrapper) {
        console.error(`Carousel elements not found for selector: ${selector}`);
        return;
      }

      this.instanceId = this.carousel.id || `it-carousel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      this.carousel.id = this.instanceId;
      this.originalItems = Array.from(this.wrapper.children);

      this.state = {
        isCloned: false,
        lastScrollY: window.scrollY,
        isDragging: false,
        dragStartX: 0,
        dragCurrentX: 0,
        velocity: 0,
        autoplay: this.config.autoplay,
        currentDirection: 1,
        autoplayTween: null
      };

      this.measurements = {
        itemWidth: 0,
        totalWidth: 0
      };

      this.init();
    }

    init() {
      if (!window.gsap || !window.ScrollTrigger) {
        console.error('GSAP and ScrollTrigger are required');
        return;
      }

      this.calculateDimensions();
      this.setupInitialPosition();
      this.bindEvents();
      this.createScrollTrigger();

      if (this.config.autoplay) {
        this.enableAutoplay();
      }

      requestAnimationFrame(() => {
        this.ensureFirstImageVisible();
      });
    }

    ensureFirstImageVisible() {
      const containerRect = this.carousel.getBoundingClientRect();
      if (containerRect.width > 0) {
        const viewportCenter = containerRect.width / 2;
        const firstItemCenter = this.measurements.itemWidth / 2;
        const optimalOffset = firstItemCenter - viewportCenter;
        gsap.set(this.wrapper, { x: optimalOffset });
      }
    }

    calculateDimensions() {
      if (this.originalItems.length === 0) return;
      this.measurements.itemWidth = this.originalItems[0].offsetWidth + this.config.itemSpacing;
      this.measurements.totalWidth = this.originalItems.length * this.measurements.itemWidth;
    }

    setupInitialPosition() {
      gsap.set(this.wrapper, {
        x: 0,
        cursor: 'grab'
      });
    }

    cloneItems() {
      if (this.state.isCloned) return;
      this.state.isCloned = true;
      const clonesBefore = this.originalItems.map(item => item.cloneNode(true));
      const clonesAfter = this.originalItems.map(item => item.cloneNode(true));
      clonesBefore.forEach(clone => this.wrapper.prepend(clone));
      clonesAfter.forEach(clone => this.wrapper.append(clone));
      gsap.set(this.wrapper, { x: -this.measurements.totalWidth });
    }

    handleWrapping() {
      const currentX = gsap.getProperty(this.wrapper, "x");
      const { totalWidth } = this.measurements;
      if (currentX < -2 * totalWidth) {
        gsap.set(this.wrapper, { x: currentX + totalWidth });
      } else if (currentX > 0) {
        gsap.set(this.wrapper, { x: currentX - totalWidth });
      }
    }

    getDirectionMultiplier(scrollDirection) {
      switch (this.config.direction) {
        case "right":
          return scrollDirection * -1;
        case "both":
          if (!this.directionChangeInterval) {
            this.directionChangeInterval = setInterval(() => {
              this.state.currentDirection *= -1;
            }, 3000);
          }
          return this.state.currentDirection;
        case "left":
        default:
          return scrollDirection;
      }
    }

    moveCarousel(distance, duration = this.config.animationDuration) {
      gsap.to(this.wrapper, {
        x: `+=${distance}`,
        duration,
        ease: this.config.animationEase,
        overwrite: 'auto',
        onUpdate: () => this.handleWrapping()
      });
    }

    handleScroll(scrollInfo) {
      this.cloneItems();
      const currentScroll = scrollInfo.scroll();
      const scrollDirection = currentScroll > this.state.lastScrollY ? -1 : 1;
      const finalDirection = this.getDirectionMultiplier(scrollDirection);
      this.state.lastScrollY = currentScroll;
      if (!this.state.isDragging && !this.state.autoplay) {
        this.moveCarousel(finalDirection * this.config.scrollSpeed);
      }
    }

    handleDragStart(e) {
      this.state.isDragging = true;
      this.state.dragStartX = e.clientX;
      this.state.dragCurrentX = e.clientX;
      gsap.set(this.wrapper, { cursor: 'grabbing' });
      gsap.killTweensOf(this.wrapper);
      if (this.state.autoplayTween) {
        this.state.autoplayTween.kill();
      }
      e.preventDefault();
    }

    handleDragMove(e) {
      if (!this.state.isDragging) return;
      const deltaX = (e.clientX - this.state.dragCurrentX) * this.config.dragSensitivity;
      this.state.dragCurrentX = e.clientX;
      this.state.velocity = deltaX;
      this.moveCarousel(deltaX, 0.1);
      e.preventDefault();
    }

    handleDragEnd() {
      if (!this.state.isDragging) return;
      this.state.isDragging = false;
      gsap.set(this.wrapper, { cursor: 'grab' });
      if (Math.abs(this.state.velocity) > 1) {
        this.moveCarousel(this.state.velocity * 10, 2);
      }
      this.state.velocity = 0;
      if (this.config.autoplay) {
        setTimeout(() => {
          this.enableAutoplay();
        }, 1000);
      }
    }

    bindEvents() {
      this.wrapper.addEventListener('mousedown', this.handleDragStart.bind(this));
      document.addEventListener('mousemove', this.handleDragMove.bind(this));
      document.addEventListener('mouseup', this.handleDragEnd.bind(this));

      this.wrapper.addEventListener('touchstart', (e) => {
        this.handleDragStart({
          clientX: e.touches[0].clientX,
          preventDefault: () => e.preventDefault()
        });
      });

      document.addEventListener('touchmove', (e) => {
        this.handleDragMove({
          clientX: e.touches[0].clientX,
          preventDefault: () => e.preventDefault()
        });
      });

      document.addEventListener('touchend', () => {
        this.handleDragEnd();
      });

      this.wrapper.addEventListener('contextmenu', (e) => e.preventDefault());

      window.addEventListener('resize', this.debounce(() => {
        this.calculateDimensions();
      }, 250));

      if (this.config.autoplay) {
        this.carousel.addEventListener('mouseenter', () => {
          if (this.state.autoplayTween) {
            this.state.autoplayTween.pause();
          }
        });
        this.carousel.addEventListener('mouseleave', () => {
          if (this.state.autoplayTween) {
            this.state.autoplayTween.resume();
          }
        });
      }
    }

    createScrollTrigger() {
      ScrollTrigger.create({
        trigger: this.carousel,
        start: "top bottom",
        end: "bottom top",
        onUpdate: this.handleScroll.bind(this)
      });
    }

    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
      };
    }

    enableAutoplay(speed = this.config.autoplaySpeed) {
      if (this.state.autoplayTween) {
        this.state.autoplayTween.kill();
      }
      this.state.autoplay = true;
      this.cloneItems();
      const direction = this.config.direction === "right" ? 1 : -1;
      const distance = direction * this.measurements.totalWidth;
      this.state.autoplayTween = gsap.to(this.wrapper, {
        x: `+=${distance}`,
        duration: this.measurements.totalWidth / (speed * 100),
        ease: "none",
        repeat: -1,
        onUpdate: () => this.handleWrapping()
      });
      return this.state.autoplayTween;
    }

    disableAutoplay() {
      this.state.autoplay = false;
      if (this.state.autoplayTween) {
        this.state.autoplayTween.kill();
        this.state.autoplayTween = null;
      }
    }

    toggleAutoplay() {
      if (this.state.autoplay) {
        this.disableAutoplay();
      } else {
        this.enableAutoplay();
      }
    }

    changeDirection(newDirection) {
      this.config.direction = newDirection;
      if (this.state.autoplay) {
        this.enableAutoplay();
      }
    }

    destroy() {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === this.carousel) {
          trigger.kill();
        }
      });
      gsap.killTweensOf(this.wrapper);
      if (this.state.autoplayTween) {
        this.state.autoplayTween.kill();
      }
      if (this.directionChangeInterval) {
        clearInterval(this.directionChangeInterval);
      }
    }
  }

  gsap.registerPlugin(ScrollTrigger);

  class CarouselManager {
    constructor() {
      this.carousels = new Map();
      this.defaultOptions = {
        itemSpacing: 20,
        scrollSpeed: 50,
        dragSensitivity: 0.8,
        animationDuration: 1,
        animationEase: "power2.out",
        direction: "left",
        autoplay: false,
        autoplaySpeed: 1
      };
    }

    parseDataAttributes(element) {
      const dataOptions = {};
      const scrollSpeed = element.getAttribute('data-scroll-speed');
      if (scrollSpeed) dataOptions.scrollSpeed = parseInt(scrollSpeed, 10);
      const direction = element.getAttribute('data-direction');
      if (direction && ['left', 'right', 'both'].includes(direction)) dataOptions.direction = direction;
      const autoplay = element.getAttribute('data-autoplay');
      if (autoplay !== null) dataOptions.autoplay = autoplay === 'true' || autoplay === '';
      const autoplaySpeed = element.getAttribute('data-autoplay-speed');
      if (autoplaySpeed) dataOptions.autoplaySpeed = parseFloat(autoplaySpeed);
      const itemSpacing = element.getAttribute('data-item-spacing');
      if (itemSpacing) dataOptions.itemSpacing = parseInt(itemSpacing, 10);
      const dragSensitivity = element.getAttribute('data-drag-sensitivity');
      if (dragSensitivity) dataOptions.dragSensitivity = parseFloat(dragSensitivity);
      const animationDuration = element.getAttribute('data-animation-duration');
      if (animationDuration) dataOptions.animationDuration = parseFloat(animationDuration);
      return dataOptions;
    }

    initializeAll(selector = '.it-carousel', options = {}) {
      const carouselElements = document.querySelectorAll(selector);
      const baseOptions = { ...this.defaultOptions, ...options };
      carouselElements.forEach((element, index) => {
        const dataOptions = this.parseDataAttributes(element);
        const mergedOptions = { ...baseOptions, ...dataOptions };
        const carouselId = element.id || `it-carousel-${index}`;
        if (!this.validateCarouselStructure(element)) {
          this.createCarouselStructure(element, carouselId);
        }
        const carousel = new InfiniteCarousel(`#${carouselId}`, mergedOptions);
        this.carousels.set(carouselId, carousel);
      });
      return this.carousels;
    }

    validateCarouselStructure(element) {
      // Accepts any .it-carousel__wrapper (not --wrapper)
      return !!element.querySelector('.it-carousel__wrapper');
    }

    createCarouselStructure(element, carouselId) {
      if (!element.id) element.id = carouselId;
      let wrapper = element.querySelector('.it-carousel__wrapper');
      if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.className = 'it-carousel__wrapper';
        while (element.firstChild) wrapper.appendChild(element.firstChild);
        element.appendChild(wrapper);
      }
      if (!element.classList.contains('it-carousel')) element.classList.add('it-carousel');
    }

    getCarousel(carouselId) {
      return this.carousels.get(carouselId);
    }

    enableAutoplayAll(speed = 1) {
      this.carousels.forEach(carousel => {
        // Only enable if config.autoplay is true
        if (carousel.config.autoplay) carousel.enableAutoplay(speed);
      });
    }

    disableAutoplayAll() {
      this.carousels.forEach(carousel => {
        if (carousel.config.autoplay) carousel.disableAutoplay();
      });
    }

    toggleAutoplayAll() {
      this.carousels.forEach(carousel => {
        if (carousel.config.autoplay) carousel.toggleAutoplay();
      });
    }

    changeDirectionAll(direction) {
      this.carousels.forEach(carousel => {
        carousel.changeDirection(direction);
      });
    }

    destroyAll() {
      this.carousels.forEach(carousel => {
        carousel.destroy();
      });
      this.carousels.clear();
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const carouselManager = new CarouselManager();
    carouselManager.initializeAll();

    // Pause/resume only carousels with autoplay enabled
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        carouselManager.disableAutoplayAll();
      } else {
        carouselManager.enableAutoplayAll();
      }
    });

    window.carouselManager = carouselManager;
  });
})(window.jQuery || undefined);
