whp.PhotoView = Backbone.View.extend({
	template: "blocks/photo",
	tagName: "div",
	className: "photo-row",
	$image: null,
	image: null,

	events: {
		"click .photo__vote": "vote",
		"dblclick .photo__pic-tile": "vote"
	},

	initialize: function(options){
		if(!!options.template) {
			this.template = options.template;
		}
		this.template = whp.Templates.get(this.template);
		this.model.on("load:success", this.render, this);
		this.model.on("change:sleeped", this.reset, this);
		this.model.on("update:vote", this.updateVote, this);
	},

	render: function(){
		var template = this.template(this.model.toJSON());
		this.$el.html(template);

		this.$vote = this.$el.find(".photo__vote");
		
		this.$image = this.$el.find("img.lazy");
		this.image = new Image();
		this.image.src = this.$image.data("orig");
		this.image.onload = _.bind(this.onImageLoad, this);
		this.image.onerror = _.bind(this.onImageError, this);

		this.delegateEvents();
	},

	onImageLoad: function () {
		this.image.onload = null;
		this.image = null;

		this.$image.attr("src", this.$image.data("orig"));
		this.$el.toggleClass("photo-loaded", true);
	},

	onImageError: function () {
		this.trigger("photo:loaderror");
	},

	reset: function() {
		this.undelegateEvents();
		this.$el.html("");
	},

	vote: function() {
		var wasvote = parseInt(this.model.get("photo").wasvote) || 0;

		if(!wasvote) {
			this.$vote.toggleClass("active", true);
			this.model.addVote();
		} else {
			this.$vote.toggleClass("active", false);
			this.model.removeVote();
		}
	},

	addLikers: function(likers_model) {
		this.$el.find(".photo-likers__cont").append(likers_model.view.$el);
	},

	addComments: function(comments_model) {
		this.$el.find(".photo-comment-pane__cont").append(comments_model.view.$el);
	},

	addShare: function(share_model) {
		this.$el.find(".photo-share__cont").append(share_model.view.$el);
	},

	updateVote: function(options) {

		if(!!options) {
			this.$vote
				.find(".photo__vote-title")
					.text(options.vote_count);
		}
	}

});

