var DD_checkbox = DD_Uibase.extend({
    mainClass: 'dd-checkbox-container',
    labelClass: 'dd-label',
    init: function (options) {
        this.options = $.extend((options ? options : {}), this.options);
        if (this.options.model) {
            this.model = this.options.model;
        }
        this._super();
        this.selfBase();
        this._add();
    },

    _addElements: function () {
        this._checkbox = $('<input />', {
            id: this.options.id ? this.options.id : this.createUUID(),
            class: this.mainClass + ' ' + (this.options.class ? this.options.class : ''),
            type: 'checkbox'
        });
        if (this.options.checked) {
            this._checkbox.attr({
                'checked': true
            }).prop('checked');
        }
        this.self.append(this._checkbox);

        if (this.options.text) {
            this.self.append($('<label />')
                    .addClass(this.labelClass)
                    .attr({'for': this._checkbox.attr('id')})
                    .text(this.options.text));
        }
    },

    _callBackModel: function (model) {
        if (!model || !model.checkedAction || !model.uncheckedAction) {
            return;
        }
        var self = this;
        this._checkbox.on('click', function () {
            if ($(this).is(':checked')) {
                model.checkedAction.call(model, this, self.options.view);
            } else {
                model.uncheckedAction.call(model, this, self.options.view);
            }
        });
        setTimeout(function () {
            if (self.checked) {
                model.checkedAction.call(model, self._checkbox, self.options.view);
                return;
            }
            model.uncheckedAction.call(model, self._checkbox, self.options.view);
        }, 10);
    }
});
