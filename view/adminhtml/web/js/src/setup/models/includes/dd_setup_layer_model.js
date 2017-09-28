var DD_setup_layer_model = DD_ModelBase.extend({

    init: function (obj) {
        this.obj = obj;
        this._super();
    },

    checkedAction: function (checkbox, view) {
        view.button.get().prop('disabled', false);
    },

    uncheckedAction: function (checkbox, view) {
        view.button.get().prop('disabled', true);
    },

    addEditLayerEvent: function (button, view) {
        var self = this;
        button.get().on('click', function () {
            if (!self._l().getMask()) {
                return new DD_Layer_Mask();
            }
            
            self._l().getHoverCanvas().clipTo = null;
            /*
            function ____(ctx) {
                var mask = self._l().getBgCanvas();
                var zoom = self._l().getHoverCanvas().getZoom();
                var top = mask.get('top');
                var left = mask.get('left');
                var width = mask.get('width') * mask.get('scaleX');
                var height = mask.get('height') * mask.get('scaleY');
                ctx.rect(top, left, width, height);
                ctx.save();
            }
            */
            self._l().getMask().hasControls = true;
            self._l().getMask().selectable = true;
                
            self._l().getMask().setOpacity(0.4);
            self._l().getHoverCanvas().setActiveObject(self._l().getMask());
            self._l().getHoverCanvas().setBackgroundColor('transparent');
            self._l().getHoverCanvas().renderAll();

        });
    }

});
