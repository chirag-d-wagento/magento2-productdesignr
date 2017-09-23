var DD_Uibase = DD_object.extend({

    init: function (id) {
        this._super(id);
    },

    getParent: function () {
        return $(this.options.parent);
    },

    get: function () {
        return this.self;
    },

    selfBase: function (tag) {
        tag = tag ? tag : '<div/>';
        this.self = $(tag, {
            id: this.getId(),
            class: this.mainClass + ' ' + (this.options.class ? this.options.class : ''),
        });
    },

    _add: function () {
        this._onBeforeCreate();
        $(this.options.parent).append(this.self);
        if (this._addElements) {
            this._addElements();
        }
        this._onAfterCreate();
    },

    _onBeforeCreate: function () {
        this.windowInit();
    },

    _onAfterCreate: function () {
        var me = this;
        var model = null;
        if (this.model) {
            eval("try {model = new " + this.model + "(this); }catch(err) {console.log('ERROR FOR MODEL: " + this.model + "; ERRTXT: ' + err)}");
        }
        if (model) {
            this.model = model;
        }
        if (this.options.windowOpener && model) {
            this.self.on('click', function () {
                if(!me.options.windowPreview) {
                    var window = me.modal.getWindow();
                    var contentElement = me.modal.getContentElement();
                }else{
                    var window = me.modal.getPreview();
                    var contentElement = me.modal.getContentElementPreview();
                }
                
                contentElement.empty();
                me.model.opener = me;
                me.model.setWindowContent( contentElement );
                me.model.setWindow(window);
                
                window.setTitle( me.model.getWindowTitle() )
                window.open({});
                
                if(!window.isClosed && !me.options.windowPreview) {
                    window.position({target: $('.canvas-container')});
                }
            });
        }
    },

    windowInit: function () {
        if (!this.winInit) {
            this.modal = new DD_Window();
            this.winInit = true;
        }
    }

});
