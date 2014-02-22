"use strict"
$(function(){
    $.ajaxPrefilter(function(options, originalOptions, jqXHR){
        options.url = "http://localhost:3000" + options.url;
    });

    jQuery.fn.serializeObject = function() {
        var arrayData, objectData;
        arrayData = this.serializeArray();
        objectData = {};

        $.each(arrayData, function() {
            var value;
            if (this.value != null) {
                value = this.value;
            } else {
                value = '';
            }
            if (objectData[this.name] != null) {
                if (!objectData[this.name].push) {
                    objectData[this.name] = [objectData[this.name]];
                }
                objectData[this.name].push(value);
            } else {
                objectData[this.name] = value;
            }
        });
        return objectData;
    };
    var MongoModel = Backbone.Model.extend({
        // this handle conversion between the mongo's _id and backbone id
        // this is best done on the client side to alleviate server load
        //_id : { "$oid" : ... } <--> id
        parse : function (response) {
            response.id = response._id.$oid;
            delete response._id;
            return response;
        },
        toJSON : function () {
            var
                json = Backbone.Model.prototype.toJSON.apply(this);
            json._id = {'$oid':json.id};
            delete json.id;
            return json;
        }
    });
    var Topics = Backbone.Collection.extend({
       url: '/topics'
    });
    var Topic = MongoModel.extend({
        urlRoot: '/topics'
    });
    var ListTopics = Backbone.View.extend({
       el: '.mid',
        render: function(){
            var that = this;
            var topics = new Topics();
            topics.fetch({
                success: function(topics){
                    var template = _.template($('#topics-list-tmpl').html(), {topics: topics.models});
                    that.$el.html(template);
                }
            });
        }
    });
    var EditTopic = Backbone.View.extend({
       el: '.mid',
        render: function(){
            var template = _.template($('#topics-new-tmpl').html(), {});
            this.$el.html(template);
        },
        events: {
            'submit #edit-topic-form': 'saveTopic'
        },
        saveTopic: function(ev){
            var topicDetails = $(ev.currentTarget).serializeObject();
            var topic = new Topic();
            topic.save(topicDetails, {
               success: function(topic){

               }
            });
            ev.preventDefault();
        }
    });
    var Router = Backbone.Router.extend({
        routes: {
            '': 'home',
            'topics/new': 'newTopic'
        }
    });
//
    var listTopics = new ListTopics();
    var editTopic = new EditTopic();
    var router = new Router();
//
    router.on('route:newTopic', function(){
//        console.log('Create a new topic');
        editTopic.render();
    });
    router.on('route:home', function(){
        console.log("Got home");
        listTopics.render();
    });
    Backbone.history.start();

});