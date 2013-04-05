aup.pages.getstarted = {
	//controller parametres
	urlStr : "getstarted",
	title : "Get started",
	rndEnable : false,
	inited : false,
	
	mainObject : null,	
	feedObject : null,

    error_meassage : null,

    mail_input : null,
    pw_input : null,
    proceedButton : null,


    active : false,

    errorMessageTimeout : -1,
	
			
	//init function
	init: function ()
	{
        this.mainObject = id$('getstarted');
        this.error_meassage = $(this.mainObject).find(".form_error_message");

        this.mail_input = $("#register-email");
        this.pw_input = $("#register-password");

        var self = this;
        $("#auth-popup input").click(function() { aup.auth.hideAllErrors(); $("#auth-popup input").removeClass("input_error"); });
        $("#auth-popup input").keypress(function() { aup.auth.hideAllErrors(); $("#auth-popup input").removeClass("input_error"); });
        $("#auth-popup_register_ok").click(bind(this.formProceed, this));
        $("#auth-popup_close").click(this.hidePopup);

        $("#register-email, #register-password").keyup(function(e) {
            if (e.target.value) {
                $("#auth-popup_register_next").fadeIn();
            } else {
                $("#auth-popup_register_next").fadeOut();
            }
        });

        $("#login-email").keyup(function(e) {
            if (e.target.value) {
                $("#auth-popup_login-email_ok").fadeIn();
            } else {
                $("#auth-popup_login-email_ok").fadeOut();
            }
        });

        $("#login-password").keyup(function(e) {
            if (e.target.value) {
                $("#auth-popup_login-email_forgot").fadeIn();
            } else {
                $("#auth-popup_login-email_forgot").fadeIn();
            }
        });

        $("#login-via-email").click(function() {
            $('#auth-popup_login-email').fadeIn();
        });
        $("#auth-popup_register_next").click(function() {
            self.registrationGoToStep2();
        });
        $("#auth-popup_register_back").click(function() {
            $("#auth-popup_register-names").fadeOut();
        });
        $("#auth-popup_login-email_back").click(function () {
            $('#auth-popup_login-email').fadeOut();
        });
        $("#login-via-fb").click(function(event) {
            aup.auth.FB.login(event);
        });
        $("#login-via-tw").click(function(event) {
            aup.auth.TW.login(event);
        });
        $("#login-via-vk").click(function(event) {
            aup.auth.VK.login(event);
        });


        $("#register-email, #register-password").keypress(function(e) {
            if (e.keyCode == 13) {
                self.registrationGoToStep2();
            }
        });

        $("#register-first_name, #register-last_name").keypress(function(e) {
            if (e.keyCode == 13) {
                self.formProceed();
            }
        });

        this.inited = true;
	},

    registrationGoToStep2: function() {
        var email =  this.mail_input.val();
        var password = this.pw_input.val();
        if (!validateEmail(email))
        {
            aup.auth.showRegStep1Error("Doesn't look like a valid email");
            this.mail_input.focus();
            this.mail_input.addClass("input_error");
            return false;
        }

        if (password.length<6)
        {
            aup.auth.showRegStep1Error("Please use at least 6 characters");
            this.pw_input.focus();
            this.pw_input.addClass("input_error");
            return false;
        }

        if  (password.length>16)
        {
            aup.auth.showRegStep1Error("You can't use more than 16 characters");
            this.pw_input.focus();
            this.pw_input.addClass("input_error");
            return false;
        }

        $("#auth-popup_register-names").fadeIn();
    },

    showPopup: function() {
        log("Show auth popup");
        $("#auth-popup").fadeIn();
        aup.contentCont.fadeOut();
    },

    hidePopup: function() {
        log("Hide auth popup");
        $("#auth-popup").hide();
        $("#auth-popup_login-email").hide();
        $("#auth-popup_register-names").hide();
        aup.contentCont.show();

        setTimeout(function() {
            $("#login-email").val("");
            $("#login-password").val("");
            $("#register-email").val("");
            $("#register-password").val("");
            $("#register-last_name").val("");
            $("#register-first_name").val("");
            aup.auth.hideAllErrors();
        }, 1000);
    },
	
	//std for each module control functions
	show: function (_q)
	{
        this.active = true;
        this.reset();
        aup.controller.showCanvas();
	},

	hide: function ()
	{
        this.active = false;
	},

    reset : function()
    {
        this.mail_input.val("");
        this.pw_input.val("");
    },

    formProceed : function()
    {
        window.scrollTo(0, 0);

        //check valid email
        var email =  this.mail_input.val();
        var password = this.pw_input.val();
        var first_name = $("#register-first_name").val();
        var last_name = $("#register-last_name").val();

        if (!validateEmail(email))
        {
            aup.auth.showRegStep1Error("Doesn't look like a valid e-mail");
            this.mail_input.focus();
            this.mail_input.addClass("input_error");
            return false;
        }


        if (password.length<6)
        {
            aup.auth.showRegStep1Error("Please use at least 6 characters");
            this.pw_input.focus();
            this.pw_input.addClass("input_error");
            return false;
        }

        if  (password.length>16)
        {
            aup.auth.showRegStep1Error("You can't use more than 16 characters");
            this.pw_input.focus();
            this.pw_input.addClass("input_error");
            return false;
        }

        if (!first_name) {
            aup.auth.showRegStep2Error("Enter your first name");
            $("#register-first_name").addClass("input_error");
            return false;
        }

        if (!last_name) {
            aup.auth.showRegStep2Error("Enter your last name");
            $("#register-last_name").addClass("input_error");
            return false;
        }

        //pew set resend params
        if (!true)
        {
            aup.pages.confirmation.resendMail = email;
            aup.pages.confirmation.resendPw = password;
            aup.controller.navigateTo("confirmation");
            return false;
        }

        $("#register-first_name").blur();
        $("#register-last_name").blur();

        $.ajax({
            url:aup.netcalls.regCall,
            data : { r : Math.random(), login :  email, passw : password, first_name: first_name, last_name: last_name },
            timeout:aup.netTimeOut,
            method : "POST",
            success:bind(this.onRegOk, this),
            error:bind(this.onRegFail, this)
        });


        return false;
    },

    showErrMsg : function(_txt)
    {
        this.error_meassage.text(_txt);
        this.hideMsg();
    },

    onRegOk : function(response)
    {
        var resp = getObjectJson(response);
        if (resp.error)
        {
            if (resp.error.code!="API_PendingConfirmation")
            {
                if (resp.error.code == "API_AlreadyInUse")
                {
                    aup.auth.showRegStep1Error("This email already registered");
                    this.mail_input.focus();
                    this.mail_input.addClass("input_error");
                    return false;
                }
                if (resp.error.code == "API_BadParams") {
                    aup.auth.showRegStep2Error("Enter your first and last name");
                    return false;
                }
                aup.auth.showRegStep2Error("Something went wrong");
                this.mail_input.focus();
                return false;
            }
        }

        aup.pages.getstarted.hidePopup();

        //check pending
        var pending = resp.state == "PENDING_CONFIRMATION";
        var errorPending = false;
        if (resp.error)
        if (resp.error.code == "API_PendingConfirmation")
            errorPending = true;
        pending = pending || errorPending;
        if (pending)
        {
            aup.pages.confirmation.resendMail = this.mail_input.val();
            aup.pages.confirmation.resendPw = this.pw_input.val();
            aup.controller.navigateTo("confirmation");
            return false;
        }

        //
        log("Normal reg");
        aup.auth.STD.onData(resp, true);
        aup.pages.getstarted.hidePopup();
        aup.controller.navigateTo("findfriends");
    },

    onRegFail : function(e)
    {
        aup.auth.showRegStep2Error("Something went wrong");
        //404???
    },

    hideMsg : function()
    {
       if (this.errorMessageTimeout!=-1)
            clearTimeout(this.errorMessageTimeout);
       this.errorMessageTimeout = setTimeout(bind(function() { this.error_meassage.text(""); this.errorMessageTimeout = -1; }, this),2000);
    },



	onAuthChange: function (_auth)
	{
        if (!this.active)
            return false;

        if (_auth)
            aup.controller.navigateTo(aup.controller.getMainPage().urlStr);
	}
};



