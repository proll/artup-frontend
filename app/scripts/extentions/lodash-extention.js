/**
*	underscore - loda extend
**/
_.isEmail = function (email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email)
};

_.capitalize = function(str){
	str = str == null ? '' : String(str);
	return str.charAt(0).toUpperCase() + str.slice(1);
};

_.decl = function (number, titles) {
	var cases = [2, 0, 1, 1, 1, 2];
	return titles[ (number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5] ];
};

_.toJSON = function (obj) {
	if (typeof(obj) != 'object') obj = JSON.parse(obj);
	return obj;
}

_.toSafeUrl = function (url) {
	if(url.indexOf("&") == -1) {
		url += "?s="+Math.random();
	}else{
		url += "s="+Math.random();
	}
	return url;
}

_.getCookie = function (name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

_.setCookieMin = function (name,value,minutes) {
	if (minutes) {
		var date = new Date();
		date.setTime(date.getTime()+(minutes*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}


_.setCookie = function(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

_.clearCookie = function (name) {
	_.setCookie(name,"",-1);
}


_.openWindow2 = function(_name, _w, _h){
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


_.isPhone = function() {
	return ($(window).width() < 639);
}