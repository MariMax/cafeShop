   $(function () {
    
        function postData() {
            var jqXHR = $.post('/api/shops/newShop', $('form').serialize())
            .done(function (data) {
                if (data.status == 200) {
                    $("#messenger").html(data.message.message);
                    $("#messenger").addClass("notice succes");
                    
                    $("#messenger").fadeIn("slow");
                    $('#verify').removeAttr('style');
                    $('#name').hide();
                    $('#phone').hide();
                    $('#submit').hide();
                    $('#shopId').attr('value', data.message.shopId);
                }
                if (data.status == 500) {
                    $("#messenger").html(data.message);
                    $("#messenger").addClass("notice error");
                   
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
                    
                    $("#messenger").fadeIn("slow");
                    var shopId = data.message.shopId;
                    var delay = 2000;
                    setTimeout(document.location.href = '/shop/'+shopId+'/admin/'  , delay);
                }
                if (data.status == 500) {
                    $("#messenger").html(data.message);
                    $("#messenger").addClass("notice error");
                    
                    $("#messenger").fadeIn("slow");
                }
            });
    
        }
    
        function isValidPhoneNumber(number) {
            var pattern = new RegExp(/^(\+7)[0-9]{10}$/); //валидный российский номер
            return pattern.test(number);
        }
    
        var field = new Array("Name", "cellPhone"); //поля обязательные 
    
        $("#submitBtn").click(function () {// обрабатываем отправку формы  
            var error = 0; // индекс ошибки
            $("form").find(":input").each(function () {// проверяем каждое поле в форме
                for (var i = 0; i < field.length; i++) { // если поле присутствует в списке обязательных
                    if ($(this).attr("name") == field[i]) { //проверяем поле формы на пустотус
    
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
    
            var cellPhone = $('#cellPhone').val();
            if (!isValidPhoneNumber(cellPhone))
            { error = 2; }
    
    
            if (error == 0) { // если ошибок нет то отправляем данные
                postData();
                return false;
            }
            else {
                if (error == 1) var err_text = "Не все обязательные поля заполнены!";
                if (error == 2) var err_text = "Введите правильный Российский сотовый номер, пример +79177640209";
                $("#messenger").html(err_text);
                $("#messenger").addClass("notice error");
                $("#messenger").fadeIn("slow");
                return false; //если в форме встретились ошибки , не  позволяем отослать данные на сервер.
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
    });
    