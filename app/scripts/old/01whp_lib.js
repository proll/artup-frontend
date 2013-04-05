function bind(fun, scope) {
	return function(args) {
	   return fun.call(scope, args);
	};
}

function AddHandler(target,eventName,handlerName,_this)
{
	if (target.addEventListener)
		target.addEventListener(eventName, bind(handlerName,_this), false);
	else if (target.attachEvent)
		target.attachEvent("on" + eventName, bind(handlerName,_this));	
}

function NformatMin(_N)
{
	var ret = _N+"";
	if (_N>=1000)
	{
		if (_N<100000)
		{
			if (_N<10000)
				ret = Math.ceil(_N/100)/10+"k";
			else
				ret = Math.ceil(_N/1000)+"k";
		}else{
			ret = Math.ceil(_N/1000000)+"m";
		}
	}
	
	return ret;	
}


//direct handlers
function AddHandlerDirect(target,eventName,handlerName)
{
	if (target.addEventListener)
		target.addEventListener(eventName,handlerName, false);
	else if (target.attachEvent)
		target.attachEvent("on" + eventName, handlerName);	
}
function removeHandlerDirect(target,eventName,handlerName)
{
	if (target.removeEventListener)
		target.removeEventListener(eventName, handlerName, false);
	else if (target.detachEvent)
		target.detachEvent("on" + eventName, handlerName);	
}

function addIntelloLink(_obj)
{
	if ((_obj.hasIntelloLinker != true) && (_obj["href"].indexOf("mailto:")==-1))
	{
		_obj.hasIntelloLinker = true;
		_obj.intelloLinker = bind(function(_e){
			log("CLICK");
			var _link = this["href"];
			var _target = this["target"];
			if ((_link.indexOf(window.location.hostname)==-1) && ((_link.indexOf("http://")>-1) || (_link.indexOf("https://")>-1)))
			{
				window.open(_link,_target);
				return cancelEvent(e);
			}


			var e = window.event? event : _e;
			var ctrlK = e.metaKey || e.ctrlKey;
			if (ctrlK)
			{
				window.open(_link,'_newtab');
				return cancelEvent(e);			
			}else{
				if (_link.length>0)
				{
					aup.menu.htmlClick();
					aup.controller.navigateTo(_link);
				}
				return cancelEvent(e);
			}			
		}, _obj);
		AddHandlerDirect(_obj,"click", _obj.intelloLinker);	
	}
}
function addIntelloLinks(_obj)
{
	var ahrefs = $(_obj)[0].getElementsByTagName("a");	
	for (var i=0; i<ahrefs.length; i++)
	{
		addIntelloLink(ahrefs[i]);
	}
}

function cancelEvent(e) {
	e = e || window.event;
	if (!e) return false;
	e = e.originalEvent || e;
	if (e.preventDefault) e.preventDefault();
	if (e.stopPropagation) e.stopPropagation();
	e.cancelBubble = true;
	e.returnValue = false;
	return false;
}


function validateEmail(email) {
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}

function setAlpha(_target, _value)
{
	var val = Number(_value);
	if (isNaN(val))
		val = 0;
	val = Math.max(0, Math.min(1.0, _value));
	val = parseInt(val*100)/100;

	if (val<1.0)
		$(_target).css({ opacity : val})
	else
		$(_target).css({ opacity : ""});
}



function elementOffset(_elem)
{
	var off = $(_elem).offset();
	if (browser.ie)
	{
		off = $(_elem).position();
	}

	return off;
}


function getScrollTop()
{
	var top = $(window).scrollTop();
	if (browser.ie)
		top = $('html').scrollTop();
	return top;
}


function extend(out, src) {
	for (var property in src) {
		out[property] = src[property];
	}
	return out;
}

function create(obj1, obj2) {
	var out = {};
	out = extend(out, obj1);
	out = extend(out, obj2);
	return out;
}

function isArray(obj) {
	return obj && typeof obj == 'object' && obj.splice && obj.join;
}

