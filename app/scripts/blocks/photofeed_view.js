aup.PhotofeedView = Backbone.View.extend({
	tagName: "div",
	className: "photofeed",

	initialize: function(options){
		this.collection = options.collection;
		this.collection.on("add", this.addPic, this);
		this.collection.on("load:start", 	this.showSpinner, this);
		this.collection.on("load:success", 	this.hideSpinner, this);
		this.collection.on("load:error", 	this.hideSpinner, this);
		this.$spinner = null;

		this.model = options.model;

		this.$cont = $('<div class="photofeed__container"></div>').appendTo(this.$el);
		this.showSpinner();
	},

	addPic: function (model, collection, options) {
		this.$cont.append(model.view.$el);
	},


	showSpinner: function () {
		if(!this.$spinner) {
			this.$spinner = $('<div class="photofeed__spinner"></div>').appendTo(this.$el);
		} else {
			this.$spinner.toggleClass("hidden", false);
		}
	},

	hideSpinner: function () {
		if(this.$spinner) {
			this.$spinner.toggleClass("hidden", true);
		}
	},	
});