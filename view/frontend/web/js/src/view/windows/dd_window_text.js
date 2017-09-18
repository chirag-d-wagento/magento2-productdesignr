var DD_windowTextForm = DD_panel.extend({
    object_id: 'dd-add-text-form',
    
    init: function(parent) {
        var options = {
            parent: parent,
            id: this.object_id
        }
        this._super(options);
        this.add();
    },
    
    _addElements: function() {
        this.addTextArea();
        this.addSaveButton();
    },
    
    addTextArea: function() {
        this.textArea = $('<textarea />').attr('class', 'dd-add-text-textarea');
        this.self.append(this.textArea);
    },
    
    addSaveButton: function() {
        new DD_button({
            'id': 'dd-add-text-button',
            'parent': this.self,
            'text': this._('Add Text')
        });
    }
});
