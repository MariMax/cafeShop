$(function () {
    function postData() {
        var jqXHR = $.post('/api/common/supportemail', $('form').serialize())
            .done(function (data) {
                $("#messenger").removeAttr("style");
            });
    }
    $("form").submit(function () {// обрабатываем отправку формы  
        postData();
        return false;
    })
});
