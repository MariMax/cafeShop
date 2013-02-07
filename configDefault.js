exports.getSiteConfig = function () {
  configValues =  {
    url: 'http://localhost:3000',
    site_name: 'cafeShop',
    site_email: 'cafeShop@gmail.com',
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
    host: 'smtp.gmail.com',
    username: 'maxim@ucluster.com',
    password: '11'
  }

  return configValues;
}
