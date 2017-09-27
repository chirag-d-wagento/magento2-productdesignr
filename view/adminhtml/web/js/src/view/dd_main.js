var DD_main = DD_panel.extend({
    object_id: 'dd-main-panel',
    class_name: 'dd-designer-container clearfix',
    model: 'DD_Main_Model',

    init: function (parent, options) {
        var self = this;
        this.options = options;
        this._super({
            'id': this.object_id,
            'class': this.class_name,
            'parent': parent
        });
        this.add();
    },
    
    _addElements: function() {
        new DD_Topcontrols(this.self);
        if(this._s('history')) {
            new DD_Historycontrols(this.self);
        }
        new DD_Maincontrols(this.self);
        new DD_setup(this.getParent(), this.options);
    }
});
