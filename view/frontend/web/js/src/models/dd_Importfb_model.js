var DD_ImportFb_Model = DD_ModelBase.extend({

    init: function (obj) {
        this.obj = obj;
    },

    setClickEvents: function () {
        var self = this;
        this.obj.self.on('click', function () {
            try {
                self.obj.content.addClass('tab-loading');
                self.obj.contentImages.html(self._('loading') + '...');
                FB.login(function (response) {
                    if (response.authResponse) {
                        self.getImagesFromServer(response.authResponse.signedRequest, response.authResponse.accessToken);

                    } else {
                        self.obj.contentImages.html(self._('facebook_load_failed') + '...');
                    }
                });

            } catch (e) {

            }

        });
    },

    getImagesFromServer: function (code, accessToken) {

        var self = this;
        $.ajax({
            url: this._s('fbImagesPath'),
            type: 'json',
            method: 'post',
            data: {
                'code': code,
                'token': accessToken
            }
        })
                .done(function (data) {
                    if (!data || data.length == 0) {
                        self.obj.contentImages.html(self._('no_data'))
                        self.obj.content.addClass('tab-no-data');
                        return;
                    }
                    self.obj.content.removeClass('tab-no-data');
                    self.obj.contentImages.html('');

                    $.each(data, function (a, img) {
                        new DD_ImageLinkAdd({
                            'parent': self.obj.contentImages,
                            'src': img.src,
                            'width': img.width,
                            'height': img.height

                        });
                    });
                });
    }


});
