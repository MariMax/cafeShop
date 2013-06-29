
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
        .required(null, 'please enter description'),

   filter("deliveryAddress").trim()
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

OrderW1AnswerForm = form(
    filter("WMI_MERCHANT_ID").trim(),
        filter("WMI_PAYMENT_AMOUNT").trim(),
             filter("WMI_CURRENCY_ID").trim(),
              filter("WMI_TO_USER_ID").trim(),
              filter("WMI_PAYMENT_NO").trim(),
              filter("WMI_ORDER_ID").trim(),
              filter("WMI_DESCRIPTION").trim(),
              filter("WMI_SUCCESS_URL").trim(),
              filter("WMI_FAIL_URL").trim(),
              filter("WMI_EXPIRED_DATE").trim(),
              filter("WMI_CREATE_DATE").trim(),
              filter("WMI_UPDATE_DATE").trim(),
              filter("WMI_ORDER_STATE").trim(),
              filter("WMI_SIGNATURE").trim()
              , filter("spUserDataOrderId").trim()
              , filter("spBalanceAmount").trim()
              , filter("spAmount").trim()

)

OrderRBKAnswerForm = form(
    filter("eshopId").trim(),
        filter("paymentId").trim(),
             filter("orderId").trim(),
              filter("eshopAccount").trim(),
              filter("serviceName").trim(),
              filter("recipientAmount").trim(),
              filter("recipientCurrency").trim(),
              filter("paymentStatus").trim(),
              filter("userName").trim(),
              filter("userEmail").trim(),
              filter("paymentData").trim(),
              filter("secretKey").trim(),
              filter("hash").trim()


)



exports.OrderFinalForm = OrderFinalForm;
exports.OrderAnswerForm = OrderAnswerForm;
exports.OrderW1AnswerForm = OrderW1AnswerForm;
exports.OrderRBKAnswerForm = OrderRBKAnswerForm;
