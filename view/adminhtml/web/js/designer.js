define([
    'jquery',
    'uiComponent',
    'desgnerAll'
], function ($, uiComponent, designer) {
    return uiComponent.extend({
        defaults: {
            template: 'designer/designer',
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
                    'percentSizeImage': 30
                }
            });
        }
    });
});