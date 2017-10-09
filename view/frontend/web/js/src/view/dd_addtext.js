var DD_AddtextButton = DD_button.extend({
    object_id: 'dd-add-text-button',
    class_name: 'dd-add-text-controls fa-file-text-o fa',
    model: 'DD_AddText_Model',
    
    init: function(parent) {
        var options = {
            parent: parent,
            id: this.object_id,
            class: this.class_name,
            tooltip_text: this._('add_text'),
            windowOpener: true,
            fa: true,
            tooltip: true
        }
        this._super(options);
    }
})

