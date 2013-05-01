   $(function () {

        function postData() {
            var jqXHR = $.post('/api/users/reset-password', $('form').serialize())
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

        postData();

    });