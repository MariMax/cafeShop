function Category(data, shopId, messageFunc, errorFunc) {
    var self = this;
    self.messageFunc = messageFunc;
    self.errorFunc = errorFunc;
    self.shopId = shopId;
    self.id = ko.observable(data._id);
    self.Name = ko.observable(data.Name);
    self.IdName = ko.observable(data.IdName);
    self.Items = ko.observableArray([]);
    self.IdNameHash = ko.observable('#' + data.IdName);
    self.active = ko.observable(false);
    self.edit = ko.observable(false);
    self.activeText = ko.computed(function () {
        if (self.active())
            return 'active';
        return '';
    });



    self.newItemName = ko.observable();
    self.newItemDescription = ko.observable();
    self.newItemPrice = ko.observable();
    self.newItemDays = ko.observableArray([]);

    self.addItem = function (data) {
        var item = new Item({ Name: this.newItemName(), Description: this.newItemDescription(), Price: this.newItemPrice(), Days: this.newItemDays(), Image: $('#newPhotoTmpUrl').val() });
        self.Items.push(item);
    };
    self.addItemToDb = function (itemData) {
        debugger;
        var imageUrl = $('#newPhotoTmpUrl').val();
        var item = new Item({ Name: itemData.Name(), Description: itemData.Description(), Price: itemData.Price(), Days: itemData.Days(), Image: imageUrl });
        var url = "/api/shop/" + self.shopId + "/category/" + self.id() + "/items";
        var jsonData = ko.toJSON(item);
        $.ajax(url, {
            data: jsonData,
            type: "post", contentType: "application/json",
            success: function (data) {
                $('#newPhotoTmpUrl').val("")
                self.messageFunc("Блюдо добавлено");
                itemData.id(data.id._id);

            },
            error: function (result) {
                self.errorFunc("Ошибка при добавлении");
                console.log(result);
            }
        });
    };

    self.removeItem = function (item) {
        self.Items.destroy(item)
        var url = "/api/shop/" + item.shop() + "/item/" + item.id();
        var jsonData = ko.toJSON(item);
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

