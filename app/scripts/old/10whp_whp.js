aup.pages.aup = {
	//controller parametres
	urlStr : "aup",
	title : "Redirect...",
	rndEnable : true,
	inited : false,
	
	mainObject : null,	
	feedObject : null,
	
			
	//init function
	init: function ()
	{
		this.mainObject = id$('aup');

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
            aup.controller.navigateTo(aup.pages.findfriends.urlStr);

            return false;
        }

        if (params[0] == "signup_confirm_failed")
        {
            aup.controller.showErrorPage();
            return false;
        }

        if (params[0] == "changepass")
        {
            log("code = ["+params[1]+"]");
            aup.pages.setpassword.code = params[1];
            aup.controller.navigateTo(aup.pages.setpassword.urlStr);
            return false;
        }

        if (params[0] == "signup_confirm_failed")
        {
            log("PW FILED!2");
            aup.controller.showErrorPage(5);
            return false;
        }

        if (params[0] == "password_reset_failed")
        {
            log("PW FILED!");
            aup.controller.showErrorPage(4);
            return false;
        }





        aup.controller.navigateTo("timeline");
	},
	hide: function ()
	{
		
	},

	onAuthChange: function (_auth)
	{
	}
}



