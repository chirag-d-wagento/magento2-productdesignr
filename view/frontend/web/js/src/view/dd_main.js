var DD_main = DD_panel.extend({
    object_id: 'dd-main-panel',
    class_name: 'dd-designer-container clearfix',
    model: 'DD_Main_Model',

    init: function (parent, options) {
        this.options = options;
        this._super({
            'id': this.object_id,
            'class': this.class_name,
            'parent': parent
        });
    },
    
    create: function() {
        return this.add();
    },
    
    _addElements: function() {
        new DD_Topcontrols(this.self.parent());
        
        if(this._s('history')) {
            new DD_Historycontrols(this.self);
        }
        new DD_Maincontrols(this.self);
        
    }
});
