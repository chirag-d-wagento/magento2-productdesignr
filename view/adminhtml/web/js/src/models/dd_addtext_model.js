var DD_AddText_Model = DD_ModelBase.extend({
    
    init: function (obj) {
        this.obj = obj;
        this._super(obj);
    },
    
    getWindowTitle: function() {
        return this._('add_text_to_image');
    },
    
    setWindowContent: function(parent) {
        this.form = new DD_windowTextForm(parent);
        this.setSaveTextEvent();
    },
    
    setSaveTextEvent: function() {
        var textarea = this.form.get().find('textarea');
        var self = this;
        this.form.get().find('button').on('click', function() {
            //alert(textarea.val());
            var text = textarea.val();
            if(text.trim() == '') {
                textarea.addClass('empty');
            }else{
                textarea.removeClass('empty');
                textarea.addClass('valid');
                new DD_Layer_Text({
                    text: text.trim()
                });
                self.closeWindow();
            }
        });
    }
});
