function OrderViewModel(orderId) {

    var self = this;
    self.OrderId = orderId
    self.OrderedDishes = ko.observableArray([]);
    


    // Operations
    
    self.deleteDish = function (dish) {
        self.OrderedDishes.push(dish);
    };

    self.addDish = function (dish) {
        self.OrderedDishes.push(dish);
    };

    self.decDish = function (dish) {
        self.OrderedDishes.push(dish);
    };

    $.getJSON('/api/order/' + orderId, function (order) {
        ko.utils.arrayForEach(order.Dishes, function (dish) {
            self.OrderedDishes.push(dish);
        })
    });

}

if (document.getElementById("orderId") != null) {
    var orderId = document.getElementById("orderId").value;
    if (document.getElementById("cafe_menu_page") != null)
        ko.applyBindings(new OrderViewModel(orderId), document.getElementById("order_page"));
}