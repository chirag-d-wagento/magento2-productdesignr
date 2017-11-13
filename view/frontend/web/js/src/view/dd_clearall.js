var DD_clearAllButton = DD_button.extend({
    class_name: 'dd-main-button fa-scissors fa',
    
    init: function (parent) {
        var options = {
            parent: parent,
            id: this.object_id,
            class: this.class_name,
            tooltip_text: this._('clear_all'),
            fa: true,
            tooltip: true,
            tooltip_position: {
                x: 'center',
                y: 'top'
            },
            tooltip_outside: 'y'
        }
        this._super(options);
    }

});
