aup.actions.comments = {
	
	//post comments
	postComment : function (_photoId, _reply, _commentBody, _callback, _errorcb)
	{

		var curUrl = aup.netcalls.commentsCallAdd;
        replyer = {};

		if (_reply)
		{
			curUrl = aup.netcalls.commentsCallReply;
            replyer = { comment : _reply};
            aup.stats.trackComment(true);
		}else{
            aup.stats.trackComment();
        }
        //aup.stats.checkVisible();

        var errcb = _errorcb;
        if (!errcb)
            errcb = bind(this.onPostCommentError, this);

        aup.opengraph.makeCommentAction(_photoId);
		$.ajax({
			  url: curUrl,
			  data : $.extend( aup.auth.status, { 'text' : _commentBody }, replyer, {r : Math.random(), photo : _photoId}),
			  timeout : aup.netTimeOut,
			  success: _callback,
			  error: errcb
		});
	},	
	onPostCommentError : function (e)
	{
		log("aup/actions/comments : Error while postiong comment!");
	},
	
	//get comments
	getComments: function (_photoId, _callback, _errorCallBack)
	{
        var erCall = bind(this.onError, this);
        if (_errorCallBack)
            erCall = _errorCallBack;

		$.ajax({
			  url: aup.netcalls.commentsCallGet,
              data : { photo : _photoId, r : Math.random(), limit : 1000, offset : 0 },
			  timeout : aup.netTimeOut,
			  success: _callback,
			  error: erCall
		});
	},
	//error callback
	onError : function (e)
	{
		log("aup/actions/comments : Error while getting comments!");
	}
}

