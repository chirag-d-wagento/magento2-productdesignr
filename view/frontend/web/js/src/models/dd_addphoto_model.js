var DD_AddPhoto_Model = DD_ModelBase.extend({
    idUploaderTab: 'dd-add-photo-tab',
    idMyPhotosTab: 'dd-my-photo-tab',
    uploaderInitiated: false,
    
    contentTop: null,
    contentImages: null,
    importFromFbControl: null,

    init: function (obj) {
        this.obj = obj;
        this._super(obj);
    },

    getWindowTitle: function () {
        return this._('add_photo_to_image');
    },

    setWindowContent: function (parent) {
        new DD_windowPhotoTabs(parent);
    },

    tabActive: function (id, content) {
        if (id === this.idMyPhotosTab) {
            this.initMyPhotos(content);
        } else if (id === this.idUploaderTab) {
            this.initUploader(content);
        }
    },

    initUploader: function (content) {
        if (this.uploaderInitiated) {
            return;
        }
        this.content = content;
        var self = this;
        content.html('<form class="dropzone">' +                
        '</form>');
        Dropzone.autoDiscover = false;
        content.find('form').dropzone({
            url: self._s('urlUploadImages') /* + '?form_key=' + window.FORM_KEY */,
            maxFilesize: 5, // MB
            maxFiles: 1,
            acceptedFiles: 'image/*',
            init: function () {
                this.on("addedfile", function (file) {
                    if (self.previousFile) {
                        self.previousFile.fadeOut();
                        delete self.previousFile;
                    }
                });
                this.on("success", function (file, responseText) {
                    self.previousFile = $(file.previewElement);
                    var obj = responseText;
                    if (!obj) {
                        return processUploaderError(file, responseText);
                    }
                    if (obj.error) {
                        return processUploaderError(file, responseText, obj.errMessage);
                        return;
                    }
                    $(file.previewElement).find('.dz-error-mark').hide();
                    $(file.previewElement).find('.dz-success-mark').show();
                    $(file.previewElement).find('.dz-details').hide();
                    new DD_Layer_Img({
                        src: obj.filename,
                        width: obj.width,
                        height: obj.height
                    });
                    setTimeout(function () {
                        self._w().close();
                    }, 500);
                });
                this.on("error", function (file, responseText) {
                    self.previousFile = $(file.previewElement);
                    return processUploaderError(file, responseText);
                })
            }});
        this.uploaderInitiated = true;

        function processUploaderError(file, responseText, extraText) {
            $(file.previewElement).find('.dz-error-message').html(self._('uploader_error') + '<br>' + (extraText ? extraText : ''));
            $(file.previewElement).find('.dz-success-mark').hide();
            $(file.previewElement).find('.dz-details').hide();

            $(file.previewElement).find('.dz-error-mark').on('click', function () {
                $(file.previewElement).hide();
            });
        }
    },

    initMyPhotos: function (content) {
        var self = this;
        if(!this.contentTop) {
            this.contentTop = $('<div />')
                .addClass('dd-my-photo-tab-content-images-top');
            content.append(this.contentTop);
        }
        if(!this.contentImages) {
            this.contentImages = $('<div />')
                .addClass('dd-my-photo-tab-content-images');
            content.append(this.contentImages);
        }
        
        content.addClass('tab-loading');
        this.contentImages.html(this._('loading') + '...');
        
        if(this._s('importFbEnabled') && !this.importFromFbControl){
            this.importFromFbControl = new DD_ImportFbButton(this.contentTop, content, this.contentImages);
        }
        if(this._s('importInstagramEnabled') && !this.importFromInstagramControl){
            this.importFromInstagramControl = new DD_ImportInstagramButton(this.contentTop, content, this.contentImages);
        }
        var self = this;

        $.ajax({
            url: this._s('myFilesPath'),
            type: 'json'
        })
                .done(function (data) {
                    content.removeClass('tab-loading');
                    if (!data || data.length == 0) {
                        self.contentImages.html(self._('no_data'))
                        content.addClass('tab-no-data');
                        return;
                    }
                    content.removeClass('tab-no-data');
                    self.contentImages.html('');

                    $.each(data, function (a, img) {
                        new DD_ImageLinkAdd({
                            'parent': self.contentImages,
                            'src': img.src,
                            'width': img.width,
                            'height': img.height
                        });
                    });

                });

    }

});
