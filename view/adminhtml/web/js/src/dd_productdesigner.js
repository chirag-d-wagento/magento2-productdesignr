$.fn.dd_productdesigner = function (options) {
    //
    //
    this.options = $.extend({
        'src': '',
        'debug': false,
        'width': '',
        'height': '',
        'sku': '',
        'product_id': '',
        'media_id': '',
        'group_index': '',
        'translator': {
            'back': 'Back',
            'next': 'Next',
            'add_photo': 'Add Photo',
            'add_text': 'Add Text',
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

            //setup
            'info': 'Image Info',
            'layer_mask': 'Layer Mask',
            'images': 'Images',
            'texts': 'Texts',
            'qr_code': 'QR Code',
            'options': 'Options',
            'image_src': 'Image src',
            'width': 'Width',
            'height': 'Height',
            'media_id': 'Media ID',
            'product_id': 'Product ID',
            'product_sku': 'Product SKU',
            'configure_layer_mask': 'Layer Mask Configuration',
            'enable_layer_mask': 'Enable Layer Mask',
            'add_layer_mask': 'Add/Edit Layer Mask',
            'add_default_images': 'Add Default Images',
            'add_image': 'Add Image',
            'add_default_texts': 'Add default texts'
        },
        'settings': {
            'addphoto': true,
            'addtext': false,
            'addfromlibrary': false,
            'history': false,
            'layers': false,
            'save': false,
            'qrcode': false,
            'preview': false,
            'defaultFont': 'Verdana',
            'defualtFontColor': '#ffffff',
            'defaultFontSize': 20,
            'percentSizeFromMask': 70,
            'defaultLayerMaskWidth': 40,

            'urlUploadImages': '',
            'myFilesPath': '/myfiles.php',
            'percentSizeImage': 20 //percentage size from canvas width
        },
        'afterLoad': null,
        'onUpdate': null
    }, options);
    
    this.onUpdate = function(callback) {
        this.options.onUpdate = callback;
    }

    this.init = function () {
        new DD_Translator(this.options.translator);
        new DD_Settings(this.options.settings);
        new DD_Event();
        var main = new DD_main(this, this.options);
        if (this.options.debug) {
            new DD_Debug(this);
        }
    }

    return this;
};
