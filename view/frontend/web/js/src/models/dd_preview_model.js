var DD_Privew_Model = DD_ModelBase.extend({
    init: function (obj) {
        this.obj = obj;
    },

    addPreviewEvent: function (mainModel) {
        var self = this;
        this.obj.get().on('click', function () {
            mainModel.unselectAll();
            var data = mainModel.getDataImg();
            var Pagelink = "about:blank";
            var pwa = window.open(Pagelink, "_new");
            pwa.document.open();
            pwa.document.write(self.__imgSourcetoShow(data));
            pwa.document.close();

        });
    },

    __imgSourcetoShow: function (data) {
        return "<html><head>/head><body>" +
                "<img src='" + data + "' style='max-width:100%;' /></body></html>";
    }
});

