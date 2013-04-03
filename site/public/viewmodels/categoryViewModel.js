function Category(data, cafeId) {
    var self = this;
    self.cafeId = cafeId;
    self.id = ko.observable(data._id);
    self.Name = ko.observable(data.Name);
    self.IdName = ko.observable(data.IdName);
    self.Dishes = ko.observableArray([]);
    self.IdNameHash = ko.observable('#' + data.IdName);
    self.active = ko.observable(false);
    self.activeText = ko.computed(function () {
        if (self.active())
            return 'active';
        return '';
    });

    self.Message = ko.observable("");
    self.showOk = ko.observable(false);
    self.showError = ko.observable(false);

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

    self.newDishName = ko.observable();
    self.newDishDescription = ko.observable();
    self.newDishPrice = ko.observable();
    self.newDishDays = ko.observableArray([]);

    self.addDish = function (data) {
        var dish = new Dish({ Name: this.newDishName(), Description: this.newDishDescription(), Price: this.newDishPrice(), Days: this.newDishDays(), Image: $('#newPhotoTmpUrl').val() });
        self.Dishes.push(dish);
    };
    self.addDishToDb = function (dishData) {
        var dish = new Dish({ Name: dishData.Name(), Description: dishData.Description(), Price: dishData.Price(), Days: dishData.Days(), Image: dishData.Image() });
        var url = "/api/cafe/" + self.cafeId + "/category/" + self.id() + "/dishes";
        var jsonData = ko.toJSON(dish);
        $.ajax(url, {
            data: jsonData,
            type: "post", contentType: "application/json",
            success: function (data) {
                $('#newPhotoTmpUrl').val("")
                self.Message("Блюдо добавлено");
                self.showOk(true);
                dishData.id(data.id._id);

            },
            error: function (result) {
                self.Message("Ошибка при добавлении");
                self.showError(true);
                console.log(result);
            }
        });
    };

    self.removeDish = function (dish) {
        self.Dishes.destroy(dish)
        var url = "/api/dishes/" + dish.id();
        var jsonData = ko.toJSON(dish);
        $.ajax(url, {
            data: jsonData,
            type: "delete", contentType: "application/json",
            success: function (data) {
                self.Message("Блюдо удалено");
                self.showOk(true);
            },
            error: function (result) {
                self.Message("Ошибка при удалении");
                self.showError(true);
                console.log(result);
            }
        });
    };




}

