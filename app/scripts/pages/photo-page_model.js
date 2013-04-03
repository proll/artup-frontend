whp.PhotoPage = whp.Page.extend({
	visited: false,
	defaults: {
	},

	initialize: function(options){
		options 		= options || {};
	},
	render: function(options) {
		// if(!this.visited) {

			this.visited = true;
			this.view = new whp.PhotoPageView({
				model: this, 
				template:"pages/photo-page"
			});


			this.photo = new whp.Photo(options);

			this.view.render(true);
			this.photo.activate();
			this.view.addPhoto(this.photo);
		// }
		// } else {

		// 	this.photo.set(options);
			
		// 	this.view.render();
		// 	this.photo.activate();
		// 	this.view.addPhoto(this.photo);

		// 	this.photo.reset();

		// }

	},

	sleep: function () {
		this.photo.remove();
	}
});