aup.pages.confirmation = {
    //controller parametres
    urlStr : "confirmation",
    title : "Confirmation",
    inited : false,
    rndEnable : false,

    mainObject : null,

    error_meassage : null,

    resendMail : "",
    resendPw : "",
    resendCount : 0,

    errorMessageTimeout : -1,

    init: function ()
    {
        this.mainObject = id$('confirmation');
        this.resendButton =  $(this.mainObject).find(".form_confirm_button");
        this.resendButton.click(bind(this.resendFunc, this));

        this.error_meassage = $(this.mainObject).find(".form_error_message");

        this.inited = true;
    },

    hideMsg : function()
    {
        if (this.errorMessageTimeout!=-1)
            clearTimeout(this.errorMessageTimeout);
        this.errorMessageTimeout = setTimeout(bind(function() { this.error_meassage.text(""); this.errorMessageTimeout = -1; }, this),2000);
    },

    showErrMsg : function(_txt)
    {
        this.error_meassage.text(_txt);
        this.hideMsg();
    },

    //std for each module control functions
    resendFunc : function()
    {

        log("resend with =["+this.resendMail+"] ["+this.resendPw+"]");
        $.ajax({
            url:aup.netcalls.resendCall,
            data : { r : Math.random(), login :  this.resendMail, passw : this.resendPw },
            timeout:aup.netTimeOut,
            method : "POST",
            success:bind(this.resendOk, this),
            error:bind(this.resendFail, this)
        });
    },

    resendOk : function(response)
    {
        var resp = getObjectJson(response);
        if (resp.error)
        {
            log("aup/registration : error while loading page data! Err =["+response+"]");
            if (resp.error.code == "API_Rejected")
            {
                this.showErrMsg("Too many tries");
            }else if (resp.error.code == "API_ObjectNotFound")
            {
                this.showErrMsg("User wasnt found");
            }
            return false;
        }

        resendCount++;
        if (resp.status == "OK")
        {
            //confirmation
            if (resp.state == "PENDING_CONFIRMATION")
            {
                //change  message?
            }
            return false;
        }



        log("resendOK");
        log(resp);
    },

    resendFail : function(e)
    {
        this.showErrMsg("Something went wrong");
    },

    show: function (_q)
    {
        if ((aup.auth.status) || (this.resendMail.length ==0) || (this.resendPw.length == 0))
        {
            aup.controller.showErrorPage();
        }

        log("1Show find friends");
        aup.controller.showCanvas();
        log("2Show find friends");
        log("Resend to = ["+this.resendMail+"]");
        this.resendCount = 0;
    },

    hide: function ()
    {

    },

    onAuthChange: function (_auth)
    {
        if (_auth)
            aup.controller.navigateTo("/timeline");
    }
}





