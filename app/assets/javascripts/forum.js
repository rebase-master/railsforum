$(function(){
    $.ajaxPrefilter(function(options, originalOptions, jqXHR){
        options.url = "http://localhost:3000" + options.url;
    });
//    var Users = Backbone.Collection.extend({
//        url: '/users'
//    });
//    var UserList = Backbone.View.extend({
//        el: '.page',
//        render: function(){
//            var users = new Users();
//            var that = this;
//            users.fetch({
//                success: function(users){
//                    var template = _.template($('#user-list-tmpl').html(), {users: users.models});
//                    that.$el.html(template);
//                }
//            });
////            this.$el.html('Complete');
//        }
//    });
    var Router = Backbone.Router.extend({
        routes: {
            '': 'home'
        }
    });
//
//    var userList = new UserList();
    var router = new Router();
//
    router.on('route:home', function(){
//        userList.render();
        console.log('Started Backbone!');
    });
    Backbone.history.start();

});