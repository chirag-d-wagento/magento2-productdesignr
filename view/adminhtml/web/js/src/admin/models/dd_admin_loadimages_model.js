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

    prepareGroupsData: function () {
        var groups = this.getGroups();
        var dataGroups = {};
        if (groups && groups.length) {
            $.each(groups, function (i, group) {
                dataGroups[group.product_id] = group.group_uid;
            });
        }
        return dataGroups;
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
                'groups': this.prepareGroupsData()
            },
            success: function (data) {
                if (data.error) {
                    alert(data.errorMessage);
                    return;
                }
                if (data.success && data.parent) {
                    self.container.append($('<h2 />').html(self._('configure_images') + ' ' + data.parent.product_name + '(' + data.parent.psku + ')'));
                    $.each(data.data, function (i, row) {
                        new DD_admin_image_row(self.container, row.imgs, row.extra);
                    });
                }
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

    hideLoading: function () {
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

