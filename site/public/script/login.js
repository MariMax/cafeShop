  $(function () {

        function postData() {
            var jqXHR = $.post('/api/users/login', $('form').serialize())
            .done(function (data) {
                if (data.status == 200) {
                    document.location.href = '/';
                }
                if (data.status == 500) {
                    $("#messenger").removeAttr("style");
                    console.log("fail " + data.message);
                    $("#messenger").fadeIn("slow");
                }
            });



        }

        $("form").submit(function () {// обрабатываем отправку формы  
                postData();
                return false;
        })
    });
