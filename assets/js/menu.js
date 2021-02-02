define(['jquery', 'underscore', 'utils/common'],
	function($, _, Common) {
		'use strict';

		var $doc = $(document);
		var $html = $('html');
		var clsMenuVisible = 'menu-visible';

		function CmpMenu(el) {
			var id = _.uniqueId('cmpmenu$');

			this.$el = $(el).attr('data-id', id);
			this.$ctaShow = $('#topbar .cta-menu');
			this.$ctaHide = this.$el.find('.close-it');

			this.scrollPos = -1;
			this.ev = 'click.' + id;

			if (this.$ctaShow.length) {
				this.init();
			}

			return this;
		}

		CmpMenu.prototype.init = function() {
			var _self = this;

			var fnHide = function() {
				if ($html.hasClass(clsMenuVisible)) {
					$html.removeClass(clsMenuVisible);
					$doc.scrollTop(_self.scrollPos);
				}
			};

			this.$ctaShow.on(this.ev, function() {
				_self.scrollPos = $doc.scrollTop();
				$html.toggleClass(clsMenuVisible);
				$doc.scrollTop(0);
			});

			this.$ctaHide.on(this.ev, fnHide);

			Common.pubsub.subscribe('onEscKeyPressed', fnHide);
		};

		$('[data-cmp="menu"]').each(function() {
			new CmpMenu(this);
		});
	}
);