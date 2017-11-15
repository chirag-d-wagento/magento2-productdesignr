var DD_Print_model = DD_ModelBase.extend({
    init: function (obj) {
        this.obj = obj;
    },

    addPrintEvent: function (mainModel) {
        var self = this;
        this.obj.get().on('click', function () {
            mainModel.unselectAll();
            var data = mainModel.getDataImg();
            var Pagelink = "about:blank";
            var pwa = window.open(Pagelink, "_new");
            pwa.document.open();
            pwa.document.write(self.__imgSourcetoPrint(data));
            pwa.document.close();

        });
    },

    __imgSourcetoPrint: function (data) {
        return "<html><head><script>function step1(){\n" +
                "setTimeout('step2()', 10);}\n" +
                "function step2(){window.print();window.close()}\n" +
                "</scri" + "pt></head><body onload='step1()'>\n" +
                "<img src='" + data + "' /></body></html>";
    }
});
