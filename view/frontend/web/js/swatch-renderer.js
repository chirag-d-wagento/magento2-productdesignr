/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'jquery',
    'jquery/ui',
    'Magento_Swatches/js/swatch-renderer'
], function($){

    $.widget('mage.SwatchRenderer', $.mage.SwatchRenderer, {


        /**
         * Render swatch options by part of config
         *
         * @param {Object} config
         * @returns {String}
         * @private
         */
        _RenderSwatchOptions: function (config) {

            /*
             if (!this.options.jsonSwatchConfig.hasOwnProperty(config.id)) {
             return '';
             }

             var optionConfig = this.options.jsonSwatchConfig[config.id],
             optionClass = this.options.classes.optionClass;

             //Allow multi addtocart for this attribute?
             if(this.options.multipleAddtocartAttributeId && config.id == this.options.multipleAddtocartAttributeId){

             $('.box-tocart .field.qty').hide();
             return this._multiVariationTable(config,optionConfig,optionClass);

             }else{
             return $.mage.SwatchRenderer.prototype._RenderSwatchOptions.call(config);
             }*/


            var optionConfig = this.options.jsonSwatchConfig[config.id],
                optionClass = this.options.classes.optionClass,
                moreLimit = parseInt(this.options.numberToShow, 10),
                moreClass = this.options.classes.moreButton,
                moreText = this.options.moreButtonText,
                countAttributes = 0,
                html = '';

            if (!this.options.jsonSwatchConfig.hasOwnProperty(config.id)) {
                return '';
            }

            //Allow multi addtocart for this attribute?
            if(this.options.multipleAddtocartAttributeId && config.id == this.options.multipleAddtocartAttributeId){

                $('.box-tocart .field.qty').hide();
                html = this._multiVariationTable(config,optionConfig,optionClass);

            }else{

                $.each(config.options, function () {
                    var id,
                        type,
                        value,
                        thumb,
                        label,
                        attr;

                    if (!optionConfig.hasOwnProperty(this.id)) {
                        return '';
                    }

                    // Add more button
                    if (moreLimit === countAttributes++) {
                        html += '<a href="#" class="' + moreClass + '">' + moreText + '</a>';
                    }

                    id = this.id;
                    type = parseInt(optionConfig[id].type, 10);
                    value = optionConfig[id].hasOwnProperty('value') ? optionConfig[id].value : '';
                    thumb = optionConfig[id].hasOwnProperty('thumb') ? optionConfig[id].thumb : '';
                    label = this.label ? this.label : '';
                    attr =
                        ' option-type="' + type + '"' +
                        ' option-id="' + id + '"' +
                        ' option-label="' + label + '"' +
                        ' option-tooltip-thumb="' + thumb + '"' +
                        ' option-tooltip-value="' + value + '"';

                    if (!this.hasOwnProperty('products') || this.products.length <= 0) {
                        attr += ' option-empty="true"';
                    }

                    if (type === 0) {
                        // Text
                        html += '<div class="' + optionClass + ' text" ' + attr + '>' + (value ? value : label) +
                            '</div>';
                    } else if (type === 1) {
                        // Color
                        html += '<div class="' + optionClass + ' color" ' + attr +
                            '" style="background: ' + value +
                            ' no-repeat center; background-size: initial;">' + '' +
                            '</div>';
                    } else if (type === 2) {
                        // Image
                        html += '<div class="' + optionClass + ' image" ' + attr +
                            '" style="background: url(' + value + ') no-repeat center; background-size: initial;">' + '' +
                            '</div>';
                    } else if (type === 3) {
                        // Clear
                        html += '<div class="' + optionClass + '" ' + attr + '></div>';
                    } else {
                        // Defaualt
                        html += '<div class="' + optionClass + '" ' + attr + '>' + label + '</div>';
                    }

                });

            }

            return html;
        },

        _multiVariationTable: function (config,optionConfig,optionClass){

            var attrLabel = config.label;
            var attrCode = config.code;
            var attrId = config.id;
            var productId = $('input[name="product"]').val();

            var html = '<table class="data table multi-addtocart-table">' +
                '<thead>' +
                '<tr class="matrix_thead">' +
                '<th class="swatch-attribute-label">' + attrLabel + '</th>' +
                '<th>Qty</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>';


            $.each(config.options, function () {
                var id,
                    type,
                    value,
                    thumb,
                    label,
                    attr;

                if (!optionConfig.hasOwnProperty(this.id)) {
                    return '';
                }

                id = this.id;
                type = parseInt(optionConfig[id].type, 10);
                value = optionConfig[id].hasOwnProperty('value') ? optionConfig[id].value : '';
                thumb = optionConfig[id].hasOwnProperty('thumb') ? optionConfig[id].thumb : '';
                label = this.label ? this.label : '';
                attr =
                    ' option-type="' + type + '"' +
                    ' option-id="' + id + '"' +
                    ' option-label="' + label + '"' +
                    ' option-tooltip-thumb="' + thumb + '"' +
                    ' option-tooltip-value="' + value + '"';

                if (!this.hasOwnProperty('products') || this.products.length <= 0) {
                    attr += ' option-empty="true"';
                }

                html += '<tr><td>';

                if (type === 0) {
                    // Text
                    html += '<div class="' + optionClass + ' text" ' + attr + '>' + (value ? value : label) +
                        '</div>';
                } else if (type === 1) {
                    // Color
                    html += '<div class="' + optionClass + ' color" ' + attr +
                        '" style="background: ' + value +
                        ' no-repeat center; background-size: initial;">' + '' +
                        '</div>';
                } else if (type === 2) {
                    // Image
                    html += '<div class="' + optionClass + ' image" ' + attr +
                        '" style="background: url(' + value + ') no-repeat center; background-size: initial;">' + '' +
                        '</div>';
                } else if (type === 3) {
                    // Clear
                    html += '<div class="' + optionClass + '" ' + attr + '></div>';
                } else {
                    // Defaualt
                    html += '<div class="' + optionClass + '" ' + attr + '>' + label + '</div>';
                }


                html += '</td>' +
                    '<td class="matrix_qty_td ' + attrCode + '_qty_' + attrId + '">' +
                    '<input style="text-align:center;width:55px;" name="qty_matrix_product[' + productId + '][' + attrId + ']" maxlength="12" value="0" title="Qty" class="qty input-text matrix_qty qty_' + attrId + '_'+id+'" option-id="'+id+'" data-validate="{&quot;required-number&quot;:true}" type="number">' +
                    '</td></tr>';

            });

            html += '</tbody></table>';

            return html;
        },

        /**
         * Event for swatch options
         *
         * @param {Object} $this
         * @param {Object} $widget
         * @private
         */
        _OnClick: function ($this, $widget) {
            var $parent = $this.parents('.' + $widget.options.classes.attributeClass),
                $label = $parent.find('.' + $widget.options.classes.attributeSelectedOptionLabelClass),
                attributeId = $parent.attr('attribute-id'),
                $input = $parent.find('.' + $widget.options.classes.attributeInput);

            if ($widget.inProductList) {
                $input = $widget.productForm.find(
                    '.' + $widget.options.classes.attributeInput + '[name="super_attribute[' + attributeId + ']"]'
                );
            }

            if ($this.hasClass('disabled')) {
                return;
            }

            if(this.options.multipleAddtocartAttributeId && attributeId == this.options.multipleAddtocartAttributeId){

                $qtyInput = $this.closest('tr').find('input');

                if ($this.hasClass('selected')) {
                    $this.removeClass('selected');
                    $qtyInput.val(0);
                } else {
                    $this.addClass('selected');
                    $qtyInput.val(1);
                }

                $widget._manageMultipleOptionSelection($this, $widget);

            }else{
                if ($this.hasClass('selected')) {
                    $parent.removeAttr('option-selected').find('.selected').removeClass('selected');
                    $input.val('');
                    $label.text('');
                } else {
                    $parent.attr('option-selected', $this.attr('option-id')).find('.selected').removeClass('selected');
                    $label.text($this.attr('option-label'));
                    $input.val($this.attr('option-id'));
                    $this.addClass('selected');
                }
            }

            $widget._Rebuild();

            if ($widget.element.parents($widget.options.selectorProduct)
                    .find(this.options.selectorProductPrice).is(':data(mage-priceBox)')
            ) {
                $widget._UpdatePrice();
            }

            $widget._LoadProductMedia();
            $input.trigger('change');
        },


        /**
         * Event listener
         *
         * @private
         */
        _EventListener: function () {

            var $widget = this;

            $widget.element.on('keyup', '.multi-addtocart-table input.qty', function () {
                $qty = parseInt($(this).val());
                $('td:first div',$(this).closest('tr')).removeClass('selected');
                if ($qty > 0) {
                    $('td:first div',$(this).closest('tr')).addClass('selected');
                }
                $widget._manageMultipleOptionSelection($(this), $widget);
            });

            //$.mage.SwatchRenderer.prototype._EventListener.call(this);


            $widget.element.on('click', '.' + this.options.classes.optionClass, function () {
                return $widget._OnClick($(this), $widget);
            });

            $widget.element.on('change', '.' + this.options.classes.selectClass, function () {
                return $widget._OnChange($(this), $widget);
            });

            $widget.element.on('click', '.' + this.options.classes.moreButton, function (e) {
                e.preventDefault();

                return $widget._OnMoreClick($(this));
            });
        },

        /**
         * Manage multi addtocart swatch input
         *
         * @param {Object} $this
         * @private
         */
        _manageMultipleOptionSelection: function ($this, $widget) {

            var $parent = $this.parents('.' + $widget.options.classes.attributeClass),
                attributeId = $parent.attr('attribute-id'),
                $input = $parent.find('.' + $widget.options.classes.attributeInput);

            var selections = {};

            var $multiOptions = $('.multi-addtocart-table tbody tr');
            $.each($multiOptions, function () {
                var optionId = $('td:first div',this).attr('option-id');
                var optionQty = parseInt($('td:last input',this).val());
                if(optionId && optionQty > 0){
                    selections[optionId] = optionQty;
                }
            });

            $input.val(JSON.stringify(selections));

        }

    });

    return $.mage.SwatchRenderer;
});
