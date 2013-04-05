aup.pages.timeline = {
	//controller parametres
	urlStr : "timeline",
	title : "Timeline",
	rndEnable : false,
	inited : false,
	
	mainObject : null,	
	timelineObject : null,

    restoreParams : null,
			
	//init function
	init: function ()
	{
		this.mainObject = id$('timeline');
		this.timelineObject = new aup_timeline_proto();
        var t = this.timelineObject;
		
		var tl_cont = $(this.mainObject).find(".timeline_box");
		t.controlUrl = aup.netcalls.timelineGlobalCallUrl;
		t.prefix = this.urlStr;
		t.showEvents = true;
		t.controlCanvas = true;
		t.userObject = aup.auth.userObject;
        t.parent = this;
        t.usePosRecalAfterRebuild = true;
        t.showEmpty = true;
		t.init(tl_cont);
        this.resetRestore();

//        aup.l10n.localize_page("timeline");
//
//        $("#l10n_" + aup.l10n.locale).addClass("active");
//
//        $("#l10n_ru").click(function() {
//            $(".main-header-l10n span").removeClass("active");
//            $(this).addClass("active");
//            aup.l10n.locale = "ru";
//            aup.l10n.localize_page("timeline");
//        });
//
//        $("#l10n_en").click(function() {
//            $(".main-header-l10n span").removeClass("active");
//            $(this).addClass("active");
//            aup.l10n.locale = "en";
//            aup.l10n.localize_page("timeline");
//        });
	},

    onContentHeightChange : function(e)
    {
        if (this.restoreParams.setScroll)
        {
            window.scrollTo(0,this.restoreParams.scrollpos);
            aup.menu.setShadow(this.restoreParams.scrollpos);
            this.restoreParams.setScroll = false;
        }
    },

    resetRestore : function()
    {
        this.restoreParams = {
            scrollpos : 0,
            setScroll : false,
            timelineRestoreResponse : null
        }
    },
	//std for each module control functions
    restore: function (e)
    {
        aup.controller.showCanvas();

        if (aup.controller.removedList.length>0)
        {
            log("REbuild");
            this.timelineObject.rebuildTimeline(aup.controller.removedList, this.restoreParams);
        }else{
            log("restore = ["+this.restoreParams.scrollpos+"]");
            this.restoreParams.setScroll = true;

        }

        this.timelineObject.restore(e);

        if (false)
        if (this.restoreParams.timelineRestoreResponse)
        {
            this.timelineObject.onData(this.restoreParams.timelineRestoreResponse,  this.timelineObject.startPage);
            this.restoreParams.timelineRestoreResponse = null;
        }

    },

	show: function (_q)
	{
        if (!aup.auth.status)
        {
            aup.controller.navigateTo("popular/");
            return false;
        }

        log("TIMELINE");

        this.resetRestore();
		this.timelineObject.show(0);
	},
	hide: function()
	{
        this.restoreParams.scrollpos = getScrollTop();
        log("restorre pos = ["+this.restoreParams.scrollpos+"]");
		this.timelineObject.hide();


	}
}



