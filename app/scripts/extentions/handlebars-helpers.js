/**
 * Helper for i10n support for Handlebars 
 */
Handlebars.registerHelper('_', function(text){
	if(arguments.length > 2){
		var str = arguments[0],
			params = _.toArray(arguments).slice(1,-1),
			param;
		while(str.indexOf("%s") != -1){
			param = params.length==1 ? params[0] : params.shift();
			str = str.replace(/%s/, param);
		}
		text = str;
	}else{
		//@TODO
		//Get string from lang config (scripts/l10n/)
		// or just resolve that we have to have pack of templates for each lang
	}
	return text;
});

/**
 * Helper for declation support for RU Handlebars 
 * sample {{_decl 123 '["день","дня","дней"]'}}
 */
Handlebars.registerHelper('_decl_ru', function(num, formsJSON) {
	// formsJSON = Handlebars.helpers._(formsJSON);
	var forms = _.toJSON(formsJSON);
	if(num % 10 == 1 && num % 100 != 11) {
		return forms[0];
	} else if ((num % 10 >= 2) && (num % 10 <= 4) && (num % 100 < 10 || num % 100 >= 20)) {
		return forms[1];
	} else {
		return forms[2];
	}
	return '';
});



/**
 * Helper for declation support for EN Handlebars 
 * sample {{_decl 123 '["day", "days"]'}}
 */
Handlebars.registerHelper('_decl_en', function(num, formsJSON) {
	// formsJSON = Handlebars.helpers._(formsJSON);
	var forms = _.toJSON(formsJSON);
	if(num == 1) {
		return forms[0];
	} else {
		return forms[1];
	}

	return '';
});


/**
 * Helper timegap Handlebars 
 * sample {{_timegap 12312312}}
 */
Handlebars.registerHelper('_timegap', function(timestamp) {
	timestamp*=1000;
	var incomingDate = new Date(timestamp);
	today = new Date();
	
	var delta = today-incomingDate;
	
	var yD = parseInt(delta / 1000 / 60 / 60/ 24 / 365 );
	var dD = parseInt(delta / 1000 / 60 / 60/ 24 );
	var hD = parseInt(delta / 1000 / 60/ 60 );
	var mD = parseInt(delta / 1000 / 60 );
	var sD = parseInt(delta / 1000 );
	
	
	if (sD<60) {
		return "< 1"+"m";
	} else if (mD<60) {
		return mD+"m";
	} else if (hD<24) {
		return hD+"h";
	} else if (dD<365) {
		return dD+"d";
	} else {
		return yD+"y";
	}
	
	return "long time";
});



// equal if
Handlebars.registerHelper('ifEq', function(v1, v2, options) {
  if(v1 == v2) {
	return options.fn(this);
  }
  return options.inverse(this);
});


/**
 * Helper for hash and mentions for Handlebars 
 */
Handlebars.registerHelper('_uinput', function(str) {
	var re = new RegExp("\\B#(\\S+)", "gi"),
	str = str.replace(re, function(match, hash){
			if(hash)
				return "<a class=\"hsh\" href=\"/explore/hash/" + hash + "/\">#" + hash + "</a>";
			return match;
		});


	re = new RegExp("\\[id(\\S+)\\|([^\\]]+)\\]", "gi");
	str = str.replace(re, function(match, id, user_name){
			if(id && user_name)
				return "<a class=\"unm\" href=\"/user/" + id + "/\">" + user_name + "</a>";
			return match;
		});

	return new Handlebars.SafeString(str);
});


/**
 * Helper for clear mentions for Handlebars 
 */
Handlebars.registerHelper('_mention_clear', function(str) {
	var re = new RegExp("\\[id(\\S+)\\|([^\\]]+)\\]", "gi");
	str = str.replace(re, function(match, id, user_name){
			if(id && user_name)
				return user_name;
			return match;
		});

	return new Handlebars.SafeString(str);
});