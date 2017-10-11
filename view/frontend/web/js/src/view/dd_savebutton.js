var DD_saveButton = DD_button.extend({
    object_id: 'dd-main-save-button',
    class_name: 'dd-main-button fa-check-square fa',
    model: 'DD_Callback_Model',

    init: function (parent, callback) {
        this._callback = callback;
        var options = {
            parent: parent,
            id: this.object_id,
            class: this.class_name,
            tooltip_text: this._('save'),
            fa: true,
            tooltip: true
        }
        this._super(options);
    },

    _callBackModel: function (model) {
        var self = this;
        this.callback = function () {
            this.self.removeClass('fa-check-square')
                    .addClass('fa-circle-o-notch')
                    .addClass('fa-spin');
            
            self._callback.call();
        };
        
        model.destroy = function () {
            if (self.tooltipBox) {
                self.tooltipBox.destroy();
            }
        }
        
        model._callbackClick();
    }
});

