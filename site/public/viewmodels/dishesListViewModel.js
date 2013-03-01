function Dish(data) {
    this.Name = ko.observable(data.Name);
    this.Description = ko.observable(data.Description);
    this.Price = ko.observable(data.Price);
}

function DishesListViewModel(cafeId, categoryId) {
    // Data
    debugger;
    var self = this;
    self.dishes = ko.observableArray([]);
    self.newDishName = ko.observable();
    self.newDishDescription = ko.observable();
    self.newDishPrice = ko.observable();

    // Operations
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

    // // Load initial state from server, convert it to Task instances, then populate self.tasks
    //$.getJSON("/cafe/:cafeId/menu/:menuId/category/:categoryId/dishes", function(allData) {
    //    var mappedTasks = $.map(allData, function(item) { return new Task(item) });
    //    self.tasks(mappedTasks);
    //});
}

var cafeId = document.getElementById("cafeId").value;
var categoryId = document.getElementById("categoryId").value;

ko.applyBindings(new DishesListViewModel(cafeId, categoryId));