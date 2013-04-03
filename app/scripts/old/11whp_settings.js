WHP.pages.settings = {
    //controller parametres
    urlStr : "settings",
    title : "Settings",
    rndEnable : false,
    inited : false,


    appSettings : {
        useOpenGraph : false,
        login : null,
        social : null
    },

    mainObject : null,

    opengraphSwitcher : null,
    linkerFBSwitcher : null,
    linkerTWSwitcher : null,

    window1 : null,
    button1 : null,
    button2 : null,
    button3 : null,

    window2 : null,


    prelogin : "",

	init : function()
    {
        this.mainObject = id$('settings');

        var lines = $(this.mainObject).find(".settings_line");

        this.opengraphSwitcher = $(lines[0]);
        this.opengraphSwitcher.switcher = new Switcher(this.opengraphSwitcher.find(".settings_switcher_0"));
        this.opengraphSwitcher.state = false;
        this.opengraphSwitcher.click(bind(this.ogClick,this));

        this.linkerFBSwitcher = $(lines[1]);
        this.linkerFBSwitcher.switcher = new Switcher(this.linkerFBSwitcher.find(".settings_switcher_0"));
        this.linkerFBSwitcher.state = false;
        this.linkerFBSwitcher.click(bind(this.linkerFBClick,this));

        this.linkerTWSwitcher = $(lines[2]);
        this.linkerTWSwitcher.switcher = new Switcher(this.linkerTWSwitcher.find(".settings_switcher_0"));
        this.linkerTWSwitcher.state = false;
        this.linkerTWSwitcher.click(bind(this.linkerTWClick,this));

        this.linkerVKSwitcher = $(lines[3]);
        this.linkerVKSwitcher.switcher = new Switcher(this.linkerVKSwitcher.find(".settings_switcher_0"));
        this.linkerVKSwitcher.state = false;
        this.linkerVKSwitcher.click(bind(this.linkerVKClick,this));

        var tables = $(this.mainObject).find("table");









        //set login and password
        this.window1 = $("#set_login_pw");
        this.window1.activeSet = false;
        this.window1.css({ position : 'fixed' });
        this.window1.click(bind(function(event) {
            event.stopPropagation();
        }, this));
        this.window1.errorMessageTimeout = -1;
        this.window1.error_meassage = this.window1.find(".form_error_message");
        this.window1.showErrMsg = bind(function(_txt)
            {
                this.error_meassage.text(_txt);
                this.hideMsg();
            }
        ,this.window1);
        this.window1.hideMsg = bind(function()
            {
                if (this.errorMessageTimeout!=-1)
                    clearTimeout(this.errorMessageTimeout);
                this.errorMessageTimeout = setTimeout(bind(function() {  this.error_meassage.text(""); this.error_meassage.errorMessageTimeout = -1; }, this),2000);
            }
        ,this.window1);
        this.window1.proceedBtn = this.window1.find(".form_confirm_button");
        this.window1.proceedBtn.click(bind(this.setLoginPass, this));

        var inputs = this.window1.find(".form_input_field_sign");
        this.window1.input_mail = $(inputs[0]);
        this.window1.input_mail.keypress(bind(function(e)
        {
            if (e.keyCode == 13)
            {
                this.setLoginPass();
            }

        },this));

        this.window1.input_pass = $(inputs[1]);
        this.window1.input_pass.keypress(bind(function(e)
        {
            if (e.keyCode == 13)
            {
                this.setLoginPass();
            }

            if  (this.window1.input_pass.val().length>=16)
            {
                this.window1.showErrMsg("You can't use more than 16 characters!");
            }

        },this));






        this.window2 = $("#set_login");

        var pages =  this.window2.find(".login_page");
        this.window2.page1 = $(pages[0]);
        this.window2.page2 = $(pages[1]);


        this.window2.page1.input_pass = this.window2.page1.find(".form_input_field_sign");
        this.window2.page1.proceedBtn = this.window2.page1.find(".form_confirm_button");
        this.window2.page1.error_meassage = this.window2.page1.find(".form_error_message");
        this.window2.page1.errorMessageTimeout = -1;
        this.window2.page1.hideMsg = bind(this.hideMsg, this.window2.page1);
        this.window2.page1.showErrMsg = bind(this.showErrMsg, this.window2.page1);
        this.window2.page1.input_pass.keypress(bind(function(e)
        {
            if (e.keyCode == 13)
            {
                this.applyForm();
            }

        },this.window2.page1));
        this.window2.page1.proceedBtn.click(bind(function(e){
            this.window2.page1.applyForm();
        },this));
        this.window2.page1.applyForm = bind(function(e)     {
            var a = this.window2.page1;
            var password =  a.input_pass.val();




            //need call
            $.ajax({
                url:WHP.netcalls.confirmPwCall,
                data : { r : Math.random(), passw : password },
                timeout:WHP.netTimeOut,
                success:bind(this.onPwConfirm, this),
                error:bind(this.onPwConfirmErr, this)
            });


        }, this);




        this.window2.page2.input_mail = this.window2.page2.find(".form_input_field_sign");
        this.window2.page2.proceedBtn = this.window2.page2.find(".form_confirm_button");
        this.window2.page2.error_meassage = this.window2.page2.find(".form_error_message");
        this.window2.page2.errorMessageTimeout = -1;
        this.window2.page2.code = "";
        this.window2.page2.hideMsg = bind(this.hideMsg, this.window2.page2);
        this.window2.page2.showErrMsg = bind(this.showErrMsg, this.window2.page2);

        this.window2.page2.input_mail.keypress(bind(function(e)
        {
            if (e.keyCode == 13)
            {
                this.applyForm();
            }

        },this.window2.page2));
        this.window2.page2.proceedBtn.click(bind(function(e){
            this.window2.page2.applyForm();
        },this));
        this.window2.page2.applyForm = bind(function(e)     {
            var a = this.window2.page2;
            var email =  a.input_mail.val();



            if (!validateEmail(email))
            {
                a.showErrMsg("Doesn't look like a valid email!");
                a.input_mail.focus();
                return false;
            }

            a.prelogin = email;


            //this.onLoginConfirm();
            //return false;

            //need call
            $.ajax({
                url:WHP.netcalls.changeLoginCall,
                data : { r : Math.random(), login : email, code : this.window2.page2.code },
                timeout:WHP.netTimeOut,
                success:bind(this.onLoginConfirm, this),
                error:bind(this.onLoginConfirmErr, this)
            });


        }, this);
        this.window2.page2.prelogin = "";

        ///



        this.window2.css({ position : 'fixed' });
        this.window2.timer = new Timer(1000/30, 18);
        this.window2.timer.onTimerEvent = bind(function(e)
        {
            var A = e.currentCount/e.repeatCount;
            var B = Math.sin(A*Math.PI*0.5);
            var s = 260;
            this.page1.css({ left : -B*s+"px"});
            this.page2.css({ left : (1-B)*s+"px"});
            if (!browser.ie)
            {
               setAlpha(this.page1, Math.max(0,1-2*A));
            }

        },this.window2);
        this.window2.setState2 = bind(function()
        {
            this.timer.reset();
            this.timer.start();
        },this.window2);
        this.window2.setState1 = bind(function()
        {
            this.page1.css({ left : "0px"});
            this.page2.css({ left : "260px"});
            if (!browser.ie)
            {
                setAlpha(this.page1, 1.0);
            }
        },this.window2);






        //set login and pw
        this.button1 =  $(tables[2]).find(".settings_line");
        this.button1.click(bind(this.clickSetPwLogin,this));


        //set pw
        var lines = $(tables[1]).find(".settings_line");
        this.button2 = $(lines[0]);
        this.button2.click(bind(this.clickLogin, this));
        this.button3 = $(lines[1]);
        this.button3.click(bind(this.clickPassword, this));

        this.inited = true;
    },

    onLoginConfirmErr : function(e)
    {
        this.window2.page2.showErrMsg("Something went wrong");
    },

    onLoginConfirm : function(response)
    {
        var resp = getObjectJson(response);
        if (resp)
        if (resp.error)
        {
            if (resp.error.code == "API_AlreadyInUse")
            {
                this.window2.page2.showErrMsg("This email already registered");
                return false;
            }
            this.window2.page2.showErrMsg("Something went wrong");
            return false;
        }

        this.appSettings.login = this.window2.page2.prelogin;
        this.setView();
        this.hideWindow2();

    },


    onPwConfirm : function(response)
    {
        var resp = getObjectJson(response);
        if (resp)
        if (resp.error)
        {
            if ((resp.error.code == "API_Rejected") || (resp.error.code == "API_BadParams"))
            {
                this.window2.page1.showErrMsg("Wrong password!");
                this.window2.page1.input_pass.focus();
                return false;
            }
            this.window2.page1.showErrMsg("Something went wrong!");
            return false;
        }

        this.window2.page2.code = resp.code;
        this.window2.setState2();
        this.window2.page2.input_mail.focus();
    },

    onPwConfirmErr : function(e)
    {
        this.window2.page1.showErrMsg("Something went wrong!");
    },

    clickLogin : function(e)
    {
        this.window2.css({display:"block"});
        WHP.main_fader.show();

        //positions
        var scrollTop = getScrollTop();


        if (browser.ie)
        {
            this.window2.css({ position : 'absolute' });
            this.window2.css({ top : (scrollTop + (WHP.screenH - this.window2.height())*0.5 )+'px', left : (WHP.screenWl-285)*0.5 +'px' });
        }else
            this.window2.css({ top : (WHP.screenH - this.window2.height())*0.5 +'px', left : (WHP.screenWl-285)*0.5 +'px' });

        this.window2.page2.input_mail.val("");
        this.window2.page1.input_pass.val("");
        this.window2.setState1();
        this.window2.page1.input_pass.focus();

        return cancelEvent(e);
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





    hideWindow2 : function()
    {
        if (this.window2.css("display") == 'none')
            return false;

        log("hideWindow2");
        this.window2.css({display:"none"});
        WHP.main_fader.hide();
    },



    clickPassword : function(e)
    {
        $.ajax({
            url:WHP.netcalls.setPwSettingsCall,
            data : { r : Math.random(), login :  this.appSettings.login },
            timeout:WHP.netTimeOut,
            success:bind(this.onpwResponse, this),
            error:bind(this.onErrorMessage, this)
        });
    },

    onErrorMessage : function(response)
    {
        WHP.popup_message.showAlert("Something went wrong!");
    },

    onpwResponse : function(response)
    {
        var resp = getObjectJson(response);
        if (resp.error)
        {
            if (!WHP.errors.hasNetError(resp))
            {
                WHP.controller.showErrorPage();
            }
            return false;
        }

        WHP.popup_message.showAlert("We have sent instructions to your email.", null, "/gui/mail_ico.png");
    },


    setLoginPass : function(e)
    {
        if (this.window1.activeSet)
            return false;

        var email =  this.window1.input_mail.val();
        var password = this.window1.input_pass.val();

        if (!validateEmail(email))
        {
            this.window1.showErrMsg("Doesn't look like a valid email!");
            this.window1.input_mail.focus();
            return false;
        }


        if (password.length<6)
        {
            this.window1.showErrMsg("Please use at least 6 characters!");
            this.window1.input_pass.focus();
            return false;
        }

        if  (password.length>16)
        {
            this.window1.showErrMsg("You can't use more than 16 characters!");
            this.window1.input_pass.focus();
            return false;
        }


        //pew set resend params
        if (!true)
        {
            WHP.pages.confirmation.resendMail = email;
            WHP.pages.confirmation.resendPw = password;
            WHP.controller.navigateTo("confirmation");
            return false;
        }

        this.prelogin = email;
        this.window1.activeSet = true;
        $.ajax({
            url:WHP.netcalls.setLogPwCall,
            data : { r : Math.random(), login :  email, passw : password, pass : password },
            timeout:WHP.netTimeOut,
            method : "POST",
            success:bind(this.onsetPWLGNOK, this),
            error:bind(this.onsetPWLGNFail, this)
        });



        return cancelEvent(e);
    },


    onsetPWLGNOK : function(response)
    {
        this.window1.activeSet = false;
        var resp = getObjectJson(response);
        if (resp.error)
        {
            if (resp.error.code == "API_AlreadyInUse")
            {
                this.window1.showErrMsg("This email already registered!");
                this.window1.input_mail.focus();
                return false;
            }
            this.window1.showErrMsg("Something went wrong!");
            this.window1.input_mail.focus();
            return false;
        }

        this.hideWindow1();
        this.appSettings.login = this.prelogin;
        this.setView();

    },

    onsetPWLGNFail : function(e)
    {
        this.window1.activeSet = false;
        this.showErrMsg("Something went wrong!");
    },



    linkerFBClick:function(e)
    {
        var fbConnected = false;
        if (WHP.settings.social)
        if (WHP.settings.social.facebook)
            fbConnected = true;

        if ( !fbConnected )
        {
            this.linker.FB.onLink = bind(this.linkerFB_link, this);
            this.linker.FB.showErrMsg = bind(WHP.popup_message.showAlert,WHP.popup_message);
            this.linker.FB.linkFb();
        }else{
            this.linker.FB.onUnlink = bind(this.linkerFB_unlink, this);
            this.linker.FB.showErrMsg = bind(WHP.popup_message.showAlert,WHP.popup_message);
            this.linker.FB.unlinkFb();
        }
    },

    linkerFB_link : function(e)
    {
        this.appSettings.social.facebook = true;
        this.setView();
    },

    linkerFB_unlink : function(resp)
    {


        delete this.appSettings.social.facebook;
        this.appSettings.useOpenGraph = false;
        this.setView();
    },



    linkerTWClick :function(e)
    {
        var linked = this.appSettings.social.twitter != null;
        if ( !linked )
        {
            this.linker.TW.onLink = bind(this.linkerTW_link, this);
            this.linker.TW.showErrMsg = bind(WHP.popup_message.showAlert,WHP.popup_message);
            this.linker.TW.linkTw();
        }else{
            this.linker.TW.onUnlink = bind(this.linkerTW_unlink, this);
            this.linker.TW.showErrMsg = bind(WHP.popup_message.showAlert,WHP.popup_message);
            this.linker.TW.unlinkTw();
        }
    },

    linkerTW_link : function(e)
    {
        this.appSettings.social.twitter = true;
        this.setView();
    },

    linkerTW_unlink : function(e)
    {
        delete this.appSettings.social.twitter;
        this.setView();
    },


    linkerVKClick :function(e)
    {
        var linked = this.appSettings.social.vkontakte != null;
        if ( !linked )
        {
            this.linker.VK.onLink = bind(this.linkerVK_link, this);
            this.linker.VK.showErrMsg = bind(WHP.popup_message.showAlert,WHP.popup_message);
            this.linker.VK.linkVk();
        } else {
            this.linker.VK.onUnlink = bind(this.linkerVK_unlink, this);
            this.linker.VK.showErrMsg = bind(WHP.popup_message.showAlert,WHP.popup_message);
            this.linker.VK.unlinkVk();
        }
    },

    linkerVK_link : function(e)
    {
        this.appSettings.social.vkontakte = true;
        this.setView();
    },

    linkerVK_unlink : function(e)
    {
        delete this.appSettings.social.vkontakte;
        this.setView();
    },



    ogClick : function(e)
    {
        this.opengraphSwitcher.state = !this.opengraphSwitcher.state;


        if (this.opengraphSwitcher.state)
        {
            //FB.api('/me/permissions', bind(this.checkStatusCallback,this));
            this.linker.FB.showErrMsg = bind(WHP.popup_message.showAlert,WHP.popup_message);
            var madeLinkBefore = false;
            if (WHP.settings.social)
            if (WHP.settings.social.facebook)
                madeLinkBefore = true;

            log("madeLinkBefore = ["+madeLinkBefore+"]");
            if (!madeLinkBefore)
            {
                this.linkerFBClick();
            }else{
                WHP.auth.FB.loginOG(null, bind(function() {
                    FB.api('/me/permissions', bind(this.checkStatusCallback2,this));
                }, this));
            }

        }else{
            WHP.pages.settings.appSettings.useOpenGraph = false;

            this.setView();
            this.setSettings();
        }
    },


    checkStatusCallback2 : function(e)
    {
        log("CALL OG");
        log(e);
        var hasOGpermission = e.data[0].publish_actions == 1;
        if (hasOGpermission)
        {
            if (!this.appSettings.social.facebook)
            {
                this.appSettings.social.facebook = true;
            }
            WHP.pages.settings.appSettings.useOpenGraph = true;
            this.setSettings();
        }
    },









    show: function (_q)
    {
        //get parametres
        var q = _q;
        if (!q)
            q = "0";
        var params = q.split("/");

        if (!WHP.auth.status)
        {
            WHP.controller.navigateTo(WHP.controller.getMainPage().urlStr);
            return false;
        }




        this.getSettings();
    },

    getSettings : function()
    {


        $.ajax({
            url:WHP.netcalls.getSettingsCall,
            data : { r : Math.random() },
            timeout:WHP.netTimeOut,
            success:bind(this.dataSet, this),
            error:bind(this.onError, this)
        });
    },

    onData : function(resp)
    {
        var fb = null;
        var tw = null;
        if (resp.social)
        {
            fb = resp.social.facebook;
            tw = resp.social.twitter;
        }
        this.appSettings.useOpenGraph = (resp.settings.opengraph == true) && (fb);
        this.appSettings.social = resp.social;
        this.appSettings.login = resp.account.login;
    },

    dataSet : function(response)
    {
        log("Setup settings");
        var resp = getObjectJson(response);
        if (resp.error)
        {
            if (!WHP.errors.hasNetError(resp))
            {
                WHP.controller.showErrorPage();
            }
            return false;
        }

        this.onData(resp);




        this.setView();
        WHP.controller.showCanvas();
    },

    onError : function(resp)
    {
        WHP.controller.showErrorPage();
    },

    setSettings : function(e)
    {
        $.ajax({
            url:WHP.netcalls.setSettingsCall,
            data : { r : Math.random(), opengraph : this.appSettings.useOpenGraph },
            timeout : WHP.netTimeOut,
            success : bind(this.onSetCallback, this)
        });
    },
    onSetCallback : function(e)
    {
        this.setView();
    },


    setView : function()
    {
        this.opengraphSwitcher.state = this.appSettings.useOpenGraph;
        this.opengraphSwitcher.switcher.setView(this.opengraphSwitcher.state);

        log(this.appSettings.social);

        this.linkerFBSwitcher.state = this.appSettings.social.facebook != null;
        this.linkerFBSwitcher.switcher.setView(this.linkerFBSwitcher.state);

        this.linkerTWSwitcher.state = this.appSettings.social.twitter != null;
        this.linkerTWSwitcher.switcher.setView(this.linkerTWSwitcher.state);

        this.linkerVKSwitcher.state = this.appSettings.social.vkontakte != null;
        this.linkerVKSwitcher.switcher.setView(this.linkerVKSwitcher.state);

        var tables = $(this.mainObject).find("table");
        if (this.appSettings.login)
        {
            $(tables[1]).css({display : ''});
            $(tables[2]).css({display : 'none'});

            var mail_label = $(tables[1]).find(".settings_label");
            $(mail_label[0]).text(this.appSettings.login);
        }else{
            $(tables[2]).css({display : ''});
            $(tables[1]).css({display : 'none'});
        }

    },

    hide: function ()
    {

    },


    clickSetPwLogin : function(e)
    {



        log("showWindow");
        this.window1.css({display:"block"});
        WHP.main_fader.show();

        //positions
        var scrollTop = getScrollTop();


        if (browser.ie)
        {
            this.window1.css({ position : 'absolute' });
            this.window1.css({ top : (scrollTop + (WHP.screenH - this.window1.height())*0.5 )+'px', left : (WHP.screenWl-285)*0.5 +'px' });
        }else
            this.window1.css({ top : (WHP.screenH - this.window1.height())*0.5 +'px', left : (WHP.screenWl-285)*0.5 +'px' });

        this.window1.input_mail.val("");
        this.window1.input_pass.val("");

        return cancelEvent(e);
    },

    hideWindow1 : function()
    {
        if (this.window1.css("display") == 'none')
            return false;

        log("hideWindow");
        this.window1.css({display:"none"});
        WHP.main_fader.hide();
    },











    linker : {
        FB : {
            showErrMsg : null,
            onLink : null,
            onUnlink : null,

            unlinkFb : function()
            {
                $.ajax({
                    url:WHP.netcalls.unlinkSocialCall,
                    data : { r : Math.random(), social : 'facebook' },
                    timeout: WHP.netTimeOut,
                    success:bind(this.fbUnlink, this),
                    error:bind(this.err, this)
                });
            },

            fbUnlink : function(response)
            {
                var resp = getObjectJson(response);
                if (resp.error)
                {
                    if (resp.error.code == "API_UnlinkLastAccount")
                    {
                        WHP.popup_message.showAlert("You can't unlink all accounts!");
                    }else{
                        WHP.popup_message.showAlert("Something went wrong!");
                    }
                    return false;
                }

                if (this.onUnlink)
                    this.onUnlink(resp);

            },



            linkFb : function()
            {

                FB.login(bind(this.onFBData, this), { scope:'publish_actions,publish_stream,user_photos,offline_access,email,user_birthday'});
            },

            onFBData: function(response)
            {
                if (response.status == "connected")
                {
                    log("Facebook : user was succesfully connected! :)");
                    var token = response.authResponse.accessToken;
                    if (token)
                    {
                        this.finalLinkFb(token);
                    }else{
                        log("Facebook : user was not connected! :(");
                    }
                }
            },


            finalLinkFb : function(_token)
            {
                $.ajax({
                    url:WHP.netcalls.linkSocialCall,
                    data : { r : Math.random(), social : 'facebook', access_token : _token },
                    timeout: WHP.netTimeOut,
                    success:bind(this.fbLink, this),
                    error:bind(this.err, this)
                });
            },


            fbLink : function(response)
            {
                var resp = getObjectJson(response);
                if (resp.error)
                {
                    if (resp.error.code == "API_AlreadyInUse")
                    {
                        log("ERR = [] = ["+this.showErrMsg+"]");
                        if (this.showErrMsg)
                            this.showErrMsg("This account is already linked with WeHeartPics!");
                    }else{
                        WHP.controller.showErrorPage();
                    }
                    return false;
                }

                if (this.onLink)
                    this.onLink(resp);

                if (!WHP.settings.social)
                    WHP.settings.social = {};
                WHP.settings.social.facebook = true;



                //get opengraph status
                FB.api('/me/permissions', bind(function(e)
                {
                    var hasOGpermission = e.data[0].publish_actions == 1;
                    if (hasOGpermission)
                    {
                        WHP.pages.settings.appSettings.useOpenGraph = true;
                        WHP.pages.settings.setView();
                    }
                },this));

            },

            err : function(e)
            {
                if (this.showErrMsg)
                    this.showErrMsg("Something went wrong!");
            }

        },
        TW : {
            showErrMsg : null,
            onLink : null,
            onUnlink : null,

            inited : false,
            jqxhr : null,
            requesttoken : null,
            req_count : 0,
            req_max : 10,
            preStatus : null,
            activeToken : false,
            curWind : null,


            unlinkTw : function()
            {
                $.ajax({
                    url:WHP.netcalls.unlinkSocialCall,
                    data : { r : Math.random(), social : 'twitter' },
                    timeout: WHP.netTimeOut,
                    success:bind(this.twUnlink, this),
                    error:bind(this.err, this)
                });
            },

            twUnlink : function(response)
            {
                var resp = getObjectJson(response);
                if (resp.error)
                {
                    if (resp.error.code == "API_UnlinkLastAccount")
                    {
                        WHP.popup_message.showAlert("You can't unlink all accounts!");
                    }else{
                        WHP.popup_message.showAlert("Something went wrong!");
                    }
                    return false;
                }

                if (this.onUnlink)
                    this.onUnlink(resp);
            },


            linkTw : function (e)
            {
                this.req_count = 0;
                this.curWind = openWindow2("Twitter link", 640, 480);
                this.getReqToken();
            },

            getReqToken : function()
            {
                this.activeToken = true;
                this.jqxhr = $.ajax({
                    url: WHP.netcalls.twReqTokenCall,
                    data : { r : Math.random() },
                    timeout : WHP.netTimeOut,
                    success: bind(this.onDataToken, this),
                    error: bind(this.onErrorToken, this)
                });
            },

            onDataToken: function(response, status, xhr)
            {
                this.activeToken = false;
                var resp = getObjectJson(response);

                if (resp.error)
                {
                    this.req_count++;
                }else{
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


            finalLinkTw: function(_id, _token, _secret)
            {
                log("Final link twitter");
                $.ajax({
                    url:WHP.netcalls.linkSocialCall,
                    data : { r : Math.random(), social : 'twitter', access_token : _token, access_token_secret : _secret },
                    timeout: WHP.netTimeOut,
                    success:bind(this.onData, this),
                    error:bind(this.err, this)
                });
            },

            onData: function(response, status, xhr)
            {
                var resp = getObjectJson(response);
                if (resp.error)
                {
                    if (resp.error.code == "API_AlreadyInUse")
                    {
                        if (this.showErrMsg)
                            this.showErrMsg("This account is already linked with WeHeartPics!");
                    }else{
                        WHP.controller.showErrorPage();
                    }
                    return false;
                }


                if (!WHP.settings.social)
                    WHP.settings.social = {};
                WHP.settings.social.twitter = true;
                WHP.pages.settings.setView();

                log("onLink");
                if (this.onLink)
                    this.onLink(resp);
            },


            err : function(e)
            {
                if (this.showErrMsg)
                    this.showErrMsg("Something went wrong!");
            }


        },
        VK : {
            showErrMsg : null,
            onLink : null,
            onUnlink : null,

            unlinkVk : function()
            {
                $.ajax({
                    url:WHP.netcalls.unlinkSocialCall,
                    data : { r : Math.random(), social : 'vk' },
                    timeout: WHP.netTimeOut,
                    success:bind(this.vkUnlink, this),
                    error:bind(this.err, this)
                });
            },

            vkUnlink : function(response)
            {
                var resp = getObjectJson(response);
                if (resp.error)
                {
                    if (resp.error.code == "API_UnlinkLastAccount")
                    {
                        WHP.popup_message.showAlert("You can't unlink all accounts!");
                    }else{
                        WHP.popup_message.showAlert("Something went wrong!");
                    }
                    return false;
                }

                if (this.onUnlink)
                    this.onUnlink(resp);

            },

            linkVk : function()
            {
                this.wind = openWindow2("VK auth", 640, 480);
                this.wind.location.href = "https://api.vk.com/oauth/authorize?client_id=" + WHP.auth.VK.app_id + "&scope=friends,photos,wall,offline&response_type=token&redirect_uri=http://weheartpics.com/close_vk_link.html";
                return false;
            },

            auth: function(token, user_id) {
                var self = this;
                $.ajax({
                    url: WHP.netcalls.linkSocialCall,
                    data : { r : Math.random(), social : 'vk', access_token : token, vk_id: user_id },
                    timeout: WHP.netTimeOut,
                    success: self.onData,
                    error: self.err
                });
            },

            onData: function(response, status, xhr)
            {
                var resp = getObjectJson(response);
                if (resp.error)
                {
                    if (resp.error.code == "API_AlreadyInUse")
                    {
                        if (this.showErrMsg)
                            this.showErrMsg("This account is already linked with WeHeartPics!");
                    }else{
                        WHP.controller.showErrorPage();
                    }
                    return false;
                }


                if (!WHP.settings.social)
                    WHP.settings.social = {};
                WHP.settings.social.vkontakte = true;
                WHP.pages.settings.setView();
            },

            err : function(e)
            {
                if (this.showErrMsg)
                    this.showErrMsg("Something went wrong!");
            }

        }
    }

}


WHP.settings = WHP.pages.settings.appSettings;




