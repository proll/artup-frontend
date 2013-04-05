aup.actions.likes = {

	likePhoto : function (_id, _vote, _label)
	{
		if (!aup.auth.status)
		{
			//show auth window 2
            aup.loginMenus.showLoginMenu();
			return false;
		}

		var curVote = parseInt(_vote);

		if (isNaN(curVote))
			return false;

		curVote = Math.max(0, curVote);
		curVote = Math.min(1, curVote);
			
		$.ajax({
			  url: aup.netcalls.voteCall,
			  data : { like : _vote , r : Math.random(), photo : _id },
			  timeout : aup.netTimeOut,
			  success: bind(this.onData, this),
			  error: bind(this.onError, this)
		});

        if (curVote>0)
        {
            aup.stats.trackLike(_label);
            aup.opengraph.makeLikeAction(_id);
        }

	},
	
	onData : function (response, status, xhr)
	{
		var resp = getObjectJson(response);	
		if (resp.error)
		{
			log("aup/actions/likes : Err = ["+resp.error.code+"]");
			//aup.controller.showErrorPage();
			aup.errors.hasNetError(resp);
			return false;
		}
        aup.stats.trackLike();
        //aup.stats.checkVisible();
		
	},
	onError : function (e)
	{
		log("aup/actions/likes : Error while loading actual data! Err = ["+e+"]");
	},
	
	
	
	getLikeList : function (_id, callBack)
	{
		$.ajax({
			  url: aup.netcalls.likesCall,
			  data : $.extend(aup.auth.status, {r : Math.random(), photo : _id, limit: 100}),
			  timeout : aup.netTimeOut,
			  success: callBack,
			  error: bind(this.onError2, this)
		});
	},

	onError2 : function (e)
	{
		log("aup/actions/likes : Error while loading actual data! Err = ["+e+"]");
	}
}



