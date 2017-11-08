var DD_Window = DD_object.extend({
    CONST_WIN_WIDTH: 300,
    CONST_WIN_CONTENT_EL: 'modalContent',
    CONST_WIN_PREVIEW_EL: 'previewContent',

    id: 'dd_window',
    init: function () {
        if (this.getGlobal(this.id)) {
            return;
        }
        this._super(this.id);
        this.createContentElement(this.CONST_WIN_CONTENT_EL);
        this.createContentElement(this.CONST_WIN_PREVIEW_EL);
        this.registerModal();
        this.registerPreview();
        this.setGlobal();
        
        return this.modal;
    },
    
    registerPreview: function() {
        var self = this;
        
        this.preview = new jBox('Modal', {
            title: '-',
            draggable: false,
            overlay: false,
            close: true,
            content: $('#' + this.CONST_WIN_PREVIEW_EL),
            width: $(window).width(),
            fixed: false,
            height: $(window).width(),
            repositionOnOpen: false,
            repositionOnContent: true,
            fixed: true,
            onOpen: function () {
                self._evnt().doCall('preview-showed');
            },
            onClose: function () {
                self._evnt().doCall('preview-closed');
            }
        });


        this._evnt().register('preview-showed', this.modal);
        this._evnt().register('preview-closed', this.modal, true);
    },
    
    registerModal: function() {
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
                self._evnt().doCall('window-showed');
            },
            onClose: function () {
                self._evnt().doCall('window-closed');
            }
        });


        this._evnt().register('window-showed', this.modal);
        this._evnt().register('window-closed', this.modal, true);
        this.registerCloseWinEventCall();
    },

    getWindow: function () {
        return this.getGlobal(this.id).modal;
    },

    getPreview: function () {
        return this.getGlobal(this.id).preview;
    },

    getContentElement: function () {
        return this.getGlobal(this.id).contentElement[this.CONST_WIN_CONTENT_EL];
    },

    getContentElementPreview: function () {
        return this.getGlobal(this.id).contentElement[this.CONST_WIN_PREVIEW_EL];
    },

    getWinWidth: function () {
        return this.CONST_WIN_WIDTH;
    },

    createContentElement: function (id) {
        if(!this.contentElement) {
            this.contentElement = {};
        }
        if($('#' + id).get(0)) {
            this.contentElement[id] = $('#' + id);
            return;
        }
        this.contentElement[id] = $('<div />').attr({
            'id': id
        }).css({
            'display': 'none'
        }).html('<p>&nbsp;</p>');

        $('body').append(this.contentElement[id]);
    },
    
    registerCloseWinEventCall: function() {
        this._evnt().registerCallback('window-closed', function(window) {
            window.isClosed = true;
        }, 'no-reposition');
    }
});

