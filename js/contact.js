$(function() {
    "use strict";
    $.validator.setDefaults({
        ignore: [],
        highlight: function(element) {
            $(element).addClass('is-invalid');
        },
        unhighlight: function(element) {
            $(element).removeClass('is-invalid');
        },
        errorElement: 'div',
        errorClass: 'invalid-feedback',
        errorPlacement: function(error, element) {
            if (element.parent('.input-group').length || element.parent('label').length) {
                error.insertAfter(element.parent());
            } else {
                error.insertAfter(element);
            }
        }
    });
    var $phpcontactform = $("#phpcontactform");
    var $jscontactbtn = $("#js-contact-btn");
    var $jscontactresult = $("#js-contact-result");
    $phpcontactform.submit(function(e) {
        e.preventDefault();
    }).validate({
        rules: {
            first_name: "required",
            last_name: "required",
            email: {
                required: true,
                email: true
            },
            phone: "required",
            address: "required",
        },
        messages: {
            first_name: "Your first name please",
            last_name: "Your last name please",
            email: {
                required: "Please enter your email address",
                email: "Please enter a valid email address"
            },
            phone: "Please enter your phone number",
            address: "Please enter your address",
        },
        submitHandler: function(form) {
            $jscontactbtn.attr("disabled", true);
            var redirect = $phpcontactform.data('redirect');
            var noredirect = false;
            if (redirect == 'none' || redirect == "" || redirect == null) {
                noredirect = true;
            }
            $jscontactresult.html('<p class="help-block text-center mt-3 mb-0">Please wait...</p>');
            var success_msg = $jscontactresult.data('success-msg');
            var error_msg = $jscontactresult.data('error-msg');
            var dataString = $(form).serialize();
            $.ajax({
                type: "POST",
                data: dataString,
                url: "php/contact.php",
                cache: false,
                success: function(d) {
                    if (d == 'success') {
                        if (noredirect) {
                            $phpcontactform[0].reset();
                            $jscontactresult.fadeIn('slow').html('<div class="mt-3 mb-0 alert alert-success text-center">' + success_msg + '</div>').delay(3000).fadeOut('slow');
                        } else {
                            window.location.href = redirect;
                        }
                    } else {
                        $jscontactresult.fadeIn('slow').html('<div class="mt-3 mb-0 alert alert-danger text-center">' + error_msg + '</div>').delay(3000).fadeOut('slow');
                        if (window.console) {
                            console.log('PHP Error: ' + d);
                        }
                    }
                    $jscontactbtn.attr("disabled", false);
                },
                error: function(d) {
                    $jscontactresult.fadeIn('slow').html('<div class="mt-3 mb-0 alert alert-danger text-center"> Cannot access Server</div>').delay(3000).fadeOut('slow');
                    $jscontactbtn.attr("disabled", false);
                    if (window.console) {
                        console.log('Ajax Error: ' + d.statusText);
                    }
                }
            });
            return false;
        }
    });
})
