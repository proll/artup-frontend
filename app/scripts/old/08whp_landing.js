WHP.pages.landing = {
    urlStr : "",	//temp name for error page
    title : "",
    video_url: "http://player.vimeo.com/video/53165732",
    rndEnable : false,
    inited : false,
    mainObject : null,

    sendMailObj : null,

    activeSend : false,

    landingScrollY: 0,

    init: function ()
    {
        this.mainObject = id$('landing_page');

        var _this = this;
        $(this.mainObject).mousewheel(function(event, delta, deltaX, deltaY) {
            _this.landingScrollY -= deltaY;
            if (_this.landingScrollY < 0) _this.landingScrollY = 0;
            if (_this.landingScrollY > 10) _this.landingScrollY = 10;

            var promo_distance = _this.landingScrollY * 75 / 10; // 75 - max distance
            $(".landing-text-top .text-scrollable").css("top", (75 - promo_distance) + "px");
            $(".landing-text-top-red .text-scrollable").css("top", (5 - promo_distance) + "px");
            $(".landing-text-bottom .text-scrollable").css("top", (-35 - promo_distance) + "px");

            var img_distance = _this.landingScrollY * 1300 / 10; // 1300 - max distance
            $("#landing-img-scrollable").css("top",  "-" + img_distance + "px");

            if (_this.landingScrollY >= 9 && !$("#promo-descr-3").is(":visible")) {
                $("#promo-descr-2").hide();
                $(".landing-text-description").fadeOut(300);
                $("#promo-descr-3").fadeIn(500);
                return true;
            }

            if (_this.landingScrollY >= 4 && _this.landingScrollY <= 6 && !$("#promo-descr-2").is(":visible")) {
                $(".landing-text-description").fadeOut(300);
                $("#promo-descr-2").fadeIn(500);
                return false;
            }

            if (_this.landingScrollY <= 1 && !$("#promo-descr-1").is(":visible")) {
                $("#promo-descr-2").hide();
                $(".landing-text-description").fadeOut(300);
                $("#promo-descr-1").fadeIn(500);
                return true;
            }

            return (_this.landingScrollY == 0 || _this.landingScrollY == 10);
        });

        $("#promo-text-1-top").click(function () {
            if (_this.activePromoText == 1) return;
            _this.movePromo(0);
            _this.landingScrollY = 0;
            $(".landing-text-description").fadeOut(300);
            $("#promo-descr-1").fadeIn(500);
        });

        $("#promo-text-2-top, #promo-text-2-bottom").click(function () {
            if (_this.activePromoText == 2) return;
            _this.movePromo(50);
            _this.landingScrollY = 5;
            $(".landing-text-description").fadeOut(300);
            $("#promo-descr-2").fadeIn(500);
        });

        $("#promo-text-3-top, #promo-text-3-bottom").click(function () {
            if (_this.activePromoText == 3) return;
            _this.movePromo(100);
            _this.landingScrollY = 10;
            $(".landing-text-description").fadeOut(300);
            $("#promo-descr-3").fadeIn(500);
        });

        $("#l10n_" + WHP.l10n.locale).addClass("active");

        $("#l10n_ru").click(function() {
            $(".main-header-l10n span").removeClass("active");
            $(this).addClass("active");
            WHP.l10n.locale = "ru";
            WHP.l10n.localize_page("landing");
        });

        $("#l10n_en").click(function() {
            $(".main-header-l10n span").removeClass("active");
            $(this).addClass("active");
            WHP.l10n.locale = "en";
            WHP.l10n.localize_page("landing");
        });

        this.sendMailObj = $(this.mainObject).find(".landin_android");

        var dn = $(this.mainObject).find(".timeline_empty_download_iphone");
        dn.click(function() { WHP.stats.trackDownload("DOWNLOAD_LANDING") });


        if (browser.opera)
        {
            var a = $(this.mainObject).find(".landin_spacer");
            a.css( {height : 773+'px'});

            var b = $(this.mainObject).find(".landin_share_cont");
            b.css({ bottom : -33+'px'});
        }

        this.setUpemptyElement();

        this.inited = true;
    },

    movePromo : function(percent) {
        if (percent > 100 || percent < 0) return;

        var top = $(".landing-text-top .text-scrollable");
        var top_red = $(".landing-text-top-red .text-scrollable");
        var bottom = $(".landing-text-bottom .text-scrollable");

        var promo_distance = percent * 75 / 100; // 75 - max distance
        top.stop().animate({ top: (75 - promo_distance) + "px" });
        top_red.stop().animate({ top: (5 - promo_distance) + "px" });
        bottom.stop().animate({ top: (-35 - promo_distance) + "px" });

        var img = $("#landing-img-scrollable");
        var img_distance = percent * 1300 / 100; // 1300 - max distance
        img.stop().animate({
            top: "-" + img_distance + "px"
        }, 300);
    },

    showVideo: function() {
        $("#video-iframe").attr("src", this.video_url);
        $('#video-popup-1').fadeIn();
    },

    hideVideo: function() {
        $('#video-popup-1').fadeOut();
        $("#video-iframe").attr("src", "");
    },

    setMissed : function(elem, missed)
    {
        elem.click(bind(function(){ this.missed.css({ display: 'block' }); this.timer.reset(); this.timer.start(); }, elem));
        elem.timer = new Timer(1500,1);
        elem.timer.onTimerEvent = bind(function(e){ log("END TIMER"); this.missed.css({ display: 'none'}) }, elem);
        elem.missed = missed;
    },



    onResizeEvent : function(e)
    {

    },


    show: function (_q)
    {
        //_q - query string
        WHP.controller.showCanvas();
        WHP.controller.setTitle();
        WHP.stats.trackShowMainButton();

        $(".main-header-l10n").show();
        WHP.l10n.localize_page("landing");
    },

    hide: function ()
    {

    },

    setUpemptyElement : function()
    {
        this.sendMailObj.defText = "Your e-mail address...";
        this.sendMailObj.input = this.sendMailObj.find(".timeline_empty_enter");
        this.sendMailObj.input.val(this.sendMailObj.defText);
        this.sendMailObj.inputs = this.sendMailObj.find(".timeline_empty_inputs");
        this.sendMailObj.outputs = this.sendMailObj.find(".timeline_empty_inputs");
        this.sendMailObj.parent = this;


        this.sendMailObj.formButton = this.sendMailObj.find(".timeline_empty_notify_0");
        if (this.sendMailObj.formButton.length == 0)
            this.sendMailObj.formButton = this.sendMailObj.find(".timeline_empty_notify_1");

        this.sendMailObj.activeSend = false;

        this.sendMailObj.input.focus(bind(this.onFocus, this.sendMailObj));
        this.sendMailObj.input.blur(bind(this.onBlur, this.sendMailObj));
        this.sendMailObj.input.keyup(bind(this.checkInput, this.sendMailObj));

        this.sendMailObj.formButton.click(bind(this.sendRequest, this.sendMailObj));

        setClass(this.sendMailObj.formButton, "timeline_empty_notify_0");
        if (browser.opera)
        {
           this.sendMailObj.formButton.css({ position : 'relative', top : 3+'px'});
        }else if (browser.ie)
        {
           this.sendMailObj.formButton.css({ position : 'relative', top : 1+'px'});
        }


    },

    checkInput : function(e)
    {
        if (validateEmail(this.input.val()))
        {
            setClass(this.formButton, "timeline_empty_notify_1");
        }else{
            setClass(this.formButton, "timeline_empty_notify_0");
        }
    },


    onFocus : function(e)
    {
        if (this.input.val() == this.defText)
            this.input.val("");
    },

    onBlur : function(e)
    {
        if (this.input.val() == "")
            this.input.val(this.defText);
    },

    sendRequest : function(e)
    {
        if (this.activeSend)
            return false;

        if (!validateEmail(this.input.val()))
            return false;

        $.ajax({
            url:WHP.netcalls.promoCall,
            data : { r : Math.random(), email :  this.input.val() },
            timeout:WHP.netTimeOut,
            success:bind(this.parent.promoOk, this),
            error:bind(this.parent.promoFail, this)
        });
    },

    promoOk : function(e)
    {
        this.inputs.css({display : 'none'});
        setClass(this.outputs, "timeline_empty_output");
        this.outputs.css({display : 'block' }).html("We will e-mail you when<br/>it is ready. See you soon!");
        this.activeSend = false;
    },

    promoFail : function (e)
    {
        this.inputs.css({display : 'block'});
        setClass(this.outputs, "timeline_empty_output_fail");
        this.outputs.css({display : 'block' }).html("Failed! <br/>Please, try again!");
        this.activeSend = false;
    },

    onAuthChange : function (_auth)
    {
//        if (_auth)
//        {
//            WHP.controller.navigateTo(WHP.pages.timeline.urlStr);
//        }
    },


    restore: function ()
    {
        WHP.controller.showCanvas();
    }
}



