exports.getSiteConfig = function () {
  configValues =  {
    //site_url: 'http://idiesh',
    site_url: 'http://localhost:28528',
    site_name: 'idiEsh',
    site_email: 'idiEsh support <noreply@idiesh.ru>',
    db: {
    	//db: 'cafeshop',
    	//host: 'ds049997.mongolab.com',
        //port:'49997',
        //username: 'cafeShop',
        //password: 'XSWzaq'
       	db: 'cafeShop',
    	host: 'localhost'
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
        accountSid:'AC26a253b30671ca908581ad0d64746241',
        authToken: 'b0cf25f4e9d41a5f3adad56386ce14df',
        From:'+16572153237'
    }
     return configValues;
}

