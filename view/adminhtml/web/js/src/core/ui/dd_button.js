var DD_button = DD_Uibase.extend({
    mainClass: 'button',
    init: function (options) {
        this.options = options ? options : {};
        this._super(this.options.id);
        this.self = $('<button />', {
            id: this.getId(),
            class: this.mainClass + ' ' + (this.options.class ? this.options.class : ''),
            text: (this.options.text ? this.options.text : '')
        });
        this.add();
    },
    
    add: function() {
        this._add();
    }
});


