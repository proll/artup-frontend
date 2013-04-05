aup.links = {
	
	getUserProfileLink : function(_id)
	{
        return "//"+aup.domain+"/user/"+_id+"/";
	},
	getPhotoLink : function(_id, _comments)
	{
		var preLink = "";
		if (_comments)
			preLink = "comments/"
		return "//"+aup.domain+"/photo/"+_id+"/"+preLink;
	},
	getScenarioLink : function(_id)
	{
		return "//"+aup.domain+"/story/"+_id+"/";
	},
    getStoriesLinkDaily : function()
    {
        return "//"+aup.domain+"/stories/daily/";
    },
    getStoriesLink : function(_catId, _subcatId)
    {
        if (!_catId)
        {
            return "//"+aup.domain+"/stories/";
        }else{
            if (!_subcatId)
            {
                return "//"+aup.domain+"/stories/"+_catId+"/";
            }else{
                return "//"+aup.domain+"/stories/"+_catId+"/"+_subcatId+"/";
            }
        }
    }
}






