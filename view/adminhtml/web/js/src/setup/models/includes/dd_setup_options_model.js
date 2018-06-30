var DD_setup_options_model = DD_ModelBase.extend({

    hoverCanvas: null,

    init: function (obj) {
        this.obj = obj;
        this._super();
    },
    
    checkedAction: function (checkbox) {
        this._l().getHoverCanvas().fire('object:extra_config', { key: $(checkbox).attr('id'), value: true });
    },

    uncheckedAction: function (checkbox) {
        this._l().getHoverCanvas().fire('object:extra_config', { key: $(checkbox).attr('id'), value: false });
    },
    
    keyupAction: function(input) {
        var value = this.parseFloat(input);
        this._l().getHoverCanvas().fire('object:extra_config', { key: input.attr('id'), value: value });
    },
    
    selectAction: function(input){
        this._l().getHoverCanvas().fire('object:extra_config', { key: input.attr('id'), value: input.val() });
    },
    
    parseFloat: function(input) {
        var val = $(input).val();
        var regex = /\d*\.?\d*/g;
        if(val) {
            var match = val.match(regex);
            val = match[0];
        }
        input.val(val);
        
        return val;
    }

});
