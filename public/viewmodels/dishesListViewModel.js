function Dish(data) {
    this.Name = ko.observable(data.Name);
    this.Description = ko.observable(data.Description);
    this.Price = ko.observable(data.Price);
}

function DishesListViewModel(cafeId, menuId, categoryId) {
    // Data
    debugger;
    var self = this;
    self.dishes = ko.observableArray([]);
    self.newDishName = ko.observable();
    self.newDishDescription = ko.observable();
    self.newDishPrice = ko.observable();
    self.cafeId = cafeId;
    self.menuId = menuId;
    self.categoryId = categoryId;



    // Operations
    self.addDish = function () {
        self.dishes.push(new Dish({ Name: this.newDishName(), Description: this.newDishDescription(), Price: this.newDishPrice() }));
        var url = "/api/cafe/" + self.cafeId + "/menu/" + self.menuId + "/category/" + self.categoryId + "/dishes";
        $.ajax(url, {
            data: ko.toJSON({ dishes: self.dishes }),
            type: "post", contentType: "application/json",
            success: function (result) { alert(result) }
        });
        self.newDishName("");
        self.newDishDescription("");
        self.newDishPrice("");
    };
    self.removeDish = function (dish) { self.dishes.destroy(dish) };

    // // Load initial state from server, convert it to Task instances, then populate self.tasks
    //$.getJSON("/tasks", function(allData) {
    //    var mappedTasks = $.map(allData, function(item) { return new Task(item) });
    //    self.tasks(mappedTasks);
    //});
}

var cafeId = document.getElementById('cafeId').value;
var menuId = document.getElementById('menuId').value;
var categoryId = document.getElementById('categoryId').value;

ko.applyBindings(new DishesListViewModel(cafeId,menuId,categoryId));