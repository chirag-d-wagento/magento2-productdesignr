var DD_Historycontrols = DD_panel.extend({
    object_id: 'dd-history-controls',
    class_name: 'dd-designer-history-controls',
    
    init: function (parent) {
        this.parent = parent;
        this._super({
            'id': this.object_id,
            'class': this.class_name,
            'parent': parent
        });
        this.add();
    },
    
    _addElements: function() {
        this.addBackButton();
        this.addNextButton();
    },
    
    addNextButton: function() {
        new DD_historyNextButton(this.self);
    },
    
    addBackButton: function() {
        new DD_historyBackButton(this.self);
    }
});
