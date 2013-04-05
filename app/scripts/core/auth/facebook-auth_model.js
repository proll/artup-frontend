aup.FB = Backbone.Model.extend({
	url : "/api/auth/",
	app_id: "205868409437437",
	inited : false,
	access_token : null,

	initialize: function (){
		window.fbAsyncInit = _.bind(function () {
			//facebook functions
			FB.init({
				appId: this.app_id,
				cookie: true,
				status: true,
				xfbml: true,
				oauth : false });
			FB.Event.subscribe('edge.create', this.fbShareEvents);
			if ($.browser.opera){
				FB.XD._transport="postmessage";
				FB.XD.PostMessage.init();
			}
			FB.getLoginStatus(_.bind(function (response) {
				if (response.status == "connected"){
					aup.log("Facebook : user was succesfully connected! :)");
				}else{
					aup.log("Facebook : user was not connected! :(");
				}
			}, this));

		}, this);

		//load facebook module
		(function(d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) {return;}
			js = d.createElement(s); js.id = id;
			js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));

		this.inited = true;
	},


	fetch: function(){
		if (this.access_token!=null) {
			var that = this;
			$.ajax({
				type: 'GET',
				url: _.toSafeUrl(this.url),
				data: { 
					social : 'fb',  
					access_token : this.access_token 
				},
				dataType: 'json'
			})
			.success(function(response, status, xhr){
				that.success(response, status, xhr);
			})
			.error(function(data){
				that.error(data);
			})
		}
	},

	success: function(response, status, xhr){
		var resp = _.toJSON(response);
		if (resp!=null)
		if (resp.error)
		{
			if (resp.error.code == "API_AuthFailed") {
				this.trigger("error", {description:"This account isn't linked with WeHeartPics"})
				// aup.auth.showRegStep1Error("This account isn't linked with WeHeartPics");
			} else {
				this.trigger("error", {description:"Something went wrong"});
				// aup.auth.showRegStep1Error("Something went wrong");

			}
		}else{
			this.trigger("auth:success", 
				{
					response: resp, 
					user: resp.user, 
					session:{ token: resp.user.token, uid: resp.user.id }
				});
			// aup.pages.settings.onData(resp);
			// aup.auth.setUser(resp.user);
			// aup.auth.setSession({ token: resp.user.token, id: resp.user.id , uid: resp.user.id });
			// aup.controller.onChangeAuthState(true);
			// aup.auth.onStartWork(resp);
		}

		// aup.controller.setTitle();
	},

	error: function(e) {
		aup.log("aup/auth/FB : error while logging in!");
		// TODO слушать ошибку выше
		this.trigger("error", {description:"aup/auth/FB : error while logging in!"})
	},

	

	login : function (e){
		this.access_token = "";
		FB.login(
			_.bind(this.onFBData, this), 
			{ scope: 'publish_actions,publish_stream,user_photos,offline_access,email,user_birthday'}
		);
		return false;
	},

	loginOG : function (e, _func){
		this.access_token = "";
		FB.login(
			_func, 
			{ scope:'publish_actions,publish_stream,user_photos,offline_access,email,user_birthday'}
		);
	},

	fbShareEvents : function(e){
		aup.log("CreateEdge");
		// TODO:надо слушать это событие гдето
		this.trigger("fb:like", e);

		// OLD
		// if (aup.shares.onFbLike(e))
		// 	return false;

		// if (aup.controller.curPage.onFBlike)
		// {
		// 	aup.controller.curPage.onFBlike(e);
		// }
	},

	onFBData: function(response){
		// aup.pages.getstarted.hidePopup();
		if (response.status == "connected"){
			aup.log("Facebook : user was succesfully connected! :)");
			var token = response.authResponse.accessToken;
			if (this.access_token!=token){
				aup.log("Facebook : token = ["+token+"]");
				this.access_token = token;
				this.fetch();
			}else{
				aup.log("Facebook : user was not connected! :(");
			}
		}
		// aup.controller.setTitle();
	},
})