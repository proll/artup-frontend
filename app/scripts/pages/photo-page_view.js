aup.PhotoPageView = aup.PageView.extend({
	el: "body",

	addPhoto: function (photo_model) {
		this.$el.find(".photo-page-row").html(photo_model.view.$el);
	},

	render: function(in_popup){
		this.popup_view = new aup.PopupView({class: "photo-popup"});
		this.popup_view.on('show', function(){
			this.reposition();
		}, this);

		this.popup_view.on('hide', function(){
			aup.trigger("historyback");
		}, this);

		this.is_popup = in_popup;
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
		this.model.photo.on('photo:ready', this.reposition, this);
		


		/**
		 * описываем в модели метод enterDocument
		 * выполнится после того как page отрисован
		 */
		this.model.enterDocument();
		this.trigger("page:render", this.model);
		this.trigger("enterDocument", this.model);

		$(window).on('resize.photo_page', _.bind(this.reposition, this));
	},

	show: function() {
	},

	remove: function() {
		$(window).off('resize.photo_page');
	},

	reposition: function() {
		var $w = $(window),
			w = $w.width(),
			h = $w.height(),

			repos_w = 0;

			indent = 35 + 94,
			min_img_h = 500,
			max_img_h = 730,

			can_reposition = ( w >= 640 );

		if(!this.is_popup) {
			indent = 66 + 94;
		}

		if( can_reposition ) {

			if (h <= min_img_h + indent) {
				repos_w = min_img_h;
			} else if (h <= max_img_h + indent) {
				repos_w = h - indent;
			} else {
				repos_w = 'auto';
			}

		} else {
			repos_w = 'auto'
		}

		var $row = '';
		if(this.is_popup) {
			$row = this.$el.find(".popup__content");
			$row.css({
				width: repos_w
			})

			$row = this.$el.find(".popup__inner");
			// for desktop
			if(w >= 950) {
				$row.css({
					width: repos_w + 2*85
				})
			} else {
				$row.removeAttr('style');
			}


		} else {
			$row = this.$el.find(".photo-row");
			$row.css({
				width: repos_w
			})
		}

		var $img_cont = this.$el.find('.photo__pic-tile');
		$img_cont.css({
			height: repos_w
		})
	}
});