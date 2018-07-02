var DD_AddText_Model = DD_ModelBase.extend({

    init: function (obj) {
        this.obj = obj;
        this._super(obj);
    },

    getWindowTitle: function () {
        return this._('add_text_to_image');
    },

    setWindowContent: function (parent) {
        this.form = new DD_windowTextForm(parent);
        this.setSaveTextEvent();
    },
    
    
    getExtraConfig: function() {
        return this._s('extra_config');
    },

    setSaveTextEvent: function () {
        var textarea = this.form.get().find('textarea');
        var self = this;
        var extraConfig = this.getExtraConfig();
        if(extraConfig.max_text_chars) {
            var maxChars = extraConfig.max_text_chars;
            var errorPlace = this.form.get().find('.dd-add-text-errors');
            textarea.on('keyup', function() {
                
                if($(this).val().length > maxChars) {
                    var val = $(this).val().substring(0, maxChars);
                    $(this).val(val);
                    errorPlace.html(self._('maximum_chars_count') + ' ' + maxChars);
                }
            });
        }

        this.form.get().find('button').on('click', function () {
            var text = textarea.val();
            if (text.trim() == '') {
                textarea.addClass('empty');
            } else {
                textarea.removeClass('empty');
                textarea.addClass('valid');
                new DD_Layer_Text({
                    text: text.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         trim()
                });
                self.closeWindow();
            }
        });
        setTimeout(function () {
            $(textarea).focus();
        }, 0);
    }
});
