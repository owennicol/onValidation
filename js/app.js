$(function () {
    registerFormSubmit();
});

function registerFormSubmit() {
    $('button[type="submit"]').off('click').on('click', function () {

        var isValid = $('#registerForm').onValidation({
            validateSelect: true,
            validateField: true,
            validateRadio: true
        });
        console.log('isValid = ' + isValid);

        if (isValid) {
            //$('#registerForm').submit();
            console.log('submitted');
        } else {
            console.log('failed');
        }
    });

}