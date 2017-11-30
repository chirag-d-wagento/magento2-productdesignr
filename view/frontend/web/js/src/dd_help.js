$.fn.dd_help = function (options) {
    this.options = $.extend({
        'delay': 7000,
        'defaultOutside': 'y',
        'defaultPosition': {
            x: 'center',
            y: 'top'
        },
        data: [
            /* 
             * {
             * 
             'selector': 'jquerySelector',
             'content' : '{content}'
             'position': null,
             'outside' : null
            
             }
             */
        ]
    }, options);

    this.show = function () {

        var options = this.options;
        var firstEl = options.data[0];
        var index   = 0;
        
        var self = this;

        function showHelpElement(data) {
            var cookieName = 'help-' + data.selector;
            if($.cookie(cookieName)) {
                index++;
                var newEl = options['data'][index];
                if(newEl) {
                    showHelpElement(newEl);
                }
                return;
            }
            $.cookie(cookieName, true);
            var divContainer = $('<div />').addClass('dd-help-container')
                    .html(data.content);
            var buttonContainer = $('<div />').addClass('dd-help-buttons');
            
            var help = new jBox('Tooltip', {
                target: data.selector,
                position: data.position ? data.position : options.defaultPosition,
                outside: data.outside ? data.outside :options.defaultOutside,
                closeOnMouseleave: true           
            });
            
            var _close = $('<button />').text('OK');
            _close.on('click', function() {
                help.destroy();
                index++;
                var newEl = options['data'][index];
                if(newEl) {
                    showHelpElement(newEl);
                }
            });
            
            
            buttonContainer.append(_close);
            divContainer.append(buttonContainer);
            help.setContent(divContainer);
            help.open();
            
            self.showed = help;
        }


        setTimeout(showHelpElement(firstEl), options.delay);

    };
    
    this.destroy = function() {
        if(this.showed){
            this.showed.destroy();
        }
    }

    return this;
};