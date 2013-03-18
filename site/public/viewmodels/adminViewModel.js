
function AdminViewModel(cafeId) {
    var self = this;
    self.Categories = ko.observableArray([]);

    // Operations
    $.getJSON("/api/cafes/" + cafeId + "/category", function (allData) {
        $.each(allData, function (index, value) {
            $.getJSON("/api/cafe/" + cafeId + "/category/" + value._id + "/dishes", function (allData) {
                var mappedDishes = $.map(allData, function (item) { return new Dish(item) });
                var category = new Category(value);
                category.Dishes(mappedDishes);
                self.Categories.push(category);
            });
        });
    });
}

if (document.getElementById("cafeId") != null) {
    var cafeId = document.getElementById("cafeId").value;
    ko.applyBindings(new AdminViewModel(cafeId), document.getElementById("admin_menu"));
}
