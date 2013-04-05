aup_newfaces_proto = function () { return {
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
	elementsLimit : 666,
	
	//cur variables
	elements : [],
    sizeE : 0,
	onSubscribe : null,
	onDeSubscribe : null,
    onDataLoad : null,
		
	
	//data loading parametres
	controlUrl : "",	
	loading : false,
	initLoad : false,
	
	controlCanvas : true,
	changeUrl : true,
	

	//init function
	init: function (_cont)
	{
		this.mainObject = $('#subscribers_template');
		this.mainObject = $(this.mainObject).clone();
		this.mainObject.removeAttr('id');
		this.mainObject.css({display : 'none'});
		
		//templates
		this.templElement = $('#user_followers_template').clone();
		this.templElement.removeAttr('id');
		
		this.loadingBar = id$("notifications_loading_tab" );
		this.loadingBar = $(this.loadingBar).clone();
		this.loadingBar.css({ display : 'none', width : 100+"%"});
	
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
	
	show: function()
	{
		this.active = true;
		this.curOffset = 0;
		this.curTotal = 0;
		
		this.clearCanvas();
		this.initLoad = true;

        this.mainObject.css({display : 'none'});
		this.mainCanvas.append( this.loadingBar );
		this.loadElements();
	},

    restore : function()
    {
        this.active = true;
    },
	
	hide: function()
	{
		this.active = false;
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
			aup.controller.scrollToPos(0,0);

			
		log("Load = ["+this.curOffset+"] ["+this.elementsLimit+"]");
			
		this.loading = true;
		this.jqxhr = $.ajax({
			  url: this.controlUrl,
			  timeout : aup.netTimeOut,
			  data : { offset : this.curOffset, limit : this.elementsLimit, r : Math.random() },
			  success: bind(this.onData, this),
			  error: bind(this.onError, this)
		});
		this.loadingBar.css({ display : 'block'});
	},
	
	onData: function(response)
	{
		this.loading = false;

        if (!this.active)
            return false;


		var resp = getObjectJson(response);	
		if (resp.error)
		{
			log("aup/timeline_prot : error while loading page data! Err =["+response+"]");
			if (!aup.errors.hasNetError(resp))
			{
				aup.controller.showErrorPage();
			}
			return false;
		}
		//log("DATA");
		
		var respC = resp.newfaces;
		
		this.curTotal = respC.total;

        if (this.curTotal>0)
            this.mainObject.css({display : 'block'})
        else
            this.mainObject.css({display : 'none'});

		this.curOffset = this.curOffset + respC.list.length;
		
			
		//dataload
		if (this.onDataLoad)
            this.onDataLoad(resp);

		this.addContent(resp);
		
		this.loadingBar.insertAfter(this.elements[this.elements.length-1]);
		if (this.curOffset >= this.curTotal)
			this.loadingBar.css({ display : 'none'});
			
		//aup.resetH();
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
		var arr = resp.newfaces;

        for (var i=0; i< arr.list.length;i++)
		{
			var a = this.newUser(arr.list[i]);
			this.mainCanvas.append(a);
			this.elements.push (a);
		}
		addIntelloLinks(this.mainCanvas);
	},
	
	newUser: function(resp)
	{
		var element_div = this.templElement.clone();
		element_div.name = element_div.find(".followers_name");
        element_div.resp = resp;

		element_div.followButton = element_div.find(".unfollow_button");
		element_div.buttonLabl = element_div.followButton.find(".unfollow_button_label");

        element_div.okButton = element_div.find(".unfollowb_button");
        element_div.okbuttonLabl = element_div.okButton.find(".unfollow_button_label");
		
		//log("user = ["+resp.id+"] follow = ["+resp.follow+"]");
		element_div.uid = resp.id;
		element_div.follow = null;
		element_div.parent = this;
        element_div.username = resp.name;
        element_div.activeNet = false;

		element_div.followButton.click(bind(this.unfollowClick,element_div));
        element_div.okButton.click(bind(this.followClick,element_div));
		
		element_div.name.attr('href', aup.links.getUserProfileLink( element_div.uid ));
		
		element_div.setButtonLabel = bind(this.setButtonLabel,element_div);
		element_div.followResponse = bind(this.followResponse,element_div);
		element_div.followError = bind(this.followError,element_div);
		
		element_div.setButtonLabel();
		element_div.name.text(resp.name);
		
		return element_div;
	},

	
	setButtonLabel: function (_q)
	{
        this.buttonLabl.html("Remove")
        setClass(this.followButton, "unfollow_button");

        this.okbuttonLabl.html("Ok")
        setClass(this.okButton, "unfollowb_button");
    },

    unfollowClick: function()
    {
        call = aup.netcalls.unfollowCall;
        this.follow = false;

        this.buttonLabl.html("<div class='button_loading'></div>");
        $.ajax({
            url: call,
            data : { r :Math.random(), user : this.uid },
            timeout : aup.netTimeOut,
            success: bind(this.followResponse, this),
            error: bind(this.followError, this)
        });
    },


	followClick: function()
	{
        if (this.activeNet)
            return false;

		var call = aup.netcalls.followCall;
        this.follow = true;
        this.activeNet = true;
		this.okbuttonLabl.html("<div class='button_loading'></div>");
        aup.opengraph.makeFolowAction(this.uid);
		$.ajax({
			  url: call,
              data : { r :Math.random(), user : this.uid },
			  timeout : aup.netTimeOut,
			  success: bind(this.followResponse, this),
			  error: bind(this.followError, this)
		});
	},
	
	followResponse: function(response)
	{
        this.activeNet = false;
        var e = { target : this, follow : this.follow };
        if (this.follow)
        {
            if (this.parent.onSubscribe)
                this.parent.onSubscribe(e,this);
        }else{
            if (this.parent.onDeSubscribe)
                this.parent.onDeSubscribe(e,this);
        }


        this.parent.curTotal--;
        if (this.parent.curTotal==0)
        {
            this.parent.mainObject.css({display : 'none'});
        }
		this.remove();
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
		if ($(document).scrollTop()+aup.screenH-$(document).height()>-sensitivity)
		{
			//log("end");	
			this.loadElements();
		}
	}
}
}





