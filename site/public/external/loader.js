var ko;
var cafeShopContainer;
requirejs.config({
		
			config: {
				text: {
					useXhr: function (url, protocol, hostname, port) {
							return true;
					}
				}
			},
			paths: {
				text: '//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.5/text',
				knockout:'//cdnjs.cloudflare.com/ajax/libs/knockout/2.2.1/knockout-min',
				menu: 'http://idiesh.ru/external/ExternalStockViewModel',
				item: 'http://idiesh.ru/external/ExternalItemViewModel',
				category: 'http://idiesh.ru/external/ExternalCategoryViewModel',
				css:'http://idiesh.ru/external/css',
				order:'http://idiesh.ru/external/ExternalOrderViewModel'
			}
	});

require(['text',"text!http://idiesh.ru/external/stock.html","css!http://idiesh.ru/external/style",'knockout','category','item','menu', 'text!http://idiesh.ru/external/order.html','order'],
function(t, stock, style,knockout,category,item,menu,orderTemplate,orderViewModel){
ko=knockout;
		cafeShopContainer = $( "#cafeShopContainer" );
		var template = $( stock );
		cafeShopContainer.html(template);
		bind(orderTemplate);
	
 
});