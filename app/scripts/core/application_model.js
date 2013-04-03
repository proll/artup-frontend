whp.App = Backbone.Model.extend({
	_didScroll: false,

	initialize:function () {
		var that = this,
			whp = window.whp;

		this.config 	= new whp.Config;
		this.statistic 	= new whp.Statistic;

		this.router = new whp.Router;
		this.pages 	= new whp.PagesCollection;


		this.auth = new whp.Auth;
		this.user = new whp.User;

		
		// GLOBAL objects
		whp.config = this.config;
		whp.user = this.user;


		this.navbar = new whp.Navbar;
		this.header = new whp.Header;

		// 404 page
		this.pages.add(new whp.Page({
			name:"404",
			template:"pages/404-page"
		}));

		this.router.on("404", function () {
			that.pages.getPage("404").render();
		});



		
		this.photofeed = new whp.PhotoFeedPage({
			name: "photofeed",
			template: "pages/photofeed-page"
		});
		this.pages.add(this.photofeed);

		this.explore = new whp.ExplorePage({
			name: "explore",
			template: "pages/explore-page"
		});
		this.pages.add(this.explore);

		this.photo = new whp.PhotoPage({
			name: "photo",
			template: "pages/photo-page"
		});
		this.pages.add(this.photo);


		this.router.on("route", function (router, route, params) {

			if(router == "explore") {

				this.navbar.set("currentItem", "explore");
				this.header.changeItem("explore");

				this.pages.getPage("explore").render({
					category:   route[0],
					story:  	route[1],
					sort: 		route[2],
					filter: 	route[3], 
				});

			} else if (router == "photofeed") {
				this.navbar.set("currentItem", "photofeed");
				this.header.changeItem("photofeed");

				this.pages.getPage("photofeed").render();
			} else if (router == "photo") {

				this.navbar.set("currentItem", "photo");
				this.header.changeItem("photo");

				this.pages.getPage("photo").render({
					photo_id: route[0]
				});
			} else {
				if(!!route[0]) {
					this.header.changeItem(route[0]);
					this.navbar.set("currentItem", route[0]);
				}
			}

		}, this);


		this.router.on("reset:explore", function () {
			this.explore.sleep();
		}, this);
		this.router.on("reset:photofeed", function () {
			this.photofeed.sleep();
		}, this);
		this.router.on("reset:photo", function () {
			this.photo.sleep();
		}, this);





		// this.router.on("route:test", function () {
		// 	this.pages.getPage("test").render();
		// }, this);

		// this.router.on("auth", function (mode) {
		// 	that.auth.set("mode", mode);
		// 	that.auth.view.show();
		// 	return false;
		// });


		// this.router.on("reset", function(prev, destination){
		// 	var prevPage = this.pages.getPage(prev)
		// 	if(this.pages.havePage(prev)){
		// 		this.pages.getPage(prev).remove();	
		// 	}
		// }, this);






		// this.router.on("route:popup", function(){
		// 	if(!this.pages.havePage("popup")){
		// 		var page = new whp.Page({
		// 			name:"popup",
		// 			template:"pages/popup-test",
		// 			view: "popupPage"
		// 		});
		// 		this.pages.add(page);
		// 	}
		// 	this.pages.getPage("popup").render();
		// }, this);

		// this.router.on("confirm", function(token){
		// 	whp.trigger("auth:confirm", token);
		// });

		






		/**
		 * Global event list
		 */
		// "twitter:hi", 	{token, uid, secret} - twitter auth success ;
		// "vkontakte:hi", 	{token, uid} - vkontakte auth success
		// "vkontakte:linker:hi", {token, uid} - strange sheet from vkontakte;
		this.on("twitter:hi", function (user_obj) {
			this.auth.trigger("twitter:hi", user_obj);
		}, this);

		this.on("vkontakte:hi", function (user_obj) {
			this.auth.trigger("vkontakte:hi", user_obj);
		}, this);
		
		this.on("error", function (err) {
			console.error("error");
			if(!!err && !!err.description) {
				whp.error(err.description);
			}
		});


		/**
		 * Global event casting
		 */

		/**
		 * USER AUTH EVENTS
		 */

		this.auth.on("auth:success", function (user_obj) {
			whp.trigger("auth:success", user_obj);
		}, this);
		this.auth.on("auth:clear", function () {
			whp.trigger("auth:clear");
		}, this);

		this.user.on("user:error", function(err){
			this.trigger("error", err);
			whp.trigger("auth:clear");
		}, this)

		this.user.settings.on("change:geo_position", function (model, value) {
			whp.trigger("geo_position:ready", value);
		}, this);

		this.user.settings.on("usersettings:ready", function (user_obj) {
			whp.trigger("usersettings:ready", user_obj);
		}, this);


		this.navbar.on("auth:show", function () {
			whp.trigger("auth:show");
		}, this)

		this.navbar.on("navbar:logout", function () {
			whp.trigger("navbar:logout");
		}, this)


		// this.user.on("no-login", function () {
		// 	whp.trigger("auth:required");
		// 	// whp.trigger("auth:not-required")
		// });

		// this.user.on("login", function (credentials) {
		// 	whp.trigger("user:login", credentials);
		// });

		// this.user.on("settings", function () {
		// 	whp.trigger("auth:success", this.user.toJSON());
		// }, this);

		// this.user.on("change", function () {
		// 	whp.trigger("user:change", this.user.toJSON());
		// }, this);

		// this.navbar.on("login", function () {
		// 	whp.trigger("auth:required");
		// });

		// this.navbar.on("register", function () {
		// 	whp.trigger("auth:register");
		// });

		// this.profile.on("user:token", function (token) {
		// 	whp.trigger("user:token", token)
		// });

		// this.profile.on("user:update", function(userObj){
		// 	whp.trigger("user:update", userObj) 
		// });


		/**
		 * Scroll handler
		 */
		var $win = $(window),
			$doc = $(document);

		$(window).scroll(function(){
			if( $win.scrollTop()+100 >= ($doc.height() - $win.height()) ) {
				whp.trigger("pagebottom:reached");
			}
		});


		/**
		 * APPLICATION READY
		 */
		whp.trigger("app:init");
	}
});
