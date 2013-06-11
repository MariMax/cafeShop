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
                         $("#messenger").html(data.message);
                         $("#messenger").addClass("notice succes");
                         console.log("done " + data.message);
                         $("#messenger").fadeIn("slow");
                         //$('#verify').removeAttr('hidden');
                     }
                     if (data.status == 500) {
                         $("#messenger").html(data.message);
                         $("#messenger").addClass("notice error");
                         console.log("fail " + data.message);
                         $("#messenger").fadeIn("slow");
                     }
                 });
    }

    function updatePhone() {

        var jqXHR = $.post('/api/shops/updateCellPhone', $('form').serialize())
                 .done(function (data) {

                     if (data.status == 200) {
                         $("#messenger").html(data.message);
                         $("#messenger").addClass("notice succes");
                         console.log("done " + data.message);
                         $("#messenger").fadeIn("slow");
                         $('#verify').removeAttr('style');
                     }
                     if (data.status == 500) {
                         $("#messenger").html(data.message);
                         $("#messenger").addClass("notice error");
                         console.log("fail " + data.message);
                         $("#messenger").fadeIn("slow");
                     }
                 });
    }
    function confirmCellPhone() {

        var jqXHR = $.post('/api/shops/approve-CellPhone', $('form').serialize())
                 .done(function (data) {
                     if (data.status == 200) {
                         $("#messenger").html(data.message.message);
                         $("#messenger").addClass("notice succes");
                         console.log("done " + data.message);
                         $("#messenger").fadeIn("slow");
                         var shopId = data.message.shopId;
                         var delay = 2000;
                         setTimeout(document.location.href = '/shop/' + shopId + '/admin/', delay);
                     }
                     if (data.status == 500) {
                         $("#messenger").html(data.message);
                         $("#messenger").addClass("notice error");
                         console.log("fail " + data.message);
                         $("#messenger").fadeIn("slow");
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
            $("#messenger").html(err_text);
            $("#messenger").addClass("notice error");
            $("#messenger").fadeIn("slow");
        } else {
            $("#messenger").html('');
            updatePhone();
        }
    })

    $('#confirm').click(function () {
        var code = $('#cellPhoneConfirmation').val();
        if (!code) {
            var err_text = "Введите код подтверждения";
            $("#messenger").html(err_text);
            $("#messenger").addClass("notice error");
            $("#messenger").fadeIn("slow");
        } else { confirmCellPhone(); }
    })

    var field = new Array("Name", "cellPhone"); //поля обязательные 

    $("form").submit(function () {// обрабатываем отправку формы  
        var error = 0; // индекс ошибки
        $("form").find(":input").each(function () {// проверяем каждое поле в форме
            for (var i = 0; i < field.length; i++) { // если поле присутствует в списке обязательных
                if ($(this).attr("name") == field[i]) { //проверяем поле формы на пустоту

                    if (!$(this).val()) {// если в поле пустое
                        // $(this).css('border', 'red 1px solid'); // устанавливаем рамку красного цвета
                        error = 1; // определяем индекс ошибки       

                    }
                    else {
                        // $(this).css('border', 'gray 1px solid'); // устанавливаем рамку обычного цвета
                    }

                }
            }
        })

        if (error == 0) { // если ошибок нет то отправляем данные
            postData();
            return false;
        }
        else {
            if (error == 1) var err_text = "Необходимо ввести название кафе";
            // if (error == 2) var err_text = "Введите правильный Российский сотовый номер, пример +79177640209";
            $("#messenger").html(err_text);
            $("#messenger").addClass("notice error");
            $("#messenger").fadeIn("slow");
            return false; //если в форме встретились ошибки , не  позволяем отослать данные на сервер.
        }



    })



});


    


