var CartLine = function(dish, count) {
    var self = this;
    
    self.product = ko.observable(dish);
    self.quantity = ko.observable(count);
    self.subtotal = ko.computed(function() {
        return self.product() ? self.product().Price * parseInt("0" + self.quantity(), 10) : 0;
    });
 
};
var Cart = function(orderId) {
    // Stores an array of lines, and from these, can work out the grandTotal
    var self = this;
    self.lines = ko.observableArray(); // Put one line in by default
    self.Total = ko.computed(function() {
        var total = 0;
        $.each(self.lines(), function() { total += this.subtotal() })
        return total;
    });
 
    // Operations
        
        $.getJSON('/api/order/' + orderId, function (order) {
        ko.utils.arrayForEach(order.Dishes, function (dish) {
            $.ajax({
                url: "/api/dishes/" + dish.dishId,
                type: "GET",
                async: false
            }).done(function (b_dish) {
                
                self.lines.push(new CartLine(b_dish,dish.count));
            });

        });
    });
};

if (document.getElementById("orderId") != null) {
    var orderId = document.getElementById("orderId").value;
    if (document.getElementById("order_page") != null)
        ko.applyBindings(new Cart(orderId), document.getElementById("order_page"));
}