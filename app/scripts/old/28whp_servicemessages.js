WHP.serviceMessages = {
	
	
	inited : false,
	mainObject : null,
    showMessage : false,

    downloadButton : null,

    timer : new Timer(1000/32, 18),
    heightH : 101,
    timerObject : {
        p0 : 0,
        p1 : 0,
        cP : 0
    },

	//init function
	init: function ()
	{
        //not [ X ] and authed user
        this.mainObject = $("#servicemessages");
        this.mainObject.closeButton = this.mainObject.find(".servicemessage_close");
        this.mainObject.closeButton.click(bind(this.closeButton, this));
        this.mainObject.donwloadButton = this.mainObject.find(".servicemessage_download");
        this.mainObject.donwloadButton.click( bind(this.clickDownload, this) );
        this.mainObject.donwloadButton.click(function() { WHP.stats.trackDownload("DOWNLOAD_SERVICE_MESSAGE") });

        this.timer.onTimerEvent = bind(this.timerEvent, this);

        /*
        if (this.showMessage)
            this.show();
            */

		this.inited = true;
	},

    clickDownload : function()
    {
        setCookie("hsdodl", "true", 60*100);
        this.hide();
    },

    onAuthChange : function()
    {
       if (this.showMessage)
       {
           setCookie("hsdodl", "true", 60*100);
           this.hide();
       }
    },

    checkVisible : function()
    {
        var photoDirect = true;
        if (WHP.controller.history.length>0)
            photoDirect = WHP.controller.history[0].url.indexOf("photo/")>-1;

        this.showMessage = (!(getCookie("hsdodl") == "true") && (WHP.auth.status == null) && photoDirect);

        if (this.mainObject == null)
            return false;


        //only on photo
        if (WHP.controller.curPage.urlStr == "photo")
        {
            if (WHP.controller.visible)
            if (this.showMessage)
            {
                WHP.stats.trackPhotoPlateShow();
                this.show();
            }
        }else{
            this.mainObject.css({ display:'none'});
        }
    },

    show : function()
    {
        this.mainObject.css({ display:''});
        this.timerObject.cP = 1.0;
        this.timerObject.p1 = 1.0;
    },

    hide: function()
    {
        this.timerObject.p0 = this.timerObject.cP;
        this.timerObject.p1 = 0;
        this.timer.reset();
        this.timer.start();
    },

    closeButton : function(e)
    {
        WHP.stats.trackXclick();
        setCookie("hsdodl", "true", 60*100);
        this.hide();
    },

    timerEvent : function(e)
    {
        var A = e.currentCount/e.repeatCount;
        var B = (Math.sin(Math.PI*(A-0.5))+1)*0.5;

        this.timerObject.cP = (1-A)*this.timerObject.p0 + A*this.timerObject.p1;
        var D = this.timerObject.cP;

        var C1 = 0.7;
        var C2 = 0.7;
        var A1 = Math.max(0, Math.min(1.0, D/C1));
        var A2 = Math.max(0, Math.min(1.0, (D-C2)/(1-C2)));

        A1 =  (Math.sin(Math.PI*(A1-0.5))+1)*0.5;
        A2 =  (Math.sin(Math.PI*(A2-0.5))+1)*0.5;

        setAlpha(this.mainObject, A2);
        this.heightH = 101*A1;
        this.mainObject.css({ height : this.heightH +'px'});

        if (A==1.0)
        if (this.timerObject.cP == 0)
        {
            this.showMessage = false;
            this.mainObject.css({ display:'none'});
        }
    }

}





