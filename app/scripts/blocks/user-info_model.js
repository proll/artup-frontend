aup.UserInfo = Backbone.Model.extend({
	url: 'http://api.artupp.ru/v1/users/',
	defaults: {
		sleeped: true,
		user_id: 0,
		user: 0,
		// "id": XXX,
		// "name": "some",
		// "email": "some@email.com",
		// "created": datetime,
		// "balance": XXX,
		// "currency": XXX,
		// "about": информация об авторе
		// user: {
		// 		bio: '',
		// 		first_name: 'Alexander',
		// 		last_name: 'Belyakov',
		// 		name: 'Alexander Belyakov',
		// 		photo: {
		// 			i212x212: 'http://img.weheartpics.com/photo/212x212/701616.jpg',
		// 			i400x400: 'http://img.weheartpics.com/photo/400x400/701616.jpg',
		// 			url: 'http://img.weheartpics.com/photo/SIZEX/701616.jpg',
		// 			i160x160: 'http://img.weheartpics.com/photo/160x160/701616.jpg',
		// 			i106x106: 'http://img.weheartpics.com/photo/106x106/701616.jpg',
		// 			i480x480: 'http://img.weheartpics.com/photo/480x480/701616.jpg',
		// 			i640x640: 'http://img.weheartpics.com/photo/640x640/701616.jpg',
		// 			i1000x1000: 'http://img.weheartpics.com/photo/1000x1000/701616.jpg',
		// 			i320x320: 'http://img.weheartpics.com/photo/320x320/701616.jpg',
		// 			id: 701616
		// 		},
		// 		banned: false,
		// 		fb_id: 1243942241,
		// 		fb_name: 'Alexander Belyakov',
		// 		last_activity: 57926,
		// 		followers_count: 219,
		// 		photos_count: 248,
		// 		followings_count: 18,
		// 		background: {
		// 			i1000x314: 'http://img.weheartpics.com/profile/bg/1000x314/1.jpg?ts=1365313921',
		// 			i640x640: 'http://img.weheartpics.com/profile/bg/640x640/1.jpg?ts=1365313921',
		// 			i480x480: 'http://img.weheartpics.com/profile/bg/480x480/1.jpg?ts=1365313921',
		// 			i320x320: 'http://img.weheartpics.com/profile/bg/320x320/1.jpg?ts=1365313921',
		// 			i1000x1000: 'http://img.weheartpics.com/profile/bg/1000x1000/1.jpg?ts=1365313921'
		// 		},
		// 		follow: false,
		// 		id: 1,
		// 		is_awesome: false
		// }
	},

	initialize: function (options) {
		this.view = new aup.UserInfoView({model:this});
	},

	fetch: function (options) {
		options = options || {};
		options.type = 'get';
		options.data = options.data || {
			user: this.get('user')
		};

		options.success  	= _.bind(this.success, this);
		options.error  		= _.bind(this.error, this);

		this.trigger('load:start');

		return Backbone.Collection.prototype.fetch.call(this, options);
	},

	success: function (model, response, options) {
		response = _.toJSON(response);
		if(!response.error && response.success) {
			this.set(response.result.user);
			this.trigger('load:success');
		} else {
			this.trigger('userinfo:error');
		}
	},

	error: function (model, xhr, options) {
		this.trigger('userinfo:error')
	},

	activate: function() {
		this.set('sleeped', false);
		this.fetch();
	},

	sleep: function() {
		this.set('sleeped', true);
	},

	reset: function () {
		return false;
	},

	remove: function () {
		this.stopListening();
		this.clear({silent: true});
		this.view.remove();
	},
});