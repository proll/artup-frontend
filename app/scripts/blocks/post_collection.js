aup.PostCollection = Backbone.Collection.extend({
	url: "/api/timeline/",
	model: aup.Post,
	more: true,

	// 
	// we need only the list of feed
	// ______________________________
	parse: function(resp, options) {
		resp = _.toJSON(resp);
		if(!!resp.feed) {

			this.more = resp.feed.more;

			if(!!resp.feed.list) {
				return resp.feed.list;
			} else {
				return false;
			}
		}

	},

	// 
	// it have to add only
	// ______________________________
	fetch: function (options) {
		if(this.more) {
			options = options || {};
			options.type = "post";
			options.update = true;
			options.remove = false;
			options.data = options.data || {
				offset: 	0,
				limit: 		30,
			};

			options.success  	= _.bind(this.success, this);
			options.error  		= _.bind(this.error, this);

			this.trigger("load:start");
			
			return Backbone.Collection.prototype.fetch.call(this, options);
		}
	},

	success: function (collection, response, options) {
		response = _.toJSON(response);
		if(!response.error) {
			this.trigger("load:success");
		} else {
			this.trigger("load:error");
		}
	},

	error: function (collection, xhr, options) {
		this.trigger("load:error")
	}
});