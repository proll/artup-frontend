whp.Signin = Backbone.Model.extend({
	url: 		"/api/auth/signin/",

	initialize: function (){},

	login: function(user_obj){
		this.fetch(user_obj);
		return false;
	},

	fetch: function(user_obj){
		var that = this;
		$.ajax({
			type: 'GET',
			url:  _.toSafeUrl(this.url),
			dataType: 'json',
			data: {
				login : user_obj.login, 
				passw : user_obj.password
			}
		})
		.success(function(response, status, xhr){
			that.success(response, status, xhr);
		})
		.error(function(response, status, xhr){
			that.error(response, status, xhr);
		})
	},

	success: function(response, status, xhr){
		var resp = _.toJSON(response);
		if (!!resp) {
			if (!!resp.error) {
				if (resp.error.code == "API_BadParams") {
					this.trigger("error", {description:"Wrong e-mail and password combination :("});
				} else if (resp.error.code == "API_AuthFailed") {
					this.trigger("error", {description:"Wrong e-mail and password combination"});
				} else if (resp.error.code == "API_PendingConfirmation") {
					this.trigger("error", {description:"We have sent you an e-mail to confirm"});
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
		}
		// WHP.controller.setTitle();
	},

	error : function(e) {
		this.trigger("error", {description:"Something went wrong"});
	}
});