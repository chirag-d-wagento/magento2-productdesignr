define([
    'jquery',
    'uiComponent',
    'desgnerAll'
], function ($, uiComponent, designer) {
    return uiComponent.extend({
        defaults: {
            template: 'designer/designer',
            config: '',
            links: {
                psku: '${ $.provider }:data.product.sku',
                product_id: '${ $.provider }:data.product.current_product_id'
            }
        },

        initObservable: function () {
            this._super().observe([
                'psku',
                'product_id'
            ]);
            return this;
        },
        /**
         * Initialization method
         */
        initialize: function () {
            this._super();
            $('head').append("<link href='" + this.cssUrl + "' type='text/css' rel='stylesheet' />");
        },

        initDesigner: function (elems, data) {
            
            $('#dd_designer_admin').dd_productdesigner_admin({
                'urlImages': data.urlImages,
                'settings': {
                    'psku': data.psku(),
                    'product_id': data.product_id(),
                    'urlLoadImages': data.urlLoadImages,
                    'urlUploadImages': data.urlUploadImages,
                    'urlSaveData': data.urlSaveData,
                    'listFonts': data.fonts,
                    'myFilesPath': data.myFilesPath,
                    'percentSizeImage': 30,
                    'percentSizeFromMask': 70,
                    
                    'defaultFont': 'Verdana,Geneva,sans-serif',
                    'defualtFontColor': '#ffffff',
                    'defaultFontSizePercent': 20,
                    'defaultLayerMaskWidth': 70,
                    
                    'defaultImgEnabled': data.defaultImgEnabled,
                    'defaultTextEnabled': data.defaultTextEnabled,
                    'defaultLibraryEnabled': data.defaultLibraryEnabled,
                    'defaultTextPrice': data.defaultTextPrice,
                    'defaultImgPrice': data.defaultImgPrice,
                    
                    'libraryPath': data.libraryPath
                    
                },
                
                'onUpdate': function(conf) {
                    data.source.data["product"]['dd-designer-conf'] = JSON.stringify(conf);
                }
            });
        }
    });
});