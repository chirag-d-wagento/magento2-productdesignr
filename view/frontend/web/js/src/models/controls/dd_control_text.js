var DD_control_text = DD_Control_Base_Model.extend({
    containerClass: 'dd-helper-control-text',

    init: function (obj) {
        this._super(obj);
    },

    _addControls: function () {
        this.obj.contentContainer.get().addClass(this.containerClass);
        this.addDelete();
        this.obj.addRotateBase();
        this.obj.addSizeBase();
        this.addFontSelector();
        this.addEdit();

        this.baseEvents();
    },

    addEdit: function () {
        var self = this;
        var edit = this.obj.addEditBase();
        

        edit.get().on('click', function () {
            var content = self.obj.content.get();
            content.empty();
            var fabricObject = self.obj.options.fabricObject;
            var text = fabricObject.text;
            var form = new DD_windowTextForm(content, text);
            self.obj.contentContainer.get().show();
            self.setEditEvents(form);
        });
    },

    setEditEvents: function (form) {
        var self = this;
        var textarea = form.get().find('textarea');
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
        var fabricObject = this.obj.options.fabricObject;

        var color = fabricObject.fill;
        var bg = fabricObject.backgroundColor;
        var font = fabricObject.fontFamily;
        var content = this.obj.content.get();
        content.empty();
        this.obj.colorSelector(content, this._('background_color'), bg, this.setBgColor, this);
        this.obj.colorSelector(content, this._('text_color'), color, this.setFontColor, this);
        this.obj.fontSelector(content, font, this.setFont, this);

        this.obj.contentContainer.get().show();
    },

    addDelete: function () {
        var self = this;
        var _delete = this.obj.addDeleteBase();
        _delete.get().on('click', function () {
            self.removeBase();
        });
    }
})
