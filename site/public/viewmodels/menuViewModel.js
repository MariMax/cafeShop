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
                var mappedDishes = $.map(allData, function (item) { return new Dish(item) });
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
    ko.applyBindings(new MenuViewModel(cafeId), document.getElementById("cafe_menu_page"));
}