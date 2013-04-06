
function AdminViewModel(cafeId) {
    var self = this;
    self.cafeId = cafeId;
    self.Categories = ko.observableArray([]);

    self.Message = ko.observable("");
    self.showOk = ko.observable(false);
    self.showError = ko.observable(false);

    self.showOkMessage = ko.computed(function () {
        return self.showOk() && (self.Message().length > 0);
    });

    self.showErrorMessage = ko.computed(function () {
        return self.showError() && (self.Message().length > 0);
    });

    var okMessage = function (message) {
        self.Message(message);
        self.showOk(true);
    };
    var errorMessage = function (message) {
        self.Message(message);
        self.showError(true);
    };

    // Operations
    $.ajax(
    {
        url: "/api/cafes/" + self.cafeId + "/category",
        type: "GET",
        async: false
    }).done(function (allData) {
        var first = true;
        $.each(allData, function (index, value) {
            $.ajax({
                url: "/api/cafe/" + self.cafeId + "/category/" + value._id + "/dishes",
                type: "GET",
                async: false
            }).done(function (allData) {
                var mappedDishes = $.map(allData, function (item) { return new Dish(item, okMessage, errorMessage) });
                var category = new Category(value, self.cafeId, okMessage, errorMessage);
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



    self.hideOk = ko.computed(self.showOk).extend({ throttle: 1000 });
    self.hideOk.subscribe(function (val) {
        if (val) {
            self.showOk(false);
            self.Message("");

        }
    }, self);
    self.hideError = ko.computed(self.showError).extend({ throttle: 1000 });
    self.hideError.subscribe(function (val) {
        if (val) {
            self.showError(false);
            self.Message("");

        }
    }, self);


}

if (document.getElementById("cafeId") != null) {
    var cafeId = document.getElementById("cafeId").value;
    if (document.getElementById("admin_menu") != null)
        ko.applyBindings(new AdminViewModel(cafeId), document.getElementById("admin_menu"));
}
