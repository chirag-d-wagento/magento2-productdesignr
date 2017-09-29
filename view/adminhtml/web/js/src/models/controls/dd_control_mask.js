var DD_control_mask = DD_Control_Base_Model.extend({
    init: function (obj) {
        this._super(obj);
    },
    _addControls: function () {
        this.addDelete();
        this.addSave();
    },
    addDelete: function () {
        var _delete = new DD_button({
            'parent': this.obj.get(),
            //'text': this._('delete'),
            'class': 'fa fa-trash'
        });
    },
    addSave: function () {
        var self = this;
        var _save = new DD_button({
            'parent': this.obj.get(),
            //'text': this._('save'),
            'class': 'fa fa-floppy-o'
        });
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
