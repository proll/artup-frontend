WHP = {
	inited : false,
	netTimeOut : 30000,
    errorMessTO : 4000,
	curUrl : "",
	curHash : "",
	domain : "",
	templateContId : "templates",
	canvasContId : "content",
    contentCont : null,




    footer : null,
    footer_dummy : null,
    main_fader : null,
	
    // Language
    language : (navigator.language || navigator.systemLanguage || navigator.browserLanguage || navigator.userLanguage || 'en').substr(0, 2).toLowerCase(),

	//vars for screen
	screenWLimit : 1000,
	screenHLimit : 512,
	screenW : 0,
	screenH : 0,
	screenWl : 0,
	screenHl : 0,
	
	scrollsWidth : 27,
	mainObject : null,
	
	pageTitle : "WeHeartPics",
	docTitle : "",
	
	totalH : 0,
	totalW : 0,

    liked1 : false,

    apple_store_link : "http://itunes.apple.com/app/weheartpics/id488515478?mt=8",


    changeContentEventTimer : new Timer(1000/20,0),

    changeContentEventLastH : 0,
    changeContentEventLastH2 : 0,
    changeContentEventLastH3 : 0,


    shadows : {
        tile : null,
        vtop : null
    },


    shares : {
        visible : true,
        container : null,
        parent : null,


        promoteButton : null,
        normalButton : null,
        promoteImg : null,

        promoteFirst : false,

        init : function()
        {
            this.promoteFirst = (getCookie("fsp") == "true");

            //this.container
            this.normalButton = $(this.parent.footer).find(".landing_facebook_lk");
            this.promoteButton = $(this.parent.footer).find(".landing_promote");
            this.promoteButton.likeholder = this.promoteButton.find(".like_holder");
            this.promoteImg = $(this.parent.footer).find(".landin_knight2");

            this.setMissed( $(this.parent.footer).find(".landing_share_fb"), $($(this.parent.footer).find(".missed_labl1")[0]) );
            this.setMissed( $(this.parent.footer).find(".landing_share_tw"), $($(this.parent.footer).find(".missed_labl1")[1]) );
            this.setMissed( $(this.parent.footer).find(".landing_share_fb2"), $($(this.parent.footer).find(".missed_labl2")[0]) );
        },

        showAct2 : function()
        {
            this.promoteButton.css({ display: ''});
            this.promoteImg.css({ display: ''});
        },
        hideAct2 : function()
        {
            if (this.promoteFirst)
            {
                this.normalButton.css({ display : 'none' });
                this.promoteButton.css({ display: '' });
            }else{
                this.normalButton.css({ display : '' });
                this.promoteButton.css({ display: 'none' });
            }

            if (typeof(FB)!='undefined')
            {
                var likeButtonStr = '<div style="position: absolute; top:6px;left:8px; height:20px;" class="fb-like" data-href="http://weheartpics.com/" data-send="false" data-layout="button_count" data-width="90" data-height="20" data-show-faces="false" action="recommend"></div>';

                //this.shares.promoteButton.likeholder.html("");
                this.promoteButton.likeholder.html(likeButtonStr);
                FB.XFBML.parse(this.promoteButton.likeholder.get()[0]);
            }


            this.promoteImg.css({ display: 'none' });
            this.parent.footer.css({ height : 61+'px'});
            WHP.resetH();
        },

        changeFooterH : function()
        {
            if (this.parent)
            {
                //this.parent.resize();
            }
        },

        onFbLike : function(e)
        {
            if (this.visible)
            {
                if ((e == "http://weheartpics.com/") || (e == "https://weheartpics.com/"))
                {
                    log("!!!!");

                    if (browser.ie)
                    if ( this.liked1 )
                        this.parent.footer.css({ height : 350+'px'});

                    this.parent.footer.css({ height : 270+'px'});

                    this.changeFooterH();
                }else{
                    this.liked1 = true;
                    setCookie("fsp", "true", 365*24);
                    var a = this.promoteButton.find(".missed_labl2");
                    setClass(a, "missed_labl1");
                    a.css({ left : -134+"px"});

                    this.parent.footer.css({ height : 150+'px'});
                    this.promoteFirst = true;
                    this.showAct2();
                }
                var posTo = $(document).height() - WHP.screenHl;
                WHP.smoothScrollTo(0, posTo, null, true);
                return true;
            }
            return false;
        },
        setMissed : function(elem, missed)
        {
            elem.click(bind(function(){ this.missed.css({ display: 'block' }); this.timer.reset(); this.timer.start(); }, elem));
            elem.timer = new Timer(1500,1);
            elem.timer.onTimerEvent = bind(function(e){  this.missed.css({ display: 'none'}) }, elem);
            elem.missed = missed;
        }
    },




    smoothScrollParams : {
        timer : new Timer(1000/32, 10),
        p0 : { x: 0, y: 0},
        p1 : { x: 0, y: 0},

        onMoveEnd : null,
        onMoveFrame : null
    },

	
	onLoad: function (e)
	{

        //detect
        this.detectSocialRedirects();
        //this.detectMobileRedirects();


		this.init();		
	},

    detectMobileRedirects : function()
    {
        alert(navigator.userAgent);
        alert(navigator.platform);
        alert(navigator.appName);

        // Detects if it is an Android device
        if (browser.iphone)
        {
            alert("IPHONAMA");
        }else if (browser.android)
        {
            alert("ANDROIDAMA");
        }else if (browser.wmobile)
        {
            alert("WINDOWSMOBILAMA!");
        }else if (browser.symbian)
        {
            alert("SYMBIANOMA!");
        }
    },

    detectSocialRedirects : function()
    {
        //detect redirects\
        //facebookredirect
        if (String(document.location).indexOf("fb_xd_fragment")>-1)
        {
            window.close();
        }

        //ie has redirect V
        var urla = "";
        var hashLink = getLinkNormolizedHash();
        if (hashLink.length==0)
            urla = getLinkNormolized();
        else
            urla = hashLink;

        //remove special symbols
        if (urla.indexOf("?")>-1)
            urla = urla.substring(0, urla.indexOf("?"));
        urla = urla.replace(new String(window.location.hostname), "");

        while (urla.charAt(0) == "/")
            urla = urla.substring(1, urla.length);

        if (document.location.hash.length>0)
        if (browser.ie)
        {
            document.location = "//" + new String(window.location.hostname) + "/" + urla;
            return false;
        }
    },

	resize: function (e)
	{
        var newW = $(window).width();
		var newH = $(window).height();
		//get zoom changed
		var kX = this.screenW/newW;
		var kY = this.screenH/newH;
		//log("Screen kX = ["+kX+"] ["+kY+"] delt = ["+(kX-kY)+"]");
		if (Math.abs(kY-kX)<0.05)
		{
			//log("zoom Changed");
		}


        if (WHP.controller.curPage)
        if (WHP.controller.curPage.onResizeEvent)
        {
            var e = { type : "onResizeEvent", newHeight : newH, newWidth : newW };
            WHP.controller.curPage.onResizeEvent(e);
        }

		//get viewport size
		this.screenW = newW;
		this.screenWl = Math.max(newW, this.screenWLimit);
		this.screenH = newH;
        if (browser.ie)
        {
            this.screenHl = Math.max(newH, this.screenHLimit-4);
        }else{
            this.screenHl = Math.max(newH, this.screenHLimit);
        }




        if (WHP.controller.curPage)
        if (WHP.controller.curPage.onResizeEvent)
        {
            var e = { type : "onResizeEvent", newHeight : newH, lastHeight : this.changeContentEventLastH, delt : (newH - this.changeContentEventLastH)};
            WHP.controller.curPage.onResizeEvent(e);
        }

        // log("["+this.screenWl+"]x["+this.screenHl+"]");
		this.mainObject.style.width = this.screenWl - this.scrollsWidth +'px';
		WHP.menu.menuObject.css({ width : (this.screenWl - this.scrollsWidth)+'px'});


        this.main_fader.css({width:this.screenWl+'px', height:this.screenHl+'px'});

        this.resetH();
	},


    getViewportParams : function()
    {
        var newW = $(window).width();
        var newH = $(window).height();
        //get zoom changed
        var kX = this.screenW/newW;
        var kY = this.screenH/newH;
        var kY = this.screenH/newH;

        this.screenW = newW;
        this.screenWl = Math.max(newW, this.screenWLimit);
        this.screenH = newH;
        this.screenHl = Math.max(newH, this.screenHLimit);
    },



	resetHtimeout: 0,
	resetH: function (e)
	{
        return false;
	},



    changeContentH : function(e, _force)
    {
        return false;
    },


	init: function ()
	{
		this.mainObject = id$('main_object');

        //shadows
        this.shadows.tile = $("#border_vtile");
        this.shadows.vtop = $("#border_top");

        //foooooter
        this.footer = $("#footer1");
        this.footer_dummy = $("#footer_dummy");
        var links = this.footer.find(".footer_link");
        for (var i = 0 ; i<links.lenght; i++)
        {
            links[i].hasIntelloLinker = true;
        }
        this.shares.parent = this;
        this.shares.init();

        this.main_fader = $("#main_fader");
        setAlpha(this.main_fader, 0);
        this.main_fader.css({ display : 'none'});
        this.main_fader.timer = new Timer(1000/30,5);
        this.main_fader.timer.onTimerEvent = bind(this.faderFunc, this.main_fader);
        this.main_fader.show = bind(this.showFader, this.main_fader);
        this.main_fader.hide = bind(this.hideFader, this.main_fader);
        this.main_fader.click(bind(this.faderClick, this));
        this.main_fader.p0 = 0;
        this.main_fader.p1 = 0;
        this.main_fader.cP = 0;


        this.contentCont = $("#content");
        //this.scrollsWidth = getScrollBarWidth();
		
	//	this.resize();
		this.domain = window.location.hostname;
		//init all links
		this.initCalls();
		
		AddHandler(window, "resize", this.resize, this);
		//init modules
        WHP.serviceMessages.init();
        WHP.timelineMessages.init();
        WHP.stats.init();
		WHP.menu.init();
		WHP.auth.init();
        WHP.popup_message.init();



        this.smoothScrollParams.timer.onTimerEvent = bind(this.smoothScrollEventFunc, this);
        this.changeContentEventTimer.onTimerEvent = bind(this.changeContentH, this);
		this.changeContentEventTimer.start();


        var mousewheelevt = browser.firefox ? "DOMMouseScroll" : "mousewheel";
        AddHandler(document, mousewheelevt, bind(this.mwheelEvent,this));
        $(window).scroll(bind(this.scrollEvent,this));







		this.inited = true;
	},
	
	initCalls : function ()
	{
		for (var key in this.netcalls)
		{
            if (this.netcalls[key].indexOf("//") < 0) {
                this.netcalls[key] = "//"+WHP.domain+"/"+this.netcalls[key]+"/";
            }
		}
	},
	
	netcalls: {
		//timeline
		timelineCallUrl : "api/user/timeline",
        timelineGlobalCallUrl : "api/timeline",
		
		//comments calls
		commentsCallAdd : "api/photo/comment/add",
        commentsCallReply : "api/photo/comment/reply",

		commentsCallGet : "api/photo/comments",

		//auth
		logoutCall : "api/auth/logout",
		checkAuthCall : "api/auth/me",


        userPhotosCall : "api/user/storyphotos",


		//stories
        dailyStories : "api/story/daily/list",
		
		//user
		getProfileCall : "api/user",

        //stories
        storyInfoUrl : "api/story/info",
        storiesCall : "api/story/tree",

        //likes
        likesCall : "api/photo/likers",
        voteCall : "api/photo/vote",



        //friends calls
		followCall : "api/friends/follow",
		unfollowCall : "api/friends/unfollow",
        shiftBkCall : "api/profile/shiftbackground",
        newFacesCall : "api/friends/newfaces",

		followersCall : "api/friends/followers",
		followingsCall : "api/friends/followings",


		
		//random
		randomImageCall : "api/photo/random",


		//scenario
		wasVoteCall : "api/photo/checkvote",

		//popular
		popularCall : "api/photo/popular",
		
		//photo
		photoInfoCall : "api/photo",
		
		//notifications
		eventsCall : "api/getevent",
        eventsCountCall : "api/event/count",
		clearCall : "api/clearevents",
		lpCall : "notify",

		//auth
        fbAuthCall : "api/auth",
        vkAuthCall : "api/auth",
		twReqTokenCall : "api/auth/twitter/request_token",
		
		//user timeline
		storiesUserCall : "api/user/photos",

        //promo
        promoCall : "api/promo",

        //versions
        versionCall : "api/version",

        //photo delete
        deletePhotoCall : "api/photo/delete",

        shareCallSvr : 'api/photo/share',

        getSettingsCall : 'api/user/settings',
        setSettingsCall : 'api/user/settings/set',

        regCall : "api/auth/signup",
        resendCall : "api/auth/resend_confirmation",
        resetPwCall : "api/auth/reset_passw",
        linkSocialCall : "api/auth/link",
        unlinkSocialCall : "api/auth/unlink",
        mailLoginCall : "api/auth/signin",
        setPwCall : "api/auth/change_passw",

        setLogPwCall : "api/auth/set_login_passw",
        setPwSettingsCall : "api/auth/reset_passw",

        changeLoginCall : "api/auth/change_login",
        confirmPwCall : "api/auth/check_passw",
        setNameCall : "api/user/rename",

        uploadCall: "api/photo/upload"

	},



    smoothScrollEventFunc: function(e)
    {
        var A = e.currentCount/e.repeatCount;
        var dL = Math.abs(this.smoothScrollParams.p0.y - this.smoothScrollParams.p1.y);
        var B = (Math.sin(Math.PI*(A-0.5))+1)*0.5;

        var scrollX = (1-B)*this.smoothScrollParams.p0.x + B*this.smoothScrollParams.p1.x;
        var scrollY = (1-B)*this.smoothScrollParams.p0.y + B*this.smoothScrollParams.p1.y;


        WHP.menu.setShadow(scrollY);
        window.scrollTo(scrollX,scrollY);

        if (A==1)
        {
            if (this.smoothScrollParams.onMoveEnd)
                this.smoothScrollParams.onMoveEnd();
        }
    },

    smoothScrollTo: function (_x,_y, _func, _Notlimit)
    {
        this.smoothScrollParams.p0.x = $(window).scrollLeft();
        this.smoothScrollParams.p0.y = getScrollTop();


        this.smoothScrollParams.p1.x = _x;

        if (!_Notlimit)
        {
            this.smoothScrollParams.p1.y = Math.max(0, Math.min($(document).height() - WHP.screenHl, _y));
        }else{
            this.smoothScrollParams.p1.y = _y;
        }

        this.smoothScrollParams.onMoveEnd = _func;

        this.smoothScrollParams.timer.reset();

        this.smoothScrollParams.timer.repeatCount = 10 + Math.abs(this.smoothScrollParams.p0.y-this.smoothScrollParams.p1.y)*(1/50);
        this.smoothScrollParams.timer.start();
    },

    faderFunc : function(e)
    {
        var A = e.currentCount/e.repeatCount;
        var B = (Math.sin(Math.PI*(A-0.5))+1)*0.5;

        this.cP = this.p1*B + this.p0*(1-B);

        setAlpha(this, this.cP);

        if (A==1)
        if (this.cP == 0)
        {
           this.css({ display : 'none' });
        }
    },

    showFader : function()
    {
        log("showFader");
        this.css({ display : '' });
        this.p0 = this.cP;
        this.p1 = 0.75;
        this.timer.reset();
        this.timer.start();
    },

    hideFader : function()
    {
        log("hideFader");
        this.p0 = this.cP;
        this.p1 = 0.0;
        this.timer.reset();
        this.timer.start();
    },

    faderClick : function()
    {
        log("Make hide event");
        this.main_fader.hide();
    },


    smoothScrolllStop: function ()
    {
        this.smoothScrollParams.timer.stop();
    },

    mwheelEvent : function(e)
    {
        this.totalH = Math.max( $(document).height(), $(window).height() );

        if (this.smoothScrollParams.timer.active)
        {
            this.smoothScrolllStop();
        }

        if (this.main_fader.cP > 0)
            return cancelEvent(e);

        if (browser.ie)
        {
            if (browser.ie_version == 8)
            {
                var delt = -e.wheelDelta/120;

                var newS = delt*40 + getScrollTop();

                newS = Math.max(0, Math.min(this.totalH-this.screenH, newS));
                window.scrollTo(0, newS);
            }
        }
    },

    scrollEvent : function(e)
    {
        if (this.main_fader.cP > 0)
            return cancelEvent(e);
    },

    popup_message :  {
        box : null,
        curTimer : -1,

        init : function()
        {
            this.box = $("#popup_message");
            this.box.css({ position : 'fixed', height : 'auto' });
            var labels =  this.box.find(".form_label_sign");
            this.box.headLabel =  $(labels[0]);
            this.box.textLabel =  $(labels[1]);
            this.box.icons = this.box.find(".message_icons");
        },

        showAlert : function(_text, _head, _ico)
        {

            log("ICO = ["+_ico+"]");
            if (_ico)
            {
                setClass(this.box.icons, "message_icons");
                this.box.icons.html("<img src='"+_ico+"' />");
                this.box.textLabel.css({ "text-align" : "left"});
            }else{
                setClass(this.box.icons, "message_icons_0");
                this.box.icons.html("");
                this.box.textLabel.css({ "text-align" : "center"});
            }

            this.box.textLabel.text(_text);
            if (_head)
            {
                this.box.headLabel.text(_head);
                this.box.headLabel.css({ display : '' });
                this.box.textLabel.css({ 'margin-top' : '10px'});
            }else{
                this.box.headLabel.css({ display : 'none' });
                this.box.textLabel.css({ 'margin-top' : '26px'});
            }



            this.box.css({ display : ""});
            WHP.main_fader.show();




            var scrollTop = getScrollTop();


            if (browser.ie)
            {
                this.box.css({ position : 'absolute' });
                this.box.css({ top : (scrollTop + (WHP.screenH - this.box.outerWidth())*0.5 )+'px', left : (WHP.screenWl-this.box.outerWidth())*0.5 -20 +'px' });
            }else
                this.box.css({ top : (WHP.screenH - this.box.outerHeight())*0.5 +'px', left : (WHP.screenWl-this.box.outerWidth())*0.5 -20 +'px' });





            if (this.curTimer!=-1)
            {
                clearTimeout(this.curTimer);
            }
            this.curTimer = setTimeout(bind(function(){
                this.hideAlert();
                this.curTimer = -1;
            },this), 3000);
        },

        hideAlert : function()
        {
            if (this.box.css("display") == "none")
                return false;

            this.box.css({ display : "none" });
            WHP.main_fader.hide();
        }
    }
}

//additional modules
WHP.pages = {}
WHP.actions = {}









