var DD_control_text = DD_Control_Base_Model.extend({
    containerClass: 'dd-helper-control-text',

    init: function (obj) {
        this._super(obj);
    },

    _addControls: function () {

        var extraConfig = this._s('extra_config');
        this.obj.contentContainer.get().addClass(this.containerClass);
        this.addDelete();

        if (!extraConfig.disable_text_rotate) {
            this.obj.addRotateBase();
        }

        if (!extraConfig.disable_text_resize) {
            this.obj.addSizeBase();

        }
        this.addFontSelector();
        this.addEdit();

        this.baseEvents();
    },

    addEdit: function () {
        var self = this;
        var edit = this.obj.addEditBase();


        edit.get().on('click', function () {
            self.showEditForm();
        });
    },

    showEditForm: function () {
        var content = this.obj.content.get();
        content.empty();
        var fabricObject = this.obj.options.fabricObject;
        var text = fabricObject.text;
        var form = new DD_windowTextForm(content, text);
        this.obj.contentContainer.get().show();
        this.setEditEvents(form);
    },

    setEditEvents: function (form) {
        var self = this;
        var textarea = form.get().find('textarea');
        var extraConfig = this.getExtraConfig();
        if (extraConfig.max_text_chars) {
            var maxChars = extraConfig.max_text_chars;
            var errorPlace = form.get().find('.dd-add-text-errors');
            textarea.on('keyup', function () {

                if ($(this).val().length > maxChars) {
                    var val = $(this).val().substring(0, maxChars);
                    $(this).val(val);
                    errorPlace.html(self._('maximum_chars_count') + ' ' + maxChars);
                }
            });
        }
        form.get().find('button').on('click', function () {
            var text = textarea.val();
            if (text.trim() == '') {
                textarea.addClass('empty');
            } else {
                textarea.removeClass('empty');
                textarea.addClass('valid');
                self.setFabricObjVal("text", text.trim());
                self.obj.contentContainer.get().hide();
            }
        });

        setTimeout(function () {
            $(textarea).focus();
        }, 0);
    },
    
    getExtraConfig: function() {
        return this._s('extra_config');
    },

    addFontSelector: function () {
        var self = this;
        var _selector = new DD_button({
            'parent': this.obj.buttons.get(),
            //'text': this._('save'),
            'class': 'fa fa-font'
        });
        _selector.get().on('click', function () {
            self.showTextSetting();
        });
    },

    setBgColor: function (color, model) {
        var setColor = color ? color.toHexString() : null;
        model.setFabricObjVal("backgroundColor", setColor);
    },

    setFontColor: function (color, model) {

        var setColor = color ? color.toHexString() : null;
        model.setFabricObjVal("fill", setColor);
    },

    setFont: function (font, model) {
        model.setFabricObjVal("fontFamily", font);
    },

    showTextSetting: function () {
        var extraConfig = this._s('extra_config');
        var fabricObject = this.obj.options.fabricObject;

        var color = fabricObject.fill;
        var bg = fabricObject.backgroundColor;
        var font = fabricObject.fontFamily;
        var content = this.obj.content.get();
        content.empty();
        if (!extraConfig.background_color_text_disable) {
            this.obj.colorSelector(content, this._('background_color'), bg, this.setBgColor, this);
        }
        if (!extraConfig.text_color_disable) {
            this.obj.colorSelector(content, this._('text_color'), color, this.setFontColor, this);
        }
        var fonts = null;
        if (extraConfig.fonts) {
            fonts = extraConfig.fonts;
        }
        this.obj.fontSelector(content, font, this.setFont, this, fonts);

        this.obj.contentContainer.get().show();
    },

    addDelete: function () {
        var self = this;
        var _delete = this.obj.addDeleteBase();
        _delete.get().on('click', function () {
            self.removeBase();
        });
    },

    handleActive: function () {
        this.showEditForm();
    }
})
