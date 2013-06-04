requirejs.config({
baseUrl: "/scripts",
paths:{
		'jquery':'http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min',
		'backbone':'http://cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.9/backbone-min',
		'underscore':'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min',
		'knockout':'http://cdnjs.cloudflare.com/ajax/libs/knockout/2.2.1/knockout-min',
		'indexmodel':'/scripts/viewModel/indexmodel',
		'fblogin':'/scripts/helpers/fblogin'
		}
});

require(['jquery','underscore','backbone','router','knockout','fblogin'],function(jquery,router,knockout,fblogin){

var App = new (Backbone.View.extend({
	router:router,
	template:_.template('<a href="/users">users</a> <a href="/views">views</a> <div id="magic"></div>'),
	render:function(){
		this.$el.html(this.template());
		},
	events:{ 
		'click a':function(e){
		
						e.preventDefault();
						Backbone.history.navigate(e.target.pathname, {trigger: true});
				}
		}

			
}))({el: document.body} );

$(function(){ 
App.render();
})
});