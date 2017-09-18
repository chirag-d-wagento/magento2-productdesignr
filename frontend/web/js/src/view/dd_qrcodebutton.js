var DD_qrButton = DD_button.extend({
    object_id: 'dd-main-qrcode-button',
    class_name: 'dd-main-button',
    
    init: function(parent) {
        var options = {
            parent: parent,
            id: this.object_id,
            class: this.class_name,
            text: this._('add_qrcode')
        }
        this._super(options);
    }
});

