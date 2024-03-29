aup.PhotoShareView = Backbone.View.extend({
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
		this.template = aup.Templates.get(this.template);
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
		if(this.model.reportPhoto()) {
			this.$el.toggleClass("photo-share_reporting", true);
		}
		return false;
	},

	shareFB: function(e) {
		e.preventDefault();
		this.model.shareFB();
		this.$el.toggleClass("photo-share_fb-sharing", true);
		return false;
	},

	shareTW: function(e) {
		e.preventDefault();
		this.model.shareTW();
		this.$el.toggleClass("photo-share_tw-sharing", true);
		return false;
	},

	shareVK: function(e) {
		e.preventDefault();
		this.model.shareVK();
		this.$el.toggleClass("photo-share_vk-sharing", true);
		return false;
	},

	sharePT: function(e) {
		e.preventDefault();
		this.model.sharePT();
		this.$el.toggleClass("photo-share_pt-sharing", true);
		return false;
	},
});

