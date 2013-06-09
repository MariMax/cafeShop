
function AdminViewModel(shopId) {
    var self = this;
    self.shopId = shopId;


    self.Categories = ko.observableArray([]);
    self.newCategoryName = ko.observable("");

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

    self.removeCategory = function (category) {
        var url = "/api/category/delete/" + category.id() + "/shop/" + category.shopId;
        $("#dialog-delete-confirm").dialog({
            resizable: false,
            height: 140,
            modal: true,
            buttons: {
                "Удалить": function () {
                    self.Categories.remove(category);
                    if (self.Categories().length > 0)
                        self.setActiveCategory(self.Categories()[0]);
                    var jsonData = ko.toJSON(category);
                    $.ajax(url, {
                        data: jsonData,
                        type: "post", contentType: "application/json",
                        success: function (data) {

                            okMessage("Категория удалена");
                        },
                        error: function (result) {
                            errorMessage("Ошибка при удалении");
                            console.log(result);
                        }
                    });
                    $(this).dialog("close");
                },
                "Отмена": function () {
                    $(this).dialog("close");
                }
            }
        });
    };

    self.addCategory = function (data) {
        var category = new Category({ Name: self.newCategoryName(), IdName: self.newCategoryName(), shopId: self.shopId });
        self.Categories.push(category);
    };

    self.addCategoryToDb = function (itemData) {
        var url = "/api/shop/" + self.shopId + "/category/";

        var category = new Category({ Name: itemData.Name(), IdName: itemData.Name() });

        var jsonData = ko.toJSON(category);
        $.ajax(url, {
            data: jsonData,
            type: "post", contentType: "application/json",
            success: function (data) {
                okMessage("Категория добавлена");
                itemData.id(data.id._id);

            },
            error: function (result) {
                errorMessage("Ошибка при добавлении");
                console.log(result);
            }
        });
    };

    self.renameCategory = function () {
        var forEdit = ko.utils.arrayFirst(self.Categories(), function (category) {
            return category.active() == true;
        });
        if (forEdit)
            forEdit.edit(true);
    }

    self.renameCategoryToDb = function (item) {
        var url = "/api/shop/" + self.shopId + "/category/" + item.id();
        var jsonData = ko.toJSON(item);
        $.ajax(url, {
            data: jsonData,
            type: "put", contentType: "application/json",
            success: function (data) {
                okMessage("Категория обновлена");

            },
            error: function (result) {
                errorMessage("Ошибка при обновлении");
                console.log(result);
            }
        });
        item.edit(false);
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
