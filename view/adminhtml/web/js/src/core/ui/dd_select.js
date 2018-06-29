var DD_select = DD_Uibase.extend({
    
    mainClass: 'dd-select-container',
    labelClass: 'dd-label',
    commentClass: 'dd-comment',
    classSelect: 'select',
    classSelectStyled: 'select-styled',
    
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
        
        var self = this;
        var id = this.options.id ? this.options.id : this.createUUID(); 
        this._label = $('<label />').addClass(this.labelClass)
                .attr('for', id);
        this._label.text(this.options.label);
        
        
        this._select = $('<select />', {
            id: id,
            class: this.classSelect + ' ' + (this.options.class ? this.options.class : '')
        });
        
        this.selectConatiner = $('<div />').addClass(this.classSelectStyled + (this.options.type ? '-' + this.options.type : ''));
        this.selectConatiner.append(this._select);
        
        if(this.options.type){
            this._select.prop(this.options.type, this.options.type);
        }
        $.each(this.options.select, function(index, item) {
            var option = $('<option />').text(item.label)
                    .attr('value', item.value);
            
            if(self.options.values) {
                
                if(self.options.values.indexOf(item.value) != -1) {
                    option.prop('selected', true);
                }
            }
            
            self._select.append(option);
        });
        
        
        this.self.append(this._label);
        this.self.append(this.selectConatiner);
        
        if(this.options.comment) {
            this._comment = $('<div />').addClass(this.commentClass);
            this._comment.text(this.options.comment);
            this.self.append(this._comment);
        }
        
    },
    
    _callBackModel: function (model) {
        if (!model || !model.selectAction) {
            return;
        }
    
        this._select.on('change', function () {
            model.selectAction.call(model, $(this));
        });
    }
    
    
});
