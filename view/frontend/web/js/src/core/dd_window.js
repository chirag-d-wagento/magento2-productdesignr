var DD_Window = DD_object.extend({
    CONST_WIN_WIDTH: 300,
    CONST_WIN_CONTENT_EL: 'modalContent',

    id: 'dd_window',
    init: function () {
        if (this.getGlobal(this.id)) {
            return;
        }
        this._super(this.id);
        this.createContentElement();
        var self = this;
        this.modal = new jBox('Modal', {
            title: '-',
            draggable: 'title',
            overlay: false,
            close: true,
            content: $('#' + this.CONST_WIN_CONTENT_EL),
            width: this.getWinWidth(),
            fixed: false,
            maxHeight: 500,
            repositionOnOpen: false,
            repositionOnContent: true,
            target: $('.canvas-container'),
            onOpen: function () {
                self._evnt().doCall('window_showed');
            },
            onClose: function () {
                self._evnt().doCall('window_closed');
            }
        });


        this._evnt().register('window_showed', this.modal);
        this._evnt().register('window_closed', this.modal, true);
        this.setGlobal();

        this.registerCloseWinEventCall();
        return this.modal;
    },

    getWindow: function () {
        return this.getGlobal(this.id).modal;
    },

    getContentElement: function () {
        return this.getGlobal(this.id).contentElement;
    },

    getWinWidth: function () {
        return this.CONST_WIN_WIDTH;
    },

    createContentElement: function () {
        this.contentElement = $('<div />').attr({
            'id': this.CONST_WIN_CONTENT_EL
        }).css({
            'display': 'none'
        }).html('<p>I AM ELEMENT</p>');

        $('body').append(this.contentElement);
    },
    
    registerCloseWinEventCall: function() {
        this._evnt().registerCallback('window_closed', function(window) {
            window.isClosed = true;
        }, 'no-reposition');
    }
});

