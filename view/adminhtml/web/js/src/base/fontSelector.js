
(function ($) {

    "use strict";

    var settings;

    var methods = {
        init: function (options) {

            settings = $.extend({
                'hide_fallbacks': false,
                'selected': function (style) {},
                'opened': function () {},
                'closed': function () {},
                'initial': '',
                'fonts': []
            }, options);

            var root = this;
            var $root = $(this);
            root.selectedCallback = settings['selected'];
            root.openedCallback = settings['opened'];
            root.closedCallback = settings['closed'];
            var visible = false;
            var selected = false;
            var openedClass = 'fontSelectOpen';

            var displayName = function (font) {
                if (settings['hide_fallbacks'])
                    return font.substr(0, font.indexOf(','));
                else
                    return font;
            }

            var select = function (font) {
                root.find('span').html(displayName(font).replace(/["']{1}/gi, ""));
                root.css('font-family', font);
                selected = font;

                root.selectedCallback(selected);
            }

            var positionUl = function () {
                var left, top;
                left = $(root).offset().left;
                top = $(root).offset().top + $(root).outerHeight();

                $(ul).css({
                    'position': 'absolute',
                    'left': left + 'px',
                    'top': top + 'px',
                    'width': $(root).outerWidth() + 'px'
                });
            }

            var closeUl = function () {
                ul.slideUp('fast', function () {
                    visible = false;
                });

                $root.removeClass(openedClass);

                root.closedCallback();
            }

            var openUi = function () {
                ul.slideDown('fast', function () {
                    visible = true;
                });

                $root.addClass(openedClass);

                root.openedCallback();
            }

            // Setup markup
            $root.prepend('<span>' + settings['initial'].replace(/'/g, '&#039;') + '</span>');
            var ul = $('<ul class="fontSelectUl"></ul>').appendTo('body');
            ul.hide();
            positionUl();

            for (var i = 0; i < settings['fonts'].length; i++) {
                var item = $('<li>' + displayName(settings['fonts'][i]) + '</li>').appendTo(ul);
                $(item).css('font-family', settings['fonts'][i]);
            }

            if (settings['initial'] != '')
                select(settings['initial']);

            ul.find('li').click(function () {

                if (!visible)
                    return;

                positionUl();
                closeUl();

                select($(this).css('font-family'));
            });

            $root.click(function (event) {

                if (visible)
                    return;

                event.stopPropagation();

                positionUl();
                openUi();
            });

            $('html').click(function () {
                if (visible)
                {
                    closeUl();
                }
            })
        },
        selected: function () {
            return this.css('font-family');
        },
        select: function (font) {
            this.find('span').html(font.substr(0, font.indexOf(',')).replace(/["']{1}/gi, ""));
            this.css('font-family', font);
            selected = font;
        }
    };

    $.fn.fontSelector = function (method) {
        if (methods[method]) {
            return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.fontSelector');
        }
    }
})(jQuery);