aup.pages.findfriends = {
    //controller parametres
    urlStr : "findfriends",
    title : "Connect with friends",
    inited : false,
    rndEnable : false,

    mainObject : null,

    facebookBtn : null,
    fbLinked : false,
    twitterBtn : null,
    twLinked : false,


    activeToken : false,
    curWind : null,



    init: function ()
    {
        this.mainObject = id$('findfriends');

        this.facebookBtn = $(this.mainObject).find(".social_link_fb_0");
        this.facebookBtn.click(bind(this.linkFb, this));
        this.twitterBtn = $(this.mainObject).find(".social_link_tw_0");
        this.twitterBtn.click(bind(this.linkTw, this));

        this.error_meassage = $(this.mainObject).find(".form_error_message");


        var btnNext = $(this.mainObject).find(".form_confirm_button");
        btnNext.click(bind(function(){
            aup.controller.navigateTo(aup.controller.getMainPage().urlStr);
        }, this));



        this.inited = true;
    },




    //twitter
    linkTw : function()
    {
        if (this.twLinked)
            return false;

        aup.pages.settings.linker.TW.showErrMsg = bind(this.showErrMsg,this);
        aup.pages.settings.linker.TW.onLink = bind(this.linkTwCallback,this);
        aup.pages.settings.linker.TW.linkTw();
    },

    linkTwCallback : function(e)
    {
        setClass(this.twitterBtn, "social_link_tw_1");
        this.twLinked = true;
    },




    //facebook
    linkFb : function()
    {
        if (this.fbLinked)
            return false;

        //set up callbacks
        aup.pages.settings.linker.FB.showErrMsg = bind(this.showErrMsg,this);
        aup.pages.settings.linker.FB.onLink = bind(this.linkFbCallback,this);
        aup.pages.settings.linker.FB.linkFb();
    },

    linkFbCallback : function(e)
    {
        setClass(this.facebookBtn, "social_link_fb_1");
        this.fbLinked = true;
    },


    hideMsg : function()
    {
        if (this.errorMessageTimeout!=-1)
            clearTimeout(this.errorMessageTimeout);
        this.errorMessageTimeout = setTimeout(bind(function() { this.error_meassage.text(""); this.errorMessageTimeout = -1; }, this),2000);
    },

    showErrMsg : function(_txt)
    {
        this.error_meassage.text(_txt);
        this.hideMsg();
    },


    //std for each module control functions
    show: function (_q)
    {
        if (!aup.auth.status)
        {
            aup.controller.showErrorPage();
        }

        log("1Show find friends");
        aup.controller.showCanvas();
        log("2Show find friends");

        log("SETTINGS SHOW FINDFRIENDS");
        log(aup.settings+" "+typeof(aup.settings.social));
        log(aup.settings+" "+(aup.settings.social !== null)+" "+(aup.settings.social != null)+" "+aup.settings.social);

        if (aup.settings.social)
        {
            log(typeof(aup.settings.social.twitter));
            if (aup.settings.social.twitter)
            {
                log("LINK TW");
                this.linkTwCallback();
            }
            if (aup.settings.social.facebook)
            {
                log("LINK FB");
                this.linkFbCallback();
            }
        }

    },

    hide: function ()
    {

    },

    onAuthChange: function (_auth)
    {

    }
}



