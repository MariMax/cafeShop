function Dish(data) {
    this.Name = ko.observable(data.Name);
    this.Description = ko.observable(data.Description);
    this.Price = ko.observable(data.Price);
    this.Id = ko.observable(data.Id);
}

function Category(data) {
    var self = this;
    self.id = ko.observable(data.id);
    self.Name = ko.observable(data.Name);
    self.IdName = ko.observable(data.IdName);
    self.Dishes = ko.observableArray([]);
    self.IdNameHash = ko.computed(function () {
        return "#" + self.IdName;
    });
}


function AdminViewModel(cafeId) {
    debugger;
    var self = this;
    self.name = ko.observable('');
    self.phone = ko.observable();
    self.Categories = ko.observableArray([]);

    var self = this;
    self.dishes = ko.observableArray([]);
    self.newDishName = ko.observable();
    self.newDishDescription = ko.observable();
    self.newDishPrice = ko.observable();

    // Operations
    self.saveInfo = function () {

    }

    self.addDish = function (categoryId) {
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

if (document.getElementById("cafeId") != null) {
    var cafeId = document.getElementById("cafeId").value;
    ko.applyBindings(new AdminViewModel(cafeId), document.getElementById("admin_menu"));
}
