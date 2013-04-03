WHP.menu = {
	inited : false,
	panelAuth : null,
	panelMenu : null,
	menuObject : null,
	menuA : null,
	menuNA : null,
	
	loginButton : null,
	logoutButton : null,
		

	
	menuShadow : null,
	
	randomButton : null,
	
	storiesRollover : false,
	animateMenuShadow : true,

    downloadButton : null,
	
	stories_wind : null,
	
	windowsScrollsDown : [],


    main_link_logo :  null,
			
	//init function
	init: function ()
	{
		$('html').click(bind(this.htmlClick, this));
		$('html').mouseup(bind(this.htmlMouseUp, this));
		$('html').mousemove(bind(this.htmlMouseMove, this));
        $("#show_upload").click(function() { WHP.upload.show() });
		
		this.panelAuth = document.getElementById("header_controls");
		this.panelMenu = document.getElementById("main_content");
		this.menuObject = $("#menu_layer");

		this.menuShadow = $(this.panelMenu).find( ".menu_shadow_menu" );
        this.menuShadow.css("pointer-events", "none");
		this.setShadowA(0);
		
		this.menuA = $(this.panelAuth).find( ".auth_controls" );
        this.menuA.links = $(this.menuA).find( ".controls_link_text" );

        this.downloadButton = $("#download_popup_open_noauth, #download_popup_open_auth");

		this.menuNA = $(this.panelAuth).find( ".noauth_controls" );

		//menu button events
		this.loginButton = this.menuNA.find(".controls_login_container").find(".controls_link_text");
		this.logoutButton = $(this.panelAuth).find( ".controls_logout_button" );
		this.logoutButton.click( function(e){ WHP.auth.logout();e.stopPropagation(); } );
		this.loginButton.click( function(e){ WHP.loginMenus.showLoginMenu();e.stopPropagation(); } );
		this.downloadButton.click(function(e) { WHP.download.togglePopup(e); e.preventDefault(); return false; });

		//auth

		//this.loginOthersWind = $(this.panelAuth).find( ".noauth_controls" );

		AddHandler(window, "scroll", bind(this.onScrollEvent, this), this);
		
		
		addIntelloLinks( $('#menu_layer') );

        this.main_link_logo = $('#menu_layer').find(".main_link_logo");
        this.main_link_logo.click(bind(this.logoClickFunc, this));

        WHP.loginMenus.init();

		this.inited = true;
	},

    logoClickFunc: function (e)
    {
        if  (WHP.auth.status)
        {
            WHP.controller.navigateTo(WHP.pages.timeline.urlStr);
        }else{
            WHP.controller.navigateTo(WHP.pages.landing.urlStr);
        }

        return cancelEvent(e);
    },
	
	downListEvent: function (elem)
	{
		this.windowsScrollsDown.push(elem);
	},
	
	htmlMouseMove: function (e)
	{
		var newX = e.pageX;
		var newY = e.pageY;
		var e = {x:newX, y:newY};
		for (var i=0; i<this.windowsScrollsDown.length; i++)
		{
            if (this.windowsScrollsDown[i].mouseMoveEvent)
			    this.windowsScrollsDown[i].mouseMoveEvent(e);
		}
	},
	
	htmlMouseUp: function (e)
	{
		while (this.windowsScrollsDown.length>0)
		{
			var a = this.windowsScrollsDown.pop();
			a.mouseup(e);
			//a.trigger(evt);
		}
	},
	
	htmlClick: function (e)
	{
        log("HTML CLIK");
        if (!WHP.controller.inited)
            return false;


        //menus
        WHP.download.hidePopup();
		WHP.loginMenus.hideLoginMenu();
		WHP.loginMenus.hideLoginMenu2();
        WHP.pages.settings.hideWindow1();
        WHP.popup_message.hideAlert();

        WHP.pages.settings.hideWindow2();
        WHP.pages.settings.hideWindow1();

        WHP.pages.profile.hideWindow1();

		if ( WHP.pages.user.pointsHelper.windCont.style.display == "block" )
			WHP.pages.user.pointsHelper.hide();
			
		if ( WHP.pages.profile.pointsHelper.windCont.style.display == "block" )
			WHP.pages.profile.pointsHelper.hide();
	},
	
	onScrollEvent: function (e)
	{
        var scrollTop = getScrollTop();
		
		if (this.animateMenuShadow)
			this.setShadow(scrollTop);
	},
	
	setShadowA: function (_C)
	{
		var C = _C;	
		C = Math.max(C, 0);
		C = Math.min(C,1);
		this.menuShadow.alpha = C;
		setAlpha(this.menuShadow, C);


        if (browser.ie)
        {
          // alert("Has layout = ["+ this.menuShadow.get()[0].hasLayout+"]");
        }
	},
	
	setShadow: function (scrollTop)
	{
		var topSpace1 = 2;
		var animSpace = 40;
			
		var C = 0;
		if (scrollTop<topSpace1)
		{
			C = 0;
		}else if (scrollTop<topSpace1+animSpace)
		{
			C = (scrollTop-topSpace1)/animSpace;
		}else{
			C = 1;
		}
		
		this.setShadowA(C);
	},
	
	setNotifyNumber: function (_n)
	{
	},       
	




	setLinkState : function(_ar)
	{
		var locationS = new String(document.location);
        locationS = locationS.toLowerCase();

		for (var i=0; i<_ar.length; i++)
		{
			var me = _ar[i];
            var meHref = new String(me.href);
            meHref = meHref.replace("http://"+WHP.domain,"");
            meHref = meHref.replace("https://"+WHP.domain,"");
            meHref = meHref.replace("http://weheartpics.com","");
            meHref = meHref.replace("//"+WHP.domain+"/","");

            //remove ?query
            if (meHref.indexOf("?")>-1)
                meHref = meHref.substring(0, meHref.indexOf("?"));

            meHref = normolizeLink(meHref);
            meHref = ".com/"+meHref;

            if (browser.ie)
            {

                if (locationS.indexOf("#")>-1)
                {
                    var str = locationS.substring(locationS.indexOf("#"), locationS.length);

                    if ( this.linkChecker(str,meHref) )
                    {
                        setClass(me, "controls_link_text_active");
                    }else{
                        setClass(me, "controls_link_text");
                    }
                }else{
                    if ( this.linkChecker(locationS,meHref) )
                    {
                        setClass(me, "controls_link_text_active");
                    }else{
                        setClass(me, "controls_link_text");
                    }
                }
            }else{
                if ( this.linkChecker(locationS,meHref) )
                {
                    setClass(me, "controls_link_text_active");
                }else{
                    setClass(me, "controls_link_text");
                }
            }

		}		
	},

    checkMenuState: function ()
    {
        if (WHP.auth.status)
        {
            this.menuA.css({ display : 'block' });
            setClass(this.logoutButton[0], "controls_logout_button");
            this.menuNA.css({ display : 'none' });
        }else{
            this.menuA.css({ display : 'none' });
            //setClass(WHP.menu.loginButton[0], "controls_login_button");
            this.menuNA.css({ display : 'block' });
        }
    },

    transformLinks : function()
    {
        var profileLink = WHP.menu.menuA.links[0];

        //profile on auth
        if (WHP.auth.status)
        {
            //set profile
            log("CHANGE = ["+$(WHP.menu.menuA.links[0]).attr("href")+"]");

			var profile = $(WHP.menu.menuA.links[0]);
            profile.attr("href", WHP.links.getUserProfileLink(WHP.auth.status.id));
			if (WHP.auth.userObject) {
                profile.text(WHP.auth.userObject.first_name);
            }
        }
    },

    linkChecker : function (_loc, _link)
    {
        var blood = false;

        if (_link == ".com/") {
            // костыль для ссылки About
            if (_loc == "http://weheartpics.com/") {
                blood = true;
            }
        } else {
            if (_loc.indexOf(_link) >= 0)
            {
                blood = true;
            }
        }

        return blood;
    },
	
	currentMenuPos : function()
	{
        this.transformLinks();
		if (WHP.auth.status)
		{
			var elem = this.menuA;
		}else{
			var elem = this.menuNA;
		}
		var active = elem.find( ".controls_link_text_active" );
		var deactive = elem.find( ".controls_link_text" );
		var location = new String(document.location);
		this.setLinkState(active);
		this.setLinkState(deactive);
    }
}


