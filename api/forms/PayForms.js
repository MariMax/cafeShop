
var form = require("express-form"),
    filter = form.filter,
    validate = form.validate;

OrderFinalForm = form(
    filter("spUserEmail").trim(),
        validate("spUserEmail").required(null, 'please enter email')
        .isEmail('need some email'),

    filter("orderId").trim(),
        validate("orderId")
        .required(null, 'please enter orderId'),

    filter("userName").trim(),
        validate("userName")
        .required(null, 'please enter userName'),

    filter("cellPhone").trim(),


    filter("description").trim(),
        validate("description")
        .required(null, 'please enter description')
)

OrderAnswerForm = form(
    filter("spPaymentId").trim(),
        filter("spShopId").trim(),
             filter("spShopPaymentId").trim(),
              filter("spBalanceAmount").trim(),
              filter("spAmount").trim(),
              filter("spCurrency").trim(),
              filter("spCustomerEmail").trim(),
              filter("spPurpose").trim(),
              filter("spPaymentSystemId").trim(),
              filter("spPaymentSystemAmount").trim(),
              filter("spPaymentSystemPaymentId").trim(),
              filter("spEnrollDateTime").trim(),
              filter("spUserDataOrderId").trim(),
              filter("spHashString").trim(),
              filter("spBalanceCurrency").trim()

)



exports.OrderFinalForm = OrderFinalForm;
exports.OrderAnswerForm = OrderAnswerForm;
