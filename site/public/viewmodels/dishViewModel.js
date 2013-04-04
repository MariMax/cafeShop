function Dish(data, messageFunc,errorFunc) {
    var self = this;
    self.id = ko.observable(data._id);
    self.Name = ko.observable(data.Name);
    self.Description = ko.observable(data.Description);
    self.Price = ko.observable(0);
    if (data.Price)
        self.Price(data.Price);
    self.Days = ko.observableArray([]);
    self.Image = ko.observable(data.Image);
    if (data.Days == null)
        self.Days.push("AllWeek");
    else {
        $.each(data.Days, function (index, value) {
            self.Days.push(value);
        });
        self.Image = ko.observable("/images/icon_add_photo.png");
        if (data.Image != null)
            self.Image(data.Image);
    }

    self.updateDish = function (dish) {
        var url = "/api/dishes/" + this.id();
        dish.Image($('#newPhotoTmpUrl').val());
        var jsonData = ko.toJSON(dish);
        $.ajax(url, {
            data: jsonData,
            type: "put", contentType: "application/json",
            success: function (data) {
                messageFunc("Блюда обновлено");
                $("#newPhotoTmpUrl").val("");
            },
            error: function (result) {
                errorFunc("ошибка при обновлении блюда")
                console.log(result);
                $("#newPhotoTmpUrl").val("");
            }
        });
    };


    ko.bindingHandlers.uploadImage = {
        init: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor()); // Get the current value of the current property we're bound to
            $(element).fileupload({ dataType: 'json',
                done: function (e, data) {
                    //var newId = "#" + e.target.id.replace("newPhotoInput", "newPhoto");
                    //$(newId).attr("style", "background:#fff url(\"" + data.result[0].url + "\") no-repeat center 25%;");

                    var newId = "#" + e.target.id.replace("newPhotoInput", "newPhotoImage");
                    //if (self.id() != null)
                    //    $("#newPhotoImage" + self.id()).attr("src", data.result[0].url);
                    //else
                    $(newId).attr("src", data.result[0].url);
                    $("#newPhotoTmpUrl").val(data.result[0].url);
                }
            });
        },
        update: function (element, valueAccessor, allBindingsAccessor) {
            // Leave as before
        }
    };

}