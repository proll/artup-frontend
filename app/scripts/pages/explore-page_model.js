aup.ExplorePage = aup.Page.extend({
	visited: false,
	defaults: {
		uid: null
	},

	initialize: function(options){
		options 		= options || {};
		aup.on("usersettings:ready", function(user_obj){
			this.set("uid", user_obj.user.id);
		}, this);
		aup.on("auth:clear", function(user_obj){
			this.unset("uid");
		}, this);

		this.on("change:uid", function () {
			if(!!this.grid) {
				this.grid.set("user", this.get("uid"), {silent: true})
				this.grid.reload();
			}
		}, this)
	},
	render: function(options) {
		if(!this.visited) {

			this.visited = true;
			this.view = new aup.ExplorePageView({
				model: this, 
				template:"pages/explore-page"
			});
			this.grid = new aup.PicTileGrid( _.extend(options, {user: this.get("uid")}) );
			this.menu = new aup.ExploreMenu(options);
			// this.story_menu = new aup.StoryMenu(options);
			// this.story_menu.fetch();

			this.view.render();
			this.grid.activate();
			this.view.addGrid(this.grid);
			this.view.addMenu(this.menu);
			// this.view.addStoryMenu(this.story_menu);

			// this.story_menu.activate();
		} else {

			this.grid.set( _.extend(options, {user: this.get("uid")}) );
			this.menu.set(options);
			// this.story_menu.set(options);
			
			this.view.render();
			this.grid.activate();
			this.view.addGrid(this.grid);
			this.view.addMenu(this.menu);
			// this.view.addStoryMenu(this.story_menu);

			// this.story_menu.activate();
			this.grid.reset();

		}

	},

	sleep: function () {
		this.grid.sleep();
		// this.story_menu.sleep();
	}
});