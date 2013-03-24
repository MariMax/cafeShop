exports.getSiteConfig = function () {
  configValues =  {
    site_url: 'http://localhost:28528',
    site_name: 'cafeShop',
    site_email: 'cafeShop support <cafeShop@gmail.com>',
    db: {
    	db: 'nodejitsu_marimax_nodejitsudb6949724517',
    	host: 'ds051977.mongolab.com',
    	//db: 'cafeShop',
    	//host: 'localhost'
        port:'51977',
        username: 'nodejitsu_marimax',
        password: 'nv3cr1i421o6f4p5ibonma0npq'
        
       },
    secret: 'cafeShop',
    mongoConnection: 'mongodb://nodejitsu_marimax:nv3cr1i421o6f4p5ibonma0npq@ds051977.mongolab.com:51977/nodejitsu_marimax_nodejitsudb6949724517'
    //mongoConnection: 'mongodb://localhost/cafeShop'
  }

  return configValues;
}

exports.getMailConfig = function () {
  configValues =  {
    host: 'Gmail',
    username: 'maxim@ucluster.ru',
    password: '11'
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

