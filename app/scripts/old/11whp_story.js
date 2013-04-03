WHP.pages.story = {
	//controller parametres
	urlStr : "story",
	title : "Scenario",
	rndEnable : true,
	inited : false,
	
	mainObject : null,	
	feedObject : null,
	titleLabel : null,
    navLabel : null,

    labl1 : null,
    labl2 : null,
	
	storyId : 0,


    linkBack : false,
    linkBackRealBack : false,
    storyType : "",
    storyName : "",
    storyCat : 0,
			
	//init function
	init: function ()
	{
		this.mainObject = id$('story');
		this.feedObject = new whp_feed_proto();
		
		this.titleLabel = $(this.mainObject).find(".feed_name_labl2");

        this.labl1 = $(this.mainObject).find(".feed_name4");
        this.labl2 = $(this.mainObject).find(".feed_name8");
		
		var feed_cont = $(this.mainObject).find(".popular_photo_box");
		this.feedObject.init(feed_cont);	
		
		this.feedObject.changeUrl = true;
        this.feedObject.useGalleryPhoto = true;
		this.feedObject.callWasVote = WHP.netcalls.wasVoteCall;
        this.feedObject.hidePaginOnNull = false;
		this.feedObject.onLoadCall = bind(this.onloadCall,this);
	},
	
	//std for each module control functions
	show: function (_q)
	{
		//get parametres
		var q = _q;
		if (!q)
			q = "0";
					
		var params = q.split("/");
		var storyId = parseInt(params[0]);
		if (isNaN(storyId))
		{
			log("WHP/scenario : parametres error");
			this.storyId = null;
			WHP.controller.showErrorPage(2);
			return false;
		}
		this.storyId = storyId;
		
		//get offset param
		var offset = parseInt(params[1])*this.feedObject.imageLimit;
		if (isNaN(offset))
			offset = 0;			
		offset = Math.max(0, offset);

        if (this.linkBack)
        {
            this.linkBack = false;
            this.linkBackRealBack = true;
        }else{
            this.linkBackRealBack = false;
        }
		
		
		this.feedObject.urlPrefix = this.urlStr+"/"+this.storyId;
		this.feedObject.controlUrl = WHP.netcalls.storyInfoUrl+"?story="+this.storyId;
		this.feedObject.show(offset);
	},
	hide: function ()
	{
		
	},
	
	restore: function ()
	{
        if (WHP.controller.removedList.length>0)
        {
            this.show(this.storyId+"/");
        }else{
            WHP.controller.showCanvas();
        }
	},
	
	onloadCall : function(_resp)
	{
        var storyName = "";
        var navStr = "";

        this.storyType = _resp.story.type;
        if (this.storyType == "STORY")
        {
            this.labl1.css({ display : ''});
            storyName = "<span class='feed_name_labl2'>"+_resp.story.name+"</span>";
            this.storyName = _resp.story.name;

            navStr = "<a class='controls_link_text' style='font-size:26px;' href='"+WHP.links.getStoriesLink(_resp.story.storycat.id)+"'>"+_resp.story.storycat.name+"</a>";
        }else if (this.storyType == "UNSORTED")
        {
            this.labl1.css({ display : ''});
            storyName = "<span class='feed_name_labl2'>"+_resp.story.name+"</span>";
            this.storyName = _resp.story.name;

            this.storyCat = _resp.story.storycat.id;

            navStr = "<a class='controls_link_text' style='font-size:26px;' href='"+WHP.links.getStoriesLink(_resp.story.storycat.id)+"'>"+_resp.story.storycat.name+"</a>";
        }else if (this.storyType == "DAILY")
        {
            this.labl1.css({ display : ''});
            storyName = "<span class='feed_name_labl2'>"+_resp.story.name+"</span>";
            this.storyName = _resp.story.name;

            navStr = "<a class='controls_link_text' style='font-size:26px;' href='"+WHP.links.getStoriesLinkDaily()+"'>Daily stories</a>";
        }else if (this.storyType == "PRIVATE")
        {
            this.labl1.css({ display : 'none'});
            storyName = "<a class='feed_name_labl2' href='"+WHP.links.getScenarioLink(_resp.story.id)+"'>PERSONAL PHOTOS</a>";
            this.storyName = "Personal photo";
        }else{
            this.labl1.css({ display : 'none'});
            storyName = "<span class='feed_name_labl2'>"+_resp.story.name+"</span>";
            this.storyName = _resp.story.name;
        }

        if (this.storyName.length>0)
        {
            this.storyName = this.storyName.charAt(0).toUpperCase() + this.storyName.slice(1);
        }


        this.setTitle();

		this.labl2.html(storyName);
        this.labl1.html(navStr);

		var linker = $(this.feedObject.pagingContainer).find(".feed_story_back");	
		linker.text("Back to stories").click(bind(this.linkerClick, this)).css({ cursor : 'pointer' });


        addIntelloLinks( this.labl1 );
	},


    setTitle : function()
    {
        this.title = this.storyName;
        WHP.controller.setTitle();
    },


    linkerClick: function (_auth)
    {
        log("this.linkBackRealBack = ["+this.linkBackRealBack+"]");
        if (this.linkBackRealBack)
        {
            history.back();
        }else{
            if (this.storyType == "DAILY")
            {
                WHP.controller.navigateTo( "stories/daily" );
            }else{
                WHP.controller.navigateTo( "stories/"+this.storyCat );
            }
        }
    },
	
	onAuthChange: function (_auth)
	{
		log("WHP/pages/scenario : on auth change to = ["+_auth+"]");
		//this.feedObject.loadWasVote(_auth);
	}
}







