var DD_ImportInstagram_Model = DD_ModelBase.extend({

    urlMyImages: 'https://api.instagram.com/v1/users/self/media/recent/',

    interval: null,
    popupWindow: null,
    processInterval: 50,
    error: null,
    token: null,

    init: function (obj) {
        this.obj = obj;
    },

    setClickEvents: function () {
        var self = this;
        this.obj.self.on('click', function () {
            self.obj.content.addClass('tab-loading');
            self.obj.contentImages.html(self._('loading') + '...');

            self.process();

            //window.InstAuth.init('5f3c220152ee4ff08586908d1766f71b');
            //window.InstAuth.startAuthFlow();
        });
    },

    process: function () {
        this.processAuth();
    },

    getWidth: function () {
        return ($(window).width() / 2) > 400 ? 400 : ($(window).width() / 2 < 400 ? 300 : $(window).width() / 2);
    },

    getHeight: function () {
        return $(window).height() / 2 < 400 ? 300 : $(window).height() / 2;
    },

    getTop: function () {
        return (($(window).height() / 2) - (this.getHeight() / 2));
    },

    getLeft: function () {
        return (($(window).width() / 2) - (this.getWidth() / 2));
    },

    processAuth: function () {
        if (this.popupWindow) {
            this.popupWindow.focus();
            return;
        }
        var authUrl = this.getAuthUrl();
        this.popupWindow = window.open(authUrl, '', 'width=' + this.getWidth() + ',height=' + this.getHeight() + ',top=' + this.getTop() + ',left=' + this.getLeft());
        var self = this;
        this.interval = setInterval(function () {
            var location = self.popupWindow.location;

            try {
                if (typeof (location.href) == 'undefined' || !location.href) {
                    self.unRegisterWindow();
                    return;
                }

                if (location.hash.search("access_token") > -1) {
                    var access_token = location.hash.substr(14).split("&")[0];
                    self.registerAccessToken(access_token);
                    //window.opener.postMessage(JSON.stringify({access_token: window.location.hash.substr(14).split("&")[0]}), window.opener.location.href)
                }
                if (location.href.search("error_reason=user_denied") > -1) {
                    self.setError('unauthorized');
                    self.unRegisterWindow();
                    return;
                }
            } catch (error) {

            }
        }, self.processInterval);
    },

    setError: function (error) {
        this.error = error;
    },

    unRegisterWindow: function () {
        if (this.popupWindow) {
            //this.popupWindow.stop();
            this.popupWindow.close();
            this.popupWindow = null;
        }
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }

        if (this.error || !this.token) {
            this.error = 'unauthorized';
            this.processError();
            return;
        }

        this.loadImages();

    },

    loadImages: function () {
        var self = this;
        var url = this.urlMyImages + '?access_token=' + this.token;
        $.getJSON(url, function (dataInstagram) {

            var data = dataInstagram.data;
            if (!data || data.length == 0) {
                self.obj.contentImages.html(self._('no_data'))
                self.obj.content.addClass('tab-no-data');
                return;
            }

            self.obj.content.removeClass('tab-no-data');
            self.obj.contentImages.html('');

            $.each(data, function (a, imgDetail) {
                var img = imgDetail.images;
                new DD_ImageLinkAdd({
                    'parent': self.obj.contentImages,
                    'src': img.standard_resolution.url,
                    'width': img.standard_resolution.width,
                    'height': img.standard_resolution.height

                });
            });

            //console.log( "suatroot" );
            //console.log( data );
            /*
             var suatroot = data.data;
             
             console.log(suatroot);
             $.each(suatroot, function (key, val) {
             console.log("item");
             var itemobj = val.images.low_resolution.url;
             var hrefobj = val.link;
             var captobj = val.caption.text;
             console.log(captobj);
             console.log(itemobj);
             var suatpaket = "<a target='_blank' href='" + hrefobj + "'><img src='" + itemobj + "'/><br>" + captobj + "<br></a>";
             $(".instagram").append(suatpaket);
             });
             */

        });
    },

    registerAccessToken: function (token) {

        this.token = token;
        this.error = null;
        this.unRegisterWindow();
    },

    processError: function () {
        switch (this.error) {
            case 'unauthorized':
                this.obj.contentImages.html(this._('instagram_load_failed') + '...');
                break;
        }
    },

    getAuthUrl: function () {
        return "https://api.instagram.com/oauth/authorize/?client_id="
                + this.instagramClientId()
                + "&response_type=token&redirect_uri="
                + this.redirectUri();
    },

    instagramClientId: function () {
        return this._s('instagramClientId');
    },

    redirectUri: function () {
        return window.location.origin;
    }
});
