var DD_control_mask = DD_Control_Base_Model.extend({
    init: function (obj) {
        this._super(obj);
    },
    _addControls: function () {
        this.addDelete();
        this.addSave();
        this.addRotate();
        this.addSize();
    },
    addDelete: function () {
        var _delete = this.obj.addDeleteBase();
    },
    addRotate: function() {
        var _rotate = this.obj.addRotateBase();
    },
    addSize: function() {
        var _size = this.obj.addSizeBase();
    },
    addSave: function () {
        var self = this;
        var _save = this.obj.addSaveBase();
        _save.get().on('click', function () {
            self._l().getMask().eventSave.call();
        });
    }
});
