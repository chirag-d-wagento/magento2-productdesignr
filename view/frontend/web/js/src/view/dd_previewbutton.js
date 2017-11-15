var DD_previewButton = DD_button.extend({
    object_id: 'dd-main-preview-button',
    class_name: 'dd-main-button fa fa-eye',
    model: 'DD_Privew_Model',
    
    init: function(parent, mainModel) {
        this.mainModel = mainModel;
        var options = {
            parent: parent,
            id: this.object_id,
            class: this.class_name,
            tooltip_text: this._('preview'),
            fa: true,
            tooltip: true,
            tooltip_position: {
                x: 'center',
                y: 'top'
            },
            tooltip_outside: 'y'
        }
        this._super(options);
    },
    
    _callBackModel: function(model) {
        model.addPreviewEvent(this.mainModel);
    }
});

