var DD_admin_image = DD_panel.extend({  
    class_name: 'dd-admin-product-image',
    class_selected: 'fa fa-check-square-o',
    class_unselected: 'fa fa-square-o',
    model: 'DD_Admin_Image_Model',
    
    init: function (parent, imgOptions) {
        this.imgOptions  = imgOptions;
        
        this._super({
            'class': this.class_name,
            'parent': parent
        });
        this.add();
        this.addImage();
    },
    
    addImage: function(){
        this.img = $('<img />').attr('src', this.imgOptions.src);
        this.self.append(this.img);
        this.model.registerImage(this.self, this.imgOptions);
        this.addSelectedIcons();
    },
    
    
    addSelectedIcons: function() {
        this.self.append($('<span />').addClass(this.class_selected));
        this.self.append($('<span />').addClass(this.class_unselected));
    }
});