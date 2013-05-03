function fid_13613773245519471603(ymaps) {

    var longitude = ymaps.geolocation.longitude;
    var latitude = ymaps.geolocation.latitude;
    var addImbaloon = false;
    if ($.cookie('longitude') && $.cookie('latitude')) {
        longitude = $.cookie('longitude');
        latitude = $.cookie('latitude');
        addImbaloon = true;
    }
    var map = new ymaps.Map("ymaps-map-id_13613773245519471603", {
        center: [longitude, latitude],
        zoom: 13,
        type: "yandex#map"
    });

    if (addImbaloon) {
        map.geoObjects.add(
        new ymaps.Placemark([longitude, latitude],
            {
                balloonContentHeader: "Я здесь"//,
                //balloonContent: ymaps.geolocation.city,
                //balloonContentFooter: ymaps.geolocation.region
            }
        )
    );
    }

    map.controls
                                        .add("zoomControl")
                                        .add("mapTools")
                                        .add(new ymaps.control.TypeSelector(["yandex#map", "yandex#satellite", "yandex#hybrid", "yandex#publicMap"]));



    $.get('/api/cafes/All/1')
        .done(function (data) {
            //debugger;
            for (var key in data) {
                var cafe = data[key];

                //console.log(val.GeoObject.metaDataProperty.GeocoderMetaData.kind + ' ' + val.GeoObject.Point.pos + ' ' + val.GeoObject.name + ' ' + val.GeoObject.description);

                map.geoObjects.add(new ymaps.Placemark([cafe.Longitude, cafe.Latitude], {
                    balloonContent: '<div class="baloon_content"><b>' + cafe.Name + '</b> <a href="/cafe/' + cafe._id + '/menu">Меню</a></div>',
                    autoPan: false
                }, {
                    iconImageHref: '/images/baloon.png',
                    iconImageSize: [41, 52],
                    iconImageOffset: [-20, -52]
                })

                                        );
            };

        })



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