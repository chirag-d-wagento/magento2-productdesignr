var DD_control_text = DD_Control_Base_Model.extend({
    init: function (obj) {
        this._super(obj);
    },
    
    _addControls: function () {
        this.addDelete();
        this.obj.addRotateBase();
        this.obj.addSizeBase();
        this.addFontSelector();
        
        this.baseEvents();
    },
    
    addFontSelector: function() {
        var self = this;
        var _selector = new DD_button({
            'parent': this.obj.buttons.get(),
            //'text': this._('save'),
            'class': 'fa fa-font'
        });
        _selector.get().on('click', function() {
            self.showTextSetting();
        });
    },
    
    showTextSetting: function() {
        var content = this.obj.content.get();
    },
    
    addDelete: function() {
        var self = this;
        var _delete = this.obj.addDeleteBase();
        _delete.get().on('click', function() {
            self.removeBase();
        });
    }
})
