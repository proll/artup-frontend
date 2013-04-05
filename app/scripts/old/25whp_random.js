aup.randomPage = {
    randomPicsIds : [],
    randomCount : 0,
    active : false,
	
	clickButton: function (e)
	{
        aup.stats.trackShuffle();
		this.getRnd();
	},
	
	getRnd: function (_param)
	{
        if (this.active)
            return false;
		aup.controller.hideCanvas();

        this.active = true;
        $.ajax({
            url: aup.netcalls.randomImageCall,
            data : { r : Math.random() },
            timeout : aup.netTimeOut,
            success: bind(this.rndImageCallback, this),
            error: bind(this.onError, this)
        });
    },


    checkRnd : function(_id)
    {
        var ret = false;
        for (var i=0; i<this.randomPicsIds.length;i++)
        {
           // log("rnd check = ["+this.randomPicsIds[i] +"] = ["+ _id+"]");
            if (this.randomPicsIds[i] == _id)
            {
                ret = true;
                break;
            }
        }

        return ret;
    },

    clearCHrnd : function()
    {
        if (this.randomPicsIds.length == 0)
            return false;

        this.randomPicsIds = [];
    },
	
	rndImageCallback : function (response, status)
	{
        this.active = false;
		var resp = getObjectJson(response);	
		if (resp.error)
		{
			log("aup/random : get picture error = ["+resp.error.code+"]");
			if (!aup.errors.hasNetError(resp))
			{
				aup.controller.showErrorPage();
			}
			return false;
		}


        var maxRndC = 30;
        if (this.checkRnd(resp.photo.id))
        {
            this.randomCount++;
            if (this.randomCount < maxRndC)
            {
                log("["+this.randomCount+"] RND FAIL!  totalL = ["+this.randomPicsIds.length+"] picID = ["+resp.photo.id+"]");
                this.getRnd();
                return false;
            }else{
                log("RND TOTAL FAILED!!! COUNT = ["+this.randomCount+"]");
            }
        }
        this.randomCount = 0;
        if (this.randomCount < maxRndC)
            this.randomPicsIds.push(resp.photo.id);


		//set photo page
		var page = aup.pages.photo;
		aup.controller.clearCurPage();
		aup.controller.setPage(page);

		//set main variables



        page.curPageId = resp.photo.id;
        page.curPageObject = resp;
        page.mainImage.likeShadow.css({ visibility : 'hidden'});

        page.setSizes();
        page.setImage(resp);


		page.comments.clearComments();
		page.comments.getComments();
		page.likeLists.getLikesLists();
		page.share.resetShare();
        page.removePhoto.checkButtonVisibility();

		var str = aup.links.getPhotoLink(resp.photo.id);
		setLink(str);
        aup.menu.currentMenuPos();
		page.setTitle(resp);

		aup.controller.showCanvas();
		aup.menu.currentMenuPos();

        aup.controller.scrollToPos(0,0);
	},


	onError : function (e)
	{
        this.active = false;
		log("aup/random : Error while loading actual data! : ["+e+"]");
		aup.controller.showErrorPage();
	}
}



