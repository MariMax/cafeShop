exports.getSiteConfig = function () {
  configValues =  {
    site_url: 'http://secret.pm-pm.ru:2000',
    site_name: 'idiEsh',
    site_email: 'idiEsh support <noreply@idiesh.ru>',
    db: {    	
        db: 'cafeShop',
    	host: 'localhost'
       },
    secret: 'cafeShop',
    sprySecret: 'b0cf25f4e9d41a5f3adad56386ce14df',
    rbkSecret:'b0cf25f4e9d41a5f3adad56386ce14df',
    w1Secret:'WUVDVXNRQ21nMWxheUg0UmJoQzdjbG1iRHNY',
    mongoConnection: 'mongodb://localhost/cafeShop',
    myPhone:'+79177640209',
    infoEmail:'info@idiesh.ru',
    cancelUrl:'http://secret.pm-pm.ru:2000/order/fail/1',
    returnUrl:'http://secret.pm-pm.ru:2000/order/success/1',
    ipnUrl:'http://secret.pm-pm.ru:2000/api/order/b0cf25f4e9d41a5f3adad56386ce14df',
    paypalPrepareUrl:'https://svcs.sandbox.paypal.com/AdaptivePayments/Pay',
    paypalAppId:"APP-80W284485P519543T",
    paypalFees:"EACHRECEIVER",
    paypalPrimaryReceiver:"conecticut-facilitator@rambler.ru",
    paypalUserId:"conecticut-facilitator_api1.rambler.ru",
    paypalUserPass:"1373806966",
    paypalUserSign:"AiPC9BjkCyDFQXbSkoZcgqH3hpacANptVoBKVehiw8crADmweLKi1pk0",
    paypalCmdUrl:"https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_ap-payment&paykey="
  }

  return configValues;
}

exports.getMailConfig = function () {
  configValues =  {
    host: 'email-smtp.us-east-1.amazonaws.com',
    username: 'AKIAIDFZW4EZ4WEGHTKA',
    password: 'AnHWclzTKs4Q2qIJgvmtfZN2CAUBvXZaz/8R5zdkOYoH'
  }
  return configValues;
}

exports.getSMSConfig = function () {
    configValues = {

        service : 2,//1 - twilio, 2 - http://smsc.ru/
        //options for 1
        accountSid:'',//'AC26a253b30671ca908581ad0d64746241',
        authToken: '',//'b0cf25f4e9d41a5f3adad56386ce14df',
        From:'+16572153237',
        //options for 2
        login:'',//'MariMax',
        password:'',//: 'XSWzaq',
        sender:'idiEsh'
    }
     return configValues;
}

