"use strict";

var relationEvents = ['add', 'change', 'remove', 'reset', 'sort', 'destroy', 'request', 'sync'];

var Model = exports.Model = Backbone.Model.extend({
    hasMany: {
        // Subclasses can override to set relations like this:
        //
        // key: function () { return new Collection([], options); },
    },

    hasOne: {
        // Subclasses can override to set relations like this:
        //
        // key: function (attrs) { return new Model(attrs, options); },
        //
        // Note that we don't really care about the difference between hasOne and belongsTo. If you want
        // a single model as the value of this key, put it here; if you want a collection, put it under
        // hasMany.
    },

    allRelationKeys: function () {
        return Object.keys(this.hasMany).concat(Object.keys(this.hasOne));
    },

    // Updates the given hasMany relation with the given models, creating a collection for it if
    // needed.
    updateHasManyRelation: function (key, models, options) {
        var collection = this.get(key);

        if (!collection) {
            var constructor = _.bind(this.hasMany[key], this);
            collection = this.attributes[key] = constructor();
            collection.parent = this;
            this.listenToRelation(key, collection);
        }

        if (models instanceof Collection) models = models.models;
        collection.reset(models, _.extend({silent: false}, options));
    },

    // Updates the given hasOne relation with the given attributes. If the current value of the key is
    // a model with the same ID as the incoming model, updates the current model in-place with the new
    // attributes. Otherwise, creates a new model.
    updateHasOneRelation: function (key, attributes, options) {
        var model = this.get(key);

        if (attributes instanceof Model) attributes = attributes.attributes;

        if (model && model.id === attributes[this.idAttribute]) {
            model.set(attributes);
        } else {
            var constructor = _.bind(this.hasOne[key], this);
            model = constructor(attributes);
            this.listenToRelation(key, model);
        }

        return model;
    },

    // Listens to events on a relation and proxy them through. E.g., if you have a collection of
    // records, and it fires an 'add' event, refire that as 'records:add'.
    listenToRelation: function (key, relation) {
        var self = this;
        var callback = this.onRelationEvent;
        relationEvents.forEach(function (event) {
            relation.on(event, callback, {parent: self, key: key, event: event});
        })
    },

    // Callback triggered on a relation event, used by listenToRelation
    onRelationEvent: function () {
        var event = this.key + ':' + this.event;
        var args = _.toArray(arguments);
        args.unshift(event);
        this.parent.trigger.apply(this.parent, args);
    },

    // Overrides the Backbone.Model#set method to deal with relations, using the update*Relation
    // methods.
    set: function (key, val, options) {
        if (key == null) return this;

        // Handle both `"key", value` and `{key: value}` -style arguments.
        var attrs;
        if (typeof key === 'object') {
            attrs = _.clone(key);
            options = val;
        } else {
            (attrs = {})[key] = val;
        }

        var self = this;

        Object.keys(this.hasMany).forEach(function (key) {
            if (key in attrs) {
                self.updateHasManyRelation(key, attrs[key], options);
                delete attrs[key];
            }
        });

        Object.keys(this.hasOne).forEach(function (key) {
            if (key in attrs) {
                attrs[key] = self.updateHasOneRelation(key, attrs[key], options);
            }
        });

        return Backbone.Model.prototype.set.call(this, attrs, options);
    },

    // Overrides Backbone.Model#toJSON to deal with relations. Calls toJSON recursively on the
    // child collections and adds them to the resulting hash.
    toJSON: function () {
        var attributes = _.clone(this.attributes);
        this.allRelationKeys().forEach(function (key) {
            if (key in attributes) {
                attributes[key] = attributes[key].toJSON();
            }
        })
        return attributes;
    }
});