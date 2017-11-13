var DD_downloadButton = DD_button.extend({
    class_name: 'dd-main-button fa-download fa',
    model: 'DD_Download_Model',
    
    init: function (parent, mainModel) {
        this.mainModel = mainModel;
        var options = {
            parent: parent,
            id: this.object_id,
            class: this.class_name,
            
            tooltip_text: this._('download'),
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
        model.addDownloadEvent(this.mainModel);
    }

});
