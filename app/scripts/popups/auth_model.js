whp.Auth = Backbone.Model.extend({
	url_logout: "/api/auth/logout/",

	initialize: function (){

		this.FB  = new whp.FB({url:"/api/auth/", app_id: "205868409437437"});
		this.TW  = new whp.TW({url:"/api/auth/", url_token:"/api/auth/twitter/request_token/"});
		this.VK  = new whp.VK({url:"/api/auth/", app_id:3154513, redirect_url: "http://weheartpics.com/go/close_vk.html"});
		this.signin 		= new whp.Signin({url:"/api/auth/signin/"});
		this.registration 	= new whp.Registration({url:"/api/auth/signup/"});

		this.on("twitter:hi", function (user_obj) {
			this.TW.fetch(user_obj);
		}, this);

		this.on("vkontakte:hi", function (user_obj) {
			this.VK.fetch(user_obj);
		}, this);

		this.FB.on 			("auth:success", this.authSuccess, this);
		this.TW.on 			("auth:success", this.authSuccess, this);
		this.VK.on 			("auth:success", this.authSuccess, this);
		this.signin.on		("auth:success", this.authSuccess, this);
		this.registration.on("auth:success", this.authSuccess, this);


		this.FB.on 			("error", this.error, this);
		this.TW.on 			("error", this.error, this);
		this.VK.on 			("error", this.error, this);
		this.signin.on		("error", this.error, this);
		this.registration.on("error", this.error, this);

		// TODO: вынести отсюда whp.navigate
		this.registration.on("registration:pending", function () {
			whp.navigate("/confirmation");
		}, this);
		this.registration.on("registration:success", function () {
			whp.navigate("/findfriends");
		}, this);

		whp.on("auth:show", function () {
			this.trigger("auth:show")
		}, this)

		whp.on("navbar:logout", function () {
			this.logout();
		}, this)

		this.view = new whp.AuthView({model: this});
		this.view.render();
	},

	authSuccess: function(user_obj) {
		if(!!user_obj.session) {
			this.trigger("auth:success", user_obj);
		}
	},

	logout: function(){
		// $.ajax({
		// 	type: 'GET',
		// 	url: _.toSafeUrl(this.url_logout),
		// 	dataType: 'json'
		// });
		this.trigger("auth:clear");
	},

	error:function (err) {
		this.trigger("error",err);
	}
});