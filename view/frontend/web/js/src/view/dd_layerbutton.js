var DD_layerButton = DD_button.extend({
    object_id: 'dd-main-layer-button',
    class_name: 'dd-main-button fa-database fa',
    model: 'DD_Layers_Model',
    
    init: function(parent) {
        var options = {
            parent: parent,
            id: this.object_id,
            class: this.class_name,
            tooltip_text: this._('layers'),
            fa: true,
            tooltip: true,
            windowOpener: true
        }
        this._super(options);
    }
});

