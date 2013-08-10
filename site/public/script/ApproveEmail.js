   $(function () {

        function postData() {
            var jqXHR = $.post('/api/users/approve-email', $('form').serialize())
            .done(function (data) {
                if (data.status == 200) {

                    console.log("done " + data.message);
                    $("#messenger").removeAttr("style");
                    $("#messenger").fadeIn("slow");
                    var delay = 3000;
                    setTimeout(document.location.href='/users/login', delay);
                }
                if (data.status == 500) {
                    $("#messenger1").removeAttr("style");
                    console.log("fail " + data.message);
                    $("#messenger1").fadeIn("slow");
                }
            });
        }

        postData();

    });
