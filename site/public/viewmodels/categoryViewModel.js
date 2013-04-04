function Category(data, cafeId, messageFunc,errorFunc) {
    var self = this;
    self.messageFunc = messageFunc;
    self.errorFunc = errorFunc;
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
                self.messageFunc("Блюдо добавлено");
                dishData.id(data.id._id);

            },
            error: function (result) {
                self.errorFunc("Ошибка при добавлении");
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
                self.messageFunc("Блюдо удалено");
            },
            error: function (result) {
                self.errorFunc("Ошибка при удалении");
                console.log(result);
            }
        });
    };





}

