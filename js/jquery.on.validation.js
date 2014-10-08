;
(function ($, window, document, undefined) {


    // Avoid `console` errors in browsers that lack a console.
    (function () {
        var method;
        var noop = function () { };
        var methods = [
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
            'timeStamp', 'trace', 'warn'
        ];
        var length = methods.length;
        var console = (window.console = window.console || {});

        while (length--) {
            method = methods[length];

            // Only stub undefined methods.
            if (!console[method]) {
                console[method] = noop;
            }
        }
    }());

    var pluginName = 'onValidation',
		version = '1.1';


    // ***** Start: Public Methods *****
    var methods = {
        init: function (options) {
            //"this" is a jquery object on which this plugin has been invoked.

            var $this = $(this);
            var data = $this.data(pluginName);
            // If the plugin hasn't been initialized yet
            if (!data) {
                var settings = {
                    fieldClass: 'required',
                    selectClass: 'required-select',
                    radioClass: 'required-radio',
                    validateField: true,
                    validateSelect: false,
                    validateRadio: false
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
                isValid = false,
                fieldIsValid,
                selectIsValid,
                radioIsValid;

            if (options.validateField) {
                //validate field on keyup or blur
                form.find(field).on('keyup blur', function (e) {
                    methods.validateField(this);
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
                //validate select boxes on keyup or blur
                radioIsValid = true;
                form.find(radio).on('change', function () {
                    if (!methods.validateRadio(this)) {
                        radioIsValid = false;
                    }
                    methods.validateRadio(this);
                });
            }

            if (options.validateField) {
                fieldIsValid = true;
                form.find(field).each(function () {
                    if (!methods.validateField(this)) {
                        fieldIsValid = false;
                    }
                    console.log('field-valid: ' + $(this).attr('id') + ' ' + fieldIsValid);
                });
            }
            else {
                fieldIsValid = true;
            }

            if (options.validateSelect) {
                selectIsValid = true;
                form.find(select).each(function () {
                    if (!methods.validateSelect(this)) {
                        selectIsValid = false;
                    }
                    console.log('select-valid: ' + selectIsValid);
                });
            }
            else {
                selectIsValid = true;
            }

            if (options.validateRadio) {
                radioIsValid = true;
                form.find(radio).each(function () {
                    if (!methods.validateRadio(radio)) {
                        radioIsValid = false;
                    }
                    console.log('radio-valid: ' + radioIsValid);
                });
            }
            else {
                radioIsValid = true;
            }


            if (fieldIsValid && selectIsValid && radioIsValid) {
                isValid = true;
            }
            else {
                isValid = false;
            }

            return isValid;
        },
        validateField: function (textbox) {

            var fieldIsValid;
            var doesCompare = false;

            var self = $(textbox), //form field
                value = self.val(), //value of the form field
                origID = self.attr('id'), //id of the form field
                valType = self.attr('data-val'), //validation type
                compareField = self.attr('data-compare'), // comapare field
                id = origID;
            label = $('label[for="' + origID + '"]').html(), //get the label text for the form field
            errorSpan = $('span[data-for="' + id + '"]'); //get the span for the current field

            var compareLabel = $('label[for="' + compareField + '"]').html();


            if (compareField) {
                if ((value == $('#' + compareField).val()) && (value !== '')) {
                    doesCompare = true;
                }
                else {
                    doesCompare = false;
                }
            }
            else {
                doesCompare = true;
            }

            console.log('doesCompare: ' + label + ' ' + doesCompare);

            var filter;

            switch (valType) {
                case "alpha-num":
                    //alpha numeric with spaces
                    filter = /^[a-z\d\-_\s]+$/i;
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
                    filter = /^[a-zA-Z0-9]+[a-zA-Z0-9_.-]+[a-zA-Z0-9_-]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9]+.[a-z]{2,4}$/;
                    break;
                case "number":
                    filter = /^\d+$/;
                default:
                    //alpha numeric with spaces
                    filter = /^[a-z\d\-_\s]+$/i;
                    break;
            }

            //isn't valid
            if ((!filter.test(value)) || (!doesCompare)) {
                self.addClass('input-validation-error');
                if (!filter.test(value)) {
                    errorSpan.addClass('field-validation-error').html('Please enter your ' + label);
                }
                else if (!doesCompare) {
                    errorSpan.addClass('field-validation-error').html('Please confirm your ' + compareLabel);
                }
                fieldIsValid = false;
            } else {
                self.removeClass('input-validation-error');
                errorSpan.removeClass('field-validation-error').html('');
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

            var self = $(radio), //form field
                name = self.attr('name'), //name of radio button group
                errorSpan = $('span[data-for="' + name + '"]'); //get the span for the current radio button
            label = $('label[for="' + name + '"]');



            if (!$('input:radio[name="' + name + '"]').is(':checked')) {
                errorSpan.addClass('field-validation-error').html('Please select an option');
                label.addClass('input-validation-error');
                fieldIsValid = false;
            } else {
                self.removeClass('input-validation-error');
                errorSpan.removeClass('field-validation-error').html('');
                label.removeClass('input-validation-error');
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