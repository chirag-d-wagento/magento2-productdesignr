var DD_Download_Model = DD_ModelBase.extend({
    init: function (obj) {
        this.obj = obj;
    },

    addDownloadEvent: function (mainModel) {
        this.obj.get().on('click', function () {
            mainModel.unselectAll();
            var data = mainModel.getDataImg();
            var image_data = atob(data.split(',')[1]);
            var arraybuffer = new ArrayBuffer(image_data.length);
            var view = new Uint8Array(arraybuffer);
            for (var i = 0; i < image_data.length; i++) {
                view[i] = image_data.charCodeAt(i) & 0xff;
            }
            try {
                var blob = new Blob([arraybuffer], {type: 'application/octet-stream'});
            } catch (e) {
                var bb = new (window.WebKitBlobBuilder || window.MozBlobBuilder);
                bb.append(arraybuffer);
                var blob = bb.getBlob('application/octet-stream');
            }
            var url = (window.webkitURL || window.URL).createObjectURL(blob);
            location.href = url;
        });
    }
});