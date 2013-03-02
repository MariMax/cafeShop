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


function MenuViewModel(cafeId) {

    var self = this;
    self.name = ko.observable('');
    self.phone = ko.observable();
    self.Categories = ko.observableArray([]);

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
ko.applyBindings(new MenuViewModel(cafeId));