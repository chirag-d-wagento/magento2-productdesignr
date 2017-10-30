var DD_Category = DD_panel.extend({
    
    class_name: 'dd-designer-category',
    
    init: function (options) {
        this.parent = options.parent;
        this.data = options.data;
        
        this._model = options.model;
        this._super({
            'class': this.class_name,
            'parent': this.parent
        });
        
        this.add();
    },
    
    _addElements: function() {
        this.self.append($('<a />')
                .append($('<span />').addClass('fa-folder-open fa'))
                .append(this.data.name));
        
        this._model.addOnCategoryEvent(this.self, this.parent, this.data.name);
        
    },
    
});
