   $(function () {

        function getUser() {
            debugger;
            var userId = $('#userId').val();
            var jqXHR = $.post('/api/users/getuser/' + userId)
            .done(function (data) {
                if (data) {
                    
                    $("#name").attr("value", data.UserName);
                    //console.log("done " + data.message);
                    $("#email").attr("value", data.email);
                }else {
               
                    $("#messenger").html("Не удалось получить пользователя");
                    $("#messenger").addClass("notice error");
                    
                    
                }
            });
        }
        getUser();

        function postNewPassword(oldPassword, newPassword, newPasswordConfirmation) {
            var jqXHR = $.post('/api/users/UpdatePassword', { OldPassword: oldPassword, NewPassword: newPassword, PasswordConfirmation: newPasswordConfirmation })
            .done(function (data) {
                if (data.status == 200) {
                    $("#messenger").html(data.message);
                    $("#messenger").addClass("notice succes");
                    
                    $("#messenger").fadeIn("slow");
                }
                if (data.status == 500) {
                    $("#messenger").html(data.message);
                    $("#messenger").addClass("notice error");
                    $("#messenger").fadeIn("slow");
                }
            });
        }

        function postNewEmail(email) {
            var jqXHR = $.post('/api/users/UpdateEmail', { email: email })
            .done(function (data) {
                if (data.status == 200) {
                    $("#messenger").html(data.message);
                    $("#messenger").addClass("notice succes");
                    $("#messenger").fadeIn("slow");
                }
                if (data.status == 500) {
                    $("#messenger").html(data.message);
                    $("#messenger").addClass("notice error");
                    $("#messenger").fadeIn("slow");
                }
            });
        }

        function postNewUserName(name) {
            var jqXHR = $.post('/api/users/updateUserName', { UserName: name })
            .done(function (data) {
                if (data.status == 200) {
                    $("#messenger").html(data.message);
                    $("#messenger").addClass("notice succes");
                    $("#messenger").fadeIn("slow");
                }
                if (data.status == 500) {
                    $("#messenger").html(data.message);
                    $("#messenger").addClass("notice error");
                    $("#messenger").fadeIn("slow");
                }
            });
        }

        function isValidPassword(password) {

            var pattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$");
            return pattern.test(password);
        }

        $("#cahngePassword").click(function () {
            var error = 0;
            var oldPass = $("#OldPassword").val();
            if (!oldPass) error = 1;
            var pass = $("#NewPassword").val();

            if (!isValidPassword(pass)) {
                error = 3;
            }

            var pass2 = $("#PasswordConfirmation").val();
            if (pass != pass2)
                error = 4;

            if (error == 0) { // если ошибок нет то отправляем данные
                postNewPassword(oldPass, pass, pass2);
            }
            else {
                if (error == 1) var err_text = "Введите старый пароль!";
                if (error == 3) var err_text = "Пароль введен неверно";
                if (error == 4) var err_text = "Пароли не совпадают";
                $("#messenger").html(err_text);
                $("#messenger").addClass("notice error");
                $("#messenger").fadeIn("slow");
            }
        })

        function isValidEmailAddress(emailAddress) {
            var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
            return pattern.test(emailAddress);
        }

        $('#cahngeEmail').click(function () {
            var email = $('#email').val();
            var error = 0;
            if (!isValidEmailAddress(email))
                error = 1;
            if (error == 0) { // если ошибок нет то отправляем данные
                postNewEmail(email);
            }
            else {
                if (error == 1) var err_text = "Введите email правильно!";
                $("#messenger").html(err_text);
                $("#messenger").addClass("notice error");
                $("#messenger").fadeIn("slow");
            }

        })

        $('#cahngeName').click(function () {
            var name = $('#name').val();
            var error = 0;
            if (!name)
                error = 1;
            if (error == 0) { // если ошибок нет то отправляем данные
                postNewUserName(name);
            }
            else {
                if (error == 1) var err_text = "Введите имя пользователя!";
                $("#messenger").html(err_text);
                $("#messenger").addClass("notice error");
                $("#messenger").fadeIn("slow");
            }

        })

    });