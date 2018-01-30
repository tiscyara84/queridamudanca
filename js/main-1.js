/*jshint undef: true, unused: false, plusplus: true, loopfunc: true */
/*global jQuery:false, window: false, Modernizr: false, clearTimeout: false, setTimeout: false, cosmic:false, cosmic:false, template_dir_url:false, document:false  */

jQuery.noConflict();

var cosmicTheme = {}; // theme namespace

/*================================== Theme Function init =======================================*/

(function ($) {

    "use strict";

    var touchDevice = (Modernizr.touch) ? true : false;
    var css3 = (Modernizr.csstransforms3d) ? true : false;

    cosmicTheme = {

        touchDevice: (Modernizr.touch) ? true : false,

        css3: (Modernizr.csstransforms3d) ? true : false,

        timers: {},

        vendor_prefix: function () {

            var prefix;

            if (css3 === true) {
                var styles = window.getComputedStyle(document.documentElement, '');
                prefix = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o']))[1];

                return prefix;
            }
        },

        is_IE: function () {


            var myNav = navigator.userAgent.toLowerCase();
            return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
        },

        is_mobile: function () {


            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                return true;
            }
            return false;
        },

        // Helps to avoid continuous method execution as can happen in the case of scroll or window resize. Useful specially
        // when DOM access/manipulation is involved
        wait_for_final_event: function (callback, ms, uniqueId) {

            if (!uniqueId) {
                uniqueId = "Don't call this twice without a uniqueId";
            }
            if (cosmicTheme.timers[uniqueId]) {
                clearTimeout(cosmicTheme.timers[uniqueId]);
            }
            cosmicTheme.timers[uniqueId] = setTimeout(callback, ms);
        },

        toggle_html5_video_volume: function (video) {


            if (video.muted) {
                video.muted = false;
            }
            else {
                video.muted = true;
            }
        },

        // Enter negative percentage to darken; assumes presence of # - Credit: http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color //
        shade_color: function (color, percent) {

            var num = parseInt(color.slice(1), 16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
            return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
        },

        setup_parallax: function () {

            var scroll = window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 600);
                };

            function init_parallax() {

                if (cosmicTheme.touchDevice === false && cosmicTheme.css3 === true) {
                    var windowHeight = $(window).height();
                    $('.parallax-banner').each(function () {
                        var segment = $(this);
                        var elementHeight = segment.outerHeight(true);

                        /* Apply transform only when the element is in the viewport */
                        var boundingRect = segment[0].getBoundingClientRect();
                        if (boundingRect.bottom >= 0 && boundingRect.top <= windowHeight) {
                            var distanceToCover = windowHeight + elementHeight;
                            var pixelsMoved = windowHeight - boundingRect.top;
                            var toTransform = 50; // only 50% of the image height is available for transforming
                            var transformPercent = toTransform * Math.abs(pixelsMoved / distanceToCover);
                            transformPercent = -transformPercent.toFixed(2); // not more than 2 decimal places for performance reasons

                            segment.find('.parallax-bg').css('-' + cosmicTheme.vendor_prefix() + '-transform', 'translate3d(0px, ' + transformPercent + '%, 0px)');
                        }
                    });
                }

            }

            if (cosmicTheme.touchDevice === false) {

                // Call once to initialize parallax and then call on each scroll
                scroll(init_parallax);
                $(window).on('scroll', function () {
                    scroll(init_parallax);
                });
            }

        },

        add_body_classes: function () {
            if (cosmicTheme.is_mobile()) {
                $('body').addClass('mobile-device');
            }
            if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                $('body').addClass('ios-device');
            }
            if (navigator.userAgent.match(/Android/i) !== null) {
                $('body').addClass('android-device');
            }
        },

        toggle_mobile_menu: function () {
            $('#mobile-menu-toggle').toggleClass('menu-open');
            $('body').toggleClass('push-right');
            $('#mobile-menu').toggleClass('slide-open');
        },

        init_side_nav: function () {
            var menuTrigger = $('.side-nav-toggle');

            menuTrigger.on('click', function (e) {
                e.preventDefault();

                var nav = $('#sidenav');
                $(this).toggleClass('close-menu');

                nav.fadeToggle(400);
                nav.toggleClass('open closed');

                if ($(this).hasClass('close-menu')) {
                    $('body').addClass('hide');
                }
                else {
                    $('body').removeClass('hide');
                }
            });

        },

        display_numbers: function (duration) {
            $('.odometer').each(function () {
                var data_stop = $(this).attr('data-stop');
                $(this).text(data_stop);
            });
        },

        display_barcharts: function () {
            /* ------- Skill Bar --------- */
            $('.stats-bar-content').each(function () {
                var dataperc = $(this).attr('data-perc');
                $(this).animate({ "width": dataperc + "%"}, dataperc * 20);
            });
        },

        display_piecharts: function () {

            /* -------- Charts like Pie Chart -------- */
            var bar_color = cosmic.options.theme_skin,
                track_color = cosmicTheme.shade_color(bar_color, 26);
            /* Lighten */

            $('.piechart .percentage').not('.dark-bg .piechart .percentage').easyPieChart({
                animate: 2000,
                lineWidth: 10,
                barColor: function (percent) {
                    var color = $(this.el).attr('data-bar-color');
                    if (color == null)
                        color = bar_color;
                    return color;
                },
                trackColor: 'rgba(0,0,0,0.1)',
                scaleColor: false,
                lineCap: 'square',
                size: 220

            });


            $('.dark-bg .piechart .percentage').easyPieChart({
                animate: 2000,
                lineWidth: 20,
                barColor: function (percent) {
                    var color = $(this.el).attr('data-bar-color');
                    if (color === null)
                        color = bar_color;
                    return color;
                },
                trackColor: 'rgba(255,255,255,0.1)',
                scaleColor: false,
                lineCap: 'square',
                size: 250

            });
        },

        get_internal_link: function (urlString) {
            var internal_link = null;
            if (urlString.indexOf("#") !== -1) {
                var arr = urlString.split('#');
                if (arr.length === 2) {
                    var url = arr[0];
                    internal_link = '#' + arr[1];
                    // check if this internal link belongs to current URL
                    if (url === (document.URL + '/') || url === document.URL) {
                        return internal_link;
                    }
                } else if (arr.length === 1) {
                    internal_link = '#' + arr[0];
                    return internal_link;
                }
            }
            return internal_link;

        },

        set_header_spacing_height: function () {

            $('#masthead-spacer').css('height', $('#masthead').outerHeight());

        },

        highlight_menu: function () {

            var $active_menu_item;

            /* Do not highlight internal links */
            // make the current page active for highlight - top list cannot have both a parent and current page item
            $active_menu_item = $('#primary-menu > ul > li.current_page_item > a').not('a[href*="#"]').first();

            if ($active_menu_item.length === 0)
                $active_menu_item = $('#primary-menu > ul > li.current-menu-item > a').not('a[href*="#"]').first();

            if ($active_menu_item.length === 1)
                $active_menu_item.parent().addClass('active');

        },

        init_page_navigation: function () {

            cosmicTheme.set_header_spacing_height();

            cosmicTheme.highlight_menu();

            var delay = (function () {
                var timer = 0;
                return function (callback, ms) {
                    clearTimeout(timer);
                    timer = setTimeout(callback, ms);
                };
            })();

            /*--- Sticky Menu -------*/

            if (cosmic.options.sticky_menu) {
                var $offset = -40;
                $('#container').waypoint({
                    offset: $offset,
                    handler: function (direction) {
                        if (direction === "up") {
                            $('#masthead').removeClass('sticky');
                            /* Reached the top and hence highlight current page link */
                            $('#primary-menu > ul > li').each(function () {
                                $(this).removeClass('active');
                            });
                            cosmicTheme.highlight_menu();
                        } else {
                            $('#masthead').addClass('sticky');
                        }
                    }
                });

            }

            /* ----- Smooth Scroll --------*/

            if ($().smoothScroll !== undefined) {
                $('.page-template-template-full-width #primary-menu > ul > li > a[href*="#"]').smoothScroll(
                    { preventDefault: true, easing: 'swing', speed: 700, offset: -60, exclude: ['.external a']});
                $('.page-template-template-full-width #mobile-menu a[href*="#"]').smoothScroll(
                    {easing: 'swing', speed: 700, offset: 0, exclude: ['.external a']});

                $('.page-template-template-full-width a[href*="#"].pointer-down').smoothScroll(
                    {easing: 'swing', speed: 700, offset: -60 });
            }


            /* --------- One Page Menu --------- */
            $('.page-template-template-full-width #primary-menu > ul > li > a[href*="#"]').on('click', function () {
                $(this).closest('ul').children('li').each(function () {
                    $(this).removeClass('active');
                });
                $(this).parent('li').addClass('active');
            });
            $('.page-template-template-full-width #primary-menu > ul > li > a[href*="#"]').each(function () {
                var current_div_selector = cosmicTheme.get_internal_link($(this).attr('href')); // Give ids of div's with ids like #work,#service, #portfolio etc.

                $(current_div_selector).waypoint(function (direction) {
                        if (direction === "up") {
                            $('#primary-menu > ul > li').each(function () {
                                $(this).removeClass('active');
                                if ($(this).find('a').attr('href').indexOf(current_div_selector) !== -1) {
                                    $(this).addClass('active');
                                }
                            });
                        }
                    }, {
                        offset: function () {
                            var half_browser_height = $.waypoints('viewportHeight') / 2;
                            var element_height = $(this).height();
                            var result = 0;
                            if (element_height > half_browser_height) {
                                result = -( element_height - (half_browser_height)); // enable when top of the div is half exposed on the screen
                            }
                            else {
                                result = -(element_height / 2); // enable the menu when everything is visible
                            }
                            return result;
                        }
                    }
                );
                $(current_div_selector).waypoint(function (direction) {
                    if (direction === "down") {
                        $('#primary-menu > ul > li').each(function () {
                            $(this).removeClass('active');
                            if ($(this).find('a').attr('href').indexOf(current_div_selector) !== -1) {
                                $(this).addClass('active');
                            }
                        });
                    }
                }, { offset: '50%' });
            });

        },

        init_menus: function () {
            /* For sticky and primary menu navigation */
            $('.dropdown-menu-wrap > ul').superfish({
                delay: 100, // one second delay on mouseout
                animation: {height: 'show'}, // fade-in and slide-down animation
                speed: 'fast', // faster animation speed
                autoArrows: false // disable generation of arrow mark-up
            });


            /* Take care of internal links too - close the menu when scrolling from internal links */
            $('#mobile-menu-toggle, #mobile-menu a[href*="#"]').on('click', function () {
                cosmicTheme.toggle_mobile_menu();
                return true;
                /* must return true to record click event for smooth scroll of internal links */
            });

            /* Close the mobile menu if the user touches the right document when mobile menu is open */
            $('#container').on('click touchstart', function () {
                if ($('body').hasClass('push-right')) {
                    cosmicTheme.toggle_mobile_menu();
                    return false;
                    /* no need to do anything else for now until menu closes */
                }
                return true;
                /* continue with normal click activity */
            });

            $("#mobile-menu ul li").each(function () {
                var sub_menu = $(this).find("> ul");
                if (sub_menu.length > 0 && $(this).addClass("has-ul")) {
                    $(this).append('<div class="sf-sub-indicator"><i class="icon-chevron-right"></i></div>');
                }
            });

            $('#mobile-menu ul li:has(">ul") > div').on('click', function () {
                $(this).siblings("ul.sub-menu").stop(true, true).slideToggle();
                $(this).parent().toggleClass("open");
                return false;
            });

            cosmicTheme.init_page_navigation();
        },

        setup_animations: function () {

            if ($().waypoint === undefined) {
                return;
            }

            /* Hide the elements if required to prepare for animation */
            $(".cosmic-visible-on-scroll:not(.animated)").css('opacity', 0);

            "function" != typeof window.cosmic_animate_widgets && (window.cosmic_animate_widgets = function () {
                $(".cosmic-animate-on-scroll:not(.animated)").waypoint(function () {
                    var animateClass = $(this).data("animation");
                    $(this).addClass("animated " + animateClass).css('opacity', 1);
                }, {
                    offset: "85%"
                })
            });

            window.setTimeout(cosmic_animate_widgets, 500);

            /* ------------------- Stats -----------------------------*/

            $(".stats-bar").waypoint(function (direction) {

                cosmicTheme.display_barcharts();

            }, { offset: $.waypoints('viewportHeight') - 150,
                triggerOnce: true});

            $(".piechart").waypoint(function (direction) {

                cosmicTheme.display_piecharts();

            }, { offset: $.waypoints('viewportHeight') - 250,
                triggerOnce: true});

            $(".animate-numbers").waypoint(function (direction) {
                setTimeout(function () {
                    cosmicTheme.display_numbers(2400);
                }, 100);

            }, { offset: $.waypoints('viewportHeight') - 100,
                triggerOnce: true});

        },

        init_features_tabs: function() {

            $('.features-tabs').each(function () {

                var tabs = $(this);

                // tabs elems
                var tabNavs = tabs.find('.features-tab');

                // content items
                var items = tabs.find('.features-tab-pane');

                // product screenshots
                var shots = tabs.find('.features-screenshot');

                /* --- Display the first tab ---- */

                tabNavs.eq(0).addClass('active');
                items.eq(0).addClass('active');
                shots.eq(0).addClass('active');

                /* ------ Register tab click event ------ */

                tabNavs.click(function (event) {

                    event.preventDefault();

                    tabNavs.removeClass('active');
                    items.removeClass('active');
                    shots.removeClass('active');

                    var current = tabNavs.index($(this));

                    tabNavs.eq(current).addClass('active');
                    items.eq(current).addClass('active');
                    shots.eq(current).addClass('active');

                });

            });

        },

        magnific_popup: function () {

            if ($().magnificPopup === undefined) {
                return;
            }

            $('.image-grid, .hfeed').each(function () {
                $(this).find('.lightbox-link').magnificPopup({

                    gallery: {
                        enabled: true
                    },
                    type: 'image'
                });
            });

            $('.video-popup').magnificPopup({
                type: 'iframe'
            });
        },

        init_testimonials_slider: function () {

            $('.testimonials.flexslider').each(function () {

                var slider_elem = $(this);

                var slideshow_speed = slider_elem.data('slideshow_speed') || 5000;

                var animation_speed = slider_elem.data('animation_speed') || 600;

                var pause_on_action = slider_elem.data('pause_on_action') ? true : false;

                var pause_on_hover = slider_elem.data('pause_on_hover') ? true : false;

                var direction_nav = slider_elem.data('direction_nav') ? true : false;

                var control_nav = slider_elem.data('control_nav') ? true : false;


                slider_elem.flexslider({
                    selector: ".slides > .slide",
                    animation: "slide",
                    slideshowSpeed: slideshow_speed,
                    animationSpeed: animation_speed,
                    namespace: "flex-",
                    pauseOnAction: pause_on_action,
                    pauseOnHover: pause_on_hover,
                    controlNav: control_nav,
                    directionNav: direction_nav,
                    prevText: "<span class=\"icon-arrow-left10\"></span>",
                    nextText: "<span class=\"icon-uniEC3A\"></span>",
                    smoothHeight: false,
                    animationLoop: true,
                    slideshow: true,
                    easing: "swing",
                    controlsContainer: ".testimonials.flexslider"});

            });

        },

        init_isotope: function () {
            if ($().isotope === undefined) {
                return;
            }

            var html_content = $('.js-isotope');
            // layout Isotope again after all images have loaded
            html_content.imagesLoaded(function () {
                html_content.isotope('layout');
            });

            var container = $('.showcase-items');
            if (container.length === 0) {
                return;
            }

            $('#showcase-filter a').on('click', function (e) {
                e.preventDefault();

                var elem = $(this);

                var selector = elem.attr('data-value');
                container.isotope({filter: selector});

                elem.closest('#showcase-filter').find('li a').removeClass('active');
                elem.addClass('active');

                return false;
            });

            if (cosmic.options.ajax_showcase) {
                if ($().infinitescroll !== undefined && $('.pagination').length) {

                    container.infinitescroll({
                            navSelector: '.pagination', // selector for the paged navigation
                            nextSelector: '.pagination .next', // selector for the NEXT link (to page 2)
                            itemSelector: '.showcase-item', // selector for all items you'll retrieve
                            loading: {
                                msgText: cosmic.options.loading_portfolio,
                                finishedMsg: cosmic.options.finished_loading,
                                img: template_dir_url + '/images/loader.gif',
                                selector: '#main'
                            }
                        },
                        // call Isotope as a callback
                        function (newElements) {
                            var $newElems = $(newElements);
                            $newElems.imagesLoaded(function () {
                                container.isotope('appended', $newElems);
                            });
                            cosmicTheme.magnific_popup();
                        });
                }
            }
        }


    };

})
    (jQuery);