WHP.timelineMessages = {
    inited : false,
    mainObject : null,
    showMessage : false,

    heightH : 0,
    heightH2 : 512,
    timer : new Timer(1000/32, 18),
    timer2 : new Timer(1000/32, 18),

    timerObject : {
        p0 : 0,
        p1 : 0,
        cP : 0
    },


    whyButton : null,
    tryButton1 : null,
    tryButton2 : null,

    desclaimer : null,

    likesCounter : 0,
    commentsCounter : 0,


    //init function
    init: function ()
    {
        //not [ X ] and authed user
        this.mainObject = $("#ogmessage");
        this.mainObject.closeButton = this.mainObject.find(".servicemessage_close");
        this.mainObject.closeButton.click(bind(this.closeButton, this));

        this.whyButton = this.mainObject.find(".why_button");
        this.whyButton.click(bind(this.onWhy, this));
        this.tryButton1 = this.mainObject.find(".ogmessage_try");
        this.tryButton2 = this.mainObject.find(".ogmessage_tryout");

        this.tryButton1.click(bind(this.getOG, this));
        this.tryButton2.click(bind(this.getOG, this));

        this.desclaimer = $(this.mainObject.find(".servicemessage_body")[1]);


        this.timer.onTimerEvent = bind(this.timerEvent, this);
        this.inited = true;
    },


    onAuthChange : function(_t)
    {

    },

    getOG : function()
    {
        FB.api('/me', function(e){ log(e);});
        WHP.auth.FB.loginOG(null, bind(this.onFBcall, this));
    },

    onFBcall: function (e)
    {
        WHP.pages.settings.linker.FB.onLink = bind( this.afterLink, this);
        WHP.pages.settings.linker.FB.showErrMsg = bind(WHP.popup_message.showAlert,WHP.popup_message);
        WHP.pages.settings.linker.FB.linkFb();
    },

    afterLink : function(resp)
    {
        log("AFTERLINK");
        log(resp);
        this.hide();
    },


    onGetSurePermission : function(e)
    {
       if (!e.data[0].publish_actions)
       {
           log("No opengraph access");

       }else{
           log("Opengraph access");
           this.hide();
           WHP.settings.useOpenGraph = true;
           WHP.pages.settings.setSettings();
       }
    },


    checkVisible : function()
    {
        var showWindow = !(getCookie("whp_stogw") == "true");
        var authStatus = WHP.auth.status;
        var OGStatus = WHP.settings.useOpenGraph;
        var cp = WHP.controller.curPage.urlStr;
        var registrationPages = (cp == WHP.pages.getstarted.urlStr) || (cp == WHP.pages.findfriends.urlStr);


        var commentsC =  WHP.stats.getCommentsCount();
        var likesC = WHP.stats.getLikesCount();
        var sharesC = WHP.stats.getSharesCount();

        if ((likesC == 100) || (commentsC == 20) || (sharesC == 5)|| (sharesC == 25))
        {
            if (!showWindow)
            {
                //set parameter more
                //!!!

                log("Make Show window on trigger!");
                this.timerObject.cP = 1.0;
                setCookie("whp_stogw", "false", 60*1000);
                showWindow = true;
            }
        }

        this.showMessage = showWindow && authStatus && !OGStatus && !registrationPages;
        if (this.mainObject == null)
            return false;

        if (this.showMessage)
        {
            //only on photo
            this.show();
            this.hide2();
        }else{
            if (this.mainObject.css("display") != "none")
                this.mainObject.css({ display:'none'});
        }
    },

    onWhy : function()
    {
        this.desclaimer.css({ height : ""});
    },

    hide2 : function()
    {
        this.desclaimer.css({ height : "0px"});
    },

    show : function()
    {
        if (this.timerObject.cP==1.0)
        {
            if (this.mainObject.css("display") == "none")
                this.mainObject.css({ display:''});

            return false;
        }

        this.mainObject.css({ display:''});
        this.timerObject.cP = 1.0;
        this.timerObject.p1 = 1.0;
    },

    hide: function()
    {
        if (this.timerObject.cP==0.0)
            return false;

        this.timerObject.p0 = this.timerObject.cP;
        this.timerObject.p1 = 0;
        this.timer.reset();
        this.timer.start();

        setCookie("whp_stogw", "true", 60*1000);
    },

    closeButton : function(e)
    {
        this.hide();
    },

    timerEvent : function(e)
    {
        var A = e.currentCount/e.repeatCount;
        var B = (Math.sin(Math.PI*(A-0.5))+1)*0.5;

        this.timerObject.cP = (1-A)*this.timerObject.p0 + A*this.timerObject.p1;
        var D = this.timerObject.cP;

        var C1 = 0.7;
        var C2 = 0.7;
        var A1 = Math.max(0, Math.min(1.0, D/C1));
        var A2 = Math.max(0, Math.min(1.0, (D-C2)/(1-C2)));

        A1 =  (Math.sin(Math.PI*(A1-0.5))+1)*0.5;
        A2 =  (Math.sin(Math.PI*(A2-0.5))+1)*0.5;

        setAlpha(this.mainObject, A2);
        this.heightH = this.mainObject.outerHeight()*A1;
        this.mainObject.css({ height : this.heightH +'px'});

        if (A==1.0)
        if (this.timerObject.cP == 0)
        {
            this.showMessage = false;
            this.mainObject.css({ display:'none'});
        }
    }

}

