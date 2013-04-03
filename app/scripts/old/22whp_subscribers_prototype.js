whp_subscribers_proto = function () { return {
	//controller parametres
	inited : false,
	
	//main objects
	mainObject  : null,
	mainCont : null,
	mainCanvas : null, 
	nameLabel : null,
	loadingBar : null,
	
	
	//templates
	templElement : null,
	curOffset : 0,
	curTotal : 0,
	elementsLimit : 200,
	
	//cur variables
	elements : [],
	onSubscribe : null,
	onDeSubscribe : null,
		
	
	//data loading parametres
	controlUrl : "",	
	loading : false,
	initLoad : false,
	
	controlCanvas : true,
	changeUrl : true,

    emptyElement : null,
    clearOnLoad : false,

    onDataLoaded : null,
	

	//init function
	init: function (_cont)
	{
		this.mainObject = $('#subscribers_template');
		this.mainObject = $(this.mainObject).clone();
		this.mainObject.removeAttr('id');
		this.mainObject.css({display : 'none'});



		
		//templates
		this.templElement = $('#user_follower_template').clone();
		this.templElement.removeAttr('id');
		
		this.loadingBar = id$("notifications_loading_tab" );
		this.loadingBar = $(this.loadingBar).clone();
		this.loadingBar.css({ display : 'none', width : 100+"%"});


        this.emptyElement = $('#feed_empty_template_medium').clone();
        this.emptyElement.removeAttr("id");
	
		//main
		this.mainCont = $(_cont);
		this.mainCont.append(this.mainObject);
		
		//canvas
		this.nameLabel = this.mainObject.find(".feed_name");
		this.mainCanvas = this.mainObject.find(".subscribers_content_box");

		
		//add scroll event for end check
		var mousewheelevt = (/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel";	
		AddHandler(document, mousewheelevt, bind(this.scrollEvent,this));
		
		
		this.inited = true;
	},

    restore : function()
    {
        this.active = false;

    },

    refresh : function()
    {
        this.clearOnLoad = true;
        this.curOffset = 0;
        this.curTotal = 0;
        this.initLoad = true;
        this.loadElements();
    },
	
	show: function()
	{
		this.active = true;
		this.curOffset = 0;
		this.curTotal = 0;
		
		this.clearCanvas();
		this.initLoad = true;
		
		this.mainCanvas.append( this.loadingBar );
		this.loadElements();
	},
	
	hide: function()
	{
		this.active = false;
	},

    hasElement : function(_id)
    {
        var has1 = false;

        for (var i=0; i< this.elements.length;i++)
        {
            if (this.elements[i].id == _id)
            {
                has1 = true;
                break;
            }
        }

        return has1;
    },

	setName: function(str)
	{
		this.nameLabel.text(str);
	},
	
	loadElements: function()
	{
		if (this.loading)
			return false;
			
		if ((this.curOffset >= this.curTotal) && (this.curOffset!=0))
			return false;
			
		if (!this.initLoad && (this.curTotal==0))
			return false;
		
		if ((!this.initLoad) && (this.controlCanvas) && (this.curOffset==0))
			WHP.controller.scrollToPos(0,0);
			
		if (this.mainObject.css('display') != 'block')
			this.mainObject.css({display : 'block'});
			
		//log("Load = ["+this.curOffset+"] ["+this.elementsLimit+"]");
			
		this.loading = true;
		this.jqxhr = $.ajax({
			  url: this.controlUrl,
			  timeout : WHP.netTimeOut,
			  data : { offset : this.curOffset, limit : this.elementsLimit, r : Math.random() },
			  success: bind(this.onData, this),
			  error: bind(this.onError, this)
		});
		this.loadingBar.css({ display : 'block'});
        this.emptyElement.remove();
	},
	
	onData: function(response)
	{
		this.loading = false;

        if (!this.active)
            return false;

		var resp = getObjectJson(response);	
		if (resp.error)
		{
			log("WHP/timeline_prot : error while loading page data! Err =["+response+"]");
			if (!WHP.errors.hasNetError(resp))
			{
				WHP.controller.showErrorPage();
			}
			return false;
		}

		//log("DATA");
        if (this.clearOnLoad)
        {
            this.clearOnLoad = false;
            this.clearCanvas();
        }
		
		var respC = resp.followers;
		if (!respC)
			respC = resp.followings;
		
		this.curTotal = respC.total;

        if (this.onDataLoaded)
            this.onDataLoaded(resp);

		this.curOffset = this.curOffset + respC.list.length;
		
		
			
		
		
		this.addContent(resp);

        if (this.curTotal == 0)
            this.mainCanvas.append(this.emptyElement);

		this.loadingBar.insertAfter(this.elements[this.elements.length-1]);
		if (this.curOffset >= this.curTotal)
			this.loadingBar.css({ display : 'none'});
			
		//WHP.resetH();
		this.initLoad = false;
	},
	
	onError : function(response)
	{
		var status = response['status'];
		//log("error loading");
		this.loadingBar.css({ display : 'none'});
		this.loading = false;
	},
	
	addContent : function(resp)
	{
		var arr = resp.followings;
		if (!arr)
			arr = resp.followers;	
			
		for (var i=0; i< arr.list.length;i++)
		{
            if (!this.hasElement(arr.list[i].id))
            {
                var a = this.newUser(arr.list[i]);
                this.mainCanvas.append(a);
                this.elements.push (a);
            }
		}
		addIntelloLinks(this.mainCanvas);
	},
	
	newUser: function(resp)
	{
		var element_div = this.templElement.clone();
		element_div.name = element_div.find(".followers_name");
		element_div.followButton = element_div.find(".unfollow_button");
		element_div.buttonLabl = element_div.find(".unfollow_button_label");
		
		//log("user = ["+resp.id+"] follow = ["+resp.follow+"]");
		element_div.uid = resp.id;
		element_div.follow = resp.follow;		
		element_div.parent = this;
        element_div.activeNet = false;
		element_div.followButton.click(bind(this.followClick,element_div));
		
		element_div.name.attr('href', WHP.links.getUserProfileLink( element_div.uid ));
		
		element_div.setButtonLabel = bind(this.setButtonLabel,element_div);
		element_div.followResponse = bind(this.followResponse,element_div);
		element_div.followError = bind(this.followError,element_div);
		element_div.setFollowersLabels = bind(this.setFollowersLabels,this);
		
		element_div.setButtonLabel();
		element_div.name.text(resp.name);
		
		return element_div;
	},
	
	setButtonLabel: function (_q)
	{
		var labl = this.buttonLabl;
		
		if (WHP.auth.status)
		{
			//log(" ids = ["+this.uid+"] ["+WHP.auth.status.id+"]");
			if (this.uid == WHP.auth.status.id)
			{
				this.followButton.css({ visibility : 'hidden' });
			}else{
				this.followButton.css({ visibility : 'visible' });
				if (this.follow)
				{
					labl.html("Remove")
					setClass(this.followButton, "unfollow_button");
				}else{
					labl.html("Subscribe");
					setClass(this.followButton, "unfollowb_button");
				}
			}
			//this.followButton.css({ visibility : 'visible' });
		}else{
			this.followButton.css({ visibility : 'visible' });
			labl.html("Subscribe");
			setClass(this.followButton, "unfollowb_button");
			//this.followButton.css({ visibility : 'hidden' });
		}		
	},
	
	setFollowersLabels: function(_a)
	{
		if (this.onSubscribe)
			this.onSubscribe(_a);
	},
	
	followClick: function()
	{
        if (this.activeNet)
            return false;

		if (!WHP.auth.status)
		{
            WHP.loginMenus.showLoginMenu();
			return false;	
		}
		
		var call = WHP.netcalls.followCall;
		
		if (this.follow)
        {
			call = WHP.netcalls.unfollowCall;
        }else{
            WHP.opengraph.makeFolowAction(this.uid);
        }

        this.activeNet = true;
		this.buttonLabl.html("<div class='button_loading'></div>");		
		$.ajax({
			  url: call ,
              data : { user : this.uid, r : Math.random() },
			  timeout : WHP.netTimeOut,
			  success: bind(this.followResponse, this),
			  error: bind(this.followError, this)
		});
	},
	
	followResponse: function(response)
	{
        this.activeNet = false;
		var resp = getObjectJson(response);			
		if (resp.error)
		{
			WHP.errors.hasNetError(resp);
			return false;
		}	
		if (resp.status == "OK")
		{
			this.follow = !this.follow;
			if (this.follow)
				this.setFollowersLabels( 1)
			else
				this.setFollowersLabels(-1);
			this.setButtonLabel();
		}
	},
	
	followError: function(e)
	{
        this.activeNet = false;
		log("Follow error");
	},
	
	clearCanvas: function()
	{
		//remove pages
		while(this.elements.length>0)
		{
			var a = this.elements.pop();
			a.remove();
		}
	},
	
	scrollEvent: function(e)
	{
		if (!this.active)
			return false;
			
		var sensitivity = 50;
		if ($(document).scrollTop()+WHP.screenH-$(document).height()>-sensitivity)
		{
			//log("end");	
			this.loadElements();
		}
	},

    removeElement : function(_id)
    {
        var elem = null;
        log("start detection");
        for (var i = 0; i< this.elements.length; i++)
        {
           log("e.id = ["+this.elements[i].uid+"] ["+_id+"]");
           if (this.elements[i].uid == _id)
           {
                //remove
               var a = this.elements[i];
               a.remove();
               this.elements.splice(i,1);
               break;
           }
        }

        //WHP.resetH();

        return true;
    },

    addElement : function(_elem)
    {
        log("Add elem");
        var element_div = this.templElement.clone();
        element_div.name = element_div.find(".followers_name");
        element_div.followButton = element_div.find(".unfollow_button");
        element_div.buttonLabl = element_div.find(".unfollow_button_label");

        //log("user = ["+resp.id+"] follow = ["+resp.follow+"]");
        element_div.uid = _elem.uid;
        element_div.follow = true;
        element_div.parent = this;
        element_div.followButton.click(bind(this.followClick,element_div));

        element_div.name.attr('href', WHP.links.getUserProfileLink( element_div.uid ));

        element_div.setButtonLabel = bind(this.setButtonLabel,element_div);
        element_div.followResponse = bind(this.followResponse,element_div);
        element_div.followError = bind(this.followError,element_div);
        element_div.setFollowersLabels = bind(this.setFollowersLabels,this);

        element_div.setButtonLabel();
        element_div.name.text(_elem.username);
        addIntelloLinks(element_div);

        this.emptyElement.remove();


        this.curTotal++;
        this.mainCanvas.prepend( element_div );
        this.elements.push ( element_div );
    }
}
}



