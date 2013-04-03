WHP.stats = {
    inited : false,
    trackPermission : false,

    commentsCount : 0,
    likesCount : 0,

    init : function()
    {
        this.trackPermission = (WHP.domain.indexOf("test") == -1);
    },

    trackPageChange : function(_url)
    {
        if (!this.trackPermission)
            return false;

        if (!WHP.controller.curPage)
            return true;

        if ((WHP.controller.curPage.urlStr == "profile") && (WHP.auth.status))
        {
            //for profile tracking
            str = "/profile/"+WHP.pages.profile.states[WHP.pages.profile.curState].urlPrefix;
        }else{
            var str = new String(_url);
            if (str.charAt(0)!="/")
                str = "/"+str;
        }





        log("WHP/stats : Track page = ["+str+"]");

        _gaq.push(['_trackPageview', str]);

    },

    trackLike : function(_label)
    {
        if (!this.trackPermission)
            return false;
        log("WHP/stats : Track like");
        _gaq.push(['_trackEvent', 'Photo', 'like', _label]);

    },

    getCommentsCount : function()
    {
        var counter = parseInt(getCookie("whp_comc"));
        if (isNaN(counter))
        {
            counter = 0;
        }
        return counter;
    },

    getLikesCount : function()
    {
        var counter = parseInt(getCookie("whp_likec"));
        if (isNaN(counter))
        {
            counter = 0;
        }
        return counter;
    },

    getSharesCount : function()
    {
        var counter = parseInt(getCookie("whp_shrc"));
        if (isNaN(counter))
        {
            counter = 0;
        }
        return counter;
    },



    trackLike: function()
    {
        var counter = getCookie("whp_likec");
        if (isNaN(counter))
        {
            counter = 0;
        }
        counter++;
        setCookie("whp_likec", counter, 60*1000);
    },


    trackComment: function(_reply)
    {
        var counter = getCookie("whp_comc");
        if (isNaN(counter))
        {
            counter = 0;
        }
        counter++;
        setCookie("whp_comc", counter, 60*1000);


        if (!this.trackPermission)
            return false;
        var reply = _reply == true;


        log("WHP/stats : Track comment reply = ["+reply+"]");

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
            var counter = getCookie("whp_shrc");
            if (isNaN(counter))
            {
                counter = 0;
            }
            counter++;
            setCookie("whp_shrc", counter, 60*1000);
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
            url:WHP.netcalls.shareCallSvr,
            data : { r : Math.random(), photo :  _id, social : _social },
            timeout:WHP.netTimeOut,
            success:bind(function (e) { log("trackServer success! ["+_social+"] ["+_id+"]");}, this)
        });


        log("WHP/stats : Track share = ["+_param+"]");
        _gaq.push(['_trackEvent', 'Photo', 'share', _param]);
    },

    trackTimeline : function(_main, _N)
    {
        if (!this.trackPermission)
            return false;
        var mainStr = "USER_TIMELINE_";
        if (_main)
            mainStr = "MAIN_TIMELINE_";


        log("WHP/stats : Track timeline ["+mainStr+_N+"]");
        _gaq.push(['_trackEvent', 'Timeline', 'PagesLoaded', mainStr+_N, _N]);
    },

    trackNotifications : function(_N)
    {
        if (!this.trackPermission)
            return false;
        log("WHP/stats : Track notifications loaded ["+_N+"]");
        _gaq.push(['_trackEvent', 'Notifications', 'PagesLoaded', "PAGES_LOADED_"+_N, _N]);
    },




    trackDownload : function(_param)
    {
        if (!this.trackPermission)
            return false;
        log("WHP/stats : Track download ["+_param+"]");
        _gaq.push(['_trackEvent', 'Download', 'click', _param]);
    },




    trackEmptyTimeline : function(_main)
    {
        if (!this.trackPermission)
            return false;
        var mainStr = "SHOW_TIMELINE_USER_EMPTY";
        if (_main)
            mainStr = "SHOW_TIMELINE_MAIN_EMPTY";

        log("WHP/stats : Track empty timeline ["+mainStr+"]");
        _gaq.push(['_trackEvent', 'Download', 'Views', mainStr]);
    },

    trackPhotoPlateShow : function()
    {
        if (!this.trackPermission)
            return false;
        var mainStr = "SHOW_PHOTO_PAGE_PLATE";
        log("WHP/stats : Track show plate []");
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

        log("WHP/stats : Track download button click ["+mainStr+"]");
        _gaq.push(['_trackEvent', 'Download', 'Views', mainStr]);
    },

    trackEmptyStories : function()
    {
        if (!this.trackPermission)
            return false;
        var mainStr = "SHOW_EMPTYSTORIES_DOWNLOAD";
        log("WHP/stats : Track empty stories ["+mainStr+"]");
        _gaq.push(['_trackEvent', 'Download', 'Views', mainStr]);
    },

    trackShowMainButton : function()
    {
        if (!this.trackPermission)
            return false;
        var mainStr = "SHOW_MAIN_DOWNLOAD";
        log("WHP/stats : Track empty stories ["+mainStr+"]");
        _gaq.push(['_trackEvent', 'Download', 'Views', mainStr]);
    },

    trackXclick : function()
    {
        if (!this.trackPermission)
            return false;
        var mainStr = "SHOW_CLICK_CLOSE_PLATE";
        log("WHP/stats : Track X click service message ["+mainStr+"]");
        _gaq.push(['_trackEvent', 'Download', 'Views', mainStr]);
    },

    trackShuffle : function()
    {
        if (!this.trackPermission)
            return false;
        var N = parseInt(getCookie("whpsc"));
        if (isNaN(N))
            N = 0;
        N++;
        setCookie("whpsc", N, 1000);

        log("WHP/stats : click rnd ["+N+"]");
        _gaq.push(['_trackEvent', 'Other', 'Shuffle', "click", N]);


    }

}







