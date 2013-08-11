function getShop() {
    var shopId = $('#shopId').val();
    var jqXHR = $.ajax({ url: '/api/shops/' + shopId, cache: false, async: true })
                 .done(function (shop) {

                     if (shop) {
                         if (shop.Name)
                             $('#name').attr('value', shop.Name);
                         if (shop.Address)
                             $('#Address').attr('value', shop.Address);
                         if (shop.Description)
                             $('#Description').html(shop.Description);
                         if (shop.WorkTime)
                             $('#WorkTime').attr('value', shop.WorkTime);
                         if (shop.ClientPhone)
                             $('#ClientPhone').attr('value', shop.ClientPhone);
                         if (shop.Delivery)
                             $('#Delivery').attr('checked', true);
                         if (shop.CellPhone)
                             $('#cellPhone').attr('value', shop.CellPhone);
                         else {
                             document.location.href = '/shops/newshop'; //Сначала подтверди телефон, потом администрируй
                         }
                     } else document.location.href = '/shops/newshop'; //а куда деваться если мы не нашли кафе, его надо создать
                 })
}

$(function () {


    getShop();

    function postData() {

        var jqXHR = $.post('/api/shops/updateValues', $('form').serialize())
                 .done(function (data) {
                     if (data.status == 200) {
                         $("#messenger").removeAttr("style");
                         console.log("done " + data.message);
                         $("#messenger1").hide();
                     }
                     if (data.status == 500) {
                         $("#messenger").hide();
                         $("#messenger1").removeAttr("style");
                         console.log("fail " + data.message);
                     }
                 });
    }

    function updatePhone() {

        var jqXHR = $.post('/api/shops/updateCellPhone', $('form').serialize())
                 .done(function (data) {

                     if (data.status == 200) {
                        
                         $("#messenger").removeAttr("style");
                         console.log("done " + data.message);
                         $('#verify').removeAttr('style');
                         $("#messenger1").hide();
                     }
                     if (data.status == 500) {  
                         $("#messenger").hide();
                         $("#messenger1").removeAttr("style");
                         console.log("fail " + data.message);
                     }
                 });
    }
    function confirmCellPhone() {

        var jqXHR = $.post('/api/shops/approve-CellPhone', $('form').serialize())
                 .done(function (data) {
                     if (data.status == 200) {
                         $("#messenger1").hide();
                         $("#messenger").removeAttr("style");
                         console.log("done " + data.message);
                         var shopId = data.message.shopId;
                         var delay = 2000;
                         setTimeout(document.location.href = '/shop/' + shopId + '/admin/', delay);
                     }
                     if (data.status == 500) {
                         $("#messenger").hide();
                         $("#messenger1").removeAttr("style");
                         console.log("fail " + data.message);
                     }
                 });

    }

    function isValidPhoneNumber(number) {
        var pattern = new RegExp(/^(\+7)[0-9]{10}$/); //валидный российский номер
        return pattern.test(number);
    }

    $('#cellPhone').blur(function () {
        var phone = $('#cellPhone').val();
        if (!isValidPhoneNumber(phone)) {
            var err_text = "Введите правильный Российский сотовый номер, пример +79177640209";
            $("#messenger2").removeAttr("style");
        } else {
            $("#messenger2").hide();
            updatePhone();
        }
    })

    $('#confirm').click(function () {
        var code = $('#cellPhoneConfirmation').val();
        if (!code) {
            var err_text = "Введите код подтверждения";
            $("#messenger3").removeAttr("style");
        } else {
            $("#messenger3").hide();
            confirmCellPhone();
        }
    })

    $("form").submit(function () {// обрабатываем отправку формы  
        postData();
        return false;
    })



});


    


