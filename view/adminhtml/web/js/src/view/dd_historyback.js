var DD_historyBackButton = DD_button.extend({
    object_id: 'dd-history-back-button',
    class_name: 'dd-history-controls',
    
    init: function(parent) {
        var options = {
            parent: parent,
            id: this.object_id,
            class: this.class_name,
            text: this._('back')
        }
        this._super(options);
    }
});

