;
(function ($) {

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

    $.fn.onValidation = function (options) {

        var defaults = {
            fieldClass: 'required',
            selectClass: 'required-select',
            radioClass: 'required-radio',
            formID: 'registerForm',
            validateField: true,
            validateSelect: false,
            validateRadio: false
        };

        options = $.extend([], defaults, options);

        var isValid = false,
            field = $('.' + options.fieldClass),
            select = $('.' + options.selectClass),
            radio = $('.' + options.radioClass),
            form = $('#' + options.formID),
            fieldIsValid,
            selectIsValid,
            radioIsValid;


        if (options.validateField) {
            //validate field on keyup or blur
            form.find(field).on('keyup blur', function (e) {
                validateField(this);
            });
        }
        if (options.validateSelect) {
            //validate select boxes on change
            form.find(select).on('change', function () {
                validateSelect(this);
            });
        }
        if (options.validateRadio) {
            //validate select boxes on keyup or blur
            form.find(radio).on('change', function () {
                validateRadio(this);
            });
        }



        function validateForm() {
            if (options.validateField) {
                form.find(field).each(function () {
                    fieldIsValid = validateField(this);
                    console.log('field-valid: ' + fieldIsValid);
                });
            }
            else{
                fieldIsValid = true;
            }

            if (options.validateSelect) {
                form.find(select).each(function () {
                    selectIsValid = validateSelect(this);
                    console.log('select-valid: ' + selectIsValid);
                });
            }
            else{
                selectIsValid = true;
            }
            
            if (options.validateRadio) {
                form.find(radio).each(function () {
                    radioIsValid = validateRadio(radio);
                    console.log('select-valid: ' + radioIsValid);
                });
            }
            else{
                radioIsValid = true;
            }


            if (fieldIsValid && selectIsValid && radioIsValid) {
                isValid = true;
            }


            return isValid;
        }

        return validateForm();

        // validation
        function validateField(textbox) {

            var fieldIsValid;

            var self = $(textbox), //form field
                value = self.val(), //value of the form field
                origID = self.attr('id'), //id of the form field
                valType = self.attr('data-val'), //validation type
                id = origID;
            label = $('label[for="' + origID + '"]').html(), //get the label text for the form field
            errorSpan = $('span[data-for="' + id + '"]'); //get the span for the current field

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
            if (!filter.test(value)) {
                self.addClass('input-validation-error');
                errorSpan.addClass('field-validation-error').html('Please enter a valid ' + label);
                fieldIsValid = false;
            } else {
                self.removeClass('input-validation-error');
                errorSpan.removeClass('field-validation-error').html('');
                fieldIsValid = true;
            }

            return fieldIsValid;
        }


        function validateSelect(selectBox) {

            var fieldIsValid;

            var self = $(selectBox), //form field
                value = self.val(), //value of the form field
                origID = self.attr('id'), //id of the form field
                id = origID;
            errorSpan = $('span[data-for="' + id + '"]'); //get the span for the current select box



            //isn't valid
            if (value === "") {
                self.addClass('input-validation-error');
                errorSpan.addClass('field-validation-error').html('Please select a valid option');
                fieldIsValid = false;
            } else {
                self.removeClass('input-validation-error');
                errorSpan.removeClass('field-validation-error').html('');
                fieldIsValid = true;
            }

            return fieldIsValid;
        }



        function validateRadio(radio) {

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

        }

    };


})(jQuery);