whp.PhotoShareView = Backbone.View.extend({
	template: 	'blocks/photo-share',
	tagName: 	'div',
	className: 	'photo-share',

	events: {
		"click .photo-share__report>a": "reportPhoto",
		"click .photo-share__fb>a": "shareFB",
		"click .photo-share__tw>a": "shareTW",
		"click .photo-share__vk>a": "shareVK",
		"click .photo-share__pt>a": "sharePT",
	},

	initialize: function(options){
		this.template = whp.Templates.get(this.template);
		this.render();

		this.model.on("reportphoto:success reportphoto:error", function() {
			this.$el.toggleClass("photo-share_reporting", false);
		}, this);

		this.model.on("fbshare:success fbshare:error", function() {
			this.$el.toggleClass("photo-share_fb-sharing", false);
		}, this);
		this.model.on("twshare:success twshare:error", function() {
			this.$el.toggleClass("photo-share_tw-sharing", false);
		}, this);
		this.model.on("ptshare:success ptshare:error", function() {
			this.$el.toggleClass("photo-share_pt-sharing", false);
		}, this);
	},

	render: function(){
		var template = this.template(this.model.toJSON());
		this.$el.html(template);
	},

	reportPhoto: function() {
		this.$el.toggleClass("photo-share_reporting", true);
		this.model.reportPhoto();
		return false;
	},

	shareFB: function(e) {
		e.preventDefault();
		this.$el.toggleClass("photo-share_fb-sharing", true);
		this.model.shareFB();
		return false;
	},

	shareTW: function(e) {
		e.preventDefault();
		this.$el.toggleClass("photo-share_tw-sharing", true);
		this.model.shareTW();
		return false;
	},

	shareVK: function(e) {
		e.preventDefault();
		this.$el.toggleClass("photo-share_vk-sharing", true);
		this.model.shareVK();
		return false;
	},

	sharePT: function(e) {
		e.preventDefault();
		this.$el.toggleClass("photo-share_pt-sharing", true);
		this.model.sharePT();
		return false;
	},
});

