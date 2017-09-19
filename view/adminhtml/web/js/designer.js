define([
    'jquery',
    'uiComponent',
    'desgnerAll'
], function ($, uiComponent, designer) {
    return uiComponent.extend({
        defaults: {
            template: 'designer/designer',
            links: {
                psku: '${ $.provider }:data.product.sku'
            }
        },

        initObservable: function () {
            this._super().observe([
                'psku'
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
                'debug': true,
                'urlImages': data.urlImages,
                'psku': data.psku()
            });
            /*
             $('#dd_designer').dd_productdesigner({
             'debug': true
             });
             */
        }
    });
});