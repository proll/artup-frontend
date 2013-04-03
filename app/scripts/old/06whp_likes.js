WHP.actions.likes = {

	likePhoto : function (_id, _vote, _label)
	{
		if (!WHP.auth.status)
		{
			//show auth window 2
            WHP.loginMenus.showLoginMenu();
			return false;
		}

		var curVote = parseInt(_vote);

		if (isNaN(curVote))
			return false;

		curVote = Math.max(0, curVote);
		curVote = Math.min(1, curVote);
			
		$.ajax({
			  url: WHP.netcalls.voteCall,
			  data : { like : _vote , r : Math.random(), photo : _id },
			  timeout : WHP.netTimeOut,
			  success: bind(this.onData, this),
			  error: bind(this.onError, this)
		});

        if (curVote>0)
        {
            WHP.stats.trackLike(_label);
            WHP.opengraph.makeLikeAction(_id);
        }

	},
	
	onData : function (response, status, xhr)
	{
		var resp = getObjectJson(response);	
		if (resp.error)
		{
			log("WHP/actions/likes : Err = ["+resp.error.code+"]");
			//WHP.controller.showErrorPage();
			WHP.errors.hasNetError(resp);
			return false;
		}
        WHP.stats.trackLike();
        //WHP.stats.checkVisible();
		
	},
	onError : function (e)
	{
		log("WHP/actions/likes : Error while loading actual data! Err = ["+e+"]");
	},
	
	
	
	getLikeList : function (_id, callBack)
	{
		$.ajax({
			  url: WHP.netcalls.likesCall,
			  data : $.extend(WHP.auth.status, {r : Math.random(), photo : _id, limit: 100}),
			  timeout : WHP.netTimeOut,
			  success: callBack,
			  error: bind(this.onError2, this)
		});
	},

	onError2 : function (e)
	{
		log("WHP/actions/likes : Error while loading actual data! Err = ["+e+"]");
	}
}



