 $(function () {

        function postData() {
            var jqXHR = $.post('/api/users/newUser', $('form').serialize())
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

        function isValidEmailAddress(emailAddress) {
            var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
            return pattern.test(emailAddress);
        }

        function isValidPassword(password) {

            var pattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$");
            return pattern.test(password);
        }

        var field = new Array("UserName", "email", "password", "passwordConfirm"); //поля обязательные 

        $("form").submit(function () {// обрабатываем отправку формы  
            var error = 0; // индекс ошибки
            $("form").find(":input").each(function () {// проверяем каждое поле в форме
                for (var i = 0; i < field.length; i++) { // если поле присутствует в списке обязательных
                    if ($(this).attr("name") == field[i]) { //проверяем поле формы на пустоту

                        if (!$(this).val()) {// если в поле пустое
                            $(this).css('border', 'red 1px solid'); // устанавливаем рамку красного цвета
                            error = 1; // определяем индекс ошибки       

                        }
                        else {
                            $(this).css('border', 'gray 1px solid'); // устанавливаем рамку обычного цвета
                        }

                    }
                }
            })

            var email = $("#email").val();
            if (!isValidEmailAddress(email)) {
                error = 2;
            }

            var pass = $("#password").val();

            if (!isValidPassword(pass)) {
                error = 3;
            }

            var pass2 = $("#passwordConfirmation").val();
            if (pass != pass2)
                error = 4;

            if (error == 0) { // если ошибок нет то отправляем данные
                postData();
                return false;
            }
            else {
                if (error == 1) var err_text = "Не все обязательные поля заполнены!";
                if (error == 2) var err_text = "Email введен неверно";
                if (error == 3) var err_text = "Пароль введен неверно";
                if (error == 4) var err_text = "Пароли не совпадают";
                $("#messenger").html(err_text);
                $("#messenger").addClass("notice error");
                $("#messenger").fadeIn("slow");
                return false; //если в форме встретились ошибки , не  позволяем отослать данные на сервер.
            }



        })
    });