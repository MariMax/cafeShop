function fid_13613773245519471603(ymaps) {

    var longitude = 55.96815; //ymaps.geolocation.longitude;
    var latitude = 54.727744; // ymaps.geolocation.latitude;
    //var addImbaloon = false;
    //if ($.cookie('longitude') && $.cookie('latitude')) {
    //    longitude = $.cookie('longitude');
    //    latitude = $.cookie('latitude');
    //    addImbaloon = true;
    //}
    var map = new ymaps.Map("ymaps-map-id_13613773245519471603", {
        center: [longitude, latitude],
        zoom: 13,
        type: "yandex#map"
    });

    //if (addImbaloon) {
    //    map.geoObjects.add(
    //    new ymaps.Placemark([longitude, latitude],
    //        {
    //            balloonContentHeader: "Я здесь"//,
    //            //balloonContent: ymaps.geolocation.city,
    //            //balloonContentFooter: ymaps.geolocation.region
    //        }
    //    )
    //);
    //}

    map.controls
                                        .add("zoomControl")
                                        .add("mapTools")
                                        .add(new ymaps.control.TypeSelector(["yandex#map", "yandex#satellite", "yandex#hybrid", "yandex#publicMap"]));



    $.get('/api/shops/All/1')
        .done(function (data) {
            //debugger;
            for (var key in data) {
                var shop = data[key];

                //console.log(val.GeoObject.metaDataProperty.GeocoderMetaData.kind + ' ' + val.GeoObject.Point.pos + ' ' + val.GeoObject.name + ' ' + val.GeoObject.description);

                map.geoObjects.add(new ymaps.Placemark([shop.Longitude, shop.Latitude], {
                    //balloonContent: '<script type="text/javascript">alert("hello")</script></script><div class="baloon_content"><b>' + shop.Name + '</b> <a href="/shop/' + shop._id + '/stock">Меню</a></div>',
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
            //alert(object.geometry._Ih[0]+" "+object.geometry._Ih[1]); 
            var position = object.geometry.getBounds();
            $.get('/api/shops/allinPalce/' + position[0][0] + '/' + position[0][1])
        .done(function (data) {
            var storeList = $("#StoreList");
            if (storeList) {
                storeList.empty();
                var storeListContent = '<div class="baloon_content">';
                for (var key in data) {
                    var shop = data[key];
                    storeListContent += //'<div><b>' + shop.Name + '</b> <a href="/shop/' + shop._id + '/stock">Меню</a></div>'
' <div class="shop_item"> <div class="shop_name">' + shop.Name + '</div> <div class="shop_address">' + shop.Address + '</div> <div class="shop_phone">' + shop.ClientPhone + '</div> <div class="shop_time">' + shop.WorkTime + '</div><a href="/shop/' + shop._id + '/stock" class="button small">Открыть меню</a></div>'
                    //balloonContent: '<script type="text/javascript">alert("hello")</script></script><div class="baloon_content"><b>' + shop.Name + '</b> <a href="/shop/' + shop._id + '/stock">Меню</a></div>',
                };
                storeListContent += '</div>'
                storeList.html(storeListContent);
                //position = e.get('globalPixelPosition');
                //object.balloon.setContent(storeListContent);
                map.balloon.open([position[0][0],position[0][1]], {
                    contentBody: storeListContent
                });
                //ebugger;
                //map.openBalloon(position, storeListContent);

                //  var storeBlock = $("#StoreBlock");
                //  if (storeBlock)
                //   storeBlock.attr("style", "display: normal");
            }
        })
        });
    //map.events.add("click",
    //                                        function (e) {
    //                                            map.balloon.open(
    //                                            // Позиция балуна
    //                        e.get("coordPosition"), {
    //                            // Свойства балуна:
    //                            // контент балуна
    //                            contentBody: "Значение: " +
    //                            e.get("coordPosition")
    //                        }
    //                    )
    //                                        }
    //            );
};