function MenuViewModel(cafeId) {

    var self = this;
    self.CafeId = cafeId;
    self.CafeName = ko.observable();
    self.CafeAddress = ko.observable('Адрес не задан');
    self.CafePhone = ko.observable('Телефон не задан');
    self.CafeWorkTime = ko.observable('Время работы не задано');
    self.Categories = ko.observableArray([]);
    self.OrderedDishes = ko.observableArray([]);
    self.OrderedDishesPrices = ko.computed(function () {
        var total = 0;
        ko.utils.arrayForEach(self.OrderedDishes(), function (dish) {
            total += dish.Price();
        })
        return total;
    });


    // Operations
    self.order = function () {
        var first = true;
        var orderId = null;
        ko.utils.arrayForEach(self.OrderedDishes(), function (dish) {
            if (first) {
                $.ajax({
                    url: '/api/order/createOrder/' + self.CafeId + '/' + dish.id() + '/1',
                    type: "GET",
                    async: false
                }).done(function (order) {
                    orderId = order._id;
                    first = false;
                })
            } else {
                $.ajax({
                    url: '/api/order/addDish/' + orderId + '/' + self.CafeId + '/' + dish.id() + '/1',
                    type: "GET",
                    async: false
                }).done(function (order) { orderId = order._id; }
                )
            }
            $.ajax({
                url: '/api/order/calcPrice/' + orderId,
                type: "GET",
                async: false
            }).done(function (order) { document.location.href = '/order/buy/' + order._id; })

        });
    }
    self.buyDish = function (dish) {
        self.OrderedDishes.push(dish);
    };

    $.getJSON('/api/cafes/' + cafeId, function (cafe) {
        if (cafe.Name)
            self.CafeName(cafe.Name);
        if (cafe.Address)
            self.CafeAddress(cafe.Address);
        if (cafe.WorkTime)
            self.CafeWorkTime(cafe.WorkTime);
        if (cafe.ClientPhone)
            self.CafePhone(cafe.ClientPhone);
    });

    $.ajax(
    {
        url: "/api/cafes/" + cafeId + "/category",
        type: "GET",
        async: false
    }).done(function (allData) {
        var first = true;
        $.each(allData, function (index, value) {
            $.ajax({
                url: "/api/cafe/" + cafeId + "/category/" + value._id + "/dishes",
                type: "GET",
                async: false
            }).done(function (allData) {
                var mappedDishes = $.map(allData, function (item) {
                    var d = new Date();
                    var n = d.getDay();
                    var nStr = "";
                    if (n === 1)
                        nStr = "Mon";
                    if (n === 2)
                        nStr = "Tue";
                    if (n === 3)
                        nStr = "Wed";
                    if (n === 4)
                        nStr = "Thu";
                    if (n === 5)
                        nStr = "Fri";
                    if (n === 6)
                        nStr = "Sat";
                    if (n === 7)
                        nStr = "Sun";

                    //if ($.inArray("AllWeek", item.Days) >= 0) {
                    if (item.Days.length == 0) {
                        return new Dish(item);
                    }
                    else if ($.inArray(nStr, item.Days) >= 0) {
                        return new Dish(item);
                    }


                });
                var category = new Category(value);
                category.Dishes(mappedDishes);
                category.active(first);
                if (first)
                    first = false;
                self.Categories.push(category);
            });
        });
    });

    //$.getJSON("/api/cafes/" + cafeId + "/category", function (allData) {
    //    $.each(allData, function (index, value) {
    //        $.getJSON("/api/cafe/" + cafeId + "/category/" + value._id + "/dishes", function (allData) {
    //            var mappedDishes = $.map(allData, function (item) { return new Dish(item) });
    //            var category = new Category(value);
    //            category.Dishes(mappedDishes);
    //            self.Categories.push(category);
    //        });
    //    });
    //});

    self.setActiveCategory = function (category) {
        self.active = true;
        $.each(self.Categories(), function (index, value) {
            if (value.id() == category.id())
                value.active(true);
            else
                value.active(false);
        });
    };
}

if (document.getElementById("cafeId") != null) {
    var cafeId = document.getElementById("cafeId").value;
    if (document.getElementById("cafe_menu_page") != null)
        ko.applyBindings(new MenuViewModel(cafeId), document.getElementById("cafe_menu_page"));
}