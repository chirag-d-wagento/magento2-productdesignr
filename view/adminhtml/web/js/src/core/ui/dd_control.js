var DD_control = DD_Uibase.extend({
    mainClass: 'dd-helper-popup',
    contentAdded: false,
    init: function (options) {
        this.options = $.extend((options ? options : {}), this.options);
        if (!this.options.fabricObject) {
            return;
        }
        if (!this.options.fabricObject.controlModel) {
            return;
        }
        this.model = this.options.fabricObject.controlModel;
        this._super(this.options.id);
        this.self = $('<div />', {
            id: this.getId(),
            class: this.mainClass + ' ' + (this.options.class ? this.options.class : '')
        });
        this._add();
    },
    
    _addElements: function() {
        this.addButtonPanel();
        this.addContentControls();
    },

    _callBackModel: function (model) {
        model._initBase();
        model.hideContentEvent();
    },

    addContentControls: function () {
        this.contentContainer = new DD_panel({
            'parent': this.self,
            'class': 'dd-helper-popup-content-container clearfix'
        });
        this.contentContainer._add();
        this.content = new DD_panel({
            'parent': this.contentContainer.get(),
            'class': 'dd-helper-popup-content'
        });
        this.content._add();
        this._closeContent = new DD_button({
            'parent': this.contentContainer.get(),
            //'text': this._('delete'),
            'class': 'fa fa-angle-double-up dd-helper-popup-content-close'
        });
    },

    addButtonPanel: function () {
        this.buttons = new DD_panel({
            'parent': this.self,
            'class': 'dd-helper-popup-buttons clearfix'
        });
        this.buttons._add();
    },

    addDeleteBase: function () {
        this._delete = new DD_button({
            'parent': this.buttons.get(),
            //'text': this._('delete'),
            'class': 'fa fa-trash'
        });

        return this._delete;
    },

    addRotateBase: function () {
        this._rotate = new DD_button({
            'parent': this.buttons.get(),
            //'text': this._('delete'),
            'class': 'fa fa-refresh'
        });

        return this._rotate;
    },

    addSaveBase: function () {
        this._save = new DD_button({
            'parent': this.buttons.get(),
            //'text': this._('save'),
            'class': 'fa fa-floppy-o'
        });

        return this._save;
    },

    addSizeBase: function () {
        this._size = new DD_button({
            'parent': this.buttons.get(),
            //'text': this._('save'),
            'class': 'fa fa-arrows fa-rotate-45'
        });

        return this._size;
    },

    addControlBase: function (attrs) {
        this.control = $('<input>').attr({'type': 'range'}).addClass('dd-helper-range');
        if(attrs) {
            this.control.attr(attrs);
        }
        this.content.get().append(this.control);
    }

});
