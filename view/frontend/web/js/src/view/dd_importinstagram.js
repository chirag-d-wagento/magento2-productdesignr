var DD_ImportInstagramButton = DD_button.extend({
    object_id: 'dd-import-fb-button',
    class_name: 'dd-add-text-controls fa-instagram fa full-width',
    model: 'DD_ImportInstagram_Model',
    content: null,
    contentImages: null,
    
    init: function(parent, content, contentImages) {
        var options = {
            parent: parent,
            id: this.object_id,
            class: this.class_name,
            label: this._('import_from_instagram')
        }
        this.content = content;
        this.contentImages = contentImages;
        this._super(options);
    },
    
    _callBackModel: function (model) {
        model.setClickEvents();
    }
})

