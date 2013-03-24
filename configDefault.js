exports.getSiteConfig = function () {
  configValues =  {
    site_url: 'http://cafeshop.eu01.aws.af.cm',
    site_name: 'cafeShop',
    site_email: 'cafeShop support <maxim@ucluster.ru>',
    db: {
    	//db: 'cafeshop',
    	//host: 'ds049997.mongolab.com',
    	db: 'cafeShop',
    	host: 'localhost'
        //port:'49997',
        //username: 'cafeShop',
        //password: 'XSWzaq'
       },
    secret: 'cafeShop',
    //mongoConnection: 'mongodb://cafeShop:XSWzaq@ds049997.mongolab.com:49997/cafeshop'
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
        accountSid:'Денег пока жалко не выложу в общий доступ',
        authToken: 'Денег пока жалко не выложу в общий доступ',
        From:'Денег пока жалко не выложу в общий доступ'
    }
     return configValues;
}

