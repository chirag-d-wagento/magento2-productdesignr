var DD_setup_images_model = DD_AddPhoto_Model.extend({
    
    init: function (obj) {
        this.obj = obj;
        this._super(obj);
    },
    
    addEditImageEvent: function(button, view) {
        view.addWindowOpenEvent(button.get(), this, this.obj.modal, this.obj.options);
    }
    
});
