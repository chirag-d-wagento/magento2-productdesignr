var DD_closeButton = DD_button.extend({
    object_id: 'dd-main-save-button',
    class_name: 'dd-main-button-cancel fa fa-times',
    model: 'DD_Callback_Model',

    init: function (parent, callback) {
        this.callback = callback;
        var options = {
            parent: parent,
            id: this.object_id,
            class: this.class_name,
            tooltip_text: this._('close'),
            tooltip: true
        }
        this._super(options);
    },

    _callBackModel: function (model) {
        var self = this;
        model.destroy = function () {
            if (self.tooltipBox) {
                self.tooltipBox.destroy();
            }
        }
        model._callbackClick();
    }
});