aup.pages.setpassword = {
    //controller parametres
    urlStr : "setpassword",
    title : "Set new password",
    inited : false,
    rndEnable : false,

    proceedButton : false,
    mail_input : null,

    mainObject : null,
    error_meassage : null,

    errorMessageTimeout : -1,

    state0 : null,
    state1 : null,

    code : "",

    init: function ()
    {
        this.mainObject = id$('setpassword');

        this.mail_input = $(this.mainObject).find(".form_input_field");

        this.mail_input.keypress(bind(function(e)
        {
            var password = this.mail_input.val();
            if  (password.length>=16)
            {
                this.showErrMsg("You can't use more than 16 characters");
            }

            if (e.keyCode == 13){this.formProceed();}
        },this));


        this.proceedButton = $(this.mainObject).find(".form_confirm_button");
        this.proceedButton.click( bind(this.formProceed, this) );

        this.error_meassage = $(this.mainObject).find(".form_error_message");

        var states = $(this.mainObject).find(".type");
        this.state0 = $(states[0]);
        this.state1 = $(states[1]);


        this.inited = true;
    },

    formProceed : function()
    {
        var email =  this.mail_input.val();

        if (email.length<6)
        {
            this.showErrMsg("Please use at least 6 characters");
            this.mail_input.focus();
            return false;
        }

        if  (email.length>16)
        {
            this.showErrMsg("You can't use more than 16 characters");
            this.mail_input.focus();
            return false;
        }


        $.ajax({
            url:aup.netcalls.setPwCall,
            data : { r : Math.random(), passw : email, code : this.code },
            timeout:aup.netTimeOut,
            success:bind(this.resendOk, this),
            error:bind(this.resendFail, this)
        });
    },

    resendOk : function(response)
    {
        var resp = getObjectJson(response);
        if (resp.error)
        {
            aup.controller.showErrorPage();
            return false;
        }

        this.code = "";
        this.setState(1);
    },

    resendFail : function(e)
    {
        this.code = "";
        this.showErrMsg("Something went wrong");
    },


    //std for each module control functions
    show: function (_q)
    {
        log("1Show find friends");
        aup.controller.showCanvas();
        log("2Show find friends");
        this.reset();

        if (this.code == "")
            aup.controller.navigateTo(aup.controller.getMainPage().urlStr);
    },


    showErrMsg : function(_txt)
    {
        this.error_meassage.text(_txt);
        this.hideMsg();
    },

    hideMsg : function()
    {
        if (this.errorMessageTimeout!=-1)
            clearTimeout(this.errorMessageTimeout);
        this.errorMessageTimeout = setTimeout(bind(function() { this.error_meassage.text(""); this.errorMessageTimeout = -1; }, this),2000);
    },


    setState : function(_state)
    {
        if (_state == 0)
        {
            this.state0.css({ display : ''});
            this.state1.css({ display : 'none'});
        }else{
            this.state1.css({ display : ''});
            this.state0.css({ display : 'none'});
        }
    },

    reset : function()
    {
        this.setState(0);
        this.mail_input.val("");
    },

    hide: function ()
    {

    },

    onAuthChange: function (_auth)
    {
    }
}




