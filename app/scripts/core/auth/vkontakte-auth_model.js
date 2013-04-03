whp.VK = Backbone.Model.extend({
	url: "/api/auth/",
	inited : false,
	wind: null,
	app_id: 3154513,
	redirect_url: whp.root + "/go/close_vk.html",

	initialize: function (){},

	login: function() {
		var that = this;
		this.wind = _.openWindow2("VK auth", 640, 480);
		this.wind.location.href = "https://api.vk.com/oauth/authorize?client_id=" + this.app_id + "&scope=friends,photos,wall,offline&response_type=token&redirect_uri="+this.redirect_url;
		return false;
	},

	fetch: function(user_obj){
		var that = this;
		$.ajax({
			type: 'GET',
			url:  _.toSafeUrl(this.url),
			dataType: 'json',
			data: {
				social: 'vk', 
				access_token : user_obj.token, 
				vk_id : user_obj.uid
			}
		})
		.success(function(response, status, xhr){
			that.success(response, status, xhr);
		})
		.error(function(data){
			that.error(data);
		})
		// .timeout(function (e) {
		// 	// TODO: сделать чтото при timeout
		// 	// OLD
		// 	// WHP.netTimeOut(e);
		// });
	},
	success:function (response, status, xhr){
		var resp = _.toJSON(response);
		if (resp.error){
			if (resp.error.code == "API_AuthFailed"){
				this.trigger("error", {description:"This account isn't linked with WeHeartPics"});
			} else {
				this.trigger("error", {description:"Something went wrong"});
			}
		} else {
			this.trigger("auth:success", 
				{
					response: resp,
					user: resp.user, 
					session:{ token: resp.user.token, uid: resp.user.id }
				}
			);
		}
	},
	error: function(e){
		whp.log("WHP/auth/VK : error while logging in!");
		this.trigger("error", {description:"Something went wrong"})
	},
});