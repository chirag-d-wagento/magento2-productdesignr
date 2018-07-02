var DD_windowTextForm = DD_panel.extend({
    object_id: 'dd-add-text-form',
    errorPlace: null,
    
    init: function(parent, value) {
        var options = {
            parent: parent,
            id: this.object_id
        }
        this.value = value;
        this._super(options);
        this.add();
    },
    
    _addElements: function() {
        this.addTextArea();
        this.addSaveButton();
    },
    
    addTextArea: function() {
        this.errorPlace = $('<div />').attr('class', 'dd-add-text-errors');
        this.textArea = $('<textarea />').attr('class', 'dd-add-text-textarea');
        if(this.value) {
            this.textArea.val(this.value);
        }
        this.self.append(this.errorPlace);
        this.self.append(this.textArea);
    },
    
    addSaveButton: function() {
        new DD_button({
            'id': 'dd-add-text-button',
            'parent': this.self,
            'text': this.value ? this._('update_text'): this._('add_text')
        });
    }
});
