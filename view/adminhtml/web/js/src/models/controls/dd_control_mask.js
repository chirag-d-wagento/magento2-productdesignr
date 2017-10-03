var DD_control_mask = DD_Control_Base_Model.extend({
    init: function (obj) {
        this._super(obj);
    },
    _addControls: function () {
        this.addDelete();
        this.addSave();
        this.obj.addRotateBase();
        this.obj.addSizeBase();
      
        this.baseEvents();
    },
    addDelete: function () {
        var _delete = this.obj.addDeleteBase();
        var self = this;
        _delete.get().on('click', function() {
            self.removeBase();
            self._l().setMask(null)
        });
    },
    addSave: function () {
        var self = this;
        var _save = this.obj.addSaveBase();
        _save.get().on('click', function () {
            self._l().getMask().eventSave.call();
        });
    }
});
