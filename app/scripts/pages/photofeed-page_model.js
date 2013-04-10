aup.PhotofeedPage = aup.Page.extend({
	visited: false,
	defaults: {
	},

	initialize: function(options){
		options 		= options || {};
	},
	render: function(options) {
		if(aup.is_needauth()) {
			return false;
		}

		if(!this.visited) {

			this.visited = true;
			this.view = new aup.PhotofeedPageView({
				model: this, 
				template:"pages/photofeed-page"
			});
			this.photofeed = new aup.Photofeed(options);

			this.view.render();
			this.photofeed.activate();
			this.view.addPhotofeed(this.photofeed);
		} else {

			this.photofeed.set(options);
			
			this.view.render();
			this.photofeed.activate();
			this.view.addPhotofeed(this.photofeed);

			this.photofeed.reset();

		}

	},

	sleep: function () {
		this.photofeed.sleep();
		// this.story_menu.sleep();
	}
});