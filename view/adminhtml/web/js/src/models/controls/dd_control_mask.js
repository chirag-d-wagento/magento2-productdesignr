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
            self._l().getHoverCanvas().clipTo = function (ctx) {
                var object = self._l().getMask();
                var oCoords = object.oCoords;
                ctx.strokeStyle = '#ccc';
                ctx.beginPath();
                ctx.moveTo(oCoords.tl.x, oCoords.tl.y);
                ctx.lineTo(oCoords.tr.x, oCoords.tr.y);
                ctx.lineTo(oCoords.br.x, oCoords.br.y);
                ctx.lineTo(oCoords.bl.x, oCoords.bl.y);
                ctx.closePath();
                ctx.stroke();
                ctx.save();
            }
            self._l().getHoverCanvas().setBackgroundColor('rgba(255, 255, 153, 0.6)');
            self._l().getMask().hasControls = false;
            self._l().getMask().selectable = false;
            self._l().getMask().controlModelCreated.hide();
            self._l().getMask().setOpacity(0);
            self._l().getHoverCanvas().renderAll();
        });
    }
});
