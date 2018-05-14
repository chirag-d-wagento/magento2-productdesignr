var DD_ImportFbButton = DD_button.extend({
    object_id: 'dd-import-fb-button',
    class_name: 'dd-add-text-controls fa-facebook fa full-width',
    model: 'DD_ImportFb_Model',
    content: null,
    contentImages: null,
    
    init: function(parent, content, contentImages) {
        var options = {
            parent: parent,
            id: this.object_id,
            class: this.class_name,
            label: this._('import_from_fb')
        }
        this.content = content;
        this.contentImages = contentImages;
        this._super(options);
    },
    
    _callBackModel: function (model) {
        model.setClickEvents();
    }
})

