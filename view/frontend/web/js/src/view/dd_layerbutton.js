var DD_layerButton = DD_button.extend({
    object_id: 'dd-main-layer-button',
    class_name: 'dd-main-button fa-database fa',
    
    init: function(parent) {
        var options = {
            parent: parent,
            id: this.object_id,
            class: this.class_name,
            tooltip_text: this._('layers'),
            tooltip_position: {
                x: 'center',
                y: 'top'
            },
            tooltip_outside: 'y',
            fa: true,
            tooltip: true
        }
        this._super(options);
    }
});

