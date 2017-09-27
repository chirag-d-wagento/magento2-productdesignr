var DD_Admin_loadimages_model = DD_Admin_ImagesSelected_Model.extend({

    class_container: 'dd-admin-loadimages-container',
    class_loading: 'dd-admin-loadimages-loading',
    
    init: function (obj) {
        this.obj = obj;
        this._super(obj);
    },

    getWindowTitle: function () {
        return this._('select_images');
    },

    setWindowContent: function (parent) {
        this.parent = parent;
        var container = new DD_panel({
            'class': this.class_container,
            'parent': parent
        });
        container.add();

        this.container = container.get();
        parent.append(this.container);
        this.loadImages();
    },

    loadImages: function () {
        this.showLoading();
        var self = this;
        
        $.ajax({
            url: this._s('urlLoadImages')
                    + '?form_key=' + window.FORM_KEY,
            data: {
                'product_sku': this._s('psku'),
                'product_id': this._s('product_id'),
                'group_index': this.obj.get().attr('data-group')
            },
            success: function (data) {
                if(data.error) {
                    alert(data.errorMessage);
                    return;
                }
                self.container.append($('<h3 />').html(data.extra.product_name + '(' + data.extra.psku + ')'));
                if(typeof(data.data) == 'undefined' || data.data.length == 0) {
                    self.container.append($('<div />').html(data.extra.no_images_text));
                }
                
                $.each(data.data, function(i, img) {
                    new DD_admin_image(self.container, img);
                });
            },
            error: function () {
                alert("Something went wrong!");
            },
            complete: function () {
                self.hideLoading();
            },
            cache: false
        }, 'json');
    },
    
    hideLoading: function() {
        this.loading.remove();
    },

    showLoading: function () {
        var loading = new DD_panel({
            'class': this.class_loading,
            'parent': this.container
        });
        loading.add();

        this.loading = loading.get();
    }
});

