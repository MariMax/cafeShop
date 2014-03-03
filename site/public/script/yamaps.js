function fid_13613773245519471603(ymaps) {

    var longitude = ymaps.geolocation.longitude;
    var latitude = ymaps.geolocation.latitude;
    //var addImbaloon = false;
    if ($.cookie('longitude') && $.cookie('latitude')) {
       longitude = $.cookie('longitude');
       latitude = $.cookie('latitude');
      // addImbaloon = true;
    }
    if (longitude==null||latitude==null)
    {
       longitude = 55.96815;
       latitude = 54.727744;
    }
    var map = new ymaps.Map("ymaps-map-id_13613773245519471603", {
        center: [longitude, latitude],
        zoom: 13,
        type: "yandex#map"
    });

    map.controls
                                        .add("zoomControl")
                                        .add("mapTools")
                                        .add(new ymaps.control.TypeSelector(["yandex#map", "yandex#satellite", "yandex#hybrid", "yandex#publicMap"]));



    $.get('/api/shops/All/1')
        .done(function (data) {
           
            for (var key in data) {
                var shop = data[key];

               

                map.geoObjects.add(new ymaps.Placemark([shop.Longitude, shop.Latitude], {
                    
                    autoPan: true
                }, {
                    iconImageHref: '/images/baloon.png',
                    iconImageSize: [41, 52],
                    iconImageOffset: [-20, -52]
                })

                                        );
            };

        })


        map.geoObjects.events.add('click',
        function (e) {
            var object = e.get('target');

            var position = object.geometry.getBounds();
            $.get('/api/shops/allinPalce/' + position[0][0] + '/' + position[0][1])
        .done(function (data) {
            var storeList = $("#StoreList");
            if (storeList) {
                storeList.empty();
                var storeListContent = '<div class="baloon_content">';
                for (var key in data) {
                    var shop = data[key];
                    storeListContent += 
' <div class="shop_item"> <div class="shop_name">' + shop.Name + '</div> <div class="shop_address">' + shop.Address + '</div> <div class="shop_phone">' + shop.ClientPhone + '</div> <div class="shop_time">' + shop.WorkTime + '</div><a href="/shop/' + shop._id + '/stock" class="button small" id = "openMenu" data-i18n="menuOpen">Открыть меню</a></div>'
                   
                };
                storeListContent += '</div>'
                storeList.html(storeListContent);

                map.balloon.open([position[0][0],position[0][1]], {
                    contentBody: storeListContent
                });

            }

            $("#openMenu").i18n();
        })
        });

};