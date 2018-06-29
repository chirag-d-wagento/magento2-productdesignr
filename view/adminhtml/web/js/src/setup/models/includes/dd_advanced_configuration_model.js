var DD_advanced_configuration_model = DD_ModelBase.extend({

    mainModel: 'DD_setup_options_model',

    init: function (obj) {
        this.obj = obj;
        this._super();
    },

    tabActive: function (id) {
        var content = $('#content-' + id + '');
        content.html('');
        switch (id) {
            case 'dd-setup-info':
                this.tabInfo(content);
                break;
            case 'dd-photos-configuration':
                this.tabPhotos(content);
                break;
            case 'dd-text-configuration':
                this.tabText(content);
                break;
            case 'dd-lib-configuration':
                this.tabLib(content);
                break;
            case 'dd-prices-configuration':
                this.tabPrices(content);
                break;
            default: //options

                break;
        }
    },
    
    tabInfo: function(content) {
        new DD_setup_info(content, this.obj.imgOptions);
    },

    tabPhotos: function (content) {

        new DD_checkbox({
            parent: content,
            text: this._('enable_photos'),
            model: this.mainModel,
            view: this,
            id: 'photos_enabled',
            checked: (this._('defaultImgEnabled') && this.obj.imgOptions.extra_config.photos_enabled !== false
                    || this.obj.imgOptions.extra_config.photos_enabled ? true
                    : false)
        });

        content
                .append($('<hr>'));

        new DD_checkbox({
            parent: content,
            text: this._('resize_disable'),
            model: this.mainModel,
            view: this,
            id: 'disable_photos_resize',
            checked: (this.obj.imgOptions.extra_config.disable_photos_resize !== false
                    ? this.obj.imgOptions.extra_config.disable_photos_resize
                    : false)
        });
        new DD_checkbox({
            parent: content,
            text: this._('rotate_disable'),
            model: this.mainModel,
            view: this,
            id: 'disable_photos_rotate',
            checked: (this.obj.imgOptions.extra_config.disable_photos_rotate !== false
                    ? this.obj.imgOptions.extra_config.disable_photos_rotate
                    : false)
        });

    },

    tabText: function (content) {

        new DD_checkbox({
            parent: content,
            text: this._('enable_text'),
            model: this.mainModel,
            view: this,
            id: 'text_enabled',
            checked: (this._('defaultTextEnabled') && this.obj.imgOptions.extra_config.text_enabled !== false
                    || this.obj.imgOptions.extra_config.text_enabled ? true
                    : false)
        });

        content
                .append($('<hr>'));

        new DD_checkbox({
            parent: content,
            text: this._('resize_disable'),
            model: this.mainModel,
            view: this,
            id: 'disable_text_resize',
            checked: (this.obj.imgOptions.extra_config.disable_text_resize !== false
                    ? this.obj.imgOptions.extra_config.disable_text_resize
                    : false)
        });
        new DD_checkbox({
            parent: content,
            text: this._('rotate_disable'),
            model: this.mainModel,
            view: this,
            id: 'disable_text_rotate',
            checked: (this.obj.imgOptions.extra_config.disable_text_rotate !== false
                    ? this.obj.imgOptions.extra_config.disable_text_rotate
                    : false)
        });
        new DD_checkbox({
            parent: content,
            text: this._('background_color_disable'),
            model: this.mainModel,
            view: this,
            id: 'background_color_text_disable',
            checked: (this.obj.imgOptions.extra_config.background_color_text_disable !== false
                    ? this.obj.imgOptions.extra_config.background_color_text_disable
                    : false)
        });
        new DD_checkbox({
            parent: content,
            text: this._('text_color_disable'),
            model: this.mainModel,
            view: this,
            id: 'text_color_disable',
            checked: (this.obj.imgOptions.extra_config.text_color_disable !== false
                    ? this.obj.imgOptions.extra_config.text_color_disable
                    : false)
        });
        new DD_inputText({
            parent: content,
            label: this._('max_text_chars'),
            type: "number",
            model: this.mainModel,
            value: (this.obj.imgOptions.extra_config.max_text_chars !== false
                    ? this.obj.imgOptions.extra_config.max_text_chars
                    : false),
            id: 'max_text_chars',
            'data-type': 'integer',
            comment: this._('unlimeted_by_default')
        });

        var fonts = this.getListOfFontsPairs();

        new DD_select({
            parent: content,
            label: this._('fonts'),
            model: this.mainModel,
            type: 'multiple',
            comment: this._('all_by_default'),
            select: fonts,
            id: 'fonts',
            values: this.obj.imgOptions.extra_config.fonts
        });
    },

    tabLib: function (content) {

        new DD_checkbox({
            parent: content,
            text: this._('enable_add_from_library'),
            model: this.mainModel,
            view: this,
            id: 'library_enabled',
            checked: (this._('defaultLibraryEnabled') && this.obj.imgOptions.extra_config.library_enabled !== false
                    || this.obj.imgOptions.extra_config.library_enabled ? true
                    : false)
        });

        content
                .append($('<hr>'));

        new DD_checkbox({
            parent: content,
            text: this._('resize_disable'),
            model: this.mainModel,
            view: this,
            id: 'disable_lib_resize',
            checked: (this.obj.imgOptions.extra_config.disable_lib_resize !== false
                    ? this.obj.imgOptions.extra_config.disable_lib_resize
                    : false)
        });
        new DD_checkbox({
            parent: content,
            text: this._('rotate_disable'),
            model: this.mainModel,
            view: this,
            id: 'disable_lib_rotate',
            checked: (this.obj.imgOptions.extra_config.disable_lib_rotate !== false
                    ? this.obj.imgOptions.extra_config.disable_lib_rotate
                    : false)
        });

        var categories = this.getListCatgeoriesPairs();

        new DD_select({
            parent: content,
            label: this._('lib_categories'),
            model: this.mainModel,
            type: 'multiple',
            comment: this._('all_by_default'),
            select: categories,
            id: 'lib_categories',
            values: this.obj.imgOptions.extra_config.lib_categories
        });
    },

    tabPrices: function (content) {

        new DD_inputText({
            parent: content,
            label: this._('layer_img_price'),
            model: this.mainModel,
            value: (typeof (this.obj.imgOptions.extra_config.layer_img_price) !== 'undefined')
                    ? this.obj.imgOptions.extra_config.layer_img_price
                    : this._s('defaultImgPrice'),
            id: 'layer_img_price',
            'data-type': 'price'
        });


        new DD_inputText({
            parent: content,
            label: this._('layer_txt_price'),
            model: this.mainModel,
            value: (typeof (this.obj.imgOptions.extra_config.layer_txt_price) !== 'undefined')
                    ? this.obj.imgOptions.extra_config.layer_txt_price
                    : this.obj._s('defaultTextPrice'),
            id: 'layer_txt_price',
            'data-type': 'price'
        });
    },

    getListCatgeoriesPairs: function () {
        var output = [];
        var cats = this._s('libraryCategories');
        $.each(cats, function (index, val) {
            output.push({
                value: val,
                label: val
            });
        });

        return output;
    },

    getListOfFontsPairs: function () {
        var output = [];
        var fonts = this._s('listFonts');
        $.each(fonts, function (index, val) {
            output.push({
                value: val,
                label: val
            });
        });

        return output;
    }
});
