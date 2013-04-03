WHP.pages.photoPopular = {
	//controller parametres
	urlStr : "popular",
	title : "Popular",
	rndEnable : true,
	inited : false,
	
	mainObject : null,	
	feedObject : null,
	
			
	//init function
	init: function ()
	{
		this.mainObject = id$('popular');
		this.feedObject = new whp_feed_proto();
		
		
		var feed_cont = $(this.mainObject).find(".popular_photo_box");
		this.feedObject.init(feed_cont);	
		
		this.feedObject.urlPrefix = this.urlStr;
		this.feedObject.changeUrl = true;
        this.feedObject.useGalleryPhoto = true;
		this.feedObject.controlUrl = WHP.netcalls.popularCall;

        this.inited = true;
	},
	
	//std for each module control functions
	show: function (_q)
	{
		//get parametres
		var q = _q;
		if (!q)
			q = "0";		
		var params = q.split("/");
		
		//get offset param
		var offset = parseInt(params[0])*this.feedObject.imageLimit;
		if (isNaN(offset))
			offset = 0;			
		offset = Math.max(0, offset);		
		
		log("show");
		this.feedObject.show(offset);
	},
	hide: function ()
	{
		
	},

	onAuthChange: function (_auth)
	{
        if (_auth)
        {
            WHP.controller.navigateTo("timeline");
        }
	}
}



