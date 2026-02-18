(function ($) {
  'use strict';
  /*=================================
      JS Index Here
  ==================================*/
  /*
    01. On Load Function
    02. Global Swiper Initialisation (with fixes)
    03. Lenis Library Support
    04. Mobile Menu Active
    04. Sticky fix
    06.Set Background Image
    07. Ajax Contact Form
    08. Popup Search Box
    09. Popup Sidebar Canvas Menu
    10. Magnific Popup
    11. Section Position
    12. One Page Nav
    13. WOW.js Animation
    14. Active Menu Item Based On URL
    15. VS Hover Image Card
    16. Sticky Header With GSAP
    17. Animate Counter
    18. Home One Servie Style
    19. Magic Hover
    20. Social Clickable
    21. Back To Top
    22. Fade In Animation
    23. Skill Progressbar
  */
  /*=================================
      JS Index End
  ==================================*/
  /*

  /*---------- 01. On Load Function ----------*/
  $(window).on('load', function () {
    const $preloader = $('.preloader');

    if ($preloader.length) {

      function hidePreloader() {
        gsap.to($preloader, {
          y: '-100%',
          duration: 1.2,
          ease: 'power3.inOut',
          onComplete: () => $preloader.hide(),
        });
      }

      // Animate preloader on load
      hidePreloader();

      // Handle preloader close event
      $('.preloaderCls').on('click', function (e) {
        e.preventDefault();
        hidePreloader();
      });

    }
  });


  /*-------------------------------------------------
   02. Global Swiper Initialisation (with fixes)
 -------------------------------------------------*/
  function getDataAttr(el, attr, fallback, type = 'int') {
    const v = el.dataset[attr];
    if (v === undefined) return fallback;
    if (type === 'bool') return v === 'true';
    if (type === 'float') return parseFloat(v);
    if (type === 'string') return v;
    return parseInt(v, 10);
  }

  /*------------- MAIN -------------*/
  document.querySelectorAll('.vs-carousel').forEach((carousel) => {
    /* basic data-attributes -------------------------------------------------- */
    const slidesXl = getDataAttr(carousel, 'xl', 'auto', 'string'),
      slidesLg = getDataAttr(carousel, 'lg', 'auto', 'string'),
      slidesMd = getDataAttr(carousel, 'md', 'auto', 'string'),
      slidesSm = getDataAttr(carousel, 'sm', 'auto', 'string'),
      slidesXs = getDataAttr(carousel, 'xs', 'auto', 'string');

    const spaceXl = getDataAttr(carousel, 'spaceXl', 30),
      spaceLg = getDataAttr(carousel, 'spaceLg', 24),
      spaceMd = getDataAttr(carousel, 'spaceMd', 20),
      spaceSm = getDataAttr(carousel, 'spaceSm', 15),
      spaceXs = getDataAttr(carousel, 'spaceXs', 10);

    const autoplayDelay = getDataAttr(carousel, 'autoplayDelay', 3000),
      effect = getDataAttr(carousel, 'effect', 'slide', 'string'),
      loopAttr = getDataAttr(carousel, 'loop', null, 'bool'),
      centeredAttr = getDataAttr(carousel, 'centeredSlides', false, 'bool'),
      grabCursor = getDataAttr(carousel, 'grabCursor', false, 'bool'),
      keyboard = getDataAttr(carousel, 'keyboard', false, 'bool'),
      mousewheel = getDataAttr(carousel, 'mousewheel', false, 'bool'),
      lazy = getDataAttr(carousel, 'lazy', false, 'bool'),
      scrollbarAttr = getDataAttr(carousel, 'scrollbar', false, 'bool');

    /* coverflow + creative effect attrs ------------------------------------- */
    const covRotate = getDataAttr(carousel, 'covRotate', 50),
      covStretch = getDataAttr(carousel, 'covStretch', 0),
      covDepth = getDataAttr(carousel, 'covDepth', 100),
      covModifier = getDataAttr(carousel, 'covModifier', 1),
      covShadows = getDataAttr(carousel, 'covShadows', true, 'bool');

    const creativeRotate = getDataAttr(carousel, 'creativeRotate', '0'),
      creativePrevTranslate = getDataAttr(carousel, 'creativePrevTranslate', '0,0,-400', 'string'),
      creativeNextTranslate = getDataAttr(carousel, 'creativeNextTranslate', '100%,0,0', 'string'),
      creativePrevOpacity = getDataAttr(carousel, 'creativePrevOpacity', null, 'float'),
      creativeNextOpacity = getDataAttr(carousel, 'creativeNextOpacity', null, 'float');

    /* nav / pagination selectors -------------------------------------------- */
    const navNext = carousel.dataset.navNext || null,
      navPrev = carousel.dataset.navPrev || null;

    /* pagination element (internal / external) ------------------------------ */
    let paginationEl = null;
    if (carousel.id) {
      paginationEl = document.querySelector(`[data-pagination-connect="${carousel.id}"]`);
    }
    if (!paginationEl) paginationEl = carousel.querySelector('.swiper-pagination');
    if (!paginationEl) {
      document.querySelectorAll('.swiper-pagination:not([data-pagination-connect])')
        .forEach(p => !p.closest('.vs-carousel') && (paginationEl = p));
    }

    // Get custom bullets number if specified
    const customBulletsNumber = paginationEl ?
      getDataAttr(paginationEl, 'paginationConnectBulletsNumber', null) : null;

    const scrollbarEl = carousel.querySelector('.swiper-scrollbar'),
      totalSlides = carousel.querySelectorAll('.swiper-slide').length;

    /* helper: convert 'auto' → 'auto' or numeric string → number ------------ */
    const parseSlideVal = v => (v === 'auto' ? 'auto' : (isNaN(+v) ? 'auto' : +v));

    const parsedSlidesXl = parseSlideVal(slidesXl);
    const enableLoop = loopAttr !== null ? loopAttr :
      totalSlides > (parsedSlidesXl === 'auto' ? 4 : parsedSlidesXl);

    const speed = getDataAttr(carousel, 'speed', 900),
      loopAdditional = getDataAttr(carousel, 'loopAdditionalSlides', 1),
      centeredSlides = centeredAttr,
      centeredSlidesFix = centeredAttr && !enableLoop;

    /* parse translate "x,y,z" to array -------------------------------------- */
    const parseTranslateArr = str => str.split(',')
      .map(v => { v = v.trim(); return v.includes('%') ? v : +v });

    /* build creative-effect config with conditional opacity ----------------- */
    const creativeCfg = {
      prev: {
        translate: parseTranslateArr(creativePrevTranslate),
        rotate: [0, 0, parseFloat(creativeRotate)],
        ...(creativePrevOpacity !== null && { opacity: creativePrevOpacity })
      },
      next: {
        translate: parseTranslateArr(creativeNextTranslate),
        rotate: [0, 0, parseFloat(creativeRotate)],
        ...(creativeNextOpacity !== null && { opacity: creativeNextOpacity })
      }
    };

    /* centring offsets when loop is off ------------------------------------- */
    function getOffsets(swiper) {
      if (!centeredSlidesFix) return { before: 0, after: 0 };
      if (swiper.slides.length === 0) return { before: 0, after: 0 };

      // width of first & last real slides
      const first = swiper.slides[0].getBoundingClientRect().width,
        last = swiper.slides[swiper.slides.length - 1].getBoundingClientRect().width,
        gap = (swiper.width - first) / 2;

      return { before: gap > 0 ? gap : 0, after: (swiper.width - last) / 2 };
    }

    // Custom pagination management
    let customPaginationContainer = null;
    let customBullets = [];

    /* Create custom pagination -------------------------------------------- */
    function createCustomPagination() {
      if (!paginationEl || !customBulletsNumber) return;

      paginationEl.innerHTML = '';
      customBullets = [];

      for (let i = 0; i < customBulletsNumber; i++) {
        const bullet = document.createElement('span');
        bullet.className = 'swiper-pagination-bullet';
        bullet.textContent = i + 1;
        bullet.setAttribute('data-index', i);

        if (i === 0) {
          bullet.classList.add('swiper-pagination-bullet-active');
        }

        paginationEl.appendChild(bullet);
        customBullets.push(bullet);
      }
    }

    /* Update active bullet ------------------------------------------------ */
    function updateActiveBullet(activeIndex) {
      if (!customBulletsNumber || customBullets.length === 0) return;

      // Handle looped slides
      let realIndex = activeIndex;
      if (enableLoop) {
        realIndex = activeIndex % totalSlides;
      }

      // Ensure we don't exceed custom bullets count
      const bulletIndex = Math.min(realIndex, customBulletsNumber - 1);

      customBullets.forEach((bullet, index) => {
        bullet.classList.remove('swiper-pagination-bullet-active');
        if (index === bulletIndex) {
          bullet.classList.add('swiper-pagination-bullet-active');
        }
      });
    }

    /* Handle bullet clicks ----------------------------------------------- */
    function setupBulletClicks(swiper) {
      if (!customBulletsNumber || customBullets.length === 0) return;

      customBullets.forEach((bullet, index) => {
        bullet.addEventListener('click', () => {
          updateActiveBullet(index);
          swiper.slideTo(index);
        });
      });
    }

    /* -------- initialise Swiper ------------------------------------------- */
    const swiper = new Swiper(carousel, {
      speed,
      slidesPerView: parseSlideVal(slidesLg),
      spaceBetween: spaceLg,

      loop: enableLoop,
      loopAdditionalSlides: loopAdditional,
      watchSlidesProgress: true,

      effect,
      centeredSlides,
      centeredSlidesBounds: centeredSlidesFix,
      grabCursor,
      keyboard: keyboard ? { enabled: true } : false,
      mousewheel: mousewheel ? { forceToAxis: true } : false,
      lazy: lazy ? { loadPrevNext: true } : false,

      autoplay: carousel.dataset.autoplay === "false" ? false : {
        delay: autoplayDelay, disableOnInteraction: false
      },

      navigation: {
        nextEl: navNext ? document.querySelector(navNext) : null,
        prevEl: navPrev ? document.querySelector(navPrev) : null
      },

      /* Standard Pagination for non-custom -------------------------------- */
      pagination: (paginationEl && !customBulletsNumber) ? {
        el: paginationEl,
        clickable: true,
        dynamicBullets: true,
        renderBullet: function (index, className) {
          return `<span class="${className}">${index + 1}</span>`;
        }
      } : false,

      scrollbar: scrollbarAttr ? {
        el: scrollbarEl, draggable: true
      } : false,

      coverflowEffect: {
        rotate: covRotate, stretch: covStretch, depth: covDepth,
        modifier: covModifier, slideShadows: covShadows
      },
      creativeEffect: creativeCfg,

      breakpoints: {
        320: { slidesPerView: parseSlideVal(slidesXs), spaceBetween: spaceXs },
        576: { slidesPerView: parseSlideVal(slidesSm), spaceBetween: spaceSm },
        768: { slidesPerView: parseSlideVal(slidesMd), spaceBetween: spaceMd },
        992: { slidesPerView: parseSlideVal(slidesLg), spaceBetween: spaceLg },
        1200: { slidesPerView: parseSlideVal(slidesXl), spaceBetween: spaceXl }
      },

      /* events -------------------------------------------------------------- */
      on: {
        init(sw) {
          if (customBulletsNumber) {
            createCustomPagination();
            setupBulletClicks(sw);
            updateActiveBullet(0);
          }
          applyAnimationDelays(sw);
          if (centeredSlidesFix) {
            const { before, after } = getOffsets(sw);
            sw.params.slidesOffsetBefore = before;
            sw.params.slidesOffsetAfter = after;
            sw.updateSlides();
          }
        },
        slideChange(sw) {
          if (customBulletsNumber) {
            const activeIndex = enableLoop ? sw.realIndex : sw.activeIndex;
            updateActiveBullet(activeIndex);
          }
        },
        slideChangeTransitionStart(sw) {
          applyAnimationDelays(sw);
        },
        imagesReady(sw) {
          sw.update();
          applyAnimationDelays(sw);
          if (customBulletsNumber) {
            const activeIndex = enableLoop ? sw.realIndex : sw.activeIndex;
            updateActiveBullet(activeIndex);
          }
          if (centeredSlidesFix) {
            const { before, after } = getOffsets(sw);
            sw.params.slidesOffsetBefore = before;
            sw.params.slidesOffsetAfter = after;
            sw.updateSlides();
          }
        }
      }
    });

    /* ensure offsets when window resizes ------------------------------------ */
    if (centeredSlidesFix) {
      window.addEventListener('resize', () => {
        const { before, after } = getOffsets(swiper);
        swiper.params.slidesOffsetBefore = before;
        swiper.params.slidesOffsetAfter = after;
        swiper.updateSlides();
      });
    }

    /* keep Swiper fresh after all resources --------------------------------- */
    window.addEventListener('load', () => {
      swiper.update();
      if (customBulletsNumber) {
        const activeIndex = enableLoop ? swiper.realIndex : swiper.activeIndex;
        updateActiveBullet(activeIndex);
      }
    });
  });

  /* in-view animation helper ----------------------------------------------- */
  function applyAnimationDelays(sw) {
    const wrapper = sw.el;
    wrapper.querySelectorAll('.swiper-slide').forEach(slide => {
      slide.querySelectorAll('.vs-swiper-animation').forEach(el => {
        el.style.transition = 'none';
        el.classList.remove('manimated');
        el.style.animationDelay = '';
        void el.offsetWidth;
        el.style.transition = '';
      });
    });

    const active = wrapper.querySelector('.swiper-slide-active:not(.swiper-slide-duplicate)');
    if (!active) return;

    requestAnimationFrame(() => {
      active.querySelectorAll('.vs-swiper-animation').forEach((el, i) => {
        el.style.animationDelay = `${0.1 + i * 0.1}s`;
        void el.offsetWidth;
        el.classList.add('manimated');
      });
    });
  }





  /**************************************
   ***** 03. Lenis Library Support *****
   **************************************/
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);

  const lenis = new Lenis({
    lerp: 0.15,              // higher value = slower, smoother
    touchMultiplier: 0,      // keep slow
    smoothWheel: true,
    smoothTouch: false,
    mouseWheel: false,
    autoResize: true,
    smooth: true,
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    syncTouch: true,
    infinite: false,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 500);    // reduced from 1200 for slower animation
  });

  gsap.ticker.lagSmoothing(0);

  /*---------- 04. Mobile Menu Active ----------*/
  $.fn.vsmobilemenu = function (options) {
    var opt = $.extend(
      {
        menuToggleBtn: '.vs-menu-toggle',
        bodyToggleClass: 'vs-body-visible',
        subMenuClass: 'vs-submenu',
        subMenuParent: 'vs-item-has-children',
        subMenuParentToggle: 'vs-active',
        meanExpandClass: 'vs-mean-expand',
        appendElement: '<span class="vs-mean-expand"></span>',
        subMenuToggleClass: 'vs-open',
        toggleSpeed: 400,
      },
      options
    );

    return this.each(function () {
      var menu = $(this); // Select menu

      // Menu Show & Hide
      function menuToggle() {
        menu.toggleClass(opt.bodyToggleClass);

        // Toggle 'active' class on the menu toggle button
        var toggleBtn = $(opt.menuToggleBtn);
        if (menu.hasClass(opt.bodyToggleClass)) {
          toggleBtn.addClass('active');
        } else {
          toggleBtn.removeClass('active');
        }

        // Collapse all submenus when menu is toggled
        var subMenu = '.' + opt.subMenuClass;
        $(subMenu).each(function () {
          if ($(this).hasClass(opt.subMenuToggleClass)) {
            $(this).removeClass(opt.subMenuToggleClass);
            $(this).css('display', 'none');
            $(this).parent().removeClass(opt.subMenuParentToggle);
          }
        });
      }


      // Class Set Up for every submenu
      menu.find('li').each(function () {
        var submenu = $(this).find('ul');
        submenu.addClass(opt.subMenuClass);
        submenu.css('display', 'none');
        submenu.parent().addClass(opt.subMenuParent);
        submenu.prev('a').append(opt.appendElement);
        submenu.next('a').append(opt.appendElement);
      });

      // Toggle Submenu
      function toggleDropDown($element) {
        if ($($element).next('ul').length > 0) {
          $($element).parent().toggleClass(opt.subMenuParentToggle);
          $($element).next('ul').slideToggle(opt.toggleSpeed);
          $($element).next('ul').toggleClass(opt.subMenuToggleClass);
        } else if ($($element).prev('ul').length > 0) {
          $($element).parent().toggleClass(opt.subMenuParentToggle);
          $($element).prev('ul').slideToggle(opt.toggleSpeed);
          $($element).prev('ul').toggleClass(opt.subMenuToggleClass);
        }
      }

      // Submenu toggle Button
      var expandToggler = '.' + opt.meanExpandClass;
      $(expandToggler).each(function () {
        $(this).on('click', function (e) {
          e.preventDefault();
          toggleDropDown($(this).parent());
        });
      });

      // Menu Show & Hide On Toggle Btn click
      $(opt.menuToggleBtn).each(function () {
        $(this).on('click', function () {
          menuToggle();
        });
      });

      // Hide Menu On out side click
      menu.on('click', function (e) {
        e.stopPropagation();
        menuToggle();
      });

      // Stop Hide full menu on menu click
      menu.find('div').on('click', function (e) {
        e.stopPropagation();
      });
    });
  };

  $('.vs-menu-wrapper').vsmobilemenu();

  // /*---------- 04. Sticky fix ----------*/
  // var lastScrollTop = '';
  // var scrollToTopBtn = '.scrollToTop';

  // function stickyMenu($targetMenu, $toggleClass, $parentClass) {
  //   var st = $(window).scrollTop();
  //   var height = $targetMenu.css('height');
  //   $targetMenu.parent().css('min-height', height);
  //   if ($(window).scrollTop() > 800) {
  //     $targetMenu.parent().addClass($parentClass);

  //     if (st > lastScrollTop) {
  //       $targetMenu.removeClass($toggleClass);
  //     } else {
  //       $targetMenu.addClass($toggleClass);
  //     }
  //   } else {
  //     $targetMenu.parent().css('min-height', '').removeClass($parentClass);
  //     $targetMenu.removeClass($toggleClass);
  //   }
  //   lastScrollTop = st;
  // }
  // $(window).on('scroll', function () {
  //   stickyMenu($('.sticky-active'), 'active', 'will-sticky');
  //   if ($(this).scrollTop() > 500) {
  //     $(scrollToTopBtn).addClass('show');
  //   } else {
  //     $(scrollToTopBtn).removeClass('show');
  //   }
  // });

  /*---------- 06.Set Background Image ----------*/
  if ($('[data-bg-src]').length > 0) {
    $('[data-bg-src]').each(function () {
      var src = $(this).attr('data-bg-src');
      $(this).css('background-image', 'url(' + src + ')');
      $(this).removeAttr('data-bg-src').addClass('background-image');
    });
  }

  /*----------- 07. Ajax Contact Form ----------*/
  function ajaxContactForm(selectForm) {
    var form = selectForm;
    var invalidCls = "is-invalid";
    var $email = '[name="email"]';
    var $validation =
      '[name="name"],[name="email"],[name="phone"],[name="message"]'; // Remove [name="subject"]
    var formMessages = $(selectForm).next(".form-messages");

    function sendContact() {
      var formData = $(form).serialize();
      var valid;
      valid = validateContact();
      if (valid) {
        jQuery
          .ajax({
            url: $(form).attr("action"),
            data: formData,
            type: "POST",
          })
          .done(function (response) {
            // Make sure that the formMessages div has the 'success' class.
            formMessages.removeClass("error");
            formMessages.addClass("success");
            // Set the message text.
            formMessages.text(response);
            // Clear the form.
            $(form + ' input:not([type="submit"]),' + form + " textarea").val(
              ""
            );
          })
          .fail(function (data) {
            // Make sure that the formMessages div has the 'error' class.
            formMessages.removeClass("success");
            formMessages.addClass("error");
            // Set the message text.
            if (data.responseText !== "") {
              formMessages.html(data.responseText);
            } else {
              formMessages.html(
                "Oops! An error occurred and your message could not be sent."
              );
            }
          });
      }
    }

    function validateContact() {
      var valid = true;
      var formInput;
      function unvalid($validation) {
        $validation = $validation.split(",");
        for (var i = 0; i < $validation.length; i++) {
          formInput = form + " " + $validation[i];
          if (!$(formInput).val()) {
            $(formInput).addClass(invalidCls);
            valid = false;
          } else {
            $(formInput).removeClass(invalidCls);
            valid = true;
          }
        }
      }
      unvalid($validation);

      if (
        !$(form + " " + $email).val() ||
        !$(form + " " + $email)
          .val()
          .match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/)
      ) {
        $(form + " " + $email).addClass(invalidCls);
        valid = false;
      } else {
        $(form + " " + $email).removeClass(invalidCls);
        valid = true;
      }
      return valid;
    }

    $(form).on("submit", function (element) {
      element.preventDefault();
      sendContact();
    });
  }
  ajaxContactForm(".vs-form-valid");
  /**************************************
   ***** 08. Popup Search Box *****
   **************************************/
  function popupSarchBox($searchBox, $searchOpen, $searchCls, $toggleCls) {
    $($searchOpen).on('click', function (e) {
      e.preventDefault();
      $($searchBox).addClass($toggleCls);
    });
    $($searchBox).on('click', function (e) {
      e.stopPropagation();
      $($searchBox).removeClass($toggleCls);
    });
    $($searchBox)
      .find('form')
      .on('click', function (e) {
        e.stopPropagation();
        $($searchBox).addClass($toggleCls);
      });
    $($searchCls).on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      $($searchBox).removeClass($toggleCls);
    });
  }
  popupSarchBox(
    '.popup-search-box',
    '.searchBoxTggler',
    '.searchClose',
    'show'
  );

  /**************************************
   ***** 09. Popup Sidebar Canvas Menu *****
   **************************************/
  document.addEventListener('DOMContentLoaded', () => {
    const menuTogglers = document.querySelectorAll('.sideMenuToggler');
    const menuList = document.querySelector('.sidemenu-wrapper');
    const menuContent = menuList.querySelector('.sidemenu-content');
    const menuItems = menuList.querySelectorAll('.sidemenu-item');
    const closeButton = menuList.querySelector('.closeButton');
    const body = document.body;

    // GSAP Timeline
    const tl = gsap.timeline({ paused: true });

    // Menu Animations
    tl.fromTo(
      menuList,
      {
        opacity: 0,
        visibility: 'hidden',
        x: '100%',
      },
      {
        opacity: 1,
        visibility: 'visible',
        x: '0%',
        duration: 0.5,
        ease: 'power3.out',
      }
    )
      .fromTo(
        menuContent,
        {
          opacity: 0,
          x: 20, // Slightly off-screen horizontally
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: 'power3.out',
        },
        '<' // Synchronize with menuList animation
      )
      .fromTo(
        menuItems,
        {
          opacity: 0,
          y: 20, // Slightly below
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.1,
        },
        '<'
      );

    // Open Menu
    const openMenu = () => {
      menuList.classList.add('show');
      tl.play();
    };

    // Close Menu
    const closeMenu = () => {
      tl.reverse().then(() => {
        menuList.classList.remove('show');
      });
    };

    // Toggle Menu
    const toggleMenu = () => {
      if (menuList.classList.contains('show')) {
        closeMenu();
      } else {
        openMenu();
      }
    };

    // Add click event listener to each toggler
    menuTogglers.forEach((menuToggle) => {
      menuToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleMenu();
      });
    });

    // Close menu when clicking outside menu content
    body.addEventListener('click', (event) => {
      if (
        menuList.classList.contains('show') &&
        !menuContent.contains(event.target) &&
        ![...menuTogglers].some((toggler) => toggler.contains(event.target))
      ) {
        closeMenu();
      }
    });

    // Close menu when clicking the close button
    closeButton.addEventListener('click', (event) => {
      event.stopPropagation();
      closeMenu();
    });
  });

  /*----------- 10. Magnific Popup ----------*/
  /* magnificPopup img view */
  $('.popup-image').magnificPopup({
    type: 'image',
    gallery: {
      enabled: true,
    },
  });

  /* magnificPopup video view */
  $('.popup-video').magnificPopup({
    type: 'iframe',
  });

  /*---------- 11. Section Position ----------*/
  // Interger Converter
  function convertInteger(str) {
    return parseInt(str, 10);
  }

  $.fn.sectionPosition = function (mainAttr, posAttr, getPosValue) {
    $(this).each(function () {
      var section = $(this);

      function setPosition() {
        var sectionHeight = Math.floor(section.height() / 2), // Main Height of section
          posValue = convertInteger(section.attr(getPosValue)), // positioning value
          posData = section.attr(mainAttr), // how much to position
          posFor = section.attr(posAttr), // On Which section is for positioning
          parentPT = convertInteger($(posFor).css('padding-top')), // Default Padding of  parent
          parentPB = convertInteger($(posFor).css('padding-bottom')); // Default Padding of  parent

        if (posData === 'top-half') {
          $(posFor).css('padding-bottom', parentPB + sectionHeight + 'px');
          section.css('margin-top', '-' + sectionHeight + 'px');
        } else if (posData === 'bottom-half') {
          $(posFor).css('padding-top', parentPT + sectionHeight + 'px');
          section.css('margin-bottom', '-' + sectionHeight + 'px');
        } else if (posData === 'top') {
          $(posFor).css('padding-bottom', parentPB + posValue + 'px');
          section.css('margin-top', '-' + posValue + 'px');
        } else if (posData === 'bottom') {
          $(posFor).css('padding-top', parentPT + posValue + 'px');
          section.css('margin-bottom', '-' + posValue + 'px');
        }
      }
      setPosition(); // Set Padding On Load
    });
  };

  var postionHandler = '[data-sec-pos]';
  if ($(postionHandler).length) {
    $(postionHandler).imagesLoaded(function () {
      $(postionHandler).sectionPosition(
        'data-sec-pos',
        'data-pos-for',
        'data-pos-amount'
      );
    });
  }

  /*----------- 12. One Page Nav ----------*/
  function onePageNav(element) {
    if ($(element).length > 0) {
      $(element).each(function () {
        $(this)
          .find('a')
          .each(function () {
            $(this).on('click', function (e) {
              var target = $(this.getAttribute('href'));
              if (target.length) {
                e.preventDefault();
                event.preventDefault();
                $('html, body')
                  .stop()
                  .animate(
                    {
                      scrollTop: target.offset().top - 10,
                    },
                    1000
                  );
              }
            });
          });
      });
    }
  }
  onePageNav('.onepage-nav, .main-menu, .vs-mobile-menu');

  /*----------- 13. WOW.js Animation ----------*/
  var wow = new WOW({
    boxClass: 'wow', // animated element css class (default is wow)
    animateClass: 'wow-animated', // animation css class (default is animated)
    offset: 0, // distance to the element when triggering the animation (default is 0)
    mobile: false, // trigger animations on mobile devices (default is true)
    live: true, // act on asynchronously loaded content (default is true)
    scrollContainer: null, // optional scroll container selector, otherwise use window,
    resetAnimation: false, // reset animation on end (default is true)
  });
  wow.init();


  // Get the current year
  const currentYear = new Date().getFullYear();
  // Set the text content of the element with id "currentYear"
  document.getElementById('currentYear').textContent = currentYear;

  /**************************************
   ***** 14. Active Menu Item Based On URL *****
   **************************************/
  document.addEventListener('DOMContentLoaded', () => {
    const navMenu = document.querySelector('.main-menu'); // Select the main menu container once
    const windowPathname = window.location.pathname;

    if (navMenu) {
      const navLinkEls = navMenu.querySelectorAll('a'); // Only get <a> tags inside the main menu

      navLinkEls.forEach((navLinkEl) => {
        const navLinkPathname = new URL(navLinkEl.href, window.location.origin)
          .pathname;

        // Match current URL with link's href
        if (
          windowPathname === navLinkPathname ||
          (windowPathname === '/index.html' && navLinkPathname === '/')
        ) {
          navLinkEl.classList.add('active');

          // Add 'active' class to all parent <li> elements
          let parentLi = navLinkEl.closest('li');
          while (parentLi && parentLi !== navMenu) {
            parentLi.classList.add('active');
            parentLi = parentLi.parentElement.closest('li'); // Traverse up safely
          }
        }
      });
    }
  });

  // Add New Animation
  /**************************************
     ***** 15. VS Hover Image Card *****
     **************************************/
  document.querySelectorAll('.vs-image-effect').forEach(wrapper => {
    const image = wrapper.querySelector('.vs-image-effect__image');
    const overlay = wrapper.querySelector('.vs-image-effect__overlay');

    // Get opacity from data attribute or fallback to 0.8
    const targetOpacity = parseFloat(overlay.dataset.opacity) || 0.8;

    wrapper.addEventListener('mouseenter', () => {
      gsap.to(image, {
        scale: 1.1,
        rotateX: 8,
        rotateY: -5,
        duration: 0.6,
        ease: "power3.inOut"
      });

      gsap.to(overlay, {
        opacity: targetOpacity,
        scale: 1.1,
        xPercent: 0,
        yPercent: 0,
        duration: 0.6,
        ease: "power2.out"
      });
    });

    wrapper.addEventListener('mouseleave', () => {
      gsap.to(image, {
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        duration: 0.7,
        ease: "power3.inOut",
      });

      gsap.to(overlay, {
        opacity: 0,
        scale: 1,
        xPercent: 0,
        yPercent: 0,
        duration: 0.6,
        ease: "power3.inOut"
      });
    });
  });


  /**************************************
   ***** 16. Sticky Header With GSAP *****
   **************************************/
  let lastScrollY = 0;

  function updateHeaderOffset() {
    const menu = document.getElementById('navbar-wrap');
    if (menu) {
      document.documentElement.style.setProperty('--sticky-header-offset', `-${menu.offsetHeight}px`);
    }
  }

  function handleStickyHeader(scrollY) {
    const header = $('.vs-sticky-header');
    const stickyPlaceholder = $('#sticky-placeholder');
    const menu = $('#navbar-wrap');

    if (menu.length === 0) return;

    const menuHeight = menu.outerHeight();
    const topbarHeight = $('#topbar-wrap').outerHeight(true) || 0;
    const targetScroll = topbarHeight;

    // Update CSS variable for offset
    document.documentElement.style.setProperty('--sticky-header-offset', `-${menuHeight}px`);

    // Sticky logic
    if (scrollY > targetScroll) {
      if (!header.hasClass('sticky')) {
        header.addClass('sticky');
        stickyPlaceholder.height(menuHeight);
      }
    } else {
      if (header.hasClass('sticky')) {
        header.removeClass('sticky');
        stickyPlaceholder.height(0);
      }
    }

    // Scroll direction logic
    const scrollDelta = scrollY - lastScrollY;
    const windowHeight = $(window).height();
    const docHeight = $(document).height();

    if (scrollDelta < 0 && scrollY > 0 && scrollY < docHeight - windowHeight) {
      header.addClass('sticky-hold');
    } else if (scrollDelta > 0) {
      header.removeClass('sticky-hold');
    }

    if (scrollY > 0) {
      header.addClass('stickyon');
    } else {
      header.removeClass('stickyon sticky-hold');
    }

    lastScrollY = scrollY;
  }

  window.addEventListener('resize', updateHeaderOffset);
  $(document).ready(updateHeaderOffset);

  // Lenis scroll event
  lenis.on('scroll', (e) => {
    handleStickyHeader(e.scroll);
  });

  /** Porfolio Custom using
   * GSAP
   * Vanila JavaScript
   */
  // portfolio active

  $('.vs-portfolio').imagesLoaded(function () {
    let grid = $('.grid').isotope({
      itemSelector: '.grid-item',
      percentPosition: true,
      masonry: {
        // use outer width of grid-sizer for columnWidth
        columnWidth: '.grid-sizer'
      }
    })

    $('.vs-portfolio__tabs').on('click', 'button', function () {
      let filterValue = $(this).attr('data-filter');
      grid.isotope({ filter: filterValue });
    });
    function moveIndicator($el, animate = true) {
      const $indicator = $('.vs-portfolio__indicator');
      const offset = $el.position();
      const width = $el.outerWidth();
      const height = $el.outerHeight();

      if (animate) {
        gsap.to($indicator, {
          duration: 0.4,
          x: offset.left,
          y: offset.top,
          width: width,
          height: height,
          scale: 1,
          transformOrigin: 'center center',
          ease: 'power2.out',
          opacity: 1
        });
      } else {
        // On page load: center scale animation
        gsap.set($indicator, {
          x: offset.left,
          y: offset.top,
          width: width,
          height: height,
          scale: 0,
          opacity: 0,
        });

        gsap.to($indicator, {
          duration: 0.5,
          scale: 1,
          opacity: 1,
          transformOrigin: 'center center',
          ease: 'back.out(1.4)',
          delay: 0.001
        });
      }
    }

    $('.vs-portfolio__tabs .vs-portfolio__tab').on('click', function (event) {
      event.preventDefault();

      $('.vs-portfolio__tabs .vs-portfolio__tab').removeClass('active');
      $(this).addClass('active');

      moveIndicator($(this), true);
    });

    $(window).on('load resize', function () {
      const $active = $('.vs-portfolio__tabs .vs-portfolio__tab.active');
      if ($active.length) {
        moveIndicator($active, false); // ⬅️ Animate from center on load
      }
    });

  });

  document.addEventListener("DOMContentLoaded", () => {
    const FOLLOW_DURATION = 0.02;
    const FOLLOW_EASE = "none";
    const SCALE_DURATION = 0;
    const SCALE_EASE = "power2.out";

    class MagnetButton {
      constructor(wrapper) {
        this.wrapper = wrapper;
        this.btn = wrapper.querySelector(".vs-portfolio__button");
        this.isActive = false;
        gsap.set(this.btn, { x: 0, y: 0, scale: 0, opacity: 0 });
        this.quickX = gsap.quickTo(this.btn, "x", { duration: FOLLOW_DURATION, ease: FOLLOW_EASE, overwrite: true });
        this.quickY = gsap.quickTo(this.btn, "y", { duration: FOLLOW_DURATION, ease: FOLLOW_EASE, overwrite: true });
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        wrapper.addEventListener("mouseenter", this.onMouseEnter);
        wrapper.addEventListener("mouseleave", this.onMouseLeave);
      }

      onMouseMove(e) {
        const r = this.wrapper.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        this.quickX(x);
        this.quickY(y);
      }

      onMouseEnter(e) {
        if (this.isActive) return;
        this.isActive = true;
        gsap.set(this.btn, { x: 0, y: 0, scale: 0, opacity: 0 });

        // Use two requestAnimationFrame calls to ensure the browser fully applies the initial state before animating
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            gsap.to(this.btn, {
              scale: 1,
              opacity: 1,
              duration: SCALE_DURATION,
              ease: SCALE_EASE,
              onComplete: () => {
                this.wrapper.addEventListener("mousemove", this.onMouseMove);
              }
            });
          });
        });
      }
      onMouseLeave() {
        if (!this.isActive) return;
        this.isActive = false;
        this.wrapper.removeEventListener("mousemove", this.onMouseMove);
        gsap.to(this.btn, {
          x: 0, y: 0, scale: 0, opacity: 0,
          duration: SCALE_DURATION,
          ease: SCALE_EASE
        });
      }
    }

    document.querySelectorAll(".magnet-wrapper").forEach(w => new MagnetButton(w));
  });

  /**
   * ON scroll left right zoom animation
   */
  // 1) Register plugin
  gsap.registerPlugin(ScrollTrigger);

  // 2) Boot everything once DOM is ready
  document.addEventListener("DOMContentLoaded", initScrollAnimations);

  function initScrollAnimations() {
    // Gather every animated element only once
    const elements = document.querySelectorAll("[data-ele-move]");

    elements.forEach(el => {
      // Split multiple move types: e.g. "left zoom"
      const moveTypes = el.dataset.eleMove.split(/\s+/);
      const speed = parseFloat(el.dataset.eleMoveSpeed) || 1;

      // Create a dedicated timeline so different move types can overlap
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          end: "bottom 20%",
          scrub: true    // smooth scrubbing
          // markers:true // uncomment for debugging
        }
      });

      moveTypes.forEach(type => {
        switch (type) {
          case "left":
            tl.to(el, { x: -100 * speed, duration: 1 }, 0);
            break;
          case "right":
            tl.to(el, { x: 100 * speed, duration: 1 }, 0);
            break;
          case "zoom":
            tl.to(el, { scale: 1 + 0.5 * speed, duration: 1 }, 0);
            break;
          default:
            console.warn(`Unknown move type "${type}" on`, el);
        }
      });
    });
  }

  /**
   * Custom Rating Star
   * Using FontAwesome
   */
  document.querySelectorAll('.vs-clients__rating').forEach(ratingElement => {
    const rate = parseFloat(ratingElement.getAttribute('data-rate'));
    const fullStars = Math.floor(rate);
    const halfStar = rate % 1 >= 0.25 && rate % 1 < 0.75 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    let starsHTML = '';

    for (let i = 0; i < fullStars; i++) {
      starsHTML += '<i class="fa-solid fa-star"></i>';
    }
    if (halfStar) {
      starsHTML += '<i class="fa-solid fa-star-half-stroke"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
      starsHTML += '<i class="fa-regular fa-star"></i>';
    }

    ratingElement.innerHTML = starsHTML;
  });

  /**************************************
   ***** 17. Animate Counter *****
   **************************************/
  function animateCounter(counter, targetValue, useComma) {
    const animationDuration = 1000; // milliseconds
    const startTimestamp = performance.now();

    function updateCounter(timestamp) {
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / animationDuration, 1);
      const currentValue = Math.floor(targetValue * progress);

      // Format the number conditionally
      counter.textContent = useComma
        ? currentValue.toLocaleString('en-US')
        : currentValue.toString();

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }

    requestAnimationFrame(updateCounter);
  }

  function startCounterAnimation(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counterBlock = entry.target;
        const counterElement = counterBlock.querySelector('.main-counter__number');
        const targetValue = parseInt(counterBlock.getAttribute('data-counter'), 10);
        const useComma = counterBlock.getAttribute('data-format') === 'comma';

        // Animate every time element enters viewport
        animateCounter(counterElement, targetValue, useComma);
      }
    });
  }

  const counterObserver = new IntersectionObserver(startCounterAnimation, {
    rootMargin: '0px',
    threshold: 0.2,
  });

  document.querySelectorAll('.main-counter').forEach((counterBlock) => {
    counterObserver.observe(counterBlock);
  });

  /**************************************
   ***** 18. Home One Servie Style *****
   **************************************/

  function activateRowItems(rowSelector) {
    const rowElement = document.querySelector(rowSelector);
    if (!rowElement) return;

    const cards = rowElement.querySelectorAll(".vs-service__grid-item");

    const manualActiveCard = rowElement.querySelector(".vs-service__grid-item.active");
    let lastActiveCard = null;

    cards.forEach(card => {
      card.addEventListener("mouseenter", () => {
        cards.forEach(c => c.classList.remove("active"));
        card.classList.add("active");
        cards.forEach(c => c.classList.remove("recentActive"));
        if (lastActiveCard && lastActiveCard !== card) {
          lastActiveCard.classList.add("recentActive");
        }
        lastActiveCard = null;
      });

      card.addEventListener("mouseleave", () => {
        lastActiveCard = card;
      });
    });

    rowElement.addEventListener("mouseleave", () => {
      cards.forEach(c => c.classList.remove("active"));
      if (manualActiveCard) {
        manualActiveCard.classList.add("active");
      }
    });
  }

  activateRowItems(".vs-service__grid-row1");
  activateRowItems(".vs-service__grid-row2");

  Textify.init();

  /**************************************
   ***** 19. Magic Hover *****
   **************************************/
  $('.vs-active').hover(function () {
    const $wrapper = $(this).closest('.vs-active-wrapper');
    $wrapper.find('.vs-active').removeClass('active');
    $(this).addClass('active');
  });

  /**************************************
   ***** 20. Social Clickable *****
   **************************************/
  document.addEventListener('DOMContentLoaded', function () {
    const wrappers = document.querySelectorAll('.social-clickable');

    wrappers.forEach(wrapper => {
      const button = wrapper.querySelector('.social-clickable__button');
      const toggle = wrapper.querySelector('.social-clickable__toggle');

      // Toggle on button click
      button.addEventListener('click', function (e) {
        e.stopPropagation(); // Prevent event from reaching document

        // Remove all other active toggles and buttons
        document.querySelectorAll('.social-clickable__toggle--active').forEach(activeToggle => {
          if (activeToggle !== toggle) {
            activeToggle.classList.remove('social-clickable__toggle--active');
          }
        });
        document.querySelectorAll('.social-clickable__button--active').forEach(activeBtn => {
          if (activeBtn !== button) {
            activeBtn.classList.remove('social-clickable__button--active');
          }
        });

        // Toggle current
        toggle.classList.toggle('social-clickable__toggle--active');
        button.classList.toggle('social-clickable__button--active');
      });

      // Remove on mouse leave
      wrapper.addEventListener('mouseleave', function () {
        toggle.classList.remove('social-clickable__toggle--active');
        button.classList.remove('social-clickable__button--active');
      });
    });

    // Click outside any wrapper
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.social-clickable')) {
        document.querySelectorAll('.social-clickable__toggle--active').forEach(toggle => {
          toggle.classList.remove('social-clickable__toggle--active');
        });
        document.querySelectorAll('.social-clickable__button--active').forEach(button => {
          button.classList.remove('social-clickable__button--active');
        });
      }
    });
  });

  /**************************************
   ***** 21. Back To Top *****
   **************************************/
  // Get references to DOM elements
  const backToTopBtn = document.getElementById('backToTop');
  const progressCircle = document.querySelector('.progress');
  const progressPercentage = document.getElementById('progressPercentage');

  // Circle properties
  const CIRCLE_RADIUS = 40;
  const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

  // Set initial styles for the circle
  progressCircle.style.strokeDasharray = CIRCUMFERENCE;
  progressCircle.style.strokeDashoffset = CIRCUMFERENCE;

  // Update progress based on scroll position
  const updateProgress = () => {
    const scrollPosition = window.scrollY;
    const totalHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    if (totalHeight > 0) {
      const scrollPercentage = (scrollPosition / totalHeight) * 100;
      const offset = CIRCUMFERENCE * (1 - scrollPercentage / 100);

      // Update the circle and percentage display
      progressCircle.style.strokeDashoffset = offset.toFixed(2);
      progressPercentage.textContent = `${Math.round(scrollPercentage)}%`;

      // Show or hide the back-to-top button
      if (scrollPercentage > 5) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  // Scroll to top using smooth animation
  const scrollToTop = () => {
    gsap.to(window, { duration: 1, scrollTo: 0 });
  };

  // Throttle function to limit function execution frequency
  const throttle = (func, limit) => {
    let lastFunc;
    let lastRan;
    return function (...args) {
      const context = this;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(() => {
          if (Date.now() - lastRan >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  };

  // Attach event listeners
  window.addEventListener('scroll', throttle(updateProgress, 50));
  backToTopBtn.addEventListener('click', scrollToTop);

  // Initial update to set the correct progress on page load
  updateProgress();

  /**************************************
   ***** 22. Fade In Animation *****
   **************************************/
  $(window).on('load', function () {
    if ($(".vs_fade_anim").length > 0) {
      gsap.utils.toArray(".vs_fade_anim").forEach((item) => {
        let vs_fade_offset = item.getAttribute("data-fade-offset") || 40,
          vs_duration_value = item.getAttribute("data-duration") || 0.75,
          vs_fade_direction = item.getAttribute("data-fade-from") || "bottom",
          vs_onscroll_value = item.getAttribute("data-on-scroll") || 1,
          vs_delay_value = item.getAttribute("data-delay") || 0.15,
          vs_ease_value = item.getAttribute("data-ease") || "power2.out",
          vs_anim_setting = {
            opacity: 0,
            ease: vs_ease_value,
            duration: vs_duration_value,
            delay: vs_delay_value,
            x: (vs_fade_direction == "left" ? -vs_fade_offset : (vs_fade_direction == "right" ? vs_fade_offset : 0)),
            y: (vs_fade_direction == "top" ? -vs_fade_offset : (vs_fade_direction == "bottom" ? vs_fade_offset : 0)),
          };

        if (vs_onscroll_value == 1) {
          vs_anim_setting.scrollTrigger = {
            trigger: item,
            start: 'top 95%',
          };
        }

        gsap.from(item, vs_anim_setting);
      });
    }
  });

  // 3 Line Menu Icon Styling
  document.addEventListener("DOMContentLoaded", function () {
    // Initial: Add active class to any open item
    document.querySelectorAll('.accordion-button:not(.collapsed)').forEach(button => {
      const item = button.closest('.accordion-item');
      if (item) {
        item.classList.add('accordion-item--active');
      }
    });

    // On click: update active class instantly
    document.querySelectorAll('.accordion-button').forEach(button => {
      button.addEventListener('click', function () {
        // Remove all active classes
        document.querySelectorAll('.accordion-item').forEach(item => {
          item.classList.remove('accordion-item--active');
        });

        // If this button is now expanded (not collapsed), add active
        if (!this.classList.contains('collapsed')) {
          const item = this.closest('.accordion-item');
          if (item) {
            item.classList.add('accordion-item--active');
          }
        }
      });
    });
  });


  let revealContainers = document.querySelectorAll(".vs-reveal-style1");

  revealContainers.forEach((container) => {
    let image = container.querySelector("img");
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        toggleActions: "restart none none reset"
      }
    });

    tl.set(container, { autoAlpha: 1 });
    tl.from(container, 1.5, {
      xPercent: -100,
      ease: Power2.out
    });
    tl.from(image, 1.5, {
      xPercent: 100,
      scale: 1.3,
      delay: -1.5,
      ease: Power2.out
    });
  });

  document.querySelectorAll('[data-opacity]').forEach(el => {
    let raw = el.getAttribute('data-opacity').trim();
    // Convert % to decimal if needed
    let val = raw.endsWith('%') ? parseFloat(raw) / 100 : parseFloat(raw);
    el.style.opacity = Math.max(0, Math.min(1, val)); // clamp between 0–1
  });


  /*---------- 23. Skill Progressbar ----------*/
  document.addEventListener('DOMContentLoaded', function () {
    const progressBoxes = document.querySelectorAll('.progress-box');

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5, // Intersection observer threshold
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateProgressBar(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, options);

    progressBoxes.forEach((progressBox) => {
      observer.observe(progressBox);
    });

    function animateProgressBar(progressBox) {
      try {
        const progressBar = progressBox.querySelector('.progress-box__bar');
        const progressNumber = progressBox.querySelector(
          '.progress-box__number'
        );

        // Retrieve target width from data attribute
        const targetWidth = parseInt(progressBar.dataset.width, 10);
        let width = 0;

        const countInterval = setInterval(() => {
          width++;
          progressBar.style.width = width + '%';

          // Safely update the progress number
          if (progressNumber) {
            progressNumber.textContent = width + '%';
          }

          if (width >= targetWidth) {
            clearInterval(countInterval);
          }
        }, 20);
      } catch (error) {
        console.error('Error animating progress bar:', error);
      }
    }
  });





  const swiper = new Swiper('#testislidev2', {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 40,
    centeredSlides: false,
    
    breakpoints: {
      992: {
        spaceBetween: 30,
        slidesPerView: 2,
        centeredSlides: true
      }
    }
  });




  // End
  // End
  // End
  // End
})(jQuery);
