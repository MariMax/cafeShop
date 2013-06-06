function StockViewModel(shopId,orderTemplate) {

    var self = this;
    self.ShopId = shopId;
	self.orderTemplate = orderTemplate;
    self.ShopName = ko.observable();
	self.ShopDescription = ko.observable();
    self.ShopAddress = ko.observable('Адрес не задан');
    self.ShopPhone = ko.observable('Телефон не задан');
    self.ShopWorkTime = ko.observable('Время работы не задано');
    self.Categories = ko.observableArray([]);
    self.OrderedItems = ko.observableArray([]);
    self.OrderedItemsPrices = ko.computed(function () {
        var total = 0;
        ko.utils.arrayForEach(self.OrderedItems(), function (item) {
            total += item.Price();
        })
        return total;
    });


    // Operations
    self.order = function () {
        var first = true;
        var orderId = null;
        ko.utils.arrayForEach(self.OrderedItems(), function (item) {
            if (first) {
                $.ajax({
                    url: 'http://idiesh.ru/api/order/createOrder/' + self.ShopId + '/' + item.id() + '/1',
                    type: "GET",
                    async: false,
                    cache: false
                }).done(function (order) {
                    
                    orderId = order._id;
                    first = false;
                })
            } else {
                $.ajax({
                    url: 'http://idiesh.ru/api/order/addItem/' + orderId + '/' + self.ShopId + '/' + item.id() + '/1',
                    type: "GET",
                    async: false,
                    cache: false
                }).done(function (order) { orderId = order._id; }
                )
            }
            
           cafeShopContainer.empty();
		   cafeShopContainer.html(self.orderTemplate);
		   enableOrderValidators();
		   bindOrder(orderId)
		   
		   


        });
    }
    self.buyItem = function (item) {
        self.OrderedItems.push(item);
    };

    $.getJSON('http://idiesh.ru/api/shops/' + shopId, function (shop) {
        if (shop.Name)
            self.ShopName(shop.Name);
        if (shop.Address)
            self.ShopAddress(shop.Address);
        if (shop.WorkTime)
            self.ShopWorkTime(shop.WorkTime);
        if (shop.ClientPhone)
            self.ShopPhone(shop.ClientPhone);
        if (shop.Description)
            self.ShopDescription(shop.Description);
			
    });

    $.ajax(
    {
        url: "http://idiesh.ru/api/shops/" + shopId + "/category",
        type: "GET",
        async: false
    }).done(function (allData) {
        var first = true;
        $.each(allData, function (index, value) {
            $.ajax({
                url: "http://idiesh.ru/api/shop/" + shopId + "/category/" + value._id + "/items",
                type: "GET",
                async: false
            }).done(function (allData) {
                var mappedItems = $.map(allData, function (item) {
                    var d = new Date();
                    var n = d.getDay();
                    var nStr = "";
                    if (n === 1)
                        nStr = "Mon";
                    if (n === 2)
                        nStr = "Tue";
                    if (n === 3)
                        nStr = "Wed";
                    if (n === 4)
                        nStr = "Thu";
                    if (n === 5)
                        nStr = "Fri";
                    if (n === 6)
                        nStr = "Sat";
                    if (n === 0)
                        nStr = "Sun";

                    //if ($.inArray("AllWeek", item.Days) >= 0) {
                    if (item.Days.length == 0) {
                        return new Item(item);
                    }
                    else if ($.inArray(nStr, item.Days) >= 0) {
                        return new Item(item);
                    }


                });
                var category = new Category(value);
                category.Items(mappedItems);
                category.active(first);
                if (first)
                    first = false;
                self.Categories.push(category);
            });
        });
    });

    self.setActiveCategory = function (category) {
        self.active = true;
        $.each(self.Categories(), function (index, value) {
            if (value.id() == category.id())
                value.active(true);
            else
                value.active(false);
        });
    };
}
function bind(orderTemplate){
if (document.getElementById("shopId") != null) {
    var shopId = document.getElementById("shopId").value;
    if (document.getElementById("shop_stock_page") != null)
        ko.applyBindings(new StockViewModel(shopId,orderTemplate), document.getElementById("shop_stock_page"));
}
}
