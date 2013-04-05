aup.PhotoPageView = aup.PageView.extend({
	el: "body",

	addPhoto: function (photo_model) {
		this.$el.find(".photo-page-row").html(photo_model.view.$el);
	},

	render: function(in_popup){
		this.popup_view = new aup.PopupView;
		this.popup_view.on('show', function(){
			this.model.trigger("view:ready");
		}, this);

		if(in_popup) {
			if (this.renderedHtml) {
				this.popup_view.setContent($(this.renderedHtml));
			} else {
				this.renderedHtml = this.template(this.model.toJSON());
				this.popup_view.setContent($(this.renderedHtml));
			}
			this.popup_view.show();

		} else {
			this.setElement("#aup-container");

			if (this.renderedHtml) {
				this.$el.append(this.renderedHtml);
			} else {
				this.renderedHtml = this.template(this.model.toJSON());

				var tmpDiv = $('<div></div>')
					.addClass('page-' + this.model.get('name'))
					.html(this.renderedHtml);
				this.trigger("page:preRender", tmpDiv);
				this.$el.html(tmpDiv);
			}
		}

		/**
		 * описываем в модели метод enterDocument
		 * выполнится после того как page отрисован
		 */
		this.model.enterDocument();
		this.trigger("page:render", this.model);
		this.trigger("enterDocument", this.model);
	},

	show: function() {
	}
});