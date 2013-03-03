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
    this.Name = ko.observable(data.Name);
    this.Slogan = ko.observable(data.Slogan);
    this.Address = ko.observable(data.Address);
    this.CellPhone = ko.observable(data.CellPhone);
    this.WorkTime = ko.observable(data.WorkTime);
    this.Id = ko.observable(data.Id);
}

function MenuViewModel(cafeId) {

    var self = this;
    self.CafeName = ko.observable();
    self.Cafe = ko.observable();
    self.Categories = ko.observableArray([]);
    
    $.getJSON("/api/cafes/" + cafeId, function (allData) {
        var mapped = $.map(allData, function (item) { return new Cafe(item) });
       
        self.Cafe(mapped);
        self.CafeName = self.Cafe.Name;
    });

    $.getJSON("/api/cafe/" + cafeId + "/category", function (allData) {
        var mapped = $.map(allData, function (item) { return new Category(item) });
        
        self.Categories(mapped);
    });

    $.each(self.Categories, function (index, value) {
        $.getJSON("/api/cafe/" + cafeId + "/category/" + value.Id + "/dishes", function (allData) {
            var mapped = $.map(allData, function (item) { return new Dish(item) });
            
            var category = new Category(value);
            category.Dishes(mapped);
            self.Categories.push(category);
        });
    });
}

var cafeId = document.getElementById("cafeId").value;
ko.applyBindings(new MenuViewModel(cafeId));