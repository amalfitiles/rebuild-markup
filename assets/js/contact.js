define(['jquery', 'underscore'],
	function($, _) {
		'use strict';

		var imageAttr = 'data-img-src';

		function CmpContact(el) {
			var _self = this;
			var id = _.uniqueId('cmpfave$');

			this.$el = $(el).attr('data-id', id);
			this.$fields = this.$el.find('input, textarea, select, button');
			this.$fName = this.$el.find('#cfname');
			this.$fEmail = this.$el.find('#cfemail');
			this.$fPhone = this.$el.find('#cfphone');
			this.$fPostCode = this.$el.find('#cfpostcode');
			this.$fSubject = this.$el.find('#cfsubject');
			this.$fSubjects = this.$el.find('#cfsubject > option');
			this.$fMessage = this.$el.find('#cfmessage');
			this.$fRecipient = this.$el.find('#cfrecipient');

			this.$fSubject.on('change', function() {
				var $selected = _self.$fSubjects.eq(this.selectedIndex);
				if ($selected.length) {
					_self.$fRecipient.val($selected.attr('data-recipient'));
				}
			});

			this.$el.on('submit', function() {
				_self.submit();
				return false;
			});

			this.loadImages();

			return this;
		}

		CmpContact.prototype.loadImages = function() {
			var $frames = this.$el.find('.frame[' + imageAttr + ']');
			if ($frames.length) {
				$frames.each(function() {
					var $f = $(this);
					var src = $f.attr(imageAttr);
					if (src && src !== '') {
						var img = new window.Image();
						$(img).on('load', function() {
							$f.css('background-image', 'url(' + src + ')');
							$f.removeAttr(imageAttr);
						});
						img.src = src;
					}
				});
			}
		};

		CmpContact.prototype.setFieldsEnabled = function(bool) {
			if (bool) {
				this.$fields.prop('disabled', false);
			} else {
				this.$fields.prop('disabled', true);
			}
		};

		CmpContact.prototype.submit = function() {
			var _self = this;

			this.setFieldsEnabled(false);

			var fName = $.trim(this.$fName.val());
			var fEmail = $.trim(this.$fEmail.val());
			var fPhone = $.trim(this.$fPhone.val());
			var fPostCode = $.trim(this.$fPostCode.val());
			var fSubject = $.trim(this.$fSubject.val());
			var fMessage = $.trim(this.$fMessage.val());
			var fRecipient = $.trim(this.$fRecipient.val());

			if (fEmail.match(window.__APP.emailRegex) === null || fEmail === '' || fName === '' || fPhone === '' || fPostCode === '' || fSubject === '' || fMessage === '' || fRecipient === '') {
				window.alert('Please fill all fields');
				this.setFieldsEnabled(true);
			} else {
				$.ajax({
					type : 'POST',
					url : window.__APP.ajaxUrl,
					data : {
						action : 'send_inquiry',
						name : fName,
						email : fEmail,
						phone : fPhone,
						postcode : fPostCode,
						subject : fSubject,
						message : fMessage,
						recipient : fRecipient
					},
					success : function(data) {
						fbq('track', 'Contact');
						fbq('track', 'Lead');
						console.log(data)
						_self.onFormSent(data);
					},
					dataType : 'json'
				});
			}
		};

		CmpContact.prototype.onFormSent = function(data) {
			console.log(data);
			if (data && data.success) {
				window.alert('Your message has been sent successfully.\nWe\'ll get to you as soon as possible.');
			}

			this.$el.get(0).reset();
			this.setFieldsEnabled(true);
		};

		$('[data-cmp="contact"]').each(function() {
			new CmpContact(this);
		});
	}
);