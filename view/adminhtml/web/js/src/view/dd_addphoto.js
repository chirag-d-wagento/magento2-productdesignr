var DD_AddphotoButton = DD_button.extend({
    object_id: 'dd-add-photo-button',
    class_name: 'dd-add-photo-controls fa fa-file-image-o',
    model: 'DD_AddPhoto_Model',
    
    init: function(parent) {
        var options = {
            parent: parent,
            id: this.object_id,
            class: this.class_name,
            tooltip_text: this._('add_photo'),
            windowOpener: true,
            fa: true,
            tooltip: true
        }
        this._super(options);
    }
});
