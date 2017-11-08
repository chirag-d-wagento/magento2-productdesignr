var DD_setup_options_model = DD_ModelBase.extend({

    hoverCanvas: null,

    init: function (obj) {
        this.obj = obj;
        this.hoverCanvas = this._l().getHoverCanvas();
        this._super();
    },
    
    checkedAction: function (checkbox) {
        this.hoverCanvas.fire('object:extra_config', { key: $(checkbox).attr('id'), value: true });
    },

    uncheckedAction: function (checkbox, view) {
        this.hoverCanvas.fire('object:extra_config', { key: $(checkbox).attr('id'), value: false });
    }

});
