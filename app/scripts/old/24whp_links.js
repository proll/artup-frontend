WHP.links = {
	
	getUserProfileLink : function(_id)
	{
        return "//"+WHP.domain+"/user/"+_id+"/";
	},
	getPhotoLink : function(_id, _comments)
	{
		var preLink = "";
		if (_comments)
			preLink = "comments/"
		return "//"+WHP.domain+"/photo/"+_id+"/"+preLink;
	},
	getScenarioLink : function(_id)
	{
		return "//"+WHP.domain+"/story/"+_id+"/";
	},
    getStoriesLinkDaily : function()
    {
        return "//"+WHP.domain+"/stories/daily/";
    },
    getStoriesLink : function(_catId, _subcatId)
    {
        if (!_catId)
        {
            return "//"+WHP.domain+"/stories/";
        }else{
            if (!_subcatId)
            {
                return "//"+WHP.domain+"/stories/"+_catId+"/";
            }else{
                return "//"+WHP.domain+"/stories/"+_catId+"/"+_subcatId+"/";
            }
        }
    }
}






