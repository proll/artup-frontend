whp_feed_proto = function () { return {
	//controller parametres
	inited : false,
	
	
	//data loading parametres
	controlUrl : "",
	
	//url options
	urlPrefix : "",
	changeUrl : false,
	
	//canvas control
	controlCanvas : true,
	scrollCanvas : true,
    useGalleryPhoto : false,
	
	emptyElement : null,

    hidePaginOnNull : true,
	
	
	
	curOffset : 0,
	curTotal : 0,
	imageLimit : 30,
	images : [],
	
	//html elements
	mainCont : null,
	mainObject : null,
	photoContainer : null,
		
	pagingContainer : null,
	paginL : null,
	paginR : null,
	
	//template id/classes
	photoTemplate : null,
	
	//localvars	
	scrollTopBackup : 0,
	
	onLoadCall : null,
	
	show1 : false,
	
	curUrl : "",

    loadingBar : null,
	
			
	//init function
	init: function (_cont)
	{
		this.mainObject = $('#feed_template');
		this.mainObject = $(this.mainObject).clone();
		this.mainObject.removeAttr('id');
		
		
		this.emptyElement = $('#feed_empty_template_medium');
		this.emptyElement = this.emptyElement.clone();
		
		
		this.photoContainer = $(this.mainObject).find( ".feed_photo_box" );		
		this.pagingContainer = $(this.mainObject).find( ".feed_paging" );
		
		this.paginL = $(this.pagingContainer).find( ".std_paging_left" );
		this.paginL.click(bind(function () { this.getPage(-1); },this));
		this.paginR = $(this.pagingContainer).find( ".std_paging_right" );
		this.paginR.click(bind(function () { this.getPage(1); },this));
		
		
		this.photoTemplate = $("#feed_pageimage");
		this.photoTemplate = $(this.photoTemplate).clone();
		this.photoTemplate.removeAttr('id');
		
		this.mainCont = $(_cont);
		this.mainCont.append(this.mainObject);
		
		$(this.photoContainer).append(this.emptyElement);
		$(this.emptyElement).css({display : 'none' });


        this.loadingBar = $("#notifications_loading_tab").clone().removeAttr('id');

        this.loadingBar.css({ display : 'block', margin : 'auto', width: 50+'px'});



		this.inited = true;
	},

	saveScrollPos : function ()
	{
		this.scrollTopBackup = (document.all ? document.scrollTop : window.pageYOffset);		
	},
	
	restoreScrollPos : function ()
	{
		window.scroll(0,this.scrollTopBackup);		
	},
	
	//std for each module control functions
    restore : function()
    {


    },

	show: function (_off)
	{
		//clear canvas
		this.show1 = true;
		this.cleanUp(_off);
        this.photoContainer.append(this.loadingBar).css({ display : 'block'});
		this.loadPhotoPack();
		WHP.controller.setTitle();
	},
	
	hide: function()
	{
		
	},

    restore : function()
    {

    },
	
	cleanUp : function (_off)
	{
		this.clearCanvas();
		this.curOffset = _off;
		this.curTotal = _off;
	},
		
	
	//loads data function
	loadPhotoPack: function ()
	{
		//clear canvas
		this.clearCanvas();		
		var pageParam = parseInt(this.curOffset/this.imageLimit);
		if (pageParam==0)
			pageParam = ""
		else
			pageParam = pageParam +"/";
			
			
		if (this.changeUrl)
		{
			var urla = this.urlPrefix+"/"+pageParam;
			if (!this.show1)
				setLink( "http://" + WHP.domain + "/" + urla);
		}
		
		this.curUrl = this.controlUrl;
		var url = this.controlUrl;
		//donot duplicate? use 1 instance?
		
		$.ajax({
			  url: this.controlUrl,
			  timeout : WHP.netTimeOut,
			  data : { offset : this.curOffset, limit : this.imageLimit, r :  Math.random() },
			  success: bind(function (r,s,x){ var curl = url; this.onData(r,s,x, curl); }, this),
			  error: bind(this.onError, this)
			});
	},
	
	onData : function (response, status, xhr, url)
	{
		// is it the last call?
		if (this.curUrl != url)		
			return false;
		
		this.clearCanvas();		
		this.show1 = false;
		
			
		var resp = getObjectJson(response);	
		if (resp.error)
		{
			log("WHP/feed_prot : error while loading page data! Err =["+response+"]");
			if (!WHP.errors.hasNetError(resp))
			{
				WHP.controller.showErrorPage();
			}
			return false;
		}
		//generate new

		if (this.onLoadCall)
			this.onLoadCall(resp);
		
				
		var respCont = resp.photos;
		if (!respCont)
			respCont = resp.photobox;
		if (!respCont)
			respCont = resp.feed;
		
		this.curTotal = respCont.total;


        this.loadingBar.remove();
		for (var i=0; i<respCont.list.length; i++)
		{
			var obj = respCont.list[i];
			var element_div = this.newImage(obj);
            element_div.N = new Number(i);
			if (i % 3 == 2)
				element_div.css({ 'margin-right' : '0px' });
			//element_div.likesLCD.text( i+" "+(i % 3 == 2));
			$(this.photoContainer).append(element_div);
			this.images.push(element_div);	
		}	
		addIntelloLinks(this.photoContainer);	
		
		if (this.images.length==0)
		{
			$(this.photoContainer).append(this.emptyElement);
			$(this.emptyElement).css({display : 'block' });
		}else{
			$(this.emptyElement).css({display : 'none' });
		}
		
		if (this.controlCanvas)
			WHP.controller.showCanvas()
		else
			this.mainCont.css({ display : 'block' });
			
		if (this.scrollCanvas)
			window.scroll(0,0);
		
		this.checkPagingState();	
		//WHP.resetH();
	},

    getPhotoPage : function()
    {
        WHP.pages.photo.imagesList.setContentLink(this.response, this.parent.curOffset + this.N, this.parent.controlUrl);
    },

	newImage: function(resp)
	{
		//log("new image = ["+resp.like+"] ["+resp.photo_id+"] by ["+resp.user_name+"]");
		var element_div = this.photoTemplate.clone();
		element_div.image = element_div.find(".img_template_like_212_img");
		element_div.image_link = element_div.find(".timeline_a_ava_holder");
		element_div.image_cont = element_div.find(".img_template_like_212_img_cont");
		element_div.likesLCD = element_div.find(".img_template_like_212_img_label");
		element_div.likesLCD_cont = element_div.find(".img_template_like_212_img_label");
        element_div.parent = this;
        element_div.response = resp;
		
		element_div.like = resp.like;
		element_div.photo_id = resp.id;
		element_div.uid = resp.uid;

        if (resp.user)
		    element_div.user_name = resp.user.name;
		
		element_div.likesLCD.text( NformatMin( element_div.like ) );
		//if (element_div.like==0)
		{
			element_div.likesLCD_cont = element_div.find(".img_template_like_212_img_like");
			element_div.likesLCD_cont.css({ display : 'none' });
		}


        if (this.useGalleryPhoto)
        {
            element_div.image_link.click(bind(this.getPhotoPage, element_div));
        }
		element_div.image_link.attr('href', WHP.links.getPhotoLink( resp.id));


        setImageOnload(element_div.image, resp['i212x212'], element_div.image_cont);
		
		return element_div;
	},
	
	//error callback
	onError : function (response, status, xhr)
	{
		log("WHP/feed_prot/ : Error while loading actual data! Err = ["+response+"]");
		WHP.controller.showErrorPage();
	},	
	
	getPage : function (_a)
	{
		if (this.controlCanvas)
			WHP.controller.hideCanvas()
		else
			this.mainCont.css({ display : 'none' });
			
		
		if (_a>0)
			this.curOffset = this.curOffset+this.imageLimit
		else
			this.curOffset = this.curOffset-this.imageLimit;	
					
		this.loadPhotoPack();
	},	
	
	//clears photos container
	clearCanvas : function ()
	{
		while(this.images.length>0)
		{
			var a = this.images.pop();
			a.remove();
		}
        if (this.hidePaginOnNull)
		    this.pagingContainer.css({display : 'none'});

		$(this.paginR).addClass("hidden");
		$(this.paginL).addClass("hidden");
		$(this.emptyElement).css({display : 'none'});
	},
	
	//checks forward/backward state
	checkPagingState: function ()
	{
		

		
		if (this.curTotal <= this.imageLimit)
		{
            this.paginL.addClass("hidden");
            this.paginR.addClass("hidden");
            if (this.hidePaginOnNull)
                this.pagingContainer.css({ display : 'none'});
		}else{
            if (this.hidePaginOnNull)
                this.pagingContainer.css({ display : ''});
			if (this.curOffset==0)
				this.paginL.addClass("hidden");
			else
				this.paginL.removeClass("hidden");
			
			if (this.curOffset >= this.curTotal-this.imageLimit )
				this.paginR.addClass("hidden")
			else
				this.paginR.removeClass("hidden");
		}
	}
}
}




