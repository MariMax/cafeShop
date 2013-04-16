ko.extenders.numeric = function (target, maxValue) {
    //create a writeable computed observable to intercept writes to our observable
    var result = ko.computed({
        read: target,  //always return the original observables value
        write: function (newValue) {
            var current = target(),

                newValueAsNum = isNaN(newValue) || newValue > maxValue || newValue < 0 ? 12 : parseFloat(+newValue);


            //only write if it changed
            if (newValueAsNum !== current) {
                target(newValueAsNum);
            } else {
                //if the rounded value is the same, but a different value was written, force a notification for the current field
                if (newValue !== current) {
                    target.notifySubscribers(newValueAsNum);
                }
            }
        }
    });

    //initialize with current value to make sure it is rounded appropriately
    result(target());

    //return the new computed observable
    return result;
};

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

    var self = this;
    self.orderId = orderId;
    self.lines = ko.observableArray();
    self.total = function () {
        var sum = 0;
        for (var key in self.lines()) {
            sum += self.lines()[key].subtotal()
        }
        return sum;
    };
    self.cafeId = ko.observable();

    self.CafeName = ko.observable();
    self.CafeAddress = ko.observable('Адрес не задан');
    self.CafePhone = ko.observable('Телефон не задан');
    self.CafeWorkTime = ko.observable('Время работы не задано');
    self.userName = ko.observable("").extend({ required: "Введите имя пользователя" });
    self.cellPhone = ko.observable("");
    self.email = ko.observable("").extend({ requiredEmail: "Введите email" });
    self.description = ko.observable();
    self.hour = ko.observable(12).extend({ numeric: 24 });
    self.minute = ko.observable(00).extend({ numeric: 60 });
    self.PaymentId = ko.observable();



    self.hasErrorMessage = ko.computed(function () {
        var text = "";
        if (self.userName.hasError() || self.email.hasError())
        { text += "Все поля должны быть заполнены"; }

        return text;
    });

    self.hasError = ko.computed(function () {

        if (self.userName.hasError() || self.email.hasError())
            return true;
        else return false;
    });

    // Operations

    function post(URL, PARAMS) {
        var temp = document.createElement("form");
        temp.action = URL;
        temp.method = "POST";
        temp.style.display = "none";
        for (var x in PARAMS) {
            var opt = document.createElement("input");
            opt.name = x;
            opt.value = PARAMS[x];
            temp.appendChild(opt);
        }
        document.body.appendChild(temp);
        temp.submit();
        return temp;
    }


    self.order = function (orderParameters) {

        ko.utils.arrayForEach(self.lines(), function (line) {

            $.ajax({
                url: '/api/order/setDish/' + self.orderId + '/' + self.cafeId + '/' + line.product()._id + '/' + line.quantity(),
                type: "GET",
                async: false,
                cache: false
            }).done(function (order) { orderId = order._id; });


        });

        $.ajax({
            url: '/api/order/calcPrice/' + self.orderId,
            type: "GET",
            async: false,
            cache: false
        }).done(function (order) { })

        if (self.hasError()) {

            return false;
            //document.location.href = '/order/buy/' + self.orderId;
        }
        else {

            var data = {};
            data.userName = self.userName();
            data.spUserEmail = self.email();
            data.orderId = self.orderId;
            data.description = self.description() ? self.description() + " " + self.hour() + ":" + self.minute() : self.hour() + ":" + self.minute();
            data.cellPhone = self.cellPhone();

            $.post('/api/order/pay', data)
            .done(function (data) {
                
               post("http://sprypay.ru/sppi/", {
                        spShopId: 213001,
                        spShopPaymentId: data.PaymentId,
                        spCurrency: "rur",
                        spPurpose:'Оплата заказа '+data._id,
                        spAmount:data.Price,
                        spUserDataOrderId:data._id,
                        spUserEmail:data.Email

                })
                //return (true);
                // document.location.href = "http://sprypay.ru/sppi/?spShopId=213001&spShopPaymentId=" + data.PaymentId + "&spCurrency=rur&spPurpose=Оплата заказа&spAmount=" + data.Price + "&spUserDataOrderId=" + data._id + "&spUserEmail=" + data.Email;
            });

        }
    }

    $.ajax({ url: '/api/order/' + orderId, cache: false, type: "GET" }).done(function (order) {


        if (order.UserName)
            self.userName(order.UserName);
        if (order.Description)
            self.description(order.Description);
        if (order.PaymentId)
            self.PaymentId(order.PaymentId);


        ko.utils.arrayForEach(order.Dishes, function (dish) {
            $.ajax({
                url: "/api/dishes/" + dish.dishId,
                type: "GET",
                async: false,
                cache: false
            }).done(function (b_dish) {

                self.lines.push(new CartLine(b_dish, dish.count));

            });

        });

        self.cafeId = order._cafe;
        self.orderPrice = order.Price;

        $.ajax({
            url: "/api/cafes/" + order._cafe,
            type: "GET",
            async: false,
            cache: false
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