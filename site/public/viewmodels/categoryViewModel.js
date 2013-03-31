function Category(data) {
    var self = this;
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
        debugger;
        var dish = new Dish({ Name: this.newDishName(), Description: this.newDishDescription(), Price: this.newDishPrice(), Days: this.newDishDays(), Image: $('#newPhotoTmpUrl').val() });
        var url = "/api/cafe/" + cafeId + "/category/" + this.id() + "/dishes";
        var jsonData = ko.toJSON(dish);
        $.ajax(url, {
            data: jsonData,
            type: "post", contentType: "application/json",
            success: function (data) {
                $('#newPhotoTmpUrl').val("")
                $('#newPhotoImage' + self.IdName()).attr("src", "");
                alert(data);
            },
            error: function (result) {
                console.log(result);
            }
        });
        self.Dishes.push(dish);
        self.newDishName("");
        self.newDishDescription("");
        self.newDishPrice("");
    };

    self.removeDish = function (dish) {
        self.Dishes.destroy(dish)
        var url = "/api/dishes/" + dish.id();
        var jsonData = ko.toJSON(dish);
        $.ajax(url, {
            data: jsonData,
            type: "delete", contentType: "application/json",
            success: function (data) {
                alert(data);
            },
            error: function (result) {
                console.log(result);
            }
        });
    };




}

