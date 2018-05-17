var DD_ImportFb_Model = DD_ModelBase.extend({

    cookie_name: 'designer-token',
    init: function (obj) {
        this.obj = obj;
    },

    setClickEvents: function () {
        var self = this;
        this.obj.self.on('click', function () {
            self.obj.content.addClass('tab-loading');
            self.obj.contentImages.html(self._('loading') + '...');
            if (self.getToken()) {
                self.getImagesFromServer(null, self.getToken());
                return;
            }
            FB.login(function (response) {
                if (response.authResponse) {
                    self.setToken(response.authResponse.accessToken);
                    self.getImagesFromServer(response.authResponse.signedRequest, response.authResponse.accessToken);

                } else {
                    self.obj.contentImages.html(self._('Failed') + '...');
                }
            });

        });
    },

    getToken: function () {
        return $.cookie(this.cookie_name);
    },

    setToken: function (token) {
        $.cookie(this.cookie_name, token);
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
