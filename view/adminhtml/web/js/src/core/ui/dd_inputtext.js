var DD_inputText = DD_Uibase.extend({
    
    mainClass: 'dd-input-text-container',
    labelClass: 'dd-label',
    commentClass: 'dd-comment',
    defaultType: 'text',
    
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
        this._label = $('<div />').addClass(this.labelClass);
        this._label.html(this.options.label);
        this._input = $('<input />', {
            id: this.options.id ? this.options.id : this.createUUID(),
            class: ' ' + (this.options.class ? this.options.class : ''),
            type: this.options.type ? this.options.type : this.defaultType
        });
        if(this.options.value) {
            this._input.val(this.options.value);
        }
        if(this.options['data-type']) {
            this._input.attr({
                'data-type': this.options['data-type']
            });
        }
        this.self.append(this._label);
        this.self.append(this._input);
        
        if(this.options.comment) {
            this._comment = $('<div />').addClass(this.commentClass);
            this._comment.text(this.options.comment);
            this.self.append(this._comment);
        }
    },
    
    _callBackModel: function (model) {
        if (!model || !model.keyupAction) {
            return;
        }
        var self = this;
        this._input.on('keyup', function () {
            model.keyupAction.call(model, $(this));
        });
    }
    
});
