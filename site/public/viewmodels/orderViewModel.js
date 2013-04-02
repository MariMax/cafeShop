

function OrderViewModel(orderId) {

    var self = this;
    self.OrderId = orderId
    self.OrderedDishes = ko.observableArray([]);
    self.Total =  ko.computed(function () {
        var total = 0;
        ko.utils.arrayForEach(self.OrderedDishes(), function (dish) {
            
            total += dish.price;
        })

        return total;
    });
    self.addDish = function (dish) {


        debugger;
        self.OrderedDishes[0].count++;


    };
    

    $.getJSON('/api/order/' + orderId, function (order) {
        ko.utils.arrayForEach(order.Dishes, function (dish) {
            $.ajax({
                url: "/api/dishes/" + dish.dishId,
                type: "GET",
                async: false
            }).done(function (b_dish) {
                
                self.OrderedDishes.push({ dish: b_dish, count: dish.count, price:b_dish.Price*dish.count });
            });

        });
    });

}

if (document.getElementById("orderId") != null) {
    var orderId = document.getElementById("orderId").value;
    if (document.getElementById("order_page") != null)
        ko.applyBindings(new OrderViewModel(orderId), document.getElementById("order_page"));
}