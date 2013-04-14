exports.getSiteConfig = function () {
  configValues =  {
    site_url: 'http://idiesh.ru',
    site_name: 'idiEsh',
    site_email: 'idiEsh support <noreply@idiesh.ru>',
    db: {    	
        db: 'cafeShop',
    	host: 'localhost'
       },
    secret: 'cafeShop',
    sprySecret: '5ea718ccef446330dcfe961b6523a6fc',
    mongoConnection: 'mongodb://localhost/cafeShop'
  }

  return configValues;
}

exports.getMailConfig = function () {
  configValues =  {
    host: 'email-smtp.us-east-1.amazonaws.com',
    username: 'AKIAJIAH67F7AIPW4PVA',
    password: 'Al0RfYaw9Wt9VdLpm0xTsiTIyIvVeet4cUsg63QVEMbu'
  }
  return configValues;
}

exports.getSMSConfig = function () {
    configValues = {

        service : 2,//1 - twilio, 2 - http://smsc.ru/
        //options for 1
        accountSid:'AC26a253b30671ca908581ad0d64746241',
        authToken: 'b0cf25f4e9d41a5f3adad56386ce14df',
        From:'+16572153237',
        //options for 2
        login:'MariMax',
        password: 'XSWzaq',
        sender:'idiEsh'
    }
     return configValues;
}

