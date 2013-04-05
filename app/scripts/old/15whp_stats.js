aup.stats = {
    inited : false,
    trackPermission : false,

    commentsCount : 0,
    likesCount : 0,

    init : function()
    {
        this.trackPermission = (aup.domain.indexOf("test") == -1);
    },

    trackPageChange : function(_url)
    {
        if (!this.trackPermission)
            return false;

        if (!aup.controller.curPage)
            return true;

        if ((aup.controller.curPage.urlStr == "profile") && (aup.auth.status))
        {
            //for profile tracking
            str = "/profile/"+aup.pages.profile.states[aup.pages.profile.curState].urlPrefix;
        }else{
            var str = new String(_url);
            if (str.charAt(0)!="/")
                str = "/"+str;
        }





        log("aup/stats : Track page = ["+str+"]");

        _gaq.push(['_trackPageview', str]);

    },

    trackLike : function(_label)
    {
        if (!this.trackPermission)
            return false;
        log("aup/stats : Track like");
        _gaq.push(['_trackEvent', 'Photo', 'like', _label]);

    },

    getCommentsCount : function()
    {
        var counter = parseInt(getCookie("aup_comc"));
        if (isNaN(counter))
        {
            counter = 0;
        }
        return counter;
    },

    getLikesCount : function()
    {
        var counter = parseInt(getCookie("aup_likec"));
        if (isNaN(counter))
        {
            counter = 0;
        }
        return counter;
    },

    getSharesCount : function()
    {
        var counter = parseInt(getCookie("aup_shrc"));
        if (isNaN(counter))
        {
            counter = 0;
        }
        return counter;
    },



    trackLike: function()
    {
        var counter = getCookie("aup_likec");
        if (isNaN(counter))
        {
            counter = 0;
        }
        counter++;
        setCookie("aup_likec", counter, 60*1000);
    },


    trackComment: function(_reply)
    {
        var counter = getCookie("aup_comc");
        if (isNaN(counter))
        {
            counter = 0;
        }
        counter++;
        setCookie("aup_comc", counter, 60*1000);


        if (!this.trackPermission)
            return false;
        var reply = _reply == true;


        log("aup/stats : Track comment reply = ["+reply+"]");

        if (reply)
        {
            _gaq.push(['_trackEvent', 'Photo', 'reply']);
        }else{
            _gaq.push(['_trackEvent', 'Photo', 'comment']);
        }
    },

    trackShare : function(_param, _id)
    {
        if (_param == "SHARE_FACEBOOK")
        {
            var counter = getCookie("aup_shrc");
            if (isNaN(counter))
            {
                counter = 0;
            }
            counter++;
            setCookie("aup_shrc", counter, 60*1000);
        }

        if (!this.trackPermission)
            return false;


        var _social = "";
        if (_param == "SHARE_FACEBOOK")
        {
            _social = "facebook";
        }else if (_param == "SHARE_PINTEREST")
        {
            _social = "pinterest";
        }else if (_param == "SHARE_TWITTER")
        {
            _social = "twitter";
        }


        $.ajax({
            url:aup.netcalls.shareCallSvr,
            data : { r : Math.random(), photo :  _id, social : _social },
            timeout:aup.netTimeOut,
            success:bind(function (e) { log("trackServer success! ["+_social+"] ["+_id+"]");}, this)
        });


        log("aup/stats : Track share = ["+_param+"]");
        _gaq.push(['_trackEvent', 'Photo', 'share', _param]);
    },

    trackTimeline : function(_main, _N)
    {
        if (!this.trackPermission)
            return false;
        var mainStr = "USER_TIMELINE_";
        if (_main)
            mainStr = "MAIN_TIMELINE_";


        log("aup/stats : Track timeline ["+mainStr+_N+"]");
        _gaq.push(['_trackEvent', 'Timeline', 'PagesLoaded', mainStr+_N, _N]);
    },

    trackNotifications : function(_N)
    {
        if (!this.trackPermission)
            return false;
        log("aup/stats : Track notifications loaded ["+_N+"]");
        _gaq.push(['_trackEvent', 'Notifications', 'PagesLoaded', "PAGES_LOADED_"+_N, _N]);
    },




    trackDownload : function(_param)
    {
        if (!this.trackPermission)
            return false;
        log("aup/stats : Track download ["+_param+"]");
        _gaq.push(['_trackEvent', 'Download', 'click', _param]);
    },




    trackEmptyTimeline : function(_main)
    {
        if (!this.trackPermission)
            return false;
        var mainStr = "SHOW_TIMELINE_USER_EMPTY";
        if (_main)
            mainStr = "SHOW_TIMELINE_MAIN_EMPTY";

        log("aup/stats : Track empty timeline ["+mainStr+"]");
        _gaq.push(['_trackEvent', 'Download', 'Views', mainStr]);
    },

    trackPhotoPlateShow : function()
    {
        if (!this.trackPermission)
            return false;
        var mainStr = "SHOW_PHOTO_PAGE_PLATE";
        log("aup/stats : Track show plate []");
        _gaq.push(['_trackEvent', 'Download', 'Views', mainStr]);
    },

    trackDownloadButtonMenu : function(_new)
    {
        if (!this.trackPermission)
            return false;
        if (!_new)
            var mainStr = "SHOW_DOWNLOAD_MENU"
        else
            var mainStr = "SHOW_DOWNLOAD_MENU_NEW";

        log("aup/stats : Track download button click ["+mainStr+"]");
        _gaq.push(['_trackEvent', 'Download', 'Views', mainStr]);
    },

    trackEmptyStories : function()
    {
        if (!this.trackPermission)
            return false;
        var mainStr = "SHOW_EMPTYSTORIES_DOWNLOAD";
        log("aup/stats : Track empty stories ["+mainStr+"]");
        _gaq.push(['_trackEvent', 'Download', 'Views', mainStr]);
    },

    trackShowMainButton : function()
    {
        if (!this.trackPermission)
            return false;
        var mainStr = "SHOW_MAIN_DOWNLOAD";
        log("aup/stats : Track empty stories ["+mainStr+"]");
        _gaq.push(['_trackEvent', 'Download', 'Views', mainStr]);
    },

    trackXclick : function()
    {
        if (!this.trackPermission)
            return false;
        var mainStr = "SHOW_CLICK_CLOSE_PLATE";
        log("aup/stats : Track X click service message ["+mainStr+"]");
        _gaq.push(['_trackEvent', 'Download', 'Views', mainStr]);
    },

    trackShuffle : function()
    {
        if (!this.trackPermission)
            return false;
        var N = parseInt(getCookie("aupsc"));
        if (isNaN(N))
            N = 0;
        N++;
        setCookie("aupsc", N, 1000);

        log("aup/stats : click rnd ["+N+"]");
        _gaq.push(['_trackEvent', 'Other', 'Shuffle', "click", N]);


    }

}







