var DD_admin_group_image_model = DD_Admin_ImagesSelected_Model.extend({

    setImageSize: function (img, group_id, media_id) {//group_index, media_id, conf
        var sizes = this.getImgSizes(img);
        return this.updateImageConf(group_id, media_id, 'sizes', sizes);
    },

    getImgSizes: function (element) {
        if (element.naturalWidth != undefined && element.naturalWidth != '' && element.naturalWidth != 0) {
            this.width = element.naturalWidth;
            this.height = element.naturalHeight;
        } else if (element.width != undefined && element.width != '' && element.width != 0) {
            this.width = element.width;
            this.height = element.height;
        } else if (element.clientWidth != undefined && element.clientWidth != '' && element.clientWidth != 0) {
            this.width = element.clientWidth;
            this.height = element.clientHeight;
        } else if (element.offsetWidth != undefined && element.offsetWidth != '' && element.offsetWidth != 0) {
            this.width = element.offsetWidth;
            this.height = element.offsetHeight;
        }

        return {
            'width': parseInt(this.width),
            'height': parseInt(this.height)
        }
    },

    clickRemove: function (el) {
        var self = this;
        el.on('click', function () {
            var group = el.attr('data-group');
            var media_id = el.attr('data-remove');
            self.removeImage(group, media_id);

        });
    },

    clickEdit: function (el, options) {
        var urlUploadImages = this._s('urlUploadImages');
        var percentSizeImage = this._s('percentSizeImage');
        el.on('click', function () {
            $('#dd_designer').html('');
            $('#dd_designer').empty();


            $('#dd_designer').dd_productdesigner({
                'src': options.src,
                'width': options.sizes.width,
                'height': options.sizes.height,

                'sku': options.sku,
                'product_id': options.product_id,
                'media_id': options.media_id,
                'settings': {
                    'urlUploadImages': urlUploadImages,
                    'percentSizeImage': percentSizeImage
                }
                
            });

            console.log(options);
        });
    }

});
