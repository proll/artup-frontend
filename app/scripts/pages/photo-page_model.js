aup.PhotoPage = aup.Page.extend({
	visited: false,
	defaults: {
	},

	initialize: function(options){
		options 		= options || {};
	},
	render: function(options) {
		// if(!this.visited) {

			this.visited = true;
			this.view = new aup.PhotoPageView({
				model: this, 
				template:"pages/photo-page"
			});


			this.photo = new aup.Photo(options);

			options.in_popup = !!options.in_popup;
			this.view.render(options.in_popup);

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