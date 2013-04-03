whp.PhotoFeedPage = whp.Page.extend({
	visited: false,
	defaults: {
	},

	initialize: function(options){
		options 		= options || {};
	},
	render: function(options) {
		if(!this.visited) {

			this.visited = true;
			this.view = new whp.PhotoFeedPageView({
				model: this, 
				template:"pages/photofeed-page"
			});
			this.timeline = new whp.Timeline(options);
			// this.menu = new whp.ExploreMenu(options);
			// this.story_menu = new whp.StoryMenu(options);
			// this.story_menu.fetch();

			this.view.render();
			this.timeline.activate();
			this.view.addTimeline(this.timeline);
			// this.view.addMenu(this.menu);
			// this.view.addStoryMenu(this.story_menu);

			// this.story_menu.activate();
		} else {

			this.timeline.set(options);
			// this.menu.set(options);
			// this.story_menu.set(options);
			
			this.view.render();
			this.timeline.activate();
			this.view.addTimeline(this.timeline);
			// this.view.addMenu(this.menu);
			// this.view.addStoryMenu(this.story_menu);

			// this.story_menu.activate();
			this.timeline.reset();

		}

	},

	sleep: function () {
		this.timeline.sleep();
		// this.story_menu.sleep();
	}
});