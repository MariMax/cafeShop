exports.getSiteConfig = function () {
  configValues =  {
    site_url: 'http://localhost:44945',
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