WHP.loginMenus = {
    loginWindowWind : null,
    loginWindowWind2 : null,

    init : function()
    {
        this.loginWindowWind = $(WHP.menu.menuNA).find( ".controls_auth_window" );
        this.loginWindowWind.click(bind(function(event) {
            event.stopPropagation();
        }, this));
        this.setLoginWindow(this.loginWindowWind);
        this.loginWindowWind.hide = bind(this.hideLoginMenu, this);


        this.loginWindowWind2 = $("#controls_auth_window2" );
        this.loginWindowWind2.css({ position : 'fixed' });
        this.loginWindowWind2.click(bind(function(event) {
            event.stopPropagation();
        }, this));
        this.setLoginWindow(this.loginWindowWind2);
        this.loginWindowWind2.hide = bind(this.hideLoginMenu2, this);
    },

    showLoginMenu : function()
    {
        log("SHOW LOGIN 1");
        //this.loginWindowWind.css({ display : 'block' });
        //this.loginWindowWind.reset();
        //this.hideLoginMenu2();
        WHP.pages.getstarted.showPopup();
    },

    showLoginMenu2 : function()
    {
        log("SHOW LOGIN 2");
        this.loginWindowWind2.css({ display : 'block' });
        this.loginWindowWind2.reset();

        var scrollTop = getScrollTop();

        var dt = 0;
        if (WHP.controller.curPage.urlStr == "photo")
            dt = -10;

        var H = 300;
        if ($(this.loginWindowWind2).css('display') == 'block')
        {
            if (browser.ie)
            {

                this.loginWindowWind2.css({ position : 'absolute' });
                this.loginWindowWind2.css({ top : (scrollTop + (WHP.screenH - H)*0.5 )+'px', left : (WHP.screenWl-285)*0.5+dt +'px' });
            }else
                this.loginWindowWind2.css({ top : (WHP.screenH - H)*0.5 +'px', left : (WHP.screenWl-285)*0.5+dt +'px' });
            //cancelEvent(e);
        }




        this.hideLoginMenu();

        WHP.main_fader.show();
    },

    hideLoginMenu : function()
    {
        log("HIDE LOGIN 1");
        if (this.loginWindowWind.css("display") == 'none')
            return false;

        this.loginWindowWind.css({ display : 'none' });
    },

    hideLoginMenu2 : function()
    {
        log("HIDE LOGIN 2");
        if (this.loginWindowWind2.css("display") == 'none')
            return false;

        this.loginWindowWind2.css({ display : 'none' });
        WHP.main_fader.hide();
    },

    setLoginWindow : function(_wind)
    {
        _wind.parent = this;
        _wind.states = _wind.find(".login_box");

        for (var i=0; i<_wind.states.length; i++)
        {
            _wind.states[i] = $(_wind.states[i]);
            _wind.states[i].a0 = 0;
            _wind.states[i].a1 = 0;
            _wind.states[i].aC = 0;
            _wind.states[i].p0 = 0;
            _wind.states[i].p1 = 0;
            _wind.states[i].pC = 0;
            _wind.states[i].dir = 0;
            _wind.pos = { x1 : 0, x2 : 0 };
            _wind.states[i].visible = false;
            _wind.states[i].parent = _wind;

            _wind.states[i].setVisible = bind( function(_a){
                if (_a)
                {
                    this.aC = 1;
                    this.pC = 1.0;
                    this.css({ display : ''});
                    this.visible = true;
                }else{
                    this.aC = 0;
                    this.pC = 0;
                    this.css({ display : 'none'});
                    this.visible = false;
                }
                this.setPos();

                this.dir = 0;
                this.timer.reset();
            }, _wind.states[i]);

            _wind.states[i].hide = bind( function(){
                if (this.dir==-1)
                    return false;
                this.a0 = this.aC;
                this.a1 = 0.0;
                this.p0 = this.pC;
                this.p1 = 0.0;
                this.dir = -1;
                this.setPos();

                this.timer.reset();
                this.timer.start();
            }, _wind.states[i]);
            _wind.states[i].N = new Number(i);
            _wind.states[i].show = bind( function(){
                if (this.dir==1)
                    return false;
                this.a0 = this.aC;
                this.a1 = 1.0;
                this.p0 = this.pC;
                this.p1 = 1.0;
                this.dir = 1;
                this.visible = true;
                this.css({ display : ''});
                this.setPos();

                this.timer.reset();
                this.timer.start();
            }, _wind.states[i]);
            _wind.states[i].setPos = bind( function(){
                setAlpha(this, this.aC);
                this.css({ height: this.H*this.pC +"px"});
            },_wind.states[i]);
            _wind.states[i].timer = new Timer(1000/30, 15);
            _wind.states[i].timer.onTimerEvent = bind(function(e){
                var A = e.currentCount/e.repeatCount;
                var d = 0.5;
                var A1 = Math.max(0, Math.min(1, A/d));
                A1 = (Math.sin(Math.PI*(A1-0.5))+1)*0.5;
                var A2 = Math.max(0, Math.min(1, (A-d)/(1-d)));
                A2 = (Math.sin(Math.PI*(A2-0.5))+1)*0.5;

                if (this.dir>0)
                {
                    //+
                    this.aC = (1-A2)*this.a0 + A2*this.a1;
                    this.pC = (1-A1)*this.p0 + A1*this.p1;
                    this.setPos();
                }else{
                    //-
                    this.aC = (1-A1)*this.a0 + A1*this.a1;
                    this.pC = (1-A2)*this.p0 + A2*this.p1;
                    this.setPos();
                }

                if (A==1)
                {
                    if (this.dir>0)
                    {
                        //+

                        if (this.N == 1)
                        {
                            if (validateEmail(this.parent.login_mailInput.val()))
                            {
                                this.parent.login_passInput.focus();
                                this.parent.login_passInput.addClass("input_error");
                            }else{
                                this.parent.login_mailInput.focus();
                                this.parent.login_mailInput.addClass("input_error");
                            }

                        }
                    }else{
                        //-
                        this.css({ display : 'none'});
                        this.visible = false;

                        if (this.N == 0)
                        {
                           this.parent.states[3].show();
                        }


                    }
                    this.dir = 0;


                }
            },_wind.states[i]);
            _wind.states[i].H = 0;
        }

        _wind.states[0].H = 120; //sigh in logos
        _wind.states[1].H = 154; //enter login pass
        _wind.states[2].H = 65; //register with mail
        _wind.states[3].H = 154; //register with mail enter
        _wind.states[4].H = 154; //register with mail enter
        _wind.states[5].H = 154; //confirmation
        _wind.states[6].H = 250; //connect


        _wind.buttonFB = _wind.states[0].find(".signin_fb_button");

        _wind.buttonTW = _wind.states[0].find(".signin_tw_button");

        _wind.buttonMAIL = _wind.states[0].find(".signin_mail_button");
        _wind.buttonMAIL.click(bind(function(){
            this.setState(1);
        },_wind));

        _wind.buttonReg = _wind.states[2];
        _wind.buttonReg.click(bind(function(){
            if ((this.state==0) || (this.state==1))
            this.setState(2);
        },_wind));

        _wind.forgetButton =  $("#auth-popup_login-email_forgot");
        _wind.forgetButton.click(bind(function(){
            WHP.pages.getstarted.hidePopup();
            WHP.controller.navigateTo(WHP.pages.resendpw.urlStr);
        },_wind));


        //
        var oks = _wind.states[6].find(".ok_mini");

        _wind.ok1 = $(oks[0]);
        _wind.ok2 = $(oks[1]);
        _wind.fbLinksButton = _wind.states[6].find(".signin_fb_button");
        _wind.fbLinksButton.click(bind(function() {
            if (this.linkedFb)
                return false;
            WHP.pages.settings.linker.FB.showErrMsg = this.showErrMsg4;
            WHP.pages.settings.linker.FB.onLink = bind(this.linkFbCallback,this);
            WHP.pages.settings.linker.FB.linkFb();
        }, _wind));

        _wind.twLinksButton = _wind.states[6].find(".signin_tw_button");
        _wind.twLinksButton.click(bind(function() {
            if (this.linkedTw)
                return false;
            WHP.pages.settings.linker.TW.showErrMsg = this.showErrMsg4;
            WHP.pages.settings.linker.TW.onLink = bind(this.linkTwCallback,this);
            WHP.pages.settings.linker.TW.linkTw();
        }, _wind));
        _wind.linkTwCallback = bind(function(response){
            this.linkedTw = true;
            this.ok1.css( { visibility : "visible"});
        }, _wind);
        _wind.linkFbCallback = bind(function(response){
            this.linkedFb = true;
            this.ok2.css( { visibility : "visible"});
        }, _wind);


        _wind.errorMessageTimeout4  = -1;
        _wind.hideMsg4 = bind(function()
        {
            if (this.errorMessageTimeout4!=-1)
                clearTimeout(this.errorMessageTimeout4);
            this.errorMessageTimeout4 = setTimeout(bind(function() { _wind.error4.text(""); this.errorMessageTimeout4 = -1; }, this),WHP.errorMessTO);
        },_wind);

        _wind.showErrMsg4 = bind(function(_txt)
        {
            alert(_txt);
            _wind.error4.text(_txt);
            this.hideMsg4();
        },_wind);
        _wind.error4 = _wind.states[6].find(".form_error_message");
        _wind.linkedTw = false;
        _wind.linkedFb = false;



        //
        var inputs = _wind.states[3].find(".form_input_field_sign");
        _wind.mailInput =  $(inputs[0]);
        _wind.passInput =  $(inputs[1]);
        _wind.mail = "";
        _wind.pass = "";
        _wind.submit1 = _wind.states[3].find(".form_confirm_button");
        _wind.error1 = _wind.states[3].find(".form_error_message");
        _wind.reset1 = bind(function(){
            this.mailInput.val(this.mail);
            this.passInput.val(this.pass);
        }, _wind);

        var inputs = _wind.states[4].find(".form_input_field_sign");
        _wind.firstName =  $(inputs[0]);
        _wind.lastName =  $(inputs[1]);
        var buttons = _wind.states[4].find(".form_confirm_button2");
        _wind.submit2Back = $(buttons[0]);
        _wind.submit2 = $(buttons[1]);
        _wind.error2 = _wind.states[4].find(".form_error_message");
        _wind.reset2 = bind(function(){
            this.firstName.val(this.fn);
            this.lastName.val(this.ln);
        }, _wind);

        //

        _wind.errorMessageTimeout3 = -1;
        _wind.hideMsg3 = bind(function()
        {
            if (this.errorMessageTimeout3!=-1)
                clearTimeout(this.errorMessageTimeout3);
            this.errorMessageTimeout3 = setTimeout(bind(function() { _wind.error3.text(""); this.errorMessageTimeout3 = -1; }, this),WHP.errorMessTO);
        },_wind);

        _wind.showErrMsg3 = bind(function(_txt)
        {
            alert(_txt);
            _wind.error3.text(_txt);
            this.hideMsg3();
        },_wind);
        _wind.submitConfirmation = _wind.states[5].find(".form_confirm_button");
        _wind.error3 = _wind.states[5].find(".form_error_message");


        _wind.resendOk = bind(function(response)
        {
            var resp = getObjectJson(response);
            if (resp.error)
            {
                log("WHP/registration : error while loading page data! Err =["+response+"]");
                if (resp.error.code == "API_Rejected")
                {
                    this.showErrMsg3("Email already sent. Please check your mail");
                }else if (resp.error.code == "API_ObjectNotFound")
                {
                    this.showErrMsg3("User wasn't found");
                }else if (resp.error.code == "API_BadParams")
                {
                    this.showErrMsg3("User wasn't found");
                }
                return false;
            }

        }, _wind);

        _wind.resendFail = bind(function(e)
        {
            WHP.auth.showAuthErr("Something went wrong");
        }, _wind);

        _wind.resendConfirmation = bind(function(){
            $.ajax({
                url:WHP.netcalls.resendCall,
                data : { r : Math.random(), login :  this.mail },
                timeout:WHP.netTimeOut,
                method : "POST",
                success:bind(this.resendOk, this),
                error:bind(this.resendFail, this)
            });
        }, _wind);

        _wind.submitConfirmation.click(bind(_wind.resendConfirmation, _wind));



        //scenario 1

        _wind.mailInput.keypress(bind(function(e)
        {
            if (e.keyCode == 13){this.applyForm1();}
        },_wind));
        _wind.passInput.keypress(bind(function(e)
        {
            log("PASS");
            var password = this.passInput.val();
            if  (password.length>=16)
            {
                WHP.auth.showAuthErr("You can't use more than 16 characters");
            }

            if (e.keyCode == 13){this.applyForm1();}
        },_wind));

        _wind.applyForm1 = bind(function(){
            log("1");
            var email =  this.mailInput.val();
            var password = this.passInput.val();

            if (!validateEmail(email))
            {
                WHP.auth.showAuthErr("Doesn't look like a valid email");
                this.mailInput.focus();
                this.mailInput.addClass("input_error");
                return false;
            }


            if (password.length<6)
            {
                WHP.auth.showAuthErr("Please use at least 6 characters");
                this.passInput.focus();
                this.passInput.addClass("input_error");
                return false;
            }


            WHP.auth.STD.showErrMsg = WHP.auth.showAuthErr;
            WHP.auth.STD.login(email, password);
            this.mail = email;
            this.pass = password;

            this.setState(3);

        }, _wind);
        _wind.submit1.click(bind(_wind.applyForm1, _wind));

        _wind.errorMessageTimeout1 = -1;
        _wind.hideMsg1 = bind(function()
        {
            if (this.errorMessageTimeout1!=-1)
                clearTimeout(this.errorMessageTimeout1);
            this.errorMessageTimeout1 = setTimeout(bind(function() { _wind.error1.text(""); this.errorMessageTimeout1 = -1; }, this),WHP.errorMessTO);
        },_wind);

        _wind.showErrMsg1 = bind(function(_txt)
        {
            alert(_txt);
            _wind.error1.text(_txt);
            this.hideMsg1();
        },_wind);




        //s2

        _wind.firstName.keypress(bind(function(e)
        {
            var password = this.firstName.val();
            if  (password.length>=32)
            {
                WHP.auth.showAuthErr("You can't use more than 32 characters");
            }


            if (e.keyCode == 13){this.applyForm2();}
        },_wind));
        _wind.lastName.keypress(bind(function(e)
        {
            var password = this.lastName.val();
            if  (password.length>=32)
            {
                WHP.auth.showAuthErr("You can't use more than 32 characters");
            }


            if (e.keyCode == 13){this.applyForm2();}
        },_wind));

        _wind.errorMessageTimeout2 = -1;
        _wind.hideMsg2 = bind(function()
        {
            if (this.errorMessageTimeout2!=-1)
                clearTimeout(this.errorMessageTimeout2);
            this.errorMessageTimeout2 = setTimeout(bind(function() { _wind.error2.text(""); this.errorMessageTimeout2 = -1; }, this),WHP.errorMessTO);
        },_wind);

        _wind.showErrMsg2 = bind(function(_txt)
        {
            alert(_txt);
            _wind.error2.text(_txt);
            this.hideMsg2();
        },_wind);

        _wind.netConnect2 = false;
        _wind.applyForm2 = bind(function(){
            if (this.netConnect2)
                return false;

            var fn =  this.firstName.val();
            var ln = this.lastName.val();

            if (fn.length==0)
            {
                this.showErrMsg2("Enter your first and last name");
                this.firstName.focus();
                return false;
            }

            if (ln.length==0)
            {
                this.showErrMsg2("Enter your first and last name");
                this.lastName.focus();
                return false;
            }


            this.fn = fn;
            this.ln = ln;
            this.netConnect2 = true;
            $.ajax({
                url:WHP.netcalls.regCall,
                data : { r : Math.random(), login :  this.mail, passw : this.pass, first_name : fn, last_name : ln },
                timeout:WHP.netTimeOut,
                method : "POST",
                success:bind(this.onRegOk, this),
                error:bind(this.onRegFail, this)
            });

        }, _wind);
        _wind.submit2.click(bind(_wind.applyForm2, _wind));
        _wind.submit2Back.click(bind(function(){

            this.fn =  this.firstName.val();
            this.ln = this.lastName.val();

            this.hideStates();
            this.states[2].setVisible(true);
            this.states[3].setVisible(true);

            this.reset2();

        }, _wind));



        _wind.onRegOk = bind(function(response){
            this.netConnect2 = false;
            var resp = getObjectJson(response);
            if (resp.error)
            {
                if (resp.error.code == "API_AlreadyInUse")
                {
                    WHP.auth.showRegStep1Error("This email already registered");
                    this.setState(6);
                    return false;
                }
                if (resp.error.code == "API_BadParams") {
                    WHP.auth.showRegStep2Error("Enter your first and last name");
                    return false;
                }
                WHP.auth.showRegStep2Error("Something went wrong");
                return false;
            }


            //check pending
            if (resp.state == "PENDING_CONFIRMATION")
            {
                this.setState(4);
                return false;
            }

            WHP.auth.STD.onData(resp, true);
            //this.setState(5);
            WHP.controller.navigateTo(WHP.pages.findfriends.urlStr);


        }, _wind);

        _wind.onRegFail = bind(function(response){
            this.netConnect2 = false;
            this.showErrMsg2("Something went wrong");
        }, _wind);




        _wind.setState = bind(function(_newState){
            this.state = _newState;

            if (this.state == 1)
            {
                this.states[1].show();
                return false;
            }

            if (this.state == 2)
            {
                this.states[1].hide();
                this.states[0].hide();
                //this.states[3].show(true);
                this.buttonReg.css({ cursor : "auto" });
                this.reset1();
                return false;
            }

            if (this.state == 3)
            {
                this.hideStates();
                this.states[2].setVisible(true);
                this.states[4].setVisible(true);
                this.firstName.focus();
                this.reset2();
                this.buttonReg.css({ cursor : "auto" });
                return false;
            }

            if (this.state == 4)
            {
                this.hideStates();
                this.states[5].setVisible(true);
                return false;
            }

            if (this.state == 5)
            {
                this.hideStates();
                this.states[6].setVisible(true);
                return false;
            }

            if (this.state == 6)
            {
                this.hideStates();
                this.states[2].setVisible(true);
                this.states[3].setVisible(true);
                this.mailInput.focus();
                this.reset1();
                return false;
            }

        },_wind);


        _wind.hideStates = bind( function() {
            for (var i=0; i<this.states.length; i++)
            {
                this.states[i].setVisible(false);
            }
        },_wind);

        _wind.state = 0;
        _wind.newState = 0;
        _wind.reset = bind(function() {
            this.fn = "";
            this.ln = "";
            this.mail = "";
            this.pass = "";

            this.hideStates();
            this.states[0].setVisible(true);
            this.states[2].setVisible(true);
            this.state = 0;

            this.ok1.css( { visibility: "hidden"});
            this.ok2.css( { visibility: "hidden"});
            this.login_passInput.val("");

            this.buttonReg.css({ cursor : "pointer" });

            this.linkedTw = false;
            this.linkedFb = false;

        },_wind);

        _wind.timer = new Timer(1000/30, 12);
        _wind.timer.onTimerEvent = bind( function(e){
            var A = e.currentCount/e.repeatCount;
            var d = 0.5;
            var A1 = Math.min(1, Math.max(0, A/d));
            var A2 = Math.min(1, Math.max(0, (A-d)/(1-d)));



            if (A == 1)
            {
                this.state = this.newState;
            }

        },_wind);


        _wind.errorMessageTimeout4 = -1;
        _wind.hideMsg4 = bind(function()
        {
            if (this.errorMessageTimeout4!=-1)
                clearTimeout(this.errorMessageTimeout4);
            this.errorMessageTimeout4 = setTimeout(bind(function() { _wind.error4.text(""); this.errorMessageTimeout4 = -1; }, this),WHP.errorMessTO);
        },_wind);

        _wind.showErrMsg4 = bind(function(_txt)
        {
            _wind.error4.text(_txt);
            this.hideMsg4();
        },_wind);

        _wind.error4 = _wind.states[1].find(".form_error_message");
        _wind.loginButton = _wind.states[1].find(".form_confirm_button");
        _wind.login_mailInput = $("#login-email");
        _wind.login_passInput = $("#login-password");
        _wind.submitLogin = bind(function(){
            var email =  this.login_mailInput.val();
            var password = this.login_passInput.val();

            if (!validateEmail(email))
            {
                WHP.auth.showLoginError("Doesn't look like a valid email");
                this.login_mailInput.focus();
                this.login_mailInput.addClass("input_error");
                return false;
            }



            WHP.auth.STD.showErrMsg = this.showErrMsg4;
            WHP.auth.STD.login(email, password);

        },_wind);

        _wind.loginButton.click(bind(_wind.submitLogin,_wind));
        $("#auth-popup_login-email_ok").click(bind(_wind.submitLogin,_wind));

        _wind.login_mailInput.keypress(bind(function(e)
        {
            if (e.keyCode == 13){this.submitLogin();}
        },_wind));
        _wind.login_passInput.keypress(bind(function(e)
        {
            if (e.keyCode == 13){this.submitLogin();}
        },_wind));



    },

    hideMenus : function()
    {
        this.hideLoginMenu2();
        this.hideLoginMenu();
    }

}


