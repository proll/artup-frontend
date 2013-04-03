whp.Statistic = Backbone.Model.extend({
	url: '/api/photo/share/',

	initialize : function() {
	},

	trackPageChange : function(_url) {
		if ((whp.router == "profile")) {
			str = "/profile/";
			// str = "/profile/"+WHP.pages.profile.states[WHP.pages.profile.curState].urlPrefix;
		}else{
			var str = new String(_url);
			if (str.charAt(0)!="/") {
				str = "/"+str;
			}
		}
		_gaq.push(['_trackPageview', str]);
	},

	trackLike : function(_label){
		_gaq.push(['_trackEvent', 'Photo', 'like', _label]);
	},

	// TODO перевести счетчики на localStorage
	getCommentsCount : function() {
		var counter = parseInt(_.getCookie("whp_comc"));
		if (_.isNaN(counter)){
			counter = 0;
		}
		return counter;
	},

	getLikesCount : function() {
		var counter = parseInt(_.getCookie("whp_likec"));
		if (_.isNaN(counter)) {
			counter = 0;
		}
		return counter;
	},

	getSharesCount : function() {
		var counter = parseInt(_.getCookie("whp_shrc"));
		if (_.isNaN(counter)) {
			counter = 0;
		}
		return counter;
	},

	trackLike: function(){
		var counter = _.getCookie("whp_likec");
		if (_.isNaN(counter)) {
			counter = 0;
		}
		counter++;
		_.setCookie("whp_likec", counter, 60*1000);
	},


	trackComment: function(_reply) {
		var counter = _.getCookie("whp_comc");
		if (_.isNaN(counter)) {
			counter = 0;
		}
		counter++;
		_.setCookie("whp_comc", counter, 60*1000);

		var reply = _reply == true;
		if (reply) {
			_gaq.push(['_trackEvent', 'Photo', 'reply']);
		} else {
			_gaq.push(['_trackEvent', 'Photo', 'comment']);
		}
	},

	trackShare : function(_param, _id) {
		if (_param == "SHARE_FACEBOOK") {
			var counter = _.getCookie("whp_shrc");
			if (_.isNaN(counter)) {
				counter = 0;
			}
			counter++;
			_.setCookie("whp_shrc", counter, 60*1000);
		}

		var _social = "";
		if (_param == "SHARE_FACEBOOK") {
			_social = "facebook";
		} else if (_param == "SHARE_PINTEREST") {
			_social = "pinterest";
		} else if (_param == "SHARE_TWITTER") {
			_social = "twitter";
		}


		$.ajax({
			url: _.toSafeUrl(this.url),
			data : { 
				photo :  _id, 
				social : _social 
			}
		});
		_gaq.push(['_trackEvent', 'Photo', 'share', _param]);
	},

	trackTimeline : function(_main, _N) {
		var mainStr = "USER_TIMELINE_";
		if (_main) {
			mainStr = "MAIN_TIMELINE_";
		}

		_gaq.push(['_trackEvent', 'Timeline', 'PagesLoaded', mainStr+_N, _N]);
	},

	trackNotifications : function(_N) {
		_gaq.push(['_trackEvent', 'Notifications', 'PagesLoaded', "PAGES_LOADED_"+_N, _N]);
	},

	trackDownload : function(_param) {
		_gaq.push(['_trackEvent', 'Download', 'click', _param]);
	},

	trackEmptyTimeline : function(_main) {
		var mainStr = "SHOW_TIMELINE_USER_EMPTY";
		if (_main) {
			mainStr = "SHOW_TIMELINE_MAIN_EMPTY";
		}

		_gaq.push(['_trackEvent', 'Download', 'Views', mainStr]);
	},

	trackPhotoPlateShow : function() {
		_gaq.push(['_trackEvent', 'Download', 'Views', "SHOW_PHOTO_PAGE_PLATE"]);
	},

	trackDownloadButtonMenu : function(_new) {
		var mainStr = "SHOW_DOWNLOAD_MENU_NEW";
		if (!_new) {
			mainStr = "SHOW_DOWNLOAD_MENU"
		}
		_gaq.push(['_trackEvent', 'Download', 'Views', mainStr]);
	},

	trackEmptyStories : function() {
		_gaq.push(['_trackEvent', 'Download', 'Views', "SHOW_EMPTYSTORIES_DOWNLOAD"]);
	},

	trackShowMainButton : function() {
		_gaq.push(['_trackEvent', 'Download', 'Views', "SHOW_MAIN_DOWNLOAD"]);
	},

	trackXclick : function() {
		_gaq.push(['_trackEvent', 'Download', 'Views', "SHOW_CLICK_CLOSE_PLATE"]);
	},

	trackShuffle : function() {
		var N = parseInt(_.getCookie("whpsc"));
		if (_.isNaN(N)) {
			N = 0;
		}
		N++;
		_.setCookie("whpsc", N, 1000);
		_gaq.push(['_trackEvent', 'Other', 'Shuffle', "click", N]);
	}

});