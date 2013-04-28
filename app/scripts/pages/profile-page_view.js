aup.ProfilePageView = aup.PageView.extend({
	events: {
		'click .profile__info-tabs li': 'toggleTabs'
	},

	addInfo: function (info_model) {
		this.$el.find('.profile__info-row').html(info_model.view.$el);
		info_model.on('load:success', function() {
			this.$el.find('.profile__about').html(info_model.get('about'));
		}, this);
	},	
	addGrid: function (grid_model) {
		this.$el.find('.profile-tab-2').html(grid_model.view.$el);
	},

	toggleTabs: function(){
		this.$el.toggleClass('profile_pics');
	}
});