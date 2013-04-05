function bind(fun, scope) {
	return function(args) {
	   return fun.call(scope, args);
	};
}

function getCaret(el) { 
  if (el.selectionStart) { 
	return el.selectionStart; 
  } else if (document.selection) { 
	el.focus(); 

	var r = document.selection.createRange(); 
	if (r == null) { 
	  return 0; 
	} 

	var re = el.createTextRange(), 
		rc = re.duplicate(); 
	re.moveToBookmark(r.getBookmark()); 
	rc.setEndPoint('EndToStart', re); 

	return rc.text.length; 
  }  
  return 0; 
}


function validateEmail(email)
{
	var atI = email.indexOf("@");
	var dotI = email.lastIndexOf(".");

	if ((atI<dotI) && (dotI<email.length-2))
		return true
	else
		return false;
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



function getScrollTop()
{
	var top = $(window).scrollTop();
	if (browser.ie)
		top = $('html').scrollTop();
	return top;
}



function log(msg) {
	if (!browser.ie)
	{
		console.log(msg);
	}else{
/*
		var doc = document.getElementById("console_ie");
		if (doc)
		{
			doc.style.display = "block";
			doc.innerHTML = doc.innerHTML+"<br/>"+msg;
		}
	   doc.scrollTop =  doc.scrollHeight;
*/
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


function setClass(_elem, _className) {
	$(_elem).removeClass();
	$(_elem).addClass(_className);
}


function getcurPageId()
{
	var retVal = "";
	if (String(document.location.hash).length>0)
	{
		retVal = getLinkNormolizedHash();

		if (retVal.indexOf("/")==retVal.length-1)
			retVal = retval.substring(0, retval.length-1);

	}else{
		retVal = getLinkNormolized();
	}

	log("RETVAL = ["+retVal+"]");

	return retVal;
}



function getLinkNormolizedHash()
{
	var hashLink = new String(document.location.hash);
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
	
	while(hashLink.charAt(0) == "#")
		hashLink = hashLink.substring(1,hashLink.length);				
	while(hashLink.charAt(0) == "/")
		hashLink = hashLink.substring(1,hashLink.length);
		
	return hashLink;
}

function normolizeLink(_str)
{
	var nStr = new String(_str);
	while(nStr.charAt(0) == "#")
		nStr = nStr.substring(1,nStr.length);				
	while(nStr.charAt(0) == "/")
		nStr = nStr.substring(1,nStr.length);	
	return nStr;
}


function getLink()
{
	return new String(document.location);
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



function setOnLoadIMG(_src, _func)
{
	//hide


	//if (_loaderbk)
	//		$(_loaderbk).css({ 'background-image' : 'none' });

	//var nScr = _src+"?r="+Math.random();
	var nScr = _src;
	//load new
	var img = new Image();
	$(img).load(function() {
		if (_func)
			_func();
	});
	img.src = nScr;

	//if complete?
	if (img.complete)
	{
		if (_func)
			_func();
	}
}

function getObjectJson(_resp)
{
	var out = _resp;
	if (typeof(out) != 'object')
		out = $.parseJSON(_resp);
	return out;
}


function iOSversion() {
	if (/iP(hone|od|ad)/.test(navigator.platform)) {
		var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
		return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
	} else {
		return false;
	}
}

var browser = {
	ie6: !window.XMLHttpRequest,
	ie: navigator.userAgent.indexOf('MSIE') > -1,
	opera: navigator.userAgent.indexOf('Opera') > -1,
	safari: navigator.userAgent.indexOf('Safari') > -1,
	firefox: navigator.userAgent.indexOf('Firefox') > -1,
	chrome: navigator.userAgent.indexOf('Chrome') > -1,
	mchrome: navigator.userAgent.indexOf('CriOS') > -1,
	
	mac: navigator.platform.indexOf('Mac') > -1,
	win: navigator.platform.indexOf('Win') > -1,
	linux: navigator.platform.indexOf('Linux') > -1,

	iphone: (navigator.platform.indexOf('iPhone') > -1) || (navigator.platform.indexOf('iPod') > -1),
	android: navigator.userAgent.indexOf('Android') > -1,
	ipad: navigator.platform.indexOf('iPad') > -1,
	wmobile : ((navigator.userAgent.indexOf('Windows CE')>-1) || (navigator.userAgent.indexOf('Windows Mobile')>-1) || (navigator.userAgent.indexOf('Windows Phone')>-1)),
	symbian : navigator.userAgent.indexOf('Symbian') > -1,
	iosversion: !!iOSversion()?iOSversion()[0]:0
}
