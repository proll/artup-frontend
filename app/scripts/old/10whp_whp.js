WHP.pages.whp = {
	//controller parametres
	urlStr : "whp",
	title : "Redirect...",
	rndEnable : true,
	inited : false,
	
	mainObject : null,	
	feedObject : null,
	
			
	//init function
	init: function ()
	{
		this.mainObject = id$('whp');

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

        if (params[0] == "signup_confirmed")
        {
            WHP.controller.navigateTo(WHP.pages.findfriends.urlStr);

            return false;
        }

        if (params[0] == "signup_confirm_failed")
        {
            WHP.controller.showErrorPage();
            return false;
        }

        if (params[0] == "changepass")
        {
            log("code = ["+params[1]+"]");
            WHP.pages.setpassword.code = params[1];
            WHP.controller.navigateTo(WHP.pages.setpassword.urlStr);
            return false;
        }

        if (params[0] == "signup_confirm_failed")
        {
            log("PW FILED!2");
            WHP.controller.showErrorPage(5);
            return false;
        }

        if (params[0] == "password_reset_failed")
        {
            log("PW FILED!");
            WHP.controller.showErrorPage(4);
            return false;
        }





        WHP.controller.navigateTo("timeline");
	},
	hide: function ()
	{
		
	},

	onAuthChange: function (_auth)
	{
	}
}



