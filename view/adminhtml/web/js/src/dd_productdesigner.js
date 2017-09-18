$.fn.dd_productdesigner = function (options) {
    //new
    this.options = $.extend({
        'src': '',
        'debug': false,
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
            'no_data': 'No Data Found'
        },
        'settings': {
            'addphoto': true,
            'addtext': true,
            'addfromlibrary': true,
            'history': true,
            'layers': true,
            'save': true,
            'qrcode': true,
            'preview': true,
            'defaultFont': 'Verdana',
            'defualtFontColor': '#ffffff',
            'defaultFontSize': 20,
            
            'uploaderPath': '/upload.php',
            'myFilesPath': '/myfiles.php',
            'percentSizeImage': 20 //percentage size from canvas width
        },
        'afterLoad': function () {}
    }, options);
    
    new DD_Translator(this.options.translator);
    new DD_Settings(this.options.settings);
    new DD_Event(); 
    new DD_main(this, this.options);
    if(this.options.debug) {
        new DD_Debug(this);
    }
    alert('I AM OVER');
    return this;
};
