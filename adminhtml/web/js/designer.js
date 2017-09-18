define([
    'jquery',
    'uiComponent',
    'desgnerAll'
], function ($, uiComponent, designer) {
    return uiComponent.extend({
        defaults: {
            template: 'designer/designer'
        },
        /**
         * Initialization method
         */
        initialize: function () {
            this._super();
            $('head').append("<link href='" + this.cssUrl + "' type='text/css' rel='stylesheet' />");
        },

        initDesigner: function () {
            $('#dd_designer').dd_productdesigner({
                'debug': true
            });
        }
    });
});