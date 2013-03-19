function Dish(data) {
    var self = this;
    self.id = ko.observable(data._id);
    self.Name = ko.observable(data.Name);
    self.Description = ko.observable(data.Description);
    self.Price = ko.observable(data.Price);
    self.Days = ko.observableArray([]);
    if (data.Days == null)
        self.Days.push("AllWeek");
    else {
        $.each(data.Days, function (index, value) {
            self.Days.push(value);
        });
    }

    self.updateDish = function (dish) {
        var url = "/api/dishes/" + this.id();
        var jsonData = ko.toJSON(dish);
        $.ajax(url, {
            data: jsonData,
            type: "put", contentType: "application/json",
            success: function (data) {
                alert(data._id);
            },
            error: function (result) {
                alert('error ' + result);
                console.log(result);
            }
        });
    };


}