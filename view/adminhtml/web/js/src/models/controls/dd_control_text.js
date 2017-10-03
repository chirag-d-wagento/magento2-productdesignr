var DD_control_text = DD_Control_Base_Model.extend({
    init: function (obj) {
        this._super(obj);
    },
    
    _addControls: function () {
        this.addDelete();
    },
    
    addDelete: function() {
        var self = this;
        var _delete = this.obj.addDeleteBase();
        _delete.get().on('click', function() {
            self.removeBase();
        });
    }
})
