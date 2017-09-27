var DD_setup_info = DD_panel.extend({
    class_name: 'dd-setup-image-info',

    init: function (parent, imgOptions) {
        this.parent = parent;
        this.imgOptions = imgOptions;
        this._super({
            'class': this.class_name,
            'parent': parent
        });
        this.add();
        //this.addElements();
    },
    
    _addElements: function() {
        this.self
                .append($('<h3 />').text(this._('product_sku') + ': ' + this.imgOptions.sku))
                .append($('<div />').text(this._('image_src') + ': ' + this.imgOptions.src))
                .append($('<div />').text(this._('width') + ': ' + this.imgOptions.width + 'px'))
                .append($('<div />').text(this._('height') + ': ' + this.imgOptions.height + 'px'))
                .append($('<div />').text(this._('media_id') + ': ' + this.imgOptions.media_id))
                .append($('<div />').text(this._('product_id') + ': ' + this.imgOptions.product_id));
    }


});
