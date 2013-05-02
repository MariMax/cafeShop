    function GetLocation(addressInput, saveToCookies) {
       
        var longitude = $('#Longitude');
        var latitude = $('#Latitude');
        //var addressInput = $('#Address');
        
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
                if (saveToCookies) {
                    $.cookie('longitude', temp[0]);
                    $.cookie('latitude', temp[1]);
                }
                addressInput.attr('value', ar[0].GeoObject.name + ' ' + ar[0].GeoObject.description)
                addressInput.addClass('succes');
            } else addressInput.removeClass('succes');

        })
    }