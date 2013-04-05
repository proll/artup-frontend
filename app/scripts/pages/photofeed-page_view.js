aup.PhotoFeedPageView = aup.PageView.extend({
	addTimeline: function (timeline_model) {
		this.$el.find('.timeline-col').html(timeline_model.view.$el);
	},
});