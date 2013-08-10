$(function () {



    function getUserShop(userId) {
        $.post('/api/users/getshop/' + userId)
        .done(function (data) {
            if (data && data.CellPhoneApprove)
                document.location.href = '/shop/' + data._id + '/admin/';
            else document.location.href = '/shops/newshop';
        })
    }

    function route() {
        var userId = $('#userId').val();

        if (userId != 'undefined') {
            getUserShop(userId);
        }
    }
    route();

    //if (!$.cookie('longitude') || !$.cookie('latitude')) {
    //    $("#where_iam_popup").attr("style", "display: normal");
    //}

    i18n.init({ lng: "en-Us", debug: false }, function () {
        // save to use translation function as resources are fetched
        $(".logo").i18n();
        $("title").i18n();
        $(".slogan").i18n();
        $("#link1").i18n();
        $("#link2").i18n();
        $("#link3").i18n();
$("#link4").i18n();
$("#link5").i18n();


    });
})

function HidePopup(popup) {
    popup.attr("style", "display: none");
}