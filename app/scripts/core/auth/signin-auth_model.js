aup.Signin = Backbone.Model.extend({
	url: 		'http://api.artupp.ru/v1/auth',

	initialize: function (){},

	login: function(user_obj){
		this.fetch(user_obj);
		return false;
	},

	fetch: function(user_obj){
		var that = this;
		$.ajax({
			type: 'POST',
			url:  _.toSafeUrl(this.url),
			data: {
				email : user_obj.login, 
				password : user_obj.password
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
				this.trigger('error', {description:'Something went wrong ('+resp.error+')'});
			} else {
				this.trigger('auth:success', 
					{
						response: resp, 
						user: resp.result.user, 
						session:{ token: resp.result.token, uid: resp.result.id },
					}
				);
			}
		}
		// aup.controller.setTitle();
	},

	error : function(e) {
		console.error(e)
		this.trigger('error', {description:'Something went wrong'});
	}
});