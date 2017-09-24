var DD_setup_layer_model = DD_ModelBase.extend({

    checkedAction: function (checkbox, view) {
        console.log(view);
        view.button.get().prop('disabled', false);
    },

    uncheckedAction: function (checkbox, view) {
        console.log(view);
        view.button.get().prop('disabled', true);
    },

    addEditLayerEvent: function (button, view) {
        button.get().on('click', function () {
            new DD_Layer_Mask(view.imgOptions);
        });
    }

});
