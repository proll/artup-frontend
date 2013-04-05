aup.pages.error404 = {
	urlStr : "404",	//temp name for error page
	title : "",
	rndEnable : true,
	inited : false,
	mainObject : null,

    errorCont : null,
    errorHolder : null,


    fm : null,
		
	init: function ()
	{
		this.mainObject = id$('404');
		this.inited = true;

        this.errorCont = $(this.mainObject).find(".error_container");
        this.errorHolder = $(this.mainObject).find(".error_holder");

        this.fm = $(this.mainObject).find(".failman1");
    },

    onResizeEvent : function(e)
    {
        var w1 = this.errorHolder.width();
        var h1 = this.errorHolder.height();

        var w2 = 996;
        var h2 = Math.max(0,aup.screenHl-120);

        this.errorHolder.css({ left : 0.5*(w2-w1)+'px', top : Math.max(0, 0.5*(h2-h1))+'px'});
    },

    setView : function(_message)
    {
        if (_message == 1)
        {
            this.fm.attr("src", "/gui/failman.png?aup20");
        }else if (_message == 2){
            this.fm.attr("src", "/gui/failman2.png?aup20");
        }else if (_message == 3){
            this.fm.attr("src", "/gui/failman_4.png?aup20");
        }else if (_message == 4){
            this.fm.attr("src", "/gui/failman_5.png?aup20");
        }

        else{
            this.fm.attr("src", "/gui/failman.png?aup20");
        }
    },

	show: function (_q)
	{
		//_q - query string
		aup.controller.showCanvas();
		aup.controller.setTitle();
        this.onResizeEvent();

	}
}