function log(msg) {

	if (!browser.ie)
	{
		console.log(msg);
	}else{
		return false;
		var doc = document.getElementById("console_ie");
		if (doc)
		{
			doc.style.display = "block";
			doc.innerHTML = doc.innerHTML+"<br/>"+msg;
		}
		doc.scrollTop =  doc.scrollHeight;
	}
}


function setCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}


function setCookieMin(name,value,minutes) {
	if (minutes) {
		var date = new Date();
		date.setTime(date.getTime()+(minutes*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}


function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function delCookie(name) {
	setCookie(name,"",-1);
}


function setBkPosition(_elem, _x, _y)
{
	if (browser.ie)
	{
		_elem.style.backgroundPositionX =  _x+"px";
		_elem.style.backgroundPositionY =  _y+"px";
	}else{
		_elem.style.backgroundPosition =  _x+"px "+_y+"px";
	}
}



function setClass(_elem, _className) {
	$(_elem).removeClass();
	$(_elem).addClass(_className);
}


function loadScript(sScriptSrc, oCallback) {
	var oHead = document.getElementById('head')[0];
	var oScript = document.createElement('script');
	oScript.type = 'text/javascript';
	oScript.src = sScriptSrc;
	// most browsers
	oScript.onload = oCallback;
	// IE 6 & 7
	oScript.onreadystatechange = function() {
		if (this.readyState == 'complete') {
			if (oCallback)
				oCallback();
		}
	}
	oHead.appendChild(oScript);
}

function getInternetExplorerVersion()
{
  var rv = -1;
  if (navigator.appName == 'Microsoft Internet Explorer')
  {
	var ua = navigator.userAgent;
	var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
	if (re.exec(ua) != null)
	  rv = parseFloat( RegExp.$1 );
  }
  return rv;
}


function id$(_id)
{
	return document.getElementById(_id);	
}


function setButton1s1i(_elem, _class, timeOut)
{
	setButton3s1i(_elem, _class, _class+"_over", _class+"_down", timeOut);
}


function setButton3s1i(_elem, _NormalState, _OverState, _DownState, timeOut)
{
	_elem.mouseOverState = false;
	_elem.StateTimer = -1;
	setClass(_elem, _NormalState);
	AddHandler(_elem, "mouseover",function() { 
		this.mouseOverState = true; 
		if (this.StateTimer == -1)
			setClass(this, _OverState);
	},_elem);
	AddHandler(_elem, "mouseout",function() { 
		this.mouseOverState = false; 
		if (this.StateTimer == -1)
			setClass(this, _NormalState);
	},_elem);
	AddHandler(_elem, "mousedown",function() { 
		setClass(this, _DownState);
		if (this.StateTimer != -1)
			clearInterval(this.StateTimer);	
		this.StateTimer = setInterval( bind( function(){	
			clearInterval(this.StateTimer);
			this.StateTimer = -1;
			if (this.mouseOverState)
				setClass(this, _OverState);
			else
				setClass(this, _NormalState);
		}, this), timeOut);
	},_elem);
}


function getcurPageId()
{
	var retVal = "";
	if ((new String(document.location.hash)).length>0)
	{
		retVal = getLinkNormolizedHash();
		if (typeof(retVal) == "undefined")
			retVal = "";

		if (retVal.indexOf("/")==retVal.length-1)
			retVal = retVal.substring(0, retVal.length-1);
	}else{
		retVal = getLinkNormolized();
	}

	return retVal;
}



function getLinkNormolizedHash()
{
	var hashLink = new String(document.location.hash);
	if ((hashLink.charAt(hashLink.length-1)!="/") && (hashLink.length>0))
		hashLink = hashLink+"/";

	while(hashLink.charAt(0) == "#")
		hashLink = hashLink.substring(1,hashLink.length);				
	while(hashLink.charAt(0) == "/")
		hashLink = hashLink.substring(1,hashLink.length);
		
	return hashLink;
}


function getLinkNormolized()
{
	var hashLink = new String(document.location) ;
	hashLink = hashLink.replace(aup.domain, "");
	hashLink = hashLink.replace("http://", "");
	hashLink = hashLink.replace("https://", "");
	if (hashLink.indexOf("//")==0)
		hashLink = hashLink.replace("//", "");
	
	while(hashLink.charAt(0) == "#")
		hashLink = hashLink.substring(1,hashLink.length);				
	while(hashLink.charAt(0) == "/")
		hashLink = hashLink.substring(1,hashLink.length);
		
	return hashLink;
}

function normolizeLink(_str)
{
	var nStr = new String(_str);
	if (browser.ie)
	{
		nStr = nStr.substring(nStr.indexOf("#"), nStr.length);
	}
	while(nStr.charAt(0) == "#")
		nStr = nStr.substring(1,nStr.length);				
	while(nStr.charAt(0) == "/")
		nStr = nStr.substring(1,nStr.length);	
	return nStr;
}


var globalSetLinksN = 0;

function setLink(_link, _restoreState)
{
	globalSetLinksN++;
	var hashLink = _link.replace(aup.domain, "");
	hashLink = hashLink.replace("http://", "");
	hashLink = hashLink.replace("https://", "");
	if (hashLink.indexOf("//")==0)
		hashLink = hashLink.replace("//", "");
	
	//visualize link change
	if (browser.ie)
	{
		curUrl = hashLink;
		document.location.hash = hashLink;
	}else{
		var stateObj = { curLink: hashLink };

		if (_restoreState)
			window.history.replaceState(_restoreState, document.title, document.location);

		window.history.pushState(stateObj, document.title, _link);
	}

	var restparams = null;
	if (aup.controller.curPage)
		restparams = aup.controller.curPage.restoreParams;

	var histObj = { url : getcurPageId(), object : restparams };
	aup.controller.history.push(histObj);
	aup.curHash = new String(document.location.hash);

	aup.stats.trackPageChange(getcurPageId());
}

function setLinkReplace(_link, _restoreState)
{
	globalSetLinksN++;
	var hashLink = _link.replace(aup.domain, "");
	hashLink = hashLink.replace("http://", "");
	hashLink = hashLink.replace("https://", "");
	if (hashLink.indexOf("//")==0)
		hashLink = hashLink.replace("//", "");

	//visualize link change
	if (browser.ie)
	{
		curUrl = hashLink;
		document.location.hash = hashLink;
	}else{
		var stateObj = { curLink: hashLink };
		window.history.replaceState(_restoreState, document.title, _link);
	}
	aup.curHash = new String(document.location.hash);


	aup.stats.trackPageChange(hashLink);
}



function getDateDelt(_date){
	var incomingDate = new Date(_date);
	today = new Date();
	
	var delta = today-incomingDate;

	var preStr = "";
	if (delta<0)
	{
		preStr = "timemachine invented ";
		delta = -delta;
		log("timemachine invented!");
	}
	
	var yD = parseInt(delta / 1000 / 60 / 60/ 24 / 365 );
	var dD = parseInt(delta / 1000 / 60 / 60/ 24 );
	var hD = parseInt(delta / 1000 / 60/ 60 );
	var mD = parseInt(delta / 1000 / 60 );
	var sD = parseInt(delta / 1000 );
	
	
	if (sD<60)
	{
		if (sD==1)
			return "1 second"
		else
			return preStr+sD+" seconds";
	}else if (mD<60)
	{
		if (mD==1)
			return preStr+"1 minute"
		else
			return preStr+mD+" minutes";
	}else if (hD<24)
	{
		if (hD==1)
			return preStr+"1 hour"
		else
			return preStr+hD+" hours";
	}else if (dD<365)
	{
		if (dD==1)
			return preStr+"1 day"
		else
			return preStr+dD+" days";
	}else{
		if (yD==1)
			return preStr+"1 year"
		else
			return preStr+yD+" years";
	}
	
	return preStr+"once upon a time";
}



function getTimeFormatedTl(_date){
	var incomingDate = new Date(_date);
	today = new Date();
	
	var delta = today-incomingDate;
	
	var yD = parseInt(delta / 1000 / 60 / 60/ 24 / 365 );
	var dD = parseInt(delta / 1000 / 60 / 60/ 24 );
	var hD = parseInt(delta / 1000 / 60/ 60 );
	var mD = parseInt(delta / 1000 / 60 );
	var sD = parseInt(delta / 1000 );
	
	
	if (sD<60)
	{
		return "< 1m";
	}else if (mD<60)
	{
		return mD+"m";
	}else if (hD<24)
	{
		return hD+"h";
	}else if (dD<365)
	{
		return dD+"d";
	}else{
		return yD+"y";
	}
	
	return "long time";
}



function getTimeFormated(_date){
	var incomingDate = new Date(_date);
	today = new Date();
	
	var delta = today-incomingDate;
	
	var yD = parseInt(delta / 1000 / 60 / 60/ 24 / 365 );
	var dD = parseInt(delta / 1000 / 60 / 60/ 24 );
	var hD = parseInt(delta / 1000 / 60/ 60 );
	var mD = parseInt(delta / 1000 / 60 );
	var sD = parseInt(delta / 1000 );
	
	
	if (sD<60)
	{
		return "< 1 m";
	}else if (mD<60)
	{
		return mD+" m";
	}else if (hD<24)
	{
		return hD+" h";
	}else if (dD<365)
	{
		return dD+" d";
	}else{
		return yD+" y";
	}
	
	return ">>";
}

function messageCheckSPaces(s) {
	s = s.replace(/(^\s*)|(\s*$)/gi,"");
	s = s.replace(/(^\n*)|(\n*$)/gi,"");
	s = s.replace(/[ ]{2,}/gi," ");
	s = s.replace(/\n /,"\n");
	return s;
}

function checkInputEmpty(_str)
{
	var has = true;
	var str = _str;
	str = messageCheckSPaces(_str);	
	if (str.length==0)
		has = false;
	return has;
}

function openWindow2(_name, _w, _h)
{
	if (browser.ie)
		var wind = window.open(_name)
	else
		var wind = window.open(null, _name, "width="+_w+",height="+_h);
	var screenW = screen.width;
	var screenH = screen.height;
	if (wind)
		wind.moveTo(Math.ceil((screenW-_w)*0.5), Math.ceil((screenH-_h)*0.5));

	return wind;
}

function getTextCutted(_str, _len)
{
	var startStr = messageCheckSPaces(_str);
	var strLen = startStr.length;
	var endStr = " ...";
	
	if (strLen>=_len-1-endStr.length)
	{
		var endStr = "...";
		var comm = startStr.substring(0,_len-1-endStr.length);
		comm = comm.substring(0, comm.lastIndexOf(" "));
		
		while ((comm.charAt(comm.length-1)== " ") || (comm.charAt(comm.length-1)== "\n"))
			comm = comm.comm.substring(0, comm.length-1);
			
		if (comm.length==0)
		{
			comm = startStr.substring(0,_len-1-endStr.length) + endStr;
		}else{
			comm = comm + endStr;
		}
	}else{
		var comm = startStr;
	}
	return comm;
}

function getNameCutted(_str, _len)
{
	var endStr = "...";
	if (_str.length > _len-1-endStr.length)
	{
		var comm = _str.substring(0,_len-1-endStr.length)+endStr;
	}else{
		var comm = _str;
	}
	return comm;	
}

function setDocTitle(_str)
{
	document.title = _str;
}

function setFCK_FF_BKy(_elem, _Y)
{
	if (browser.firefox || browser.opera)
	{
		var pos = [];
		pos = $(_elem).css('background-position').split(" ");
		if ((typeof(pos[0]) == 'undefined') || (pos[0] == ""))
			pos[0] = "0px";

		if ((typeof(pos[1]) == 'undefined') || (pos[1] == ""))
			pos[1] = "0px";

		$(_elem).css({ 'background-position' : pos[0]+" "+_Y + 'px' });
	}else{
		$(_elem).css({ 'background-position-y' : _Y + 'px' });
	}
}
function setFCK_FF_BKx(_elem, _X)
{
	if (browser.firefox || browser.opera)
	{
		var pos = [];
		pos = $(_elem).css('background-position').split(" ");
		if ((typeof(pos[0]) == 'undefined') || (pos[0] == ""))
			pos[0] = "0px";

		if ((typeof(pos[1]) == 'undefined') || (pos[1] == ""))
			pos[1] = "0px";

		$(_elem).css({ 'background-position' : _X + 'px '+pos[1] });
	}else{
		$(_elem).css({ 'background-position-x' : _X + 'px' });
	}
}


function getTrimmedTextToSize(_str, _fSize, _w, _bold)
{
	var str = _str;
	var canvas = $("#service_layer");
	canvas.css({ 'font-size' : _fSize });
	if (_bold)
	{
		canvas.css({ 'font-weight' : 'bold' });
	}else{
		canvas.css({ 'font-weight' : 'normal' });
	}
	canvas.text(str);
	
	var fW = canvas.width()+1;
	if (fW>_w)
	{
		str = str.substring(0, str.length-3);
		canvas.text(str);
	}

	while ((str.length>0) && (canvas.width()+1>_w))
	{
		str = str.substring(0, str.length-1);
		canvas.text(str);
	}
	
	if (_str.length!=str.length)
		str = str+"...";

	return str;
}

function getILimit(offset,total,deltN, maxCount)
{
	var count = total-offset;
	count = Math.max(count, maxCount);
	if (count > maxCount+deltN)
		count = maxCount;
	return count;
}



function limitPos(_pos, _len)
{
	var nP = _pos;

	if (nP>=_len)
		nP = nP % _len;

	if (nP<0)
		nP = _len-(-nP % _len);

	return nP;
}

function printNotify19(_N, _cont)
{
	var N = parseInt(_N);
	if (isNaN(N))
		N = 0;
	if (N>999)
		N = 999;
	N = N+"";
	if (N.length<2)
		N = "0"+N;
	
	
	for (var i=0; i <N.length; i++)
	{
		var elem = document.createElement("div");
		elem.title = N;
		setClass(elem, "events_font_19");
		elem = $(elem);
		elem.css({'background-position-x' : -parseInt(N.charAt(i))*19+'px'});
		$(_cont).append(elem);
	}
	$(_cont).css({ width : N.length*19+2+'px'});
	return N.length;
}


Switcher = function (_object) { return {
		object : _object,

		setView : function(_state)
		{
			if (_state)
			{
				setClass(_object, "settings_switcher_1");
			}else{
				setClass(_object, "settings_switcher_0");
			}
		}
	}
}

InputMasked = function (_object, _text) { return {
	object : _object,
	onBlur : null,
	onFocus : null,
	onInput : null,

	maskedText : _text,

	init : function()
	{
		object.focus(bind(this._onFocus, _elem));
		object.blur(bind(this._onBlur, _elem));
		if (this.onInput)
			object.keyup(bind(this.onInput, _elem));
	},

	onFocus : function(e)
	{

		if (this.onFocus)
			this.onFocus(e);
	},

	onBlur : function(e)
	{
		if (this.onBlur)
			this.onBlur(e);
	}
}
}

			
			
Timer = function (_delay, _count) { return {
	timerId : -1,
	currentCount : 0,
	repeatCount : Math.max(0,_count),
	//0 - till an infinity exists
	delay : Math.max(1,_delay),
	active : false,
	
	onTimerEvent : null,
	onTimerEventEnd : null,
	
	
	start : function ()
	{
		if (this.active)
			return false;
		
		if (!this.onTimerEvent && !this.onTimerEventEnd)
			return false;
		
		this.active = true;
		
		if ((this.currentCount <= this.repeatCount) || (this.repeatCount == 0))
			this.timerId = setInterval(bind(this.timerProgress, this), this.delay);
	},
	stop : function()
	{
		if (this.timerId!=-1)
			clearInterval(this.timerId);
		this.timerId = -1;
		this.active = false;
	},
	
	reset : function()
	{
		this.stop();
		this.currentCount = 0;
	},
	
	timerProgress : function()
	{
		
			
		if ((this.currentCount >= this.repeatCount) && (this.repeatCount > 0))
		{
			clearInterval(this.timerId);
			this.currentCount = this.repeatCount;
			this.timerId = -1;
			this.active = false;
			
			if (this.onTimerEventEnd)
			{
				var timerEvent = {type : "onTimerEventEnd", currentCount : this.currentCount, repeatCount : this.repeatCount, target : this};
				this.onTimerEventEnd(timerEvent);
			}
		}
		
		if (this.onTimerEvent)
		{
			var timerEvent = {type : "onTimerEvent", currentCount : this.currentCount, repeatCount : this.repeatCount, target : this};
			this.onTimerEvent(timerEvent);
		}
		
		this.currentCount++;
	}
}}

function getObjectJson(_resp)
{
	var out = _resp;
	if (typeof(out) != 'object')
		out = $.parseJSON(_resp);
	return out;
}

function escapeHtml(_text) {
	return _.escape(_text);
	var htmlEscapes = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#x27;',
		'/': '&#x2F;'
	};
	var htmlEscaper = /[&<>"'\/]/g;
	return ('' + _text).replace(htmlEscaper, function(match) {
		return htmlEscapes[match];
	});
}

function setOnLoadIMG(_src, _func)
{
	var nScr = _src;
	var img = new Image();
	img.aup_complete = false;
	$(img).load(bind(function() {
		if (this.aup_complete)
		{
			log("1 img fired from cache FALSE");
			return false;
		}
		if (_func)
			_func();
	}, img));
	img.src = nScr;
	if (img.complete)
	{
		log("COMPLETE EXCACTLY!");
		img.aup_complete = true;
		if (_func)
			_func();
	}
}


function setOnLoad(_img, _src, _loaderbk, _func)
	{
		var nScr = _src;
		var img = new Image();
		img.aup_complete = false;
		$(img).load(bind(function() {
			if (this.aup_complete)
			{
				log("2 img fired from cache FALSE");
				return false;
			}


			$(_img).attr('src', nScr);
			$(_img).css({visibility: 'visible'});

			if (_loaderbk)
				$(_loaderbk).css({ 'background-image' : 'none' });
			if (_func)
				_func();
		}, img));
		img.src = nScr;

		if (img.complete)
		{
			img.aup_complete = true;
			$(_img).attr('src', nScr);
			$(_img).css({visibility: 'visible'});

			if (_loaderbk)
				$(_loaderbk).css({ 'background-image' : 'none' });
			if (_func)
				_func();
		}else{
			$(_img).css({visibility: 'hidden'});
		}
	}

function onLoadTimerEvent(e)
{
	var A =  e.currentCount/e.repeatCount;

	setAlpha(this, A);
}






function setImageOnload(_img, _src, _loaderbk, _func)
{

	var nScr = _src;
	var img = _img.get()[0];
	img.aup_complete = false;
	img.onLoadTimer = new Timer(1000/30, 4);

	img.onLoadTimerEvent = bind(onLoadTimerEvent, img);
	img.onLoadTimer.onTimerEvent = img.onLoadTimerEvent;


	var func = bind(function() {
		if (this.aup_complete)
		{
			//log("CANCELED!");
			return false;
		}
		this.aup_complete = true;

		if (browser.ie)
		{
			$(_img).css({visibility: 'visible'});
		}else{
			setAlpha(_img, 0.0);
			$(_img).css({visibility: 'visible'});
			this.onLoadTimer.reset();
			this.onLoadTimer.start();
		}



		if (_loaderbk)
			$(_loaderbk).css({ 'background-image' : 'none' });
		if (_func)
			_func();
	}, img);

	$(img).load( func );
	img.src = nScr;

	if (img.complete)
	{
		//log("FROM CACHE = ["+_src+"]");
		func();
	}else{
		$(_img).css({visibility: 'hidden'});
	}
}




function checkBoxClick(e)
{
	this.checkedBox = !this.checkedBox;
	this.removeClass();
	if (this.checkedBox)
	{
		this.addClass("gui_checkmark_1");
	}else{
		this.addClass("gui_checkmark_0");
	}

	if (this.actionsFunc)
	{
		this.actionsFunc(this.checkedBox);
	}
}

function setCheckBox(_elem, func,  _label)
{
	var elem = $(_elem);
	if (elem.hasClass("gui_checkmark_0"))
	{
		elem.checkedBox = false;
	}else{
		elem.checkedBox = true;
	}
	elem.actionsFunc = func;

	elem.click(bind(checkBoxClick, elem));
	if (_label)
		_label.click(bind(checkBoxClick, elem));

}


function checkIfAnalyticsLoaded() {
	if (window.gat_ && window.gat_.getTracker_) {
		// Do tracking with new-style analytics
		return true;
	} else if (window.urchinTracker) {
		// Do tracking with old-style analytics
		return true;
	}
	return false;
}


(function($){

	var url1 = /(^|&lt;|\s)(www\..+?\..+?)(\s|&gt;|$)/g,
		url2 = /((^|&lt;|\s)*(\b(https?|ftp)):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@\/%~_|])/ig,
		url3 = /([^|a-z0-9])@([A-Za-z0-9_]+)/ig ,

		linkifyThis = function () {
			var childNodes = this.childNodes,
				i = childNodes.length;
			while(i--)
			{
				var n = childNodes[i];
				if (n.nodeType == 3) {
					var html = $.trim(n.nodeValue);
					if (html)
					{
						html = html.replace(/&/g, '&amp;')
							.replace(/</g, '&lt;')
							.replace(/>/g, '&gt;')
							.replace(url2, function($1){
								var str = $1;
								str = str.replace("http://","");
								str = str.replace("https://","");
								str = str.replace("mailto://", "");

								return '<a class="comment_link_text" href="'+$1+'">'+str+'</a>';
							})
							.replace(url1, '$1<a class="comment_link_text" href="http://$2">$2</a>$3')
							.replace(url3, '$1<a class="comment_link_text" href="http://twitter.com/$2">@$2</a>');

						$(n).after(html).remove();
					}
				}
				else if (n.nodeType == 1  &&  !/^(a|button|textarea)$/i.test(n.tagName)) {
					linkifyThis.call(n);
				}
			}
		};

	$.fn.linkify = function () {
		return this.each(linkifyThis);
	};

})(jQuery);

// Usage example:


var browser = {
	ie6: !window.XMLHttpRequest,
	ie: navigator.userAgent.indexOf('MSIE') > -1,
	ie_version : getInternetExplorerVersion(),
	opera: navigator.userAgent.indexOf('Opera') > -1,
	safari: navigator.userAgent.indexOf('Safari') > -1,
	firefox: navigator.userAgent.indexOf('Firefox') > -1,
	chrome: navigator.userAgent.indexOf('Chrome') > -1,
	
	mac: navigator.platform.indexOf('Mac') > -1,
	win: navigator.platform.indexOf('Win') > -1,
	linux: navigator.platform.indexOf('Linux') > -1,

	iphone: navigator.platform.indexOf('iPhone') > -1,
	android: navigator.userAgent.indexOf('Android') > -1,
	ipad: navigator.platform.indexOf('iPad') > -1,
	wmobile : ((navigator.userAgent.indexOf('Windows CE')>-1) || (navigator.userAgent.indexOf('Windows Mobile')>-1) || (navigator.userAgent.indexOf('Windows Phone')>-1)),
	symbian : navigator.userAgent.indexOf('Symbian') > -1
}


