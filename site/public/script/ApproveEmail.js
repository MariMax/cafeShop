   $(function () {

        function postData() {
            var jqXHR = $.post('/api/users/approve-email', $('form').serialize())
            .done(function (data) {
                if (data.status == 200) {
                    $("#messenger").html(data.message);
                    console.log("done " + data.message);
                    $("#messenger").fadeIn("slow");
                    var delay = 3000;
                    setTimeout(document.location.href='/users/login', delay);
                }
                if (data.status == 500) {
                    $("#messenger").html(data.message);
                    console.log("fail " + data.message);
                    $("#messenger").fadeIn("slow");
                }
            });
        }

        postData();

    });
