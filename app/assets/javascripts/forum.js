"use strict";

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

    var Topic = Backbone.RelationalModel.extend({
        relations: [{
           type: Backbone.hasMany,
            key: 'comments',
            relationalModel: 'Comment',
            collectionType: 'CommentCollection',
            reverseRelation: {
                key: 'topic_id',
                includeInJSON: 'id'
            }
        }],
        urlRoot: '/topics',
        parse : function (response) {
            response.id = response._id.$oid;
            delete response._id;
            return response;
        },
        toJSON : function () {
            var json = Backbone.Model.prototype.toJSON.apply(this);
            json._id = {'$oid':json.id};
            delete json.id;
            return json;
        }
    });
    var Topics = Backbone.Collection.extend({
        url: '/topics',
        model: Topic
    });

    var Comment = Backbone.RelationalModel.extend({
        urlRoot: '/comments/'
    });
    var CommentCollection = Backbone.Collection.extend({
        model: Comment
    });

    var ListTopics = Backbone.View.extend({
       el: '.mid',
        render: function(){
            var that = this;
            var topics = new Topics();
            topics.fetch({
                success: function(topics){
                    var template = _.template($('#topics-list-tmpl').html(), {topics: topics.models});
                    console.log(JSON.stringify(topics.models));
                    that.$el.html(template);
                }
            });
        }
    });
    var ShowTopic = Backbone.View.extend({
       el: '.mid',
//       model: Topic,
        render: function(options){
            var that = this;
            var model = new Topic({id: options.id});
            model.fetch({
                success: function(topics){
                    var template = _.template($('#topics-show-tmpl').html(), {topic: topics});
                    console.log(JSON.stringify(topics.models));
                    that.$el.html(template);
                }
            });
        },
        events: {
            'submit #new-comment-form': 'saveComment',
            'click .home': 'goHome'
        },
        goHome: function(){
            router.navigate('', {trigger: true})
        },
        saveComment: function(ev){

            return false;
        }
    });
    var NewTopic = Backbone.View.extend({
       el: '.mid',
       model: Topic,
        render: function(options){
            var template = _.template($('#topics-new-tmpl').html(), {});
            this.$el.html(template);
            this.model = Topic.findOrCreate(options.id);
        },
        events: {
            'submit #new-topic-form': 'saveTopic'
        },
        saveTopic: function(ev){
            ev.preventDefault();
            var topicDetails = $(ev.currentTarget).serializeObject();
            this.model.fetch({
                success: function(){
                    self.save(topicDetails, {
                        success: function(topic){
                            router.navigate('', {trigger:true});
                        }
                    });

                }
            });

//            var topic = new Topic();
        }
    });
    var EditTopic = Backbone.View.extend({
       el: '.mid',
        render: function(options){
            var that = this;
            var model = new Topic({id: options.id});
                model.fetch({
                success: function(topic){
                    var template = _.template($('#topics-edit-tmpl').html(), {topic: topic});
                    that.$el.html(template);
                }
            });
        },
        events: {
            'submit #edit-topic-form': 'saveTopic',
            'click .delete': 'deleteTopic'
        },
        saveTopic: function(ev){
            var topicDetails = $(ev.currentTarget).serializeObject();
            ev.preventDefault();
            this.model.save(topicDetails, {
                success: function(topic){
                    router.navigate('', {trigger:true});
                }
            });
        },
        deleteTopic: function(ev){
            var tid = $(ev.target).data('id');
            if(confirm('Are you sure you want to delete this topic?')){
                var topic = new Topic({id: tid});
                topic.destroy({
                    success: function(){
                        router.navigate('', {trigger:true});
                    }
                });
            }
            return false;
        }
    });
    var Router = Backbone.Router.extend({
        routes: {
            '': 'home',
            'topics/new/:id': 'newTopic',
            'topics/:id': 'showTopic',
            'topics/:id/edit': 'editTopic'
        }
    });

    var listTopics = new ListTopics();
    var newTopic = new NewTopic();
    var editTopic = new EditTopic();
    var showTopic = new ShowTopic();
    var router = new Router();

    router.on('route:showTopic', function(id){
        showTopic.render({id: id});
       console.log("Show topic id: "+id);
    });
    router.on('route:newTopic', function(id){
        newTopic.render({id: id});
    });
    router.on('route:editTopic', function(id){
        editTopic.render({id: id});
    });
    router.on('route:home', function(){
        console.log("Got home");
        listTopics.render();
    });
    Backbone.history.start();

});