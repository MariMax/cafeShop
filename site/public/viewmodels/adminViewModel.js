
function AdminViewModel(shopId) {
    var self = this;
    self.shopId = shopId;
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
        url: "/api/shops/" + self.shopId + "/category",
        type: "GET",
        async: false
    }).done(function (allData) {
        var first = true;
        $.each(allData, function (index, value) {
            $.ajax({
                url: "/api/shop/" + self.shopId + "/category/" + value._id + "/items",
                type: "GET",
                async: false
            }).done(function (allData) {
                var mappedItems = $.map(allData, function (item) { return new Item(item, okMessage, errorMessage) });
                var category = new Category(value, self.shopId, okMessage, errorMessage);
                category.Items(mappedItems);
                category.active(first);
                if (first)
                    first = false;
                self.Categories.push(category);
            });
        });
    });

    //$.getJSON("/api/shops/" + shopId + "/category", function (allData) {
    //    var first = true;
    //    $.each(allData, function (index, value) {
    //        $.getJSON("/api/shop/" + shopId + "/category/" + value._id + "/items", function (allData) {
    //            var mappedItems = $.map(allData, function (item) { return new Item(item) });
    //            var category = new Category(value);
    //            category.Items(mappedItems);
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

if (document.getElementById("shopId") != null) {
    var shopId = document.getElementById("shopId").value;
    if (document.getElementById("admin_stock") != null)
        ko.applyBindings(new AdminViewModel(shopId), document.getElementById("admin_stock"));
}
