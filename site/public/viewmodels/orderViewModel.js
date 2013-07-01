function enableOrderValidators() {
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

    ko.extenders.required = function (target, overrideMessage) {
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

    ko.extenders.requiredEmail = function (target, overrideMessage) {
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

}
var CartLine = function (item, count) {
    var self = this;

    self.product = ko.observable(item);
    self.quantity = ko.observable(count);
    self.subtotal = ko.computed(function () {
        return self.product() ? self.product().Price * parseInt("0" + self.quantity(), 10) : 0;
    });

};

function post(URL, PARAMS, enabledW1) {

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
    for (var x in enabledW1) {
        var opt = document.createElement("input");
        opt.name = 'WMI_PTENABLED';
        opt.value = enabledW1[x];
        temp.appendChild(opt);
    }
    temp.appendChild(opt);
    temp.submit();
    return temp;
}

function orderCommon(self, orderParameters) {

    ko.utils.arrayForEach(self.lines(), function (line) {

        $.ajax({
            url: self.url+'/api/order/setItem/' + self.orderId + '/' + self.shopId + '/' + line.product()._id + '/' + line.quantity(),
            type: "GET",
            async: false,
            cache: false
        }).done(function (order) { orderId = order._id; });


    });

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
        if (self.showDelivery())
            data.deliveryAddress = self.deliveryAddress();

        $.post(self.url + '/api/order/pay', data)
            .done(function (data) {
                //sprypay.ru
                if (orderParameters === 'sprypay') {
                    post("http://sprypay.ru/sppi/", {
                        spShopId: 213001,
                        spShopPaymentId: data.PaymentId,
                        spCurrency: "rur",
                        spPurpose: data._id,
                        spAmount: data.Price,
                        spUserDataOrderId: data._id,

                        spUserEmail: data.Email

                    })
                }
                if (orderParameters === 'w1') {
                    //w1.ru
                    var enabled = ['WalletOneRUB', 'YandexMoneyRUB', 'RbkMoneyRUB', 'BeelineRUB', 'MtsRUB', 'MegafonRUB', 'CashTerminalRUB', 'EurosetRUB', 'SvyaznoyRUB', 'CifrogradRUB', 'AlfaclickRUB', 'PsbRetailRUB', 'SvyaznoyBankRUB', 'SberOnlineRUB'];

                    var PARAMS = {
                        WMI_MERCHANT_ID: 174743083272,
                        WMI_PAYMENT_AMOUNT: data.Price.toString() + '.00',
                        WMI_CURRENCY_ID: 643,
                        WMI_DESCRIPTION: data._id,
                        WMI_SUCCESS_URL: "http://idiesh.ru/order/success/1",
                        WMI_FAIL_URL: "http://idiesh.ru/order/fail/1",
                        spUserDataOrderId: data._id,
                        spBalanceAmount: data.Price,
                        spAmount: data.Price,

                        WMI_PAYMENT_NO: data._id

                    }
                    post("https://merchant.w1.ru/checkout/default.aspx", PARAMS, enabled);
                }
                if (orderParameters === 'RBK') {
                    //RBK
                    
                    var PARAMS = {
                        eshopid: 2020011,
                        orderId: data._id,
                        serviceName: data._id,
                        recipientAmount: data.Price.toString() + '.00',
                        recipientCurrency: 'RUR',
                        user_email: data.Email,
                        successUrl: "http://idiesh.ru/order/success/1",
                        failUrl: "http://idiesh.ru/order/fail/1"
                    }
                    post("https://rbkmoney.ru/acceptpurchase.aspx", PARAMS);
                }

            });

    }
}

var Cart = function (url, orderId) {

    var self = this;
    self.url = url;
    self.orderId = orderId;
    self.lines = ko.observableArray();
    self.total = function () {
        var sum = 0;
        for (var key in self.lines()) {
            sum += self.lines()[key].subtotal()
        }
        return sum;
    };
    self.shopId = ko.observable();

    self.ShopName = ko.observable();
    self.ShopAddress = ko.observable('Адрес не задан');
    self.ShopPhone = ko.observable('Телефон не задан');
    self.ShopWorkTime = ko.observable('Время работы не задано');
    self.userName = ko.observable("").extend({ required: "Введите имя пользователя" });
    self.cellPhone = ko.observable("");
    self.email = ko.observable("").extend({ requiredEmail: "Введите email" });
    self.description = ko.observable();
    self.hour = ko.observable(12).extend({ numeric: 24 });
    self.minute = ko.observable(00).extend({ numeric: 60 });
    self.PaymentId = ko.observable();
    self.showDelivery = ko.observable(false);
    self.delivery = ko.observable('self');
    self.approved = ko.observable(false);
    self.deliveryAddress = ko.observable('');


    self.hasErrorMessage = ko.computed(function () {
        var text = "";
        if (self.userName.hasError() || self.email.hasError())
        { text += "email и Имя обязательные поля, если вы заполните телефон, то Вам придет SMS подтверждение заказа"; }

        return text;
    });

    self.hasError = ko.computed(function () {

        if (self.userName.hasError() || self.email.hasError())
            return true;
        else return false;
    });

    // Operations

    self.orderSpryPay = function (cart) { orderCommon(cart, 'sprypay'); }

    self.orderW1 = function (cart) { orderCommon(cart, 'w1'); }

    self.orderRBK = function (cart) { orderCommon(cart, 'RBK'); }

    $.ajax({ url: self.url+'/api/order/' + orderId, cache: false, type: "GET" }).done(function (order) {


        if (order.UserName)
            self.userName(order.UserName);
        if (order.Description)
            self.description(order.Description);
        if (order.PaymentId)
            self.PaymentId(order.PaymentId);
        if (order.DeliveryAddress) {
            self.deliveryAddress(order.DeliveryAddress);
            self.delivery('delivery');

        }
        if (order.Approved)
            self.approved(true);



        ko.utils.arrayForEach(order.Items, function (item) {
            $.ajax({
                url: self.url+"/api/item/" + item.itemId,
                type: "GET",
                async: false,
                cache: false
            }).done(function (b_item) {

                self.lines.push(new CartLine(b_item, item.count));

            });

        });

        self.shopId = order._shop;
        self.orderPrice = order.Price;

        $.ajax({
            url: self.url+"/api/shops/" + order._shop,
            type: "GET",
            async: false,
            cache: false
        }).done(function (shop) {

            if (shop.Name)
                self.ShopName(shop.Name);
            if (shop.Address)
                self.ShopAddress(shop.Address);
            if (shop.WorkTime)
                self.ShopWorkTime(shop.WorkTime);
            if (shop.ClientPhone)
                self.ShopPhone(shop.ClientPhone);
            if (shop.Delivery)
                self.showDelivery(true);

        });

    });
};


function bindOrder(url,orderId){
	enableOrderValidators();
    if (document.getElementById("order_page") != null)
        ko.applyBindings(new Cart(url,orderId), document.getElementById("order_page"));

}