var DD_setup_texts_model = DD_AddText_Model.extend({
    
    init: function (obj) {
        this.obj = obj;
        this._super(obj);
    },
    
    addEditTextEvent: function(button, view) {
        view.addWindowOpenEvent(button.get(), this, this.obj.modal, this.obj.options);
    }
    
});
