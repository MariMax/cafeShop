$(function () {

    function postData() {
        var jqXHR = $.post('/api/users/newUser', $('form').serialize())
            .done(function (data) {
                if (data.status == 200) {
                    $("#messenger").fadeIn("slow");
                    $("#messenger").removeAttr("style");
                }
                if (data.status == 500) {

                    $("#messenger1").removeAttr("style");
                    $("#messenger1").fadeIn("slow");
                }
            });



    }



    function isValidPassword(password) {

        var pattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$");
        return pattern.test(password);
    }



    $("form").submit(function () {// обрабатываем отправку формы  
        var error = 0; // индекс ошибки

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
            if (error == 3) {//слишком просто
                $("#messenger2").fadeIn("slow");
                $("#messenger2").removeAttr("style");
            }
            if (error == 4) {//Пароли не совпали
                $("#messenger3").fadeIn("slow");
                $("#messenger3").removeAttr("style");
            }
            return false; //если в форме встретились ошибки , не  позволяем отослать данные на сервер.
        }



    })
});