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
            self._l().getMask().eventRestore.call();

        });
    }

});
