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
})

function HidePopup(popup) {
    popup.attr("style", "display: none");
}