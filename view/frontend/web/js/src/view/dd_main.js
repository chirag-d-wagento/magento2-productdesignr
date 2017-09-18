var DD_main = DD_panel.extend({
    object_id: 'dd-main-panel',
    class_name: 'dd-designer-container',
    model: 'DD_Main_Model',

    init: function (parent) {
        var self = this;
        this.parent = parent;
        this._super({
            'id': this.object_id,
            'class': this.class_name,
            'parent': parent
        });
        this.add();
        this.self.on('click', function() {
            self._evnt().doCall(self.model.clickEventName());
        });
        
    },
    
    _addElements: function() {
        this.addTopControls();
        if(this._s('history')) {
            this.addHistoryControls();
        }
        this.addMainControls();
    },
    
    addTopControls: function() {
        new DD_Topcontrols(this.self);
    },
    
    addMainControls: function() {
        new DD_Maincontrols(this.self);
    },
    
    addHistoryControls: function() {
        new DD_Historycontrols(this.self);
    }
});
