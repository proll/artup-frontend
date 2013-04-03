WHP.actions.comments = {
	
	//post comments
	postComment : function (_photoId, _reply, _commentBody, _callback, _errorcb)
	{

		var curUrl = WHP.netcalls.commentsCallAdd;
        replyer = {};

		if (_reply)
		{
			curUrl = WHP.netcalls.commentsCallReply;
            replyer = { comment : _reply};
            WHP.stats.trackComment(true);
		}else{
            WHP.stats.trackComment();
        }
        //WHP.stats.checkVisible();

        var errcb = _errorcb;
        if (!errcb)
            errcb = bind(this.onPostCommentError, this);

        WHP.opengraph.makeCommentAction(_photoId);
		$.ajax({
			  url: curUrl,
			  data : $.extend( WHP.auth.status, { 'text' : _commentBody }, replyer, {r : Math.random(), photo : _photoId}),
			  timeout : WHP.netTimeOut,
			  success: _callback,
			  error: errcb
		});
	},	
	onPostCommentError : function (e)
	{
		log("WHP/actions/comments : Error while postiong comment!");
	},
	
	//get comments
	getComments: function (_photoId, _callback, _errorCallBack)
	{
        var erCall = bind(this.onError, this);
        if (_errorCallBack)
            erCall = _errorCallBack;

		$.ajax({
			  url: WHP.netcalls.commentsCallGet,
              data : { photo : _photoId, r : Math.random(), limit : 1000, offset : 0 },
			  timeout : WHP.netTimeOut,
			  success: _callback,
			  error: erCall
		});
	},
	//error callback
	onError : function (e)
	{
		log("WHP/actions/comments : Error while getting comments!");
	}
}

