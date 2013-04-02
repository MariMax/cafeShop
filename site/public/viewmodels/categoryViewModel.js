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
    self.showAdded = ko.observable(false);
    self.hideAdded = ko.observable(false);
    self.newDishName = ko.observable();
    self.newDishDescription = ko.observable();
    self.newDishPrice = ko.observable();
    self.newDishDays = ko.observableArray([]);

    self.addDish = function (data) {
        var dish = new Dish({ Name: this.newDishName(), Description: this.newDishDescription(), Price: this.newDishPrice(), Days: this.newDishDays(), Image: $('#newPhotoTmpUrl').val() });
        //var url = "/api/cafe/" + cafeId + "/category/" + this.id() + "/dishes";
        //var jsonData = ko.toJSON(dish);
        //$.ajax(url, {
        //    data: jsonData,
        //    type: "post", contentType: "application/json",
        //    success: function (data) {
        //        $('#newPhotoTmpUrl').val("")
        //        $('#newPhotoImage' + self.IdName()).attr("src", "");
        //        alert(data);
        //    },
        //    error: function (result) {
        //        console.log(result);
        //    }
        //});
        self.Dishes.push(dish);
        //self.newDishName("");
        //self.newDishDescription("");
        //self.newDishPrice("");
    };
    self.addDishToDb = function (data) {
        var dish = new Dish({ Name: data.Name(), Description: data.Description(), Price: data.Price(), Days: data.Days(), Image: data.Image() });
        var url = "/api/cafe/" + self.cafeId + "/category/" + self.id() + "/dishes";
        var jsonData = ko.toJSON(dish);
        $.ajax(url, {
            data: jsonData,
            type: "post", contentType: "application/json",
            success: function (data) {
                $('#newPhotoTmpUrl').val("")
                self.showAdded(true);
                self.showAdded(ko.computed(self.hideAdded).extend({ throttle: 500 }));
            },
            error: function (result) {
                debugger;
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
                alert(data);
            },
            error: function (result) {
                console.log(result);
            }
        });
    };




}

