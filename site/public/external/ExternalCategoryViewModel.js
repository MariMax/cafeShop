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

}

