aup.auth = {
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
            var aup_uid = parseInt(getCookie("uid"));
            var aup_token = getCookie("token");
            var newStatus = true;



            if (isNaN(aup_uid))
            {
                aup_uid = -1;
                aup_token = 1;
                newStatus = false;
            }

            if (!this.initCheck)
            {
                if (this.authStatus != newStatus)
                {
                    if (newStatus)
                    {
                        //login
                        this.parent.setSession({  id: aup_uid , uid : aup_uid , token: aup_token }	);
                        this.parent.checkAuth();
                    }else{
                        //logout
                        if (!this.parent.activeLogout)
                        {
                            aup.auth.onlogoutData({ state : "OK" });
                            aup.loginMenus.showLoginMenu();
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
		var aup_uid = parseInt(getCookie("uid"));
		if (isNaN(aup_uid))
			aup_uid = -1;
		var aup_token = getCookie("token");
		if ((aup_uid==-1) || (aup_token == 'undefined'))
		{
			//log("aup.auth : client - user didnt log in!");
			this.clearSession();
			aup.controller.init();
		}else{			
			//log("aup.auth : client - cookie user_id = ["+aup_uid+"] token = ["+aup_token+"]");	
			this.setSession({  id: aup_uid , uid : aup_uid , token: aup_token }	);	
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
		aup.menu.checkMenuState();
	},	
	
	//session control functions
	setUser : function (_user, _settings)
	{
		this.userObject = this.escapeUser(new Object(_user));
        this.userSettings = new Object(_settings);
	},

	setSession : function (_status)
	{
		log("(!) aup/auth : Session check for ID = ["+_status.id+"] TOKEN = ["+_status.token+"]");
			
		this.status = _status;
		
		setCookie("uid",this.status.id,this.cookieExpireDate);
		setCookie("token",this.status.token,this.cookieExpireDate);
        this.authChecker.flush(this.status.id);
	},

	clearSession : function ()
	{
		aup.auth.status = null;
		aup.auth.checkStatus();
		setClass(document.body, "body_main");


	},
	
	//test login state on start
	checkAuth : function()
	{
		if (this.status)
		{
			$.ajax({
				url: aup.netcalls.checkAuthCall+"?"+Math.random(),
				timeout : aup.netTimeOut,
				data : this.status,
				success: bind(this.oncheckAuthData, this),
				error: bind(this.oncheckAuthDataErr, this)
			});
		}
	},	
	
	onStartWork : function (resp)
	{
		aup.auth.checkStatus();
        if (aup.controller.current_page && aup.controller.current_page.indexOf("photo") != 0) {
            // если только мы не на странице фото, то перекидываем в таймлайн
            aup.controller.navigateTo("/timeline");
        }
	},
	
	oncheckAuthData : function(response)
	{

		var resp = getObjectJson(response);	
		if (resp.error)
		{
            aup.controller.init();
			//user id and token arent actal
			log("aup/auth : check state ERROR after netcall!");
			delCookie("uid");
			delCookie("token");	
			this.checkStatus();
			this.clearSession();
		} else {
            $("#main-header-logo-img").attr("src", "/gui/aup_logo.png");
			aup.auth.setUser(resp.user, resp.settings);
			aup.auth.onStartWork(resp);
			setClass(document.body, "body_main");
            log("AUTH.oncheck");
            aup.controller.init(resp);
            //aup.pages.settings.onData(
		}
	},
	
	oncheckAuthDataErr : function(e)
	{
		//set up unloged
		log("aup/auth : check state ERROR self!");
		aup.controller.init();
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
		log("aup/auth : logout...");
        this.activeLogout = true;
		setClass(aup.menu.logoutButton[0], "controls_logout_button_procces");
		$.ajax({
				url: aup.netcalls.logoutCall+"?"+Math.random(),
			 	timeout : aup.netTimeOut,
			 	success: bind(this.onlogoutData, this),
			 	error: bind(this.onlogoutDataErr, this)
			});
	},
	onlogoutData : function(response)
	{
		var resp = getObjectJson(response);	
		if (resp.error)
		{
			log("aup/auth : on logout error = ["+resp.error.code+"]");
			if (resp.error.code == API_Auth_Failed)
				aup.auth.authError();
		}else{
			log("aup/auth : response status = ["+resp.status+"]");
            $("#main-header-logo-img").attr("src", "/gui/web_landing/aup_logo_bigger.png");
		}
		this.logoutCallBack();
	},
	onlogoutDataErr : function(e)
	{
		log("aup/auth : error while logging out!");
		aup.controller.showErrorPage();
	},
	logoutCallBack : function()
	{
		delCookie("uid");
		delCookie("token");	
		this.clearSession();
        aup.controller.setTitle();
		aup.controller.onChangeAuthState(null);
	},
	logoutCallBackOnerr : function()
	{
		log("aup/auth : LOGOUT ERROR!");
		delCookie("uid");
		delCookie("token");	
		this.clearSession();
		aup.controller.onChangeAuthState(null);
	},
	
	
	
	
	//global error
	authError : function()
	{
		log("aup/auth : LOGOUT!");
		this.logoutOnerrorServer();
	},
	logoutOnerrorServer : function(response)
	{
		log("aup/auth : on Err server logout...");
		$.ajax({
				url: aup.netcalls.logoutCall+"?"+Math.random(),
			 	timeout : aup.netTimeOut,
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
            if (!aup.auth.status)
            if (this.access_token!=null)
            {
                log("aup.auth : get auth for FB...");
                 this.jqxhr = $.ajax({
                    url: aup.netcalls.fbAuthCall+"?r="+Math.random(),
                    timeout : aup.netTimeOut,
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
                    aup.auth.showRegStep1Error("This account isn't linked with WeHeartPics");
                } else {
                    aup.auth.showRegStep1Error("Something went wrong");

                }
            }else{
                aup.pages.settings.onData(resp);
                aup.auth.setUser(resp.user);
                aup.auth.setSession({ token: resp.user.token, id: resp.user.id , uid: resp.user.id });
                aup.controller.onChangeAuthState(true);
                aup.auth.onStartWork(resp);
            }
            //setClass(aup.menu.loginButton[0], "controls_login_button");
            aup.controller.setTitle();
        },

        onFBData: function(response)
        {
            aup.pages.getstarted.hidePopup();
            if (response.status == "connected")
            {
                log("Facebook : user was succesfully connected! :)");
                var token = response.authResponse.accessToken;
                if (this.access_token!=token)
                {
                    //setClass(aup.menu.loginButton[0], "controls_logout_button_procces");
                    log("Facebook : token = ["+token+"]");
                    this.access_token = token;
                    this.getAuth();
                }else{
                    log("Facebook : user was not connected! :(");
                }
            }
            aup.controller.setTitle();
        },

        onError: function(e)
        {
            log("aup/auth/FB : error while logging in!");
            aup.controller.showErrorPage();
            //setClass(aup.menu.loginButton[0], "controls_login_button");
            aup.controller.setTitle();
        },

        login : function (e)
        {
            this.access_token = "";
            FB.login(bind(this.onFBData, aup.auth.FB), { scope:'publish_actions,publish_stream,user_photos,offline_access,email,user_birthday'});
        },

        loginOG : function (e, _func)
        {

            this.access_token = "";
            FB.login(_func, { scope:'publish_actions,publish_stream,user_photos,offline_access,email,user_birthday'});
        },

        fbShareEvents : function(e)
        {
            log("CreateEdge");
            if (aup.shares.onFbLike(e))
                return false;

            if (aup.controller.curPage.onFBlike)
            {
                aup.controller.curPage.onFBlike(e);
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
            //aup.pages.photo.share.setShareEvents();
        },


        getReqToken : function()
        {
            log("login tw2 >");
            //active?t
            this.activeToken = true;
            this.jqxhr = $.ajax({
                url: aup.netcalls.twReqTokenCall+"?"+Math.random(),
                timeout : aup.netTimeOut,
                success: bind(this.onDataToken, this),
                error: bind(this.onErrorToken, this)
            });
        },

        onDataToken: function(response, status, xhr)
        {
            log("data token");
            this.activeToken = false;
            var resp = getObjectJson(response);
            aup.pages.getstarted.hidePopup();

            if (resp.error)
            {
                log("aup/auth/TW : got error while getting twitter token = ["+resp.error.code+"]");
                this.req_count++;
                this.getReqTokenAct();
            }else{
                log("aup/auth/TW : get twitter request token = ["+resp.oauth_token+"]");
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
                log("aup/auth/TW : OFFLINE mode!");
            }else{
                this.getReqTokenAct();
                this.req_count++;
                log("aup/auth/TW : error while getting twitter request token! Status = ["+status+"] Tries = ["+this.req_count+"]");
            }
        },


        getAuth: function(_id, _token, _secret)
        {
            log("GET TW AUTH = ["+_id+" : "+_token+" : "+_secret+"]");
            log("aup/auth/TW : get auth...");

            if (aup.auth.status)
            {
                aup.pages.settings.linker.TW.finalLinkTw(_id, _token, _secret);
                return false;
            }


            //setClass(aup.menu.loginButton[0], "controls_logout_button_procces");

            this.jqxhr = $.ajax({
                url: aup.netcalls.fbAuthCall,
                timeout : aup.netTimeOut,
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
                    aup.pages.settings.onData(resp);
                    aup.auth.setUser(resp.user);
                    aup.auth.setSession({ token: resp.user.token, id: resp.user.id , uid: resp.user.id });
                    aup.controller.onChangeAuthState(true);
                    aup.auth.onStartWork(resp);
                }
            //setClass(aup.menu.loginButton[0], "controls_login_button");
            aup.controller.setTitle();
        },


        onError: function(e)
        {
            log("aup/auth/TW : error while logging in!");
            this.preStatus = null;
            //setClass(aup.menu.loginButton[0], "controls_login_button");
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
                url: aup.netcalls.vkAuthCall,
                timeout : aup.netTimeOut,
                data : { r : Math.random(), social : 'vk' , access_token : token, vk_id : user_id },
                success: self.onData,
                error: self.onError
            });
        },

        onData: function(response) {
            console.debug("AUTH SUCCCEEED!", response);
            if (response.error) {
                if (resp.error.code == "API_AuthFailed") {
                    aup.auth.showRegStep1Error("This account isn't linked with WeHeartPics");
                } else {
                    aup.auth.showRegStep1Error("Something went wrong");
                }
            } else {
                aup.pages.settings.onData(response);
                aup.auth.setUser(response.user);
                aup.auth.setSession({ token: response.user.token, id: response.user.id , uid: response.user.id });
                aup.controller.onChangeAuthState(true);
                aup.auth.onStartWork(response);
                aup.pages.getstarted.hidePopup();
            }
            aup.controller.setTitle();
        },

        onError : function(e) {
            aup.auth.showRegStep1Error("Something went wrong");
        }
    },


    STD : {
        showErrMsg : null,

        login: function(_login, _pw)
        {
            this.jqxhr = $.ajax({
                url: aup.netcalls.mailLoginCall,
                timeout : aup.netTimeOut,
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
                        aup.auth.showLoginError("Wrong e-mail and password combination");
                        $("#login-email, #login-password").addClass("input_error");
                    } else if (resp.error.code == "API_AuthFailed") {
                        aup.auth.showLoginError("Wrong e-mail and password combination");
                        $("#login-email, #login-password").addClass("input_error");
                    } else if (resp.error.code = "API_PendingConfirmation") {
                        aup.auth.showLoginError("We have sent you an e-mail to confirm");
                    } else {
                        aup.auth.showLoginError("Something went wrong");

                    }

                }else{
                    aup.pages.getstarted.hidePopup();
                    aup.pages.settings.onData(resp);
                    aup.auth.setUser(resp.user);
                    aup.auth.setSession({ token: resp.user.token, id: resp.user.id , uid: resp.user.id });
                    aup.controller.onChangeAuthState(true);
                    aup.auth.onStartWork(resp);
                }
            //setClass(aup.menu.loginButton[0], "controls_login_button");
            aup.controller.setTitle();
        },


        onError : function(e)
        {
            aup.auth.showLoginError("Something went wrong");
            $("#login-email, #login-password").addClass("input_error");
        }
    }
}


