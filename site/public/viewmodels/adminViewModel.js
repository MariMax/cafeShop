
function AdminViewModel(cafeId) {
    debugger;
    var self = this;
    self.Categories = ko.observableArray([]);
    

    // Operations
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
    //    var first = true;
    //    $.each(allData, function (index, value) {
    //        $.getJSON("/api/cafe/" + cafeId + "/category/" + value._id + "/dishes", function (allData) {
    //            var mappedDishes = $.map(allData, function (item) { return new Dish(item) });
    //            var category = new Category(value);
    //            category.Dishes(mappedDishes);
    //            category.active(first);
    //            if (first)
    //                first = false;
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
    ko.applyBindings(new AdminViewModel(cafeId), document.getElementById("admin_menu"));
}
