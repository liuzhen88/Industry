var Login = function () {


    var handleLogin = function () {

        $("#login-form").formValidation({
            framework: 'bootstrap',
            icon: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                username: {
                    validators: {
                        notEmpty: {
                            message: '用户名是必需的'
                        },
                        regexp: {
                            regexp: /^(admin|[a-zA-Z]{4}[0-9]{4})$/i,
                            message: "无效用户名"
                        }
                    }
                },
                password: {
                    validators: {
                        notEmpty: {
                            message: '密码是必需的'
                        },
                        stringLength: {
                            min: 8,
                            message: "密码需要至少8个字母或数字"
                        }
                    }
                }
            }
        }).on('success.field.fv', function (e, data) {
            if (data.field === "username") {
                if (data.element.val() === 'admin') {
                    $("#password-fg").show();
                } else {
                    $("#password-fg").hide();
                }
            }
        }).on('success.form.fv', function (e) {
            // Prevent form submission
            e.preventDefault();

            var $form = $(e.target),
                fv = $form.data('formValidation');

            // Use Ajax to submit form data
            $.ajax({
                url: $form.attr('action'),
                type: 'POST',
                data: $form.serialize()
            }).done(function (data, status, jqXHR) {
                window.location.replace(window.location.protocol + "//" + window.location.host + mesUtil.getClientPath());
            }).fail(function (jqXHR, status, error) {
                $(".alert-danger span.message").html(jqXHR.responseJSON.message);
                $(".alert-danger").show();
            });
        });
    };

    return {
        //main function to initiate the module
        init: function () {
            handleLogin();
        }
    };
}();