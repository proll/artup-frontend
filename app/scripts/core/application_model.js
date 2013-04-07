aup.App = Backbone.Model.extend({
	_didScroll: false,

	initialize:function () {
		var that = this,
			aup = window.aup;

		this.config 	= new aup.Config;
		this.statistic 	= new aup.Statistic;

		this.router = new aup.Router;
		this.pages 	= new aup.PagesCollection;


		this.auth = new aup.Auth;
		this.user = new aup.User;

		
		// GLOBAL objects
		aup.config = this.config;
		aup.user = this.user;


		this.navbar = new aup.Navbar;

		// 404 page
		this.pages.add(new aup.Page({
			name:"404",
			template:"pages/404-page"
		}));

		this.router.on("404", function () {
			that.pages.getPage("404").render();
		});



		
		this.photofeed = new aup.PhotofeedPage({
			name: "photofeed",
			template: "pages/photofeed-page"
		});
		this.pages.add(this.photofeed);

		this.explore = new aup.ExplorePage({
			name: "explore",
			template: "pages/explore-page"
		});
		this.pages.add(this.explore);

		this.photo = new aup.PhotoPage({
			name: "photo",
			template: "pages/photo-page"
		});
		this.pages.add(this.photo);


		this.router.on("route", function (router, route, params) {

			if(router == "explore") {

				this.navbar.set("currentItem", "explore");

				this.pages.getPage("explore").render({
					category:   route[0],
					story:  	route[1],
					sort: 		route[2],
					filter: 	route[3], 
				});

			} else if (router == "photofeed") {

				this.navbar.set("currentItem", "photofeed");

				this.pages.getPage("photofeed").render();

			} else if (router == "photo") {

				this.navbar.set("currentItem", "photo");

				// first open photo
				if(this.router.route_passed <= 1) {
					this.pages.getPage("photo").render({
						photo_id: route[0],
						in_popup: false
					});
				} else {
					this.pages.getPage("photo").render({
						photo_id: route[0],
						in_popup: true,
					});
				}
			} else {
				if(!!route[0]) {
					this.navbar.set("currentItem", route[0]);
				}
			}

		}, this);


		this.router.on("reset:explore", function () {
			if(this.router.current_route != 'photo') this.explore.sleep();
		}, this);
		this.router.on("reset:photofeed", function () {
			if(this.router.current_route != 'photo') this.photofeed.sleep();
		}, this);
		this.router.on("reset:photo", function () {
			console.log("reset:photo");
			this.photo.sleep();
		}, this);

		aup.on('historyback', function(){
			aup.navigate(this.router.back_path);
		}, this);


		aup.on('auth:clear', function(){
			aup.navigate('/', {trigger: true});
		});




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
		// 		var page = new aup.Page({
		// 			name:"popup",
		// 			template:"pages/popup-test",
		// 			view: "popupPage"
		// 		});
		// 		this.pages.add(page);
		// 	}
		// 	this.pages.getPage("popup").render();
		// }, this);

		// this.router.on("confirm", function(token){
		// 	aup.trigger("auth:confirm", token);
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
				aup.error(err.description);
			}
		});


		/**
		 * Global event casting
		 */

		/**
		 * USER AUTH EVENTS
		 */

		this.auth.on("auth:success", function (user_obj) {
			aup.trigger("auth:success", user_obj);
		}, this);
		this.auth.on("auth:clear", function () {
			aup.trigger("auth:clear");
		}, this);

		this.user.on("user:error", function(err){
			this.trigger("error", err);
			aup.trigger("auth:clear");
		}, this)

		this.user.settings.on("change:geo_position", function (model, value) {
			aup.trigger("geo_position:ready", value);
		}, this);

		this.user.settings.on("usersettings:ready", function (user_obj) {
			aup.trigger("usersettings:ready", user_obj);
		}, this);


		this.navbar.on("auth:show", function () {
			aup.trigger("auth:show");
		}, this)

		this.navbar.on("navbar:logout", function () {
			aup.trigger("navbar:logout");
		}, this)


		


		/**
		 * Scroll handler
		 */
		var $win = $(window),
			$doc = $(document);

		$(window).scroll(function(){
			if( $win.scrollTop()+150 >= ($doc.height() - $win.height()) ) {
				aup.trigger("pagebottom:reached");
			}
		});


		/**
		 * APPLICATION READY
		 */
		aup.trigger("app:init");
	}
});