/*======================== Document event handling ======================*/

jQuery(document).ready(function ($) {

    "use strict";


    /*--------------------- Parallax Init -------------------- */


    cosmicTheme.setup_parallax();

    /* -------------------------- Initialize document based on platform type -------------------- */

    cosmicTheme.add_body_classes();

    /* ---------------------------------- Drop-down Menu.-------------------------- */

    cosmicTheme.init_menus();

    /* ---------------------------------- Full Screen Toggle Side Menu -------------------------- */

    cosmicTheme.init_side_nav();

    /* --------- Back to top function ------------ */
    $(window).scroll(function () {
        cosmicTheme.wait_for_final_event(function () {
            var yPos = $(window).scrollTop();
            /* show back to top after screen has scrolled down 200px from the top in desktop and big size tablets only */
            if (yPos > 200) {
                if (!cosmic.options.disable_back_to_top) {
                    $("#go-to-top").fadeIn();
                }
            } else {
                $("#go-to-top").fadeOut();
            }
        }, 200, 'go-to-top');
    });


    // Animate the scroll to top
    $('#go-to-top').on('click', function (event) {
        event.preventDefault();
        $('html, body').animate({scrollTop: 0}, 600);
    });


    /* ------------------- Scroll Effects ----------------------------- */


    var width = $(window).width();
    if (width > 1100 && !cosmic.options.disable_animations_on_page && !(cosmicTheme.is_IE() && cosmicTheme.is_IE() < 10) && !cosmicTheme.is_mobile()) {
        cosmicTheme.setup_animations();
    }
    else {

        //Show stats without waiting for user to scroll to the element
        cosmicTheme.display_barcharts();
        cosmicTheme.display_piecharts();
        setTimeout(function () {
            cosmicTheme.display_numbers(2400);
        }, 200);

        // Show elements rightaway without animation
        $('#feature-pointers img').css({ opacity: 1});
    }

    /* ----------------- Testimonials Slider ------------------------ */

    cosmicTheme.init_testimonials_slider();

    /* ----------------- Features Tabs --------------------------- */

    cosmicTheme.init_features_tabs();

    /* ------------------- Tooltips ------------------------ */

    $(".social-list li a[title]").not('#sidebar-header .social-list li a').tooltip();


    /* ------------------- Back to Top and Close ------------------------ */

    $(".back-to-top").on('click', function (e) {
        $('html,body').animate({
            scrollTop: 0
        }, 600);
        e.preventDefault();
    });

    $('a.close').on('click', function (e) {
        e.preventDefault();
        $(this).closest('.message-box').fadeOut();
    });


    /* --------------------------- YouTube Video display ------------------------- */

    if (!cosmicTheme.is_mobile()) {

        if ($().mb_YTPlayer !== undefined) {
            /* Video Backgrounds */
            $('.ytp-bg').mb_YTPlayer({
                startAt: 0,
                showYTLogo: false,
                showControls: false,
                autoPlay: true,
                mute: true,
                containment: 'self'});
        }

    }

    /* ------------------------ Vimeo Video display ------------------------------ */

    $('.vimeo-wrap img, .vimeo-wrap i').on('click', function () {
        var parent = $(this).closest('.vimeo-wrap');
        parent.html('<iframe src="https://player.vimeo.com/video/' + parent.data('vimeoid') + '?portrait=0&title=0&color=bf1f48&badge=0&byline=0&autoplay=1" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>');
    });

    /*-----------------------------------------------------------------------------------*/
    /*	jQuery isotope functions and Infinite Scroll
     /*-----------------------------------------------------------------------------------*/

    cosmicTheme.init_isotope();

    /*-----------------------------------------------------------------------------------*/
    /*	Handle videos in responsive layout - Credit - http://css-tricks.com/NetMag/FluidWidthVideo/Article-FluidWidthVideo.php
     /*-----------------------------------------------------------------------------------*/

    $("#content, #sidebar-primary, #footer").fitVids();

    // Take care of maps too - https://github.com/davatron5000/FitVids.js - customSelector option
    $("#content").fitVids({ customSelector: "iframe[src^='http://mapbuildr.com/'], iframe[src^='http://maps.google.com/'], iframe[src^='https://maps.google.com/'], iframe[src^='https://www.google.com/maps/'], iframe[src^='http://www.google.com/maps/']"});


    /*----------------- Magnific Popup --------------------*/

    cosmicTheme.magnific_popup();


});

jQuery(window).load(function () {

    /*------------ Show the page now that all have been loaded ---------*/


    /*if (!cosmic.options.disable_smooth_page_load) {
        jQuery("#page-loading").delay(500).fadeOut("slow");
    }

    // Wait till all images have loaded before unwrapping
    setTimeout(function () {
        jQuery('.flex-slider-container').removeClass('loading');
    }, 400);*/

    if (!cosmic.options.disable_smooth_page_load) {
        jQuery("#page-loading").fadeOut("slow");
    }

    // Wait till all images have loaded before unwrapping
    jQuery('.flex-slider-container').removeClass('loading');

});