var DD_panel = DD_Uibase.extend({
    mainClass: 'panel',
    init: function (options) {
        this.options = $.extend(( options ? options : {} ) , this.options);
        if(!this.parent ) {
            this.parent = this.options.parent;
        }
        this._super(this.options.id);
        this.selfBase();
    },
    
    add: function() {
        this._add();
    }
});
