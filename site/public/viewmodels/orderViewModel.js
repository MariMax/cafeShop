ko.extenders.required = function(target, overrideMessage) {
    //add some sub-observables to our observable
    target.hasError = ko.observable();
    target.validationMessage = ko.observable();
 
    //define a function to do validation
    function validate(newValue) {
       target.hasError(newValue ? false : true);
       target.validationMessage(newValue ? "" : overrideMessage || "This field is required");
    }
 
    //initial validation
    validate(target());
 
    //validate whenever the value changes
    target.subscribe(validate);
 
    //return the original observable
    return target;
};

ko.extenders.requiredCellPhone = function(target, overrideMessage) {
    //add some sub-observables to our observable
    target.hasError = ko.observable();
    target.validationMessage = ko.observable();
 
    //define a function to do validation
            function isValidPhoneNumber(number) {
            var pattern = new RegExp(/^(\+7)[0-9]{10}$/); //валидный российский номер
            return pattern.test(number);
        }

    function validate(newValue) {
       target.hasError(!isValidPhoneNumber(newValue));
       target.validationMessage(isValidPhoneNumber(newValue) ? "" : overrideMessage || "This field is required");
    }
 
    //initial validation
    validate(target());
 
    //validate whenever the value changes
    target.subscribe(validate);
 
    //return the original observable
    return target;
};

ko.extenders.requiredEmail = function(target, overrideMessage) {
    //add some sub-observables to our observable
    target.hasError = ko.observable();
    target.validationMessage = ko.observable();
 
    //define a function to do validation
        function isValidEmailAddress(emailAddress) {
            var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
            return pattern.test(emailAddress);
        }

    function validate(newValue) {
       target.hasError(!isValidEmailAddress(newValue));
       target.validationMessage(isValidEmailAddress(newValue) ? "" : overrideMessage || "This field is required");
    }
 
    //initial validation
    validate(target());
 
    //validate whenever the value changes
    target.subscribe(validate);
 
    //return the original observable
    return target;
};

var CartLine = function(dish, count) {
    var self = this;
    
    self.product = ko.observable(dish);
    self.quantity = ko.observable(count);
    self.subtotal = ko.computed(function() {
        return self.product() ? self.product().Price * parseInt("0" + self.quantity(), 10) : 0;
    });
 
};
var Cart = function (orderId) {
    // Stores an array of lines, and from these, can work out the grandTotal
    var self = this;
    self.orderId = orderId;
    self.lines = ko.observableArray(); // Put one line in by default
    self.Total = ko.computed(function () {
        var total = 0;
        $.each(self.lines(), function () { total += this.subtotal() })
        return total;
    });
    self.cafeId = ko.observable();
    self.CafeName = ko.observable();
    self.CafeAddress = ko.observable('Адрес не задан');
    self.CafePhone = ko.observable('Телефон не задан');
    self.CafeWorkTime = ko.observable('Время работы не задано');
    self.userName = ko.observable("").extend({ required: "Введите имя пользователя" });
    self.cellPhone = ko.observable("").extend({ requiredCellPhone: "Введите номер телефона" });
    self.email = ko.observable("").extend({ requiredEmail: "Введите email" });
    self.description = ko.observable();
    self.hour = ko.observable(12);
    self.minute = ko.observable(00);
    


    self.hasErrorMessage = ko.computed(function () {
        var text = "";
        if (self.userName.hasError() || self.cellPhone.hasError() || self.email.hasError())
        { text += "Все поля должны быть заполнены"; }
        
        return text;
    });

    self.hasError = ko.computed(function () {

        if (self.userName.hasError() || self.cellPhone.hasError() || self.email.hasError())
            return true;
        else return false;
    });

    // Operations

    self.order = function () {

        ko.utils.arrayForEach(self.lines(), function (line) {

            $.ajax({
                url: '/api/order/setDish/' + self.orderId + '/' + self.cafeId + '/' + line.product()._id + '/' + line.quantity(),
                type: "GET",
                async: false
            }).done(function (order) { orderId = order._id; });


        });

        $.ajax({
            url: '/api/order/calcPrice/' + self.orderId,
            type: "GET",
            async: false
        }).done(function (order) { })

        if (self.hasError()) {

            document.location.href = '/order/buy/' + self.orderId;
        }
        else {

            var data = {};
            data.userName = self.userName();
            data.email = self.email();
            data.orderId = self.orderId;
            data.description = self.description() ? self.description() : "" + " Приготовить к " + self.hour() + ":" + self.minute();
            data.cellPhone = self.cellPhone();

            $.post('/api/order/pay', data)
            .done(function (data) {
                document.location.href = '/order/show/' + self.orderId;
                //document.location.href = '/order/buy/' + order._id;
                //Отправить на страницу оплаты как вариант
            });

        }
    }

    $.getJSON('/api/order/' + orderId+'/0', function (order) {


        if (order.UserName)
             self.userName(order.UserName);
        if (order.Description)
             self.description(order.Description);


        ko.utils.arrayForEach(order.Dishes, function (dish) {
            $.ajax({
                url: "/api/dishes/" + dish.dishId,
                type: "GET",
                async: false
            }).done(function (b_dish) {

                self.lines.push(new CartLine(b_dish, dish.count));

            });

        });

        self.cafeId = order._cafe;

        $.ajax({
            url: "/api/cafes/" + order._cafe,
            type: "GET",
            async: false
        }).done(function (cafe) {
            if (cafe.Name)
                self.CafeName(cafe.Name);
            if (cafe.Address)
                self.CafeAddress(cafe.Address);
            if (cafe.WorkTime)
                self.CafeWorkTime(cafe.WorkTime);
            if (cafe.ClientPhone)
                self.CafePhone(cafe.ClientPhone);

        });

    });


};

if (document.getElementById("orderId") != null) {
    var orderId = document.getElementById("orderId").value;
    if (document.getElementById("order_page") != null)
        ko.applyBindings(new Cart(orderId), document.getElementById("order_page"));
}