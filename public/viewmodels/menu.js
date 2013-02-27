function Dish(data) {
    this.Name = ko.observable(data.Name);
    this.Description = ko.observable(data.Description);
    this.Price = ko.observable(data.Price);
    this.Id = ko.observable(data.Id);
}

function Category(data) {
    this.Name = ko.observable(data.Name);
    this.IdName = ko.observable(data.IdName);
    this.Dishes = ko.observableArray([]);
}

function Cafe(data) {
    this.Slogan = ko.observable(data.Slogan);
    this.Address = ko.observable(data.Address);
    this.CellPhone = ko.observable(data.CellPhone);
    this.WorkTime = ko.observable(data.WorkTime);
    this.Id = ko.observable(data.Id);
    this.Categories = ko.observableArray([]);

}

function MenuViewModel(cafeId) {

    var self = this;
    self.Cafe = ko.observable();

    $.getJSON("/api/cafes/" + cafeId, function (allData) {
        var mappedCafe = $.map(allData, function (item) { return new Cafe(item) });
        self.Cafe = mappedCafe;
    });

    $.getJSON("/api/cafe/" + cafeId + "/category", function (allData) {
        var mappedCafe = $.map(allData, function (item) { return new Category(item) });
        self.Cafe.Categories(mappedCafe);
    });

    $.each(self.Cafe.Categories, function (index, value) {
        $.getJSON("/api/cafe/" + cafeId + "/category/" + value.Id + "/dishes", function (allData) {
            var mappedDishes = $.map(allData, function (item) { return new Dish(item) });
            value.Dishes(mappedDishes);
        });
    });
}