aup.pages.resendpw = {
    //controller parametres
    urlStr : "reset",
    title : "Reset password",
    inited : false,
    rndEnable : false,

    proceedButton : false,
    mail_input : null,

    mainObject : null,
    error_meassage : null,

    errorMessageTimeout : -1,

    state0 : null,
    state1 : null,

    init: function ()
    {
        this.mainObject = id$('reset');

        this.mail_input = $(this.mainObject).find(".form_input_field");
        this.proceedButton = $(this.mainObject).find(".form_confirm_button");
        this.proceedButton.click( bind(this.formProceed, this) );

        this.error_meassage = $(this.mainObject).find(".form_error_message");

        var states = $(this.mainObject).find(".type");
        this.state0 = $(states[0]);
        this.state1 = $(states[1]);


        this.inited = true;
    },

    formProceed : function()
    {
        var email =  this.mail_input.val();

        if (!validateEmail(email))
        {
            this.showErrMsg("Doesn't look like a valid e-mail");
            this.mail_input.focus();
            return false;
        }

        log("RESET!");

        $.ajax({
            url:aup.netcalls.resetPwCall,
            data : { r : Math.random(), login :  email },
            timeout:aup.netTimeOut,
            success:bind(this.resendOk, this),
            error:bind(this.resendFail, this)
        });
    },

    resendOk : function(response)
    {
        var resp = getObjectJson(response);
        if (resp.error)
        {
            if ((resp.error.code == "API_Rejected") || (resp.error.code == "API_BadParams"))
            {
                this.showErrMsg("No user with this e-mail");
                this.mail_input.focus();
            }else{
                aup.controller.showErrorPage();
            }
            return false;
        }

        this.setState(1);

    },

    resendFail : function(e)
    {
        this.showErrMsg("Something went wrong");
    },


    //std for each module control functions
    show: function (_q)
    {
        log("1Show find friends");
        aup.controller.showCanvas();
        log("2Show find friends");
        this.reset();
    },


    showErrMsg : function(_txt)
    {
        this.error_meassage.text(_txt);
        this.hideMsg();
    },

    hideMsg : function()
    {
        if (this.errorMessageTimeout!=-1)
            clearTimeout(this.errorMessageTimeout);
        this.errorMessageTimeout = setTimeout(bind(function() { this.error_meassage.text(""); this.errorMessageTimeout = -1; }, this),2000);
    },


    setState : function(_state)
    {
        if (_state == 0)
        {
            this.state0.css({ display : ''});
            this.state1.css({ display : 'none'});
        }else{
            this.state1.css({ display : ''});
            this.state0.css({ display : 'none'});
        }
    },

    reset : function()
    {
        this.setState(0);
        this.mail_input.val("");
    },

    hide: function ()
    {

    },

    onAuthChange: function (_auth)
    {
        if (_auth)
            aup.controller.navigateTo(aup.controller.getMainPage().urlStr);
    }
}




