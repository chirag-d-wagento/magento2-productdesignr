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
             'selector': 'jquerySelector',
             'content' : '{content}'
             }
             */
        ]
    }, options);

    this.show = function () {

        var options = this.options;
        var firstEl = options.data[0];

        function showHelpElement(data) {
            var divContainer = $('<div />').addClass('dd-help-container')
                    .html(data.content);
            var buttonContainer = $('<div />').addClass('dd-help-buttons');
            
            var help = new jBox('Tooltip', {
                target: data.selector,
                //content: divContainer,
                position: options.defaultPosition,
                outside: options.defaultOutside,
                closeOnMouseleave: true           
            });
            
            var _close = $('<button />').text('OK');
            _close.on('click', function() {
                help.destroy();
            });
            
            buttonContainer.append(_close);
            divContainer.append(buttonContainer);
            help.setContent(divContainer);
            help.open();
        }


        setTimeout(showHelpElement(firstEl), options.delay);

    };

    return this;
};