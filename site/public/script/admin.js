         function getCafe() {
            var cafeId = $('#cafeId').val();
            var jqXHR = $.ajax({ url: '/api/cafes/' + cafeId, cache: false, async: true })
                 .done(function (cafe) {

                     if (cafe) {
                         if (cafe.Name)
                             $('#name').attr('value', cafe.Name);
                         if (cafe.Address)
                             $('#Address').attr('value', cafe.Address);
                         if (cafe.Description)
                             $('#Description').html(cafe.Description);
                         if (cafe.WorkTime)
                             $('#WorkTime').attr('value', cafe.WorkTime);
                         if (cafe.ClientPhone)
                             $('#ClientPhone').attr('value', cafe.ClientPhone);
                         if (cafe.CellPhone)
                             $('#cellPhone').attr('value', cafe.CellPhone);
                         else {
                             document.location.href = '/cafes/newcafe'; //Сначала подтверди телефон, потом администрируй
                         }
                     } else document.location.href = '/cafes/newcafe'; //а куда деваться если мы не нашли кафе, его надо создать
                 })
        }   
        
        $(function () {


        getCafe();

        function postData() {

            var jqXHR = $.post('/api/cafes/updateValues', $('form').serialize())
                 .done(function (data) {
                     if (data.status == 200) {
                         $("#messenger").html(data.message);
                         console.log("done " + data.message);
                         $("#messenger").fadeIn("slow");
                         //$('#verify').removeAttr('hidden');
                     }
                     if (data.status == 500) {
                         $("#messenger").html(data.message);
                         console.log("fail " + data.message);
                         $("#messenger").fadeIn("slow");
                     }
                 });
        }

        function updatePhone() {

            var jqXHR = $.post('/api/cafes/updateCellPhone', $('form').serialize())
                 .done(function (data) {

                     if (data.status == 200) {
                         $("#messenger").html(data.message);
                         console.log("done " + data.message);
                         $("#messenger").fadeIn("slow");
                         $('#verify').removeAttr('style');
                     }
                     if (data.status == 500) {
                         $("#messenger").html(data.message);
                         console.log("fail " + data.message);
                         $("#messenger").fadeIn("slow");
                     }
                 });
        }
        function confirmCellPhone() {

            var jqXHR = $.post('/api/cafes/approve-CellPhone', $('form').serialize())
                 .done(function (data) {
                     if (data.status == 200) {
                         $("#messenger").html(data.message.message);
                         console.log("done " + data.message);
                         $("#messenger").fadeIn("slow");
                         var cafeId = data.message.cafeId;
                         var delay = 2000;
                         setTimeout(document.location.href = '/cafe/' + cafeId + '/admin/', delay);
                     }
                     if (data.status == 500) {
                         $("#messenger").html(data.message);
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
                $("#messenger").fadeIn("slow");
                return false; //если в форме встретились ошибки , не  позволяем отослать данные на сервер.
            }



        })




    });

    function GetLocation() {
        var longitude = $('#Longitude');
        var latitude = $('#Latitude');
        var addressInput = $('#Address');
        
        var address = addressInput.val();
        $.ajax({
            url: 'http://geocode-maps.yandex.ru/1.x/?format=json&geocode=' + address,
            cache: false,
            async: false,
            type: "GET"
        }).done(function (data) {
            var ar = data.response.GeoObjectCollection.featureMember;

            if (ar[0].GeoObject.metaDataProperty.GeocoderMetaData.kind == 'house') {
                var b = ar[0].GeoObject.Point.pos;
                var temp = new Array();
                temp = b.split(' ');
                longitude.attr('value', temp[0]);
                latitude.attr('value', temp[1]);
                addressInput.attr('value', ar[0].GeoObject.name + ' ' + ar[0].GeoObject.description)
                addressInput.addClass('succes');
            } else addressInput.removeClass('succes');

        })
    }
    


