window.browser = {
	ie6: !window.XMLHttpRequest,
    ie: navigator.userAgent.indexOf('MSIE') > -1,
    // ie_version : getInternetExplorerVersion(),
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
};




window.aup = {
	root: "http://prollsandbox.artupp.ru",
	Models: {},
	Collections: {},
	Views: {},
	Routers: {},
	Templates: {
		templates: [],
		compiled: [], 
		add: function(name, template){
			this.templates[name] = template;
		},
		get: function(name){
			if(this.compiled[name]){
				return this.templates[name];
			}else if(this.templates[name]){
				this.templates[name] = Handlebars.compile(this.templates[name]);
				this.compiled[name] = true;
				return this.templates[name];
			}else{
				console.error("Can't find template \"" + name + "\"");
				return function(){ return "" }
			}

		}
	},
	Widgets: {},
	preloadTemplates: function(){
		var files = [];
		_.each(window.templates.files, function(templateName){
			var file = templates.path + "/" + templateName + "." + templates.ext;
			files.push( $.get(file, function(templateData){
				aup.Templates.add(templateName, templateData);
			}));
		});
		return files;
	},
	init: function() {

		// Templates preloaded TODO: builder must inject templates into body
		$.when.apply(this, this.preloadTemplates()).done(function(){
			aup.error = function(text, context){
				var error = "";
				// if(context && testErrors[context]){
				// 	error = testErrors[context][text];
				// }else{
				// 	error = testErrors[text];
				// }
				console.error(text);
				return error || text;
			}
			/**
			 * aup app initialization
			 */
			aup.app = new aup.App({ 
				debug: true,
				language: "ru"
			});

			// Init Backbone history
			Backbone.history.start({pushState: true});

		});

		// Catch links and trigger router
		$(document).on("click", "a", function(evt){
			if($(this).attr("target")) return true;
			evt.stopPropagation();
			evt.preventDefault();
			aup.app.router.navigate($(this).attr("href"), {trigger: true});
			return false;
		});
	},
	log: function (txt) {
		console.log(txt);
	},
	error: function(desc) {
		console.error(desc);
	},
	navigate: function (path, options) {
		aup.app.router.navigate(path, options);
	},

	is_needauth: function() {
		if(!aup.user.is_auth()) {
			aup.trigger("auth:show");
			return true;
		} else {
			return false;
		}
	}
};

Backbone._sync = Backbone.sync;

Backbone.sync = function(method, model, options){
	options = options || {};
	var credentials = {};
	if(options.userData){
		credentials = {
			uid: options.userData.uid,
			token: options.userData.token
		}
	}else{
		if(!!aup.app.user.get("uid")) {
			credentials = {
				uid: aup.app.user.get("uid"),
				token: aup.app.user.get("token")
			}
		}
	}
	options.url = (options.url || (model.url && _.result(model, 'url'))) + "?" + _.map(credentials, function(value, key){ return key+"="+value}).join("&");

	// options.url	= "/api/gate.php?method=" + options.url;
    return Backbone._sync(method, model, options);
}

$(document).ready(function(){
	_.extend(aup, Backbone.Events);
	aup.init();
});
