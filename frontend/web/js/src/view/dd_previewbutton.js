var DD_previewButton = DD_button.extend({
    object_id: 'dd-main-preview-button',
    class_name: 'dd-main-button',
    
    init: function(parent) {
        var options = {
            parent: parent,
            id: this.object_id,
            class: this.class_name,
            text: this._('preview')
        }
        this._super(options);
    }
});

