var DD_ImageLinkAdd = DD_Uibase.extend({
    
    mainClass: 'dd-image-link',
    defaultImageClass: 'size-medium',
    model: 'DD_ImageLink_Model',
    
    init: function(options) {
        this.options = options;
        this._super(this.options.id);
        this.self = $('<a />', {
            id: this.getId(),
            class: this.mainClass + ' ' + (this.options.class ? this.options.class : this.defaultImageClass),
            href: 'javascript:void(0)',
            "data-src": options.src,
            "data-width": options.width,
            "data-height": options.height
        });
        this._add();
    },
    
    _addElements: function() {
        this.image = $('<img />', {
            src: this.options.src
        });
        this.self.append( this.image );
    },
    
    _callBackModel: function (model) {
        model.setClickEvents();
    }
    
});
