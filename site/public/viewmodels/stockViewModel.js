function StockViewModel(shopId) {

    var self = this;
    self.ShopId = shopId;
    self.ShopName = ko.observable();
    self.ShopAddress = ko.observable('Адрес не задан');
    self.ShopPhone = ko.observable('Телефон не задан');
    self.ShopWorkTime = ko.observable('Время работы не задано');
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
                    url: '/api/order/createOrder/' + self.ShopId + '/' + dish.id() + '/1',
                    type: "GET",
                    async: false,
                    cache: false
                }).done(function (order) {
                    orderId = order._id;
                    first = false;
                })
            } else {
                $.ajax({
                    url: '/api/order/addDish/' + orderId + '/' + self.ShopId + '/' + dish.id() + '/1',
                    type: "GET",
                    async: false,
                    cache: false
                }).done(function (order) { orderId = order._id; }
                )
            }
            document.location.href = '/order/buy/' + orderId;
            //$.ajax({
            //    url: '/api/order/calcPrice/' + orderId,
            //    type: "GET",
            //    async: false
            //}).done(function (order) { document.location.href = '/order/buy/' + order._id; })

        });
    }
    self.buyDish = function (dish) {
        self.OrderedDishes.push(dish);
    };

    $.getJSON('/api/shops/' + shopId, function (shop) {
        if (shop.Name)
            self.ShopName(shop.Name);
        if (shop.Address)
            self.ShopAddress(shop.Address);
        if (shop.WorkTime)
            self.ShopWorkTime(shop.WorkTime);
        if (shop.ClientPhone)
            self.ShopPhone(shop.ClientPhone);
    });

    $.ajax(
    {
        url: "/api/shops/" + shopId + "/category",
        type: "GET",
        async: false
    }).done(function (allData) {
        var first = true;
        $.each(allData, function (index, value) {
            $.ajax({
                url: "/api/shop/" + shopId + "/category/" + value._id + "/dishes",
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
                    if (n === 0)
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

    //$.getJSON("/api/shops/" + shopId + "/category", function (allData) {
    //    $.each(allData, function (index, value) {
    //        $.getJSON("/api/shop/" + shopId + "/category/" + value._id + "/dishes", function (allData) {
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

if (document.getElementById("shopId") != null) {
    var shopId = document.getElementById("shopId").value;
    if (document.getElementById("shop_stock_page") != null)
        ko.applyBindings(new StockViewModel(shopId), document.getElementById("shop_stock_page"));
}