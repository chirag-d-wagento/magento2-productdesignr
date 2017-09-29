var DD_control = DD_Uibase.extend({
    mainClass: 'dd-helper-popup',
    init: function (options) {
        this.options = $.extend(( options ? options : {} ) , this.options);
        if(!this.options.fabricObject) {
            return;
        }
        if(!this.options.fabricObject.controlModel) {
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
    
    _callBackModel: function(model) {
        model.initPosition();
    },
    
    addDeleteBase: function() {
        var _delete = new DD_button({
            'parent': this.get(),
            //'text': this._('delete'),
            'class': 'fa fa-trash'
        });
        
        return _delete;
    },
    
    addRotateBase: function() {
        var _rotate = new DD_button({
            'parent': this.get(),
            //'text': this._('delete'),
            'class': 'fa fa-undo'
        });
        
        return _rotate;
    },
    
    addSaveBase: function() {
        var _save = new DD_button({
            'parent': this.get(),
            //'text': this._('save'),
            'class': 'fa fa-floppy-o'
        });
        
        return _save;
    },
    
    addSizeBase: function() {
        var _size = new DD_button({
            'parent': this.get(),
            //'text': this._('save'),
            'class': 'fa fa-arrows'
        });
        
        return _size;
    },
    
    
    remove: function() {
        
    }
});
