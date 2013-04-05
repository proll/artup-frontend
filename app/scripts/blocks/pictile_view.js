aup.PicTileView = Backbone.View.extend({
	template: "blocks/pictile",
	tagName: "div",
	className: "pic-tile",
	$image: null,
	image: null,

	initialize: function(options){
		this.template = aup.Templates.get(this.template);
		this.render();
		this.model.on("change:src", this.loadTile, this);
	},

	render: function(){
	},


	loadTile: function () {
		var template = this.template(this.model.toJSON());
		this.$el.html(template);
		this.$image = this.$el.find("img");
		this.image = new Image();
		this.image.src = this.$image.data("orig");
		this.image.onload = _.bind(this.onImageLoad, this);
		this.image.onerror = _.bind(this.onImageError, this);
	},

	onImageLoad: function () {
		this.image.onload = null;
		this.image = null;

		this.$el.toggleClass("pic-tile-loaded", true);
		this.$image.attr("src", this.$image.data("orig"));
	},

	onImageError: function () {
		this.trigger("pictile:loaderror");
	}


});

