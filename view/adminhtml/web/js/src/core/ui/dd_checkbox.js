var DD_checkbox = DD_Uibase.extend({
    mainClass: 'dd-checkbox-container',
    labelClass: 'dd-label',
    init: function (options) {
        this.options = $.extend((options ? options : {}), this.options);
        if(this.options.model) {
            this.model = this.options.model;
        }
        this._super(this.options.id);
        this.selfBase();
        this._add();
        this.checkbox = $('<input />', {
            id: this.createUUID(),
            class: this.mainClass + ' ' + (this.options.class ? this.options.class : ''),
            type: 'checkbox'
        });
        if(this.checked) {
            this.checkbox.attr({
                'checked': true
            }).prop('checked');
        }
        this.self.append(this.checkbox);
        
        if(this.options.text) {
            this.self.append($('<label />')
                    .addClass(this.labelClass)
                    .attr({'for': this.checkbox.attr('id')})
                    .text(this.options.text));
        }
        if(!this.model || !this.model.checkedAction || !this.model.uncheckedAction) {
            return;
        }
        var self = this;
        this.checkbox.on('click', function() {
            if($(this).is(':checked')) {
                self.model.checkedAction.call(self.model, this, self.options.view);
            }else{
                self.model.uncheckedAction.call(self.model, this, self.options.view);
            }
        });
        setTimeout(function() {
            if(self.checked) {
                self.model.checkedAction.call(self.model, self.checkbox, self.options.view);
                return;
            }
            self.model.uncheckedAction.call(self.model, self.checkbox, self.options.view);
        }, 100);
    }
});
