var DD_Uibase = DD_object.extend({
    options: {},

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
        var model = this._onAfterCreate();
        if (model) {
            model.registerEvents();
            return model;
        }
    },

    _onBeforeCreate: function () {
        this.windowInit();
    },

    _onAfterCreate: function () {
        var model = null;
        if (this.model) {
            eval("try {model = new " + this.model + "(this); }catch(err) {console.log('ERROR FOR MODEL: " + this.model + "; ERRTXT: ' + err + '; err.lineNumber: ' + err.lineNumber)}");
        }
        if (this.options.windowOpener && model) {
            this.addWindowOpenEvent(this, model, this.modal, this.options);
        }
        if (model) {
            return model;
        }
    },

    addWindowOpenEvent: function (me, model, modal, options) {
        var obj = me.get();
        $(obj).on('click', function () {
            if (!options.windowPreview) {
                var window = modal.getWindow();
                var contentElement = modal.getContentElement();
            } else {
                var window = modal.getPreview();
                var contentElement = modal.getContentElementPreview();
            }

            contentElement.empty();
            model.setWindowContent(contentElement);
            model.setWindow(window);

            window.setTitle(model.getWindowTitle())
            window.open({});

            if (!window.isClosed && !options.windowPreview) {
                window.position({target: $('.canvas-container')});
            }
        });
    },

    windowInit: function () {
        if (!this.winInit) {
            this.modal = new DD_Window();
            this.winInit = true;
        }
    }

});
