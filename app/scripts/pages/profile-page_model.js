aup.ProfilePage = aup.Page.extend({
	visited: false,
	defaults: {
		user: null
	},


	initialize: function(options){
		options 		= options || {};
	},
	render: function(options) {
		if(!this.visited) {
			this.set(options);

			this.visited = true;
			this.view = new aup.ProfilePageView({
				model: this, 
				template:"pages/profile-page"
			});
			this.grid = new aup.PicTileGrid(options);
			this.uinfo = new aup.UserInfo(options);

			this.view.render();
			this.grid.activate();
			this.uinfo.activate();
			this.view.addGrid(this.grid);
			this.view.addInfo(this.uinfo);
		} else {
			this.set(options);

			this.grid.set(options);
			this.uinfo.set(options);
			
			this.view.render();
			this.view.addGrid(this.grid);
			this.view.addInfo(this.uinfo);

			this.grid.reset();
		}

	},

	sleep: function () {
		if(this.grid) this.grid.sleep();
		if(this.uinfo) this.uinfo.sleep();
	}
});