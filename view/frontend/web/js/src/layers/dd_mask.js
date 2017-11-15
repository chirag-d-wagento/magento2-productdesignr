var DD_Layer_Mask = DD_Layer_Base.extend({

    init: function (maskOptions, notSelect) {
        if (maskOptions) {
            if (maskOptions.type == 'rect') {
                maskOptions.controlModel = 'DD_control_mask';
                return this.addRectLayer(maskOptions, notSelect);
            }
        }
        return this.addRectLayer(false, notSelect);
    },
    addRectLayer: function (conf, notSelect) {
        var parent = this.getParent();
        if (!conf) {
            var conf = {
                opacity: 0.4,
                layerMask: true,
                controlModel: 'DD_control_mask',
                centeredScaling: true
            };

            conf = this.setSize(conf, null, this._s('defaultLayerMaskWidth'));
            conf = this.positionToBase(conf);

        }
        var rect = new fabric.Rect(conf);
        parent.add(rect);
        
        rect.notSelect = notSelect;
        if(!notSelect) {
            parent.setActiveObject(rect);
        }
        parent.renderAll();
        this._l().setMask(rect);
        rect.eventSave = this.save.bind(this);
        rect.eventRestore = this.restore.bind(this);
        this.object = rect;
        this.setDeselectEvent();
        
        return this;
    },

    save: function () {
        var object = this._l().getMask();
        var canvas = this._l().getHoverCanvas();
        canvas.clipTo = function (ctx) {
            var oCoords = object.oCoords;
            ctx.strokeStyle = 'transparent';
            ctx.beginPath();
            ctx.moveTo(oCoords.tl.x, oCoords.tl.y);
            ctx.lineTo(oCoords.tr.x, oCoords.tr.y);
            ctx.lineTo(oCoords.br.x, oCoords.br.y);
            ctx.lineTo(oCoords.bl.x, oCoords.bl.y);
            ctx.closePath();
            ctx.stroke();
            ctx.save();
        }
        canvas.setBackgroundColor('transparent');
        object.hasControls = false;
        object.selectable = false;
        if(object.controlModelCreated) {
            object.controlModelCreated.hide();
        }
        object.setOpacity(0);
        canvas.renderAll();
    },

    restore: function () {
        var object = this._l().getMask();
        var canvas = this._l().getHoverCanvas();
        canvas.clipTo = null;
        object.hasControls = true;
        object.selectable = true;
        object.setOpacity(0.4);
        canvas.setActiveObject(object);
        canvas.setBackgroundColor('transparent');
        canvas.renderAll();
    }
});
