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
    
    remove: function() {
        
    }
});
