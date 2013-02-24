exports.getSiteConfig = function () {
  configValues =  {
    site_url: 'http://localhost:28528',
    site_name: 'cafeShop',
    site_email: 'cafeShop support <cafeShop@gmail.com>',
    db: {
    	db: 'cafeShopFirstTry',
    	host: 'localhost'
    },
    secret: 'cafeShop'
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

