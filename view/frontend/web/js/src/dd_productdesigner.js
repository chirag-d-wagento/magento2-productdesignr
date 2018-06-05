$.fn.dd_productdesigner = function (options) {
    var settings = {
        'addphoto': true,
        'addtext': true,
        'addfromlibrary': true,
        'history': false,
        'layers': true,
        'save': true,
        'print': true,
        'clear_all': true,
        'preview': true,
        'download': true,
        'defaultFont': 'Verdana,Geneva,sans-serif',
        'defualtFontColor': '#ffffff',
        'defaultFontSize': 25,
        'listFonts': [],
        'percentSizeFromMask': 70,
        'defaultLayerMaskWidth': 40,
        'urlUploadImages': '',
        'myFilesPath': '/myfiles.php',
        'libraryPath': '',
        'shareFb': false,
        'shareInst': false,
        'loadGoogleFonts': true,
        'percentSizeImage': 20 //percentage size from canvas width,
    };

    settings = $.extend(settings, options.settings);

    this.options = $.extend({
        'src': '',
        'debug': false,
        'width': '',
        'height': '',
        'sku': '',
        'product_id': '',
        'media_id': '',
        'group_index': '',
        'mask': '',
        'translator': {
            'back': 'Back',
            'next': 'Next',
            'add_photo': 'Add Photo',
            'add_text': 'Add Text',
            'update_text': 'Update Text',
            'add_from_library': 'Add from Library',
            'layers': 'Layers',
            'save': 'Save',
            'add_qrcode': 'Add QR Code',
            'preview': 'Preview',
            'loading': 'Loading',
            'add_text_to_image': 'Add text to image',
            'add_photo_to_image': 'Add photo to image',
            'upload': 'Upload',
            'my_photos': 'My Photos',
            'drop_files_or_upload': 'Click to upload',
            'uploader_error': 'Uploader Error!!!',
            'loading': 'Loading',
            'no_data': 'No Data Found',
            'delete': 'Delete',
            'save': 'Save',
            'change_size': 'Change Size',
            'rotate': 'Rotate',
            'background_color': 'Background',
            'text_color': 'Color',
            'resize': 'Resize',
            'text_settings': 'Text Settings',
            'edit': 'Edit',
            'close': 'Close',
            'color': 'Color',
            'download': 'Download',
            'print': 'Print',
            'clear_all': 'Clear All',
            'share_facebook': 'Share Facebook',
            'share_instagram': 'Share Instagram',
            'import_from_fb': 'Import from Facebook',
            'import_from_instagram': 'Import from Instagram'
            
        },
        //'settings': settings,
        'onSave': null,
        'onUpdate': null,
        'onClose': null,
        'onClearAll': null
    }, options);

    this.options.settings = settings;

    this.onUpdate = function (callback) {
        this.options.onUpdate = callback;
    }
    
    this.onClearAll = function (callback) {
        this.options.onClearAll = callback;
    }

    this.onClose = function (callback) {
        this.options.onClose = callback;
    }

    this.onSave = function (callback) {
        this.options.onSave = callback;
    }

    this.init = function () {
        new DD_Translator(this.options.translator);
        new DD_Settings(this.options.settings);
        new DD_Event();
        var main = new DD_main(this, this.options);
        var app = main.create();
        if (this.options.debug) {
            new DD_Debug(this);
        }

        this.destroy = function () {
            app.destroy();
        }

        this.unselectAll = function () {
            return app.unselectAll();
        }

        this.getData = function () {
            return app.getDataImg();
        }

        this.getMediaId = function () {
            return this.options.media_id;
        }

        this.getProductId = function () {
            return this.options.product_id;
        }

        this.getJson = function () {
            return app.getJsonImg();
        }

        return this;
    }

    return this;
};
