WHP.auth = {
	inited : false,	
	status : null,
	userObject : {},
    userSettings : {},
	cookieExpireDate : 365,
    activeLogout : false,

    authChecker : {
        timer : new Timer(1000,0),
        parent : null,
        authStatus : false,
        initCheck : true,

        init : function()
        {
            this.timer.onTimerEvent = bind(this.eventOnTimer, this);
            this.start();
        },
        eventOnTimer : function()
        {
            var whp_uid = parseInt(getCookie("uid"));
            var whp_token = getCookie("token");
            var newStatus = true;



            if (isNaN(whp_uid))
            {
                whp_uid = -1;
                whp_token = 1;
                newStatus = false;
            }

            if (!this.initCheck)
            {
                if (this.authStatus != newStatus)
                {
                    if (newStatus)
                    {
                        //login
                        this.parent.setSession({  id: whp_uid , uid : whp_uid , token: whp_token }	);
                        this.parent.checkAuth();
                    }else{
                        //logout
                        if (!this.parent.activeLogout)
                        {
                            WHP.auth.onlogoutData({ state : "OK" });
                            WHP.loginMenus.showLoginMenu();
                        }

                        if (this.parent.activeLogout)
                            this.parent.activeLogout = false;
                    }
                    this.authStatus = newStatus;
                }
            }else{
                this.authStatus = newStatus;
            }




            if (this.initCheck)
                this.initCheck = false;
        },
        flush : function(_id)
        {
            this.lastId = _id;
        },
        start : function()
        {
            this.timer.start();
        },
        stop : function()
        {
            this.timer.stop();
        }
    },
	
	init: function ()
	{
		var whp_uid = parseInt(getCookie("uid"));
		if (isNaN(whp_uid))
			whp_uid = -1;
		var whp_token = getCookie("token");
		if ((whp_uid==-1) || (whp_token == 'undefined'))
		{
			//log("WHP.auth : client - user didnt log in!");
			this.clearSession();
			WHP.controller.init();
		}else{			
			//log("WHP.auth : client - cookie user_id = ["+whp_uid+"] token = ["+whp_token+"]");	
			this.setSession({  id: whp_uid , uid : whp_uid , token: whp_token }	);	
			this.checkAuth();			
		}
		
		
		this.FB.init();
		this.TW.init();
        this.VK.init();
        this.authChecker.init();
        this.authChecker.parent = this;
		
		this.inited = true;
	},

    escapeUser: function(user) {
        user.bio = escapeHtml(user.bio);
        user.first_name = escapeHtml(user.first_name);
        user.last_name = escapeHtml(user.last_name);
        user.fb_name = escapeHtml(user.fb_name);
        user.tw_name = escapeHtml(user.tw_name);
        return user;
    },

    showLoginError: function(text) {
        $("#auth-login-error").html(text).fadeIn();
    },

    showRegStep1Error: function(text) {
        $("#auth-popup_register-names").fadeOut();
        $("#register-email-error").html(text).fadeIn();
    },

    showRegStep2Error: function(text) {
        $("#register-names-error").html(text).fadeIn();
    },

    hideAllErrors: function() {
        $("#auth-login-error").hide();
        $("#register-email-error").hide();
        $("#register-names-error").hide();
    },

	//set gui etc of auth state
	checkStatus : function ()
	{
		WHP.menu.checkMenuState();
	},	
	
	//session control functions
	setUser : function (_user, _settings)
	{
		this.userObject = this.escapeUser(new Object(_user));
        this.userSettings = new Object(_settings);
	},

	setSession : function (_status)
	{
		log("(!) WHP/auth : Session check for ID = ["+_status.id+"] TOKEN = ["+_status.token+"]");
			
		this.status = _status;
		
		setCookie("uid",this.status.id,this.cookieExpireDate);
		setCookie("token",this.status.token,this.cookieExpireDate);
        this.authChecker.flush(this.status.id);
	},

	clearSession : function ()
	{
		WHP.auth.status = null;
		WHP.auth.checkStatus();
		setClass(document.body, "body_main");


	},
	
	//test login state on start
	checkAuth : function()
	{
		if (this.status)
		{
			$.ajax({
				url: WHP.netcalls.checkAuthCall+"?"+Math.random(),
				timeout : WHP.netTimeOut,
				data : this.status,
				success: bind(this.oncheckAuthData, this),
				error: bind(this.oncheckAuthDataErr, this)
			});
		}
	},	
	
	onStartWork : function (resp)
	{
		WHP.auth.checkStatus();
        if (WHP.controller.current_page && WHP.controller.current_page.indexOf("photo") != 0) {
            // если только мы не на странице фото, то перекидываем в таймлайн
            WHP.controller.navigateTo("/timeline");
        }
	},
	
	oncheckAuthData : function(response)
	{

		var resp = getObjectJson(response);	
		if (resp.error)
		{
            WHP.controller.init();
			//user id and token arent actal
			log("WHP/auth : check state ERROR after netcall!");
			delCookie("uid");
			delCookie("token");	
			this.checkStatus();
			this.clearSession();
		} else {
            $("#main-header-logo-img").attr("src", "/gui/whp_logo.png");
			WHP.auth.setUser(resp.user, resp.settings);
			WHP.auth.onStartWork(resp);
			setClass(document.body, "body_main");
            log("AUTH.oncheck");
            WHP.controller.init(resp);
            //WHP.pages.settings.onData(
		}
	},
	
	oncheckAuthDataErr : function(e)
	{
		//set up unloged
		log("WHP/auth : check state ERROR self!");
		WHP.controller.init();
		delCookie("uid");
		delCookie("token");	
		this.checkStatus();
		this.clearSession();
	},




	//logout functions
	logout : function()
	{

		if (this.status)
		{
			//log("Facebook : access_token = ["+this.FB.access_token+"]");
			this.logoutServer();
		}
	},
	logoutServer : function(response)
	{
		log("WHP/auth : logout...");
        this.activeLogout = true;
		setClass(WHP.menu.logoutButton[0], "controls_logout_button_procces");
		$.ajax({
				url: WHP.netcalls.logoutCall+"?"+Math.random(),
			 	timeout : WHP.netTimeOut,
			 	success: bind(this.onlogoutData, this),
			 	error: bind(this.onlogoutDataErr, this)
			});
	},
	onlogoutData : function(response)
	{
		var resp = getObjectJson(response);	
		if (resp.error)
		{
			log("WHP/auth : on logout error = ["+resp.error.code+"]");
			if (resp.error.code == API_Auth_Failed)
				WHP.auth.authError();
		}else{
			log("WHP/auth : response status = ["+resp.status+"]");
            $("#main-header-logo-img").attr("src", "/gui/web_landing/whp_logo_bigger.png");
		}
		this.logoutCallBack();
	},
	onlogoutDataErr : function(e)
	{
		log("WHP/auth : error while logging out!");
		WHP.controller.showErrorPage();
	},
	logoutCallBack : function()
	{
		delCookie("uid");
		delCookie("token");	
		this.clearSession();
        WHP.controller.setTitle();
		WHP.controller.onChangeAuthState(null);
	},
	logoutCallBackOnerr : function()
	{
		log("WHP/auth : LOGOUT ERROR!");
		delCookie("uid");
		delCookie("token");	
		this.clearSession();
		WHP.controller.onChangeAuthState(null);
	},
	
	
	
	
	//global error
	authError : function()
	{
		log("WHP/auth : LOGOUT!");
		this.logoutOnerrorServer();
	},
	logoutOnerrorServer : function(response)
	{
		log("WHP/auth : on Err server logout...");
		$.ajax({
				url: WHP.netcalls.logoutCall+"?"+Math.random(),
			 	timeout : WHP.netTimeOut,
			 	success: bind(this.logoutCallBackOnerr, this),
			 	error: bind(this.onlogoutDataErr, this)
			});
	},





    FB : {
        inited : false,
        access_token : null,
        jqxhr : null,

        showErrMsg : null,

        init: function ()
        {
            window.fbAsyncInit = bind(function () {
                //facebook functions
                FB.init({
                    appId: '205868409437437',
                    cookie: true,
                    status: true,
                    xfbml: true,
                    oauth : false });
                FB.Event.subscribe('edge.create', this.fbShareEvents);

                if ($.browser.opera)
                {
                    FB.XD._transport="postmessage";
                    FB.XD.PostMessage.init();
                }

                FB.getLoginStatus(bind(function (response) {
                    if (response.status == "connected")
                    {
                        log("Facebook : user was succesfully connected! :)");
                    }else{
                        log("Facebook : user was not connected! :(");
                    }
                }, this));

            }, this);

            //load facebook module
            (function(d, s, id) {
              var js, fjs = d.getElementsByTagName(s)[0];
              if (d.getElementById(id)) {return;}
              js = d.createElement(s); js.id = id;
              js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
              fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));

            this.inited = true;
        },

        getAuth: function()
        {
            var senddata = { social : 'fb',  access_token : this.access_token };
            if (!WHP.auth.status)
            if (this.access_token!=null)
            {
                log("WHP.auth : get auth for FB...");
                 this.jqxhr = $.ajax({
                    url: WHP.netcalls.fbAuthCall+"?r="+Math.random(),
                    timeout : WHP.netTimeOut,
                    data : senddata,
                    success: bind(this.onData, this),
                    error: bind(this.onError, this)
                 });
            }
        },

        onData: function(response, status, xhr)
        {
            var resp = getObjectJson(response);
            if (resp!=null)
            if (resp.error)
            {
                if (resp.error.code == "API_AuthFailed") {
                    WHP.auth.showRegStep1Error("This account isn't linked with WeHeartPics");
                } else {
                    WHP.auth.showRegStep1Error("Something went wrong");

                }
            }else{
                WHP.pages.settings.onData(resp);
                WHP.auth.setUser(resp.user);
                WHP.auth.setSession({ token: resp.user.token, id: resp.user.id , uid: resp.user.id });
                WHP.controller.onChangeAuthState(true);
                WHP.auth.onStartWork(resp);
            }
            //setClass(WHP.menu.loginButton[0], "controls_login_button");
            WHP.controller.setTitle();
        },

        onFBData: function(response)
        {
            WHP.pages.getstarted.hidePopup();
            if (response.status == "connected")
            {
                log("Facebook : user was succesfully connected! :)");
                var token = response.authResponse.accessToken;
                if (this.access_token!=token)
                {
                    //setClass(WHP.menu.loginButton[0], "controls_logout_button_procces");
                    log("Facebook : token = ["+token+"]");
                    this.access_token = token;
                    this.getAuth();
                }else{
                    log("Facebook : user was not connected! :(");
                }
            }
            WHP.controller.setTitle();
        },

        onError: function(e)
        {
            log("WHP/auth/FB : error while logging in!");
            WHP.controller.showErrorPage();
            //setClass(WHP.menu.loginButton[0], "controls_login_button");
            WHP.controller.setTitle();
        },

        login : function (e)
        {
            this.access_token = "";
            FB.login(bind(this.onFBData, WHP.auth.FB), { scope:'publish_actions,publish_stream,user_photos,offline_access,email,user_birthday'});
        },

        loginOG : function (e, _func)
        {

            this.access_token = "";
            FB.login(_func, { scope:'publish_actions,publish_stream,user_photos,offline_access,email,user_birthday'});
        },

        fbShareEvents : function(e)
        {
            log("CreateEdge");
            if (WHP.shares.onFbLike(e))
                return false;

            if (WHP.controller.curPage.onFBlike)
            {
                WHP.controller.curPage.onFBlike(e);
            }
        }
    },



    TW : {
        inited : false,
        jqxhr : null,
        requesttoken : null,
        req_count : 0,
        req_max : 10,
        preStatus : null,
        activeToken : false,
        curWind : null,

        showErrMsg : null,



        init: function ()
        {
              var js, fjs = document.getElementsByTagName('script')[0];
              if (document.getElementById('twitter-jssdk')) {return;}
              js = document.createElement('script');
              js.id = 'twitter-jssdk';
              $(js).load(bind(this.twLoadedCall,this));
              js.src = "//platform.twitter.com/widgets.js";
              fjs.parentNode.insertBefore(js, fjs);

            this.inited = true;
        },

        twLoadedCall : function(e)
        {
            //WHP.pages.photo.share.setShareEvents();
        },


        getReqToken : function()
        {
            log("login tw2 >");
            //active?t
            this.activeToken = true;
            this.jqxhr = $.ajax({
                url: WHP.netcalls.twReqTokenCall+"?"+Math.random(),
                timeout : WHP.netTimeOut,
                success: bind(this.onDataToken, this),
                error: bind(this.onErrorToken, this)
            });
        },

        onDataToken: function(response, status, xhr)
        {
            log("data token");
            this.activeToken = false;
            var resp = getObjectJson(response);
            WHP.pages.getstarted.hidePopup();

            if (resp.error)
            {
                log("WHP/auth/TW : got error while getting twitter token = ["+resp.error.code+"]");
                this.req_count++;
                this.getReqTokenAct();
            }else{
                log("WHP/auth/TW : get twitter request token = ["+resp.oauth_token+"]");
                this.req_count = 0;

                if ( this.curWind )
                    this.curWind.location.href = "http://api.twitter.com/oauth/authorize?oauth_token="+resp.oauth_token;
            }
        },

        onErrorToken: function(response)
        {
            this.activeToken = false;
            var status = response['status'];

            if (status==0)
            {
                //offline
                log("WHP/auth/TW : OFFLINE mode!");
            }else{
                this.getReqTokenAct();
                this.req_count++;
                log("WHP/auth/TW : error while getting twitter request token! Status = ["+status+"] Tries = ["+this.req_count+"]");
            }
        },


        getAuth: function(_id, _token, _secret)
        {
            log("GET TW AUTH = ["+_id+" : "+_token+" : "+_secret+"]");
            log("WHP/auth/TW : get auth...");

            if (WHP.auth.status)
            {
                WHP.pages.settings.linker.TW.finalLinkTw(_id, _token, _secret);
                return false;
            }


            //setClass(WHP.menu.loginButton[0], "controls_logout_button_procces");

            this.jqxhr = $.ajax({
                url: WHP.netcalls.fbAuthCall,
                timeout : WHP.netTimeOut,
                data : { r : Math.random(), social : 'tw' , access_token : _token, access_token_secret : _secret},
                success: bind(this.onData, this),
                error: bind(this.onError, this)
            });

        },

        onData: function(response, status, xhr)
        {
            var resp = getObjectJson(response);
                if (resp.error)
                {
                    if (resp.error.code == "API_AuthFailed")
                    {
                        if (this.showErrMsg)
                            this.showErrMsg("This account isn't linked with WeHeartPics");
                    }else
                    {
                        if (this.showErrMsg)
                            this.showErrMsg("Something went wrong");

                    }


                }else{
                    WHP.pages.settings.onData(resp);
                    WHP.auth.setUser(resp.user);
                    WHP.auth.setSession({ token: resp.user.token, id: resp.user.id , uid: resp.user.id });
                    WHP.controller.onChangeAuthState(true);
                    WHP.auth.onStartWork(resp);
                }
            //setClass(WHP.menu.loginButton[0], "controls_login_button");
            WHP.controller.setTitle();
        },


        onError: function(e)
        {
            log("WHP/auth/TW : error while logging in!");
            this.preStatus = null;
            //setClass(WHP.menu.loginButton[0], "controls_login_button");
        },

        login : function (e)
        {
            log("login tw >");
            this.req_count = 0;
            this.curWind = openWindow2("Twitter auth", 640, 480);
            this.getReqToken();
        }
    },


    VK : {
        app_id: 3154513,
        inited : false,
        jqxhr : null,
        showErrMsg : null,
        wind: null,

        init: function() {
            var self = this;
        },

        login: function(event) {
            var self = this;
            this.wind = openWindow2("VK auth", 640, 480);
            var interval = setInterval(function() {
                console.debug("HREF: ", self.wind.location.href);
            }, 500);
            this.wind.location.href = "https://api.vk.com/oauth/authorize?client_id=" + this.app_id + "&scope=friends,photos,wall,offline&response_type=token&redirect_uri=http://weheartpics.com/close_vk.html";
            return false;
        },

        auth: function(token, user_id) {
            var self = this;
            $.ajax({
                url: WHP.netcalls.vkAuthCall,
                timeout : WHP.netTimeOut,
                data : { r : Math.random(), social : 'vk' , access_token : token, vk_id : user_id },
                success: self.onData,
                error: self.onError
            });
        },

        onData: function(response) {
            console.debug("AUTH SUCCCEEED!", response);
            if (response.error) {
                if (resp.error.code == "API_AuthFailed") {
                    WHP.auth.showRegStep1Error("This account isn't linked with WeHeartPics");
                } else {
                    WHP.auth.showRegStep1Error("Something went wrong");
                }
            } else {
                WHP.pages.settings.onData(response);
                WHP.auth.setUser(response.user);
                WHP.auth.setSession({ token: response.user.token, id: response.user.id , uid: response.user.id });
                WHP.controller.onChangeAuthState(true);
                WHP.auth.onStartWork(response);
                WHP.pages.getstarted.hidePopup();
            }
            WHP.controller.setTitle();
        },

        onError : function(e) {
            WHP.auth.showRegStep1Error("Something went wrong");
        }
    },


    STD : {
        showErrMsg : null,

        login: function(_login, _pw)
        {
            this.jqxhr = $.ajax({
                url: WHP.netcalls.mailLoginCall,
                timeout : WHP.netTimeOut,
                data : { r : Math.random(), login : _login, passw : _pw},
                success: bind(this.onData, this),
                error: bind(this.onError, this)
            });
        },

        onData: function(response, _reg)
        {
            var resp = getObjectJson(response);
            if (resp!=null)
                if (resp.error)
                {
                    if (resp.error.code == "API_BadParams") {
                        WHP.auth.showLoginError("Wrong e-mail and password combination");
                        $("#login-email, #login-password").addClass("input_error");
                    } else if (resp.error.code == "API_AuthFailed") {
                        WHP.auth.showLoginError("Wrong e-mail and password combination");
                        $("#login-email, #login-password").addClass("input_error");
                    } else if (resp.error.code = "API_PendingConfirmation") {
                        WHP.auth.showLoginError("We have sent you an e-mail to confirm");
                    } else {
                        WHP.auth.showLoginError("Something went wrong");

                    }

                }else{
                    WHP.pages.getstarted.hidePopup();
                    WHP.pages.settings.onData(resp);
                    WHP.auth.setUser(resp.user);
                    WHP.auth.setSession({ token: resp.user.token, id: resp.user.id , uid: resp.user.id });
                    WHP.controller.onChangeAuthState(true);
                    WHP.auth.onStartWork(resp);
                }
            //setClass(WHP.menu.loginButton[0], "controls_login_button");
            WHP.controller.setTitle();
        },


        onError : function(e)
        {
            WHP.auth.showLoginError("Something went wrong");
            $("#login-email, #login-password").addClass("input_error");
        }
    }
}


