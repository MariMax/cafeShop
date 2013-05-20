function Item(data, messageFunc,errorFunc) {
    var self = this;
    self.messageFunc = messageFunc;
    self.errorFunc = errorFunc;
    self.id = ko.observable(data._id);
        self.shop = ko.observable(data._shop);
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

    self.updateItem = function (item) {
        var url = "/api/shop/"+this.shop()+"/item/" + this.id();
        item.Image($('#newPhotoTmpUrl').val());
        var jsonData = ko.toJSON(item);
        $.ajax(url, {
            data: jsonData,
            type: "put", contentType: "application/json",
            success: function (data) {
                self.messageFunc("Блюда обновлено");
                $("#newPhotoTmpUrl").val("");
            },
            error: function (result) {
                self.errorFunc("ошибка при обновлении блюда")
                console.log(result);
                $("#newPhotoTmpUrl").val("");
            }
        });
    };
}