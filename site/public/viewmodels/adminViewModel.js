function Dish(data) {
    this.Name = ko.observable(data.Name);
    this.Description = ko.observable(data.Description);
    this.Price = ko.observable(data.Price);
    this.Id = ko.observable(data.Id);
}

function Category(data) {
    this.id = ko.observable(data.id);
    this.Name = ko.observable(data.Name);
    this.IdName = ko.observable(data.IdName);
    this.Dishes = ko.observableArray([]);
}


function AdminViewModel(cafeId) {

    var self = this;
    self.name = ko.observable('');
    self.phone = ko.observable();
    self.Categories = ko.observableArray([]);

    var self = this;
    self.dishes = ko.observableArray([]);
    self.newDishName = ko.observable();
    self.newDishDescription = ko.observable();
    self.newDishPrice = ko.observable();
    self.newDishCategory = ko.observable();

    // Operations
    self.saveInfo = function () {

    }

    self.addDish = function () {
        var dish = new Dish({ Name: this.newDishName(), Description: this.newDishDescription(), Price: this.newDishPrice() });
        self.dishes.push(dish);
        var url = "/api/cafe/" + cafeId + "/category/" + categoryId + "/dishes";
        debugger;
        var jsonData = ko.toJSON(dish);
        $.ajax(url, {
            data: jsonData,
            type: "post", contentType: "application/json",
            success: function (result) { alert(result) }
        });
        self.newDishName("");
        self.newDishDescription("");
        self.newDishPrice("");
    };
    self.removeDish = function (dish) { self.dishes.destroy(dish) };


    $.getJSON("/api/cafes/" + cafeId, function (data) {
        self.name(data.Name);
        self.phone(data.tempCellPhone);
    });

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

var cafeId = document.getElementById("cafeId").value;
ko.applyBindings(new AdminViewModel(cafeId));