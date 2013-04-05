aup_window_proto = function () { return {
	mainCall : "",
	inited : false,
	
	mainCont : null,
	windCont : null,
	itemsCont : null,
	itemsCanvas : null,
	
	scrollBar : null, 
	scrollBarJQ : null,
	
	scrollEnabled : true,
	clearOnShow : true,
	
	onEndFunc : null,
	
	position : {
		x : 0,
		y : 0
	},
	scrollPos : {
		x : 0,
		y : 0
	},
	scrollParams : {
		scrollBarH : 0,
		scrollBarPos : 0,
		scrollBarTotalH : 0,
		
		canvasH : 0,
		windH : 0,
		dY : 0,
		curA : 0,
		p0 : 0,
		p1 : 0
	},
	mousePos : {
		x : 0,
		y : 0,
		dX : 0,
		dY : 0,
		dnX : 0,
		dnY : 0,
		
		startScrollY : 0,
		startOffsetY : 0
	},
	
	scrollsShoHideTimer : new Timer(1000/30, 8),
	scrollsShowHideDelayTimer : new Timer(600,1),
	
	scrollDefault : true,
	
	visible : false,
	
	
	scrollDown : false,
    scroller : null,
			
	//init function
	init: function (_cont)
	{		
		//this.scrollDefault = (browser.mac) && (!browser.firefox) && (!browser.opera);
		this.scrollDefault = false;
		this.windCont = id$('notifications_template');
		
		this.windCont = $(this.windCont).clone();
		this.windCont.removeAttr('id');
		this.windCont.click(function (e){ return cancelEvent(e); });
		
		this.itemsCont = $(this.windCont).find( ".window_prot_container" ).get()[0];	
		this.itemsCanvas = $(this.windCont).find( ".window_prot_canvas" ).get()[0];
		this.topArr = $(this.windCont).find( ".window_prot_box_arrow" ).get()[0];
		
		if (this.scrollDefault)
			this.itemsCont.style['overflow-y'] = 'scroll';
		
		this.scrollBar = $(this.windCont).find( ".scrolling_bar" ).get()[0];		
		this.scrollCont = $(this.windCont).find( ".scrolling_container" ).get()[0];


		
		//se
		var mousewheelevt = (/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel";	
		var elem = this.windCont.get()[0];
		if (this.scrollDefault)
			AddHandler(elem, mousewheelevt, bind(this.scrollWindowMac,this))
		else{
			setAlpha(this.scrollBar,0);
			AddHandler(elem, mousewheelevt, bind(this.scrollWindow,this));
			
			this.scrollBarJQ = $(this.scrollBar);
			this.scrollBarJQ.mousedown(bind(this.mouseDownEvent, this));
			this.scrollBarJQ.mouseup(bind(this.mouseUpEvent, this));
			this.scrollBarJQ.mouseMoveEvent = bind(this.mouseMoveEvent, this);
			//scrollbar.mousemove(bind(this.mouseMoveEvent, this));
		}
		
		this.mainCont = $(_cont);
		this.mainCont.append(this.windCont);
		
		//timers
		this.scrollsShoHideTimer.onTimerEvent = bind(this.showHideScrolls, this);
		this.scrollsShowHideDelayTimer.onTimerEvent = bind(this.showHideScrollsDelay, this);


        //this.scroller = new iScroll(this.itemsCont);

		this.inited = true;
	},
	
	mouseDownEvent : function (e)
	{
		this.scrollDown = true;
		aup.menu.downListEvent(this.scrollBarJQ);
		
		this.mousePos.dnX = e.pageX;
		this.mousePos.dnY = e.pageY;		
		this.mousePos.x = e.pageX;
		this.mousePos.y = e.pageY;
		this.mousePos.dX = 0;
		this.mousePos.dY = 0;
		this.mousePos.startScrollY = this.scrollParams.scrollBarPos;
		this.mousePos.startOffsetY = this.scrollBarJQ.offset().top;
		
		this.showScrolls();
		this.scrollsShowHideDelayTimer.reset();
		
		
		return cancelEvent(e);
	},
	
	mouseUpEvent : function (e)
	{
		this.scrollDown = false;
		this.scrollsShowHideDelayTimer.reset();
		this.scrollsShowHideDelayTimer.start();
		return cancelEvent(e);
	},
	
	mouseMoveEvent : function (newPos)
	{
		var newX = newPos.x;
		var newY = newPos.y;
		if (this.scrollDown)
		{
			//var newX = e.pageX;
			//var newY = e.pageY;
			this.mousePos.x = newX;
			this.mousePos.y = newY;
			
			this.mousePos.dX = this.mousePos.x - this.mousePos.dnX;
			this.mousePos.dY = this.mousePos.y - this.mousePos.dnY;
			
			var fY = this.mousePos.startScrollY + this.mousePos.dY;
			fY = Math.max(0, fY);
			fY = Math.min(this.scrollParams.scrollBarTotalH - this.scrollParams.scrollBarH, fY);
			
			var normolizedP = fY/(this.scrollParams.scrollBarTotalH - this.scrollParams.scrollBarH);
			this.scrollWindowTo(-normolizedP);
			
			if ( Math.abs(-normolizedP+1) < 50/this.scrollParams.canvasH )
			{
				log("LOAD!!!");
				if (this.onEndFunc)
					this.onEndFunc();
			}
		}
	},
	
	showScrolls : function (e)
	{
		if (this.scrollParams.p1!=1)
		{
			this.scrollParams.p0 = this.scrollParams.curA;
			this.scrollParams.p1 = 1;
			this.scrollsShoHideTimer.reset();
			this.scrollsShoHideTimer.start();
		}
		
		if (this.scrollsShowHideDelayTimer.active)
		{
			this.scrollsShowHideDelayTimer.reset();
			this.scrollsShowHideDelayTimer.start();
		}
	},
	
	hideScrolls : function (e)
	{
		if (this.scrollParams.curA != 0)
		{
			this.scrollParams.p0 = this.scrollParams.curA;
			this.scrollParams.p1 = 0;
			this.scrollsShoHideTimer.reset();
			this.scrollsShoHideTimer.start();
		}
	},
	
	showHideScrolls : function (e)
	{
		var A = e.currentCount/e.repeatCount;
		this.scrollParams.curA = (1-A)*this.scrollParams.p0 + A*this.scrollParams.p1;
		setAlpha(this.scrollBar, this.scrollParams.curA);
	},
	
	showHideScrollsDelay : function (e)
	{
		this.hideScrolls();		
	},
	

	show: function ()
	{
		if (this.clearOnShow)
			this.clearCanvas();
		this.windCont.css({ display : 'block'});
		
		this.scrollEnabled = true;
		this.scrollWindowTo(0);
		this.setScrollEn(false);
		this.visible = true;
        //this.scroller.refresh();
	},
	hide: function ()
	{
		this.windCont.css({ display : 'none'});
		this.visible = false;
	},
	
	
	setPos: function (_x, _y)
	{
		this.position.x = _x;
		this.position.y = _y;
		
		var sizeX = this.windCont.width();
		
		this.windCont.css({ left : _x - sizeX*0.5+'px', top : _y+16+'px'});
	},
	
	
	setSize: function (_w, _h)
	{	
		this.windCont.css({ width : _w+'px', height : _h+'px'});
		this.topArr.style.left = (_w-34)*0.5 + 'px';	
		
		this.setPos(this.position.x, this.position.y);
	},
	
	setH: function(_h)
	{
		this.windCont.css({ height : _h+'px'});		
	},
	
	setW: function(_w)
	{
		this.windCont.css({ width : _w+'px'});	
		this.topArr.style.left = (_w-34)*0.5 + 'px';		
	},
	
	setScrollEn : function (_enable)
	{
		this.scrollEnabled = _enable;
		if (this.scrollEnabled)
		{
			if (!this.scrollDefault)
				this.scrollCont.style.display = "block";
		}else{
			this.scrollCont.style.display = "none";
		}
	},
	
	
	scrollWindow: function(e)
	{
		
		if (this.scrollEnabled)
		{
			var evt=window.event || e //equalize event object
			var delta=evt.detail? evt.detail*(-120) : evt.wheelDelta;
			
			if (browser.firefox || browser.opera)
				delta = delta/10;
			
			
			var windH = this.windCont.height();
			var canvasH = this.itemsCanvas.offsetHeight;	
			delta = delta*0.5/canvasH;
			var pos = Math.min(this.itemsCanvas.offsetTop/Math.max(1, (canvasH-windH)),0);
			var fPos = pos + delta;
			
			
			this.scrollWindowTo(fPos);
			
			if ( Math.abs(fPos+1) < 50/canvasH)
			{
				if (this.onEndFunc)
					this.onEndFunc();
			}
			this.showScrolls();
			this.scrollsShowHideDelayTimer.reset();
			this.scrollsShowHideDelayTimer.start();
		}
		return cancelEvent(e);
	},
	
	scrollWindowMac: function(e)
	{
		
		if (this.scrollEnabled)
		{
			var evt=window.event || e //equalize event object
			var delta=evt.detail? evt.detail*(-120) : evt.wheelDelta;
			
			if (browser.firefox || browser.opera)
				delta = delta/10;
			
			
			var windH = this.windCont.height();
			var canvasH = this.itemsCanvas.offsetHeight;	
			delta = delta*0.5/canvasH;
			var pos = Math.max(this.itemsCont.scrollTop/Math.max(1, (canvasH-windH)),0);
			var fPos = pos - delta;
			fPos = Math.min(1, fPos);
			
			if ( Math.abs(fPos-1) < 50/canvasH)
			{
				if (this.onEndFunc)
					this.onEndFunc();
				if ( Math.abs(fPos-1) < 1/canvasH)
				{
					this.itemsCont.scrollTop = canvasH;
					return cancelEvent(e);
				}
			}
		}else
			return cancelEvent(e);
	},
	
	scrollWindowTo: function(_pos)
	{
		if (this.scrollEnabled)
		{
			var fPos = Math.min(0, _pos);
			fPos = Math.max(-1, fPos);	
			var canvasH = this.itemsCanvas.offsetHeight;	
			var windH = this.windCont.height();
			
			
			if (browser.ie)
				var stepH = 0
			else
				var stepH = 0;
			var newH = Math.min((windH-stepH)/canvasH*(windH-stepH), (windH-stepH));
			newH = Math.max(14, newH);

            //log("["+fPos+"] ["+windH+"] ["+stepH+"] ["+ newH+"]");
			var posS = -fPos*((windH-stepH) - newH);
			this.scrollBar.style.height = parseInt(newH)+'px';
			this.scrollBar.style.top = parseInt(posS)+'px';
			
			
			
			var topPos = 0;
			
			if (!this.scrollDefault)
			{
				topPos = -fPos*Math.max(0, (canvasH-windH));
				this.itemsCanvas.style.top = -topPos + 'px';
			}else{
				topPos = -fPos*Math.max(0, (canvasH-windH));
				this.itemsCont.scrollTop = topPos;
			}
			
			this.scrollPos.x = 0
			this.scrollPos.y = fPos;

			this.calculateScrollParams();
		}
	},
	
	calculateScrollParams : function()
	{
		this.scrollParams.canvasH = $(this.itemsCanvas).height();
		this.scrollParams.windH = this.windCont.height();
		
		var pos = 0;
		if (!this.scrollDefault)
		{
			pos = parseInt(this.itemsCanvas.style.top);
		}else{
			pos = parseInt(this.itemsCont.scrollTop);
		}
		this.scrollParams.dY = pos;
		
		var windH = this.scrollParams.windH;
		windH = Math.min(windH/this.scrollParams.canvasH*windH, windH);
		windH = Math.max(14, windH);
		this.scrollParams.scrollBarH = windH;
		this.scrollParams.scrollBarPos = parseInt(this.scrollBar.style.top);
		this.scrollParams.scrollBarTotalH = this.scrollParams.windH;

		var lastH = this.mousePos.dnY - this.mousePos.startOffsetY ;
		if (lastH>this.scrollParams.scrollBarH)
		{
			log("outOfScroll");
		}
	},
	
	setScrollBar: function()
	{
        var canvasH = $(this.itemsCanvas).height();
        var windH = this.windCont.height();
        var stepH = 0;


		var pos = Math.max(this.itemsCont.scrollTop/Math.max(1, (canvasH-windH)),0);
		var fPos = Math.min(1, pos);
		fPos = Math.max(0, fPos);


		var newH = Math.min((windH-stepH)/canvasH*(windH-stepH), (windH-stepH));
		newH = Math.max(14, newH);
			
		var posS = -fPos*((windH-stepH) - newH);
		this.scrollBar.style.height = parseInt(newH)+'px';
		this.scrollBar.style.top = parseInt(posS)+'px';
	},
	
	clearCanvas : function (e)
	{
		//clearcanvas
		while (this.itemsCanvas.hasChildNodes()) {
			this.itemsCanvas.removeChild(this.itemsCanvas.lastChild);
		}
	}	
}
}



