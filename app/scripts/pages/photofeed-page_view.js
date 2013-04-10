aup.PhotofeedPageView = aup.PageView.extend({
	addPhotofeed: function (photofeed_model) {
		this.$el.find('.photofeed-col').html(photofeed_model.view.$el);
	},
});