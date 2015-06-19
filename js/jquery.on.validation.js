/*!
 * Jquery on.validation plugin
 *
 * Copyright 2015 Owen Nicol
 * Author: Owen Nicol
 * Version 2.1.1
 *
 * DEPENDENCIES:
 *	JQuery 1.11.x - http://jquery.com/download/
 */


/*jslint browser: true*/
/*global $, jQuery, alert, console*/

(function ($, window, document) {
	'use strict';
	// Avoid `console` errors in browsers that lack a console.
	(function () {
		var method,
			noop = function () {},
			methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'],
			length = methods.length,
			console = (window.console = window.console || {});

		while (length--) {
			method = methods[length];

			// Only stub undefined methods.
			if (!console[method]) {
				console[method] = noop;
			}
		}
	}());


	var pluginName = 'onValidation',
		version = '2.1.2';


	// ***** Start: Public Methods *****
	var methods = {
		init: function (options) {
			//"this" is a jquery object on which this plugin has been invoked.

			var $this = $(this),
				data = $this.data(pluginName);

			// If the plugin hasn't been initialized yet
			if (!data) {
				var settings = {
					fieldClass: 'required',
					selectClass: 'required-select',
					radioClass: 'required-radio',
					checkboxClass: 'required-checkbox',
					validateField: true,
					validateSelect: false,
					validateRadio: false,
					validateCheckbox: false,
					debug: false,
					scrollToFirstError: false,
					scrollSpeed: 400
				};
				if (options) {
					$.extend(true, settings, options);
				}

				$this.data(pluginName, {
					target: $this,
					settings: settings
				});
			}

			return methods.startup.apply($this);


		},
		startup: function () {
			var $this = $(this),
				data = $this.data(pluginName),
				form = $this,
				options = data.settings;

			return methods.validateForm(form, options);
		},
		validateForm: function (form, options) {

			var field = $('.' + options.fieldClass),
				select = $('.' + options.selectClass),
				radio = $('.' + options.radioClass),
				checkbox = $('.' + options.checkboxClass),
				isValid = false,
				fieldIsValid,
				selectIsValid,
				radioIsValid,
				checkboxIsValid,
				debug = options.debug,
				scrollToFirstError = options.scrollToFirstError,
				scrollSpeed = options.scrollSpeed;


			if (options.validateField) {
				fieldIsValid = true;
				//validate field on keyup or blur
				form.find(field).on('keyup blur', function (e) {
					if (!methods.validateField(this)) {
						fieldIsValid = false;
					}
				});
			}
			if (options.validateSelect) {
				//validate select boxes on change
				selectIsValid = true;
				form.find(select).on('change', function () {
					if (!methods.validateSelect(this)) {
						selectIsValid = false;
					}
				});
			}
			if (options.validateRadio) {
				//validate radio buttons on change
				radioIsValid = true;
				form.find(radio).on('change', function () {
					if (!methods.validateRadio(this)) {
						radioIsValid = false;
					}
				});
			}


			if (options.validateCheckbox) {
				//validate checkboxes buttons on change
				checkboxIsValid = true;
				form.find(checkbox).on('change', function () {
					if (!methods.validateCheckbox(this)) {
						checkboxIsValid = false;
					}
				});
			}


			if (options.validateField) {
				fieldIsValid = true;
				form.find(field).each(function () {
					if (!methods.validateField(this)) {
						fieldIsValid = false;
					}
					if (debug) {
						console.log('field-valid: ' + $(this).attr('id') + ' ' + fieldIsValid);
					}
				});
			} else {
				fieldIsValid = true;
			}

			if (options.validateSelect) {
				selectIsValid = true;
				form.find(select).each(function () {
					if (!methods.validateSelect(this)) {
						selectIsValid = false;
					}
					if (debug) {
						console.log('select-valid: ' + selectIsValid);
					}
				});
			} else {
				selectIsValid = true;
			}

			if (options.validateRadio) {
				radioIsValid = true;
				form.find(radio).each(function () {
					if (!methods.validateRadio(this)) {
						radioIsValid = false;
					}
					if (debug) {
						console.log('radio-valid: ' + radioIsValid);
					}
				});
			} else {
				radioIsValid = true;
			}


			if (options.validateCheckbox) {
				checkboxIsValid = true;
				form.find(checkbox).each(function () {
					if (!methods.validateCheckbox(this)) {
						checkboxIsValid = false;
					}
					if (debug) {
						console.log('checkbox-valid: ' + checkboxIsValid);
					}
				});
			} else {
				checkboxIsValid = true;
			}


			if (fieldIsValid && selectIsValid && radioIsValid) {
				isValid = true;
			} else {
				isValid = false;
				if (scrollToFirstError) {
					$('html, body').animate({
						scrollTop: $('.input-validation-error').first().offset().top
					}, scrollSpeed);
				}
			}

			return isValid;
		},
		validateField: function (textbox) {

			var fieldIsValid;
			var doesCompare = false;

			var self = $(textbox), //form field
				value = self.val(), //value of the form field
				origID = self.attr('id'), //id of the form field
				valType = self.attr('data-validate'), //validation type
				compareField = self.attr('data-compare'), // comapare field
				minChars = self.attr('data-min-chars'),
				id = origID,
				label = $('label[for="' + origID + '"]'),
				errorSpan = $('span[data-for="' + id + '"]'); //get the span for the current field

			var compareLabel = $('label[for="' + compareField + '"]').html();

			if (label.length > 0) {
				label = label.html(); //get the label text for the form field
			}

			if (compareField) {

				if ((value == $('[data-compare-id="' + compareField + '"]').val()) && (value !== '')) {
					doesCompare = true;
				} else {
					doesCompare = false;
				}
			} else {
				doesCompare = true;
			}


			if (!minChars) {
				minChars = 0;
			}


			var filter;

			switch (valType) {
			case "alpha-num":
			default:
				//alpha numeric with spaces
				filter = /^[a-z\d\"'-_\s]+$/i;
				break;
			case "date":
				filter = /[A-Za-z0-9\/ _.,!"'/$]/i;
				break;
			case "address":
				//address
				filter = /[A-Za-z0-9 _.,!"'/$]/i;
				break;
			case "phone":
				//phone number
				filter = /[0-9 -()+]+$/;
				break;
			case "email":
				//email
				//filter = /^[a-zA-Z0-9]+[a-zA-Z0-9_.-]+[a-zA-Z0-9_-]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9]+.[a-z]{2,4}$/;
				filter = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
				break;
			case "number":
				filter = /^\d+$/;
			}

			//isn't valid
			if ((!filter.test(value)) || (!doesCompare) || (value.length < minChars)) {
				self.addClass('input-validation-error');

				if (label.length > 0) {
					if (!filter.test(value)) {
						if (!doesCompare) {
							errorSpan.addClass('field-validation-error').html('Please confirm your ' + compareLabel.toLowerCase());
						} else {
							errorSpan.addClass('field-validation-error').html('Please enter your ' + label.toLowerCase());
						}
					} else if (!doesCompare) {
						errorSpan.addClass('field-validation-error').html('Please confirm your ' + compareLabel.toLowerCase());
					}
				}
				fieldIsValid = false;
			} else {
				self.removeClass('input-validation-error');
				if (label.length > 0) {
					errorSpan.removeClass('field-validation-error').html('');
				}
				fieldIsValid = true;
			}

			return fieldIsValid;
		},
		validateSelect: function (selectBox) {

			var fieldIsValid;

			var self = $(selectBox), //form field
				value = self.val(), //value of the form field
				origID = self.attr('id'), //id of the form field
				id = origID;
			errorSpan = $('span[data-for="' + id + '"]'); //get the span for the current select box

			//isn't valid
			if ((value === "") || (value === "-1")) {
				self.addClass('input-validation-error');
				errorSpan.addClass('field-validation-error').html('Please select an option');
				fieldIsValid = false;
			} else {
				self.removeClass('input-validation-error');
				errorSpan.removeClass('field-validation-error').html('');
				fieldIsValid = true;
			}

			return fieldIsValid;
		},
		validateRadio: function (radio) {

			var fieldIsValid;

			var self = $(radio).find('input'), //form field
				name = self.attr('name'), //name of radio button group
				errorSpan = $('span[data-for="' + name + '"]'), //get the span for the current radio button
				label = $(radio).find('label');

			if (!$('input:radio[name="' + name + '"]').is(':checked')) {
				errorSpan.addClass('field-validation-error').html('Please select an option');
				label.addClass('checkbox-validation-error');
				fieldIsValid = false;
			} else {
				self.removeClass('input-validation-error');
				errorSpan.removeClass('field-validation-error').html('');
				label.removeClass('checkbox-validation-error');
				fieldIsValid = true;
			}

			return fieldIsValid;

		},
		validateCheckbox: function (checkbox) {

			var fieldIsValid;

			var self = $(checkbox).find('input'), //form field
				name = self.attr('name'), //name of checkbox button group
				errorSpan = $('span[data-for="' + name + '"]'), //get the span for the current checkbox button
				label = $(checkbox).find('label');

			if (!$('input:checkbox[name="' + name + '"]').is(':checked')) {
				errorSpan.addClass('field-validation-error').html('Please select an option');
				label.addClass('checkbox-validation-error');
				fieldIsValid = false;
			} else {
				self.removeClass('input-validation-error');
				errorSpan.removeClass('field-validation-error').html('');
				label.removeClass('checkbox-validation-error');
				fieldIsValid = true;
			}

			return fieldIsValid;

		},
		resetForm: function () {
			var $this = $(this),
				data = $this.data(pluginName);

			if (data) {

				var form = $('#' + $this.attr('id')),
					options = data.settings,
					field = $('.' + options.fieldClass),
					select = $('.' + options.selectClass),
					radio = $('.' + options.radioClass);

				if (options.validateField) {
					field.val('').removeClass('input-validation-error');
					field.prev().removeClass('input-validation-error');
					field.next().removeClass('field-validation-error').html('');
				}
				if (options.validateSelect) {
					select.val('').removeClass('input-validation-error');
					select.prev().removeClass('input-validation-error');
					select.next().removeClass('field-validation-error').html('');
				}
				if (options.validateRadio) {
					radio.val('').removeClass('input-validation-error');
					radio.prev().removeClass('input-validation-error');
					radio.next().removeClass('field-validation-error').html('');
				}

				if (options.validateCheckbox) {
					checkbox.val('').removeClass('input-validation-error');
					checkbox.prev().removeClass('input-validation-error');
					checkbox.next().removeClass('field-validation-error').html('');
				}
			}



		}
	};


	// ***** Start: Supervisor *****
	$.fn[pluginName] = function (method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist in jQuery.' + pluginName);
		}
	};
	// ***** end: Supervisor *****


})(jQuery, window, document);
