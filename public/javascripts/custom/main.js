$(document).ready(function() {
    window.App = {
        Models: {},
        Views: {},
        Collections: {}
    };


    App.Models.Play = Backbone.Model.extend({
        defaults: {
            name: 'play',
            date: "22/10/11"
        }
    });

    App.Views.PlayView = Backbone.View.extend({
        tagName: 'div',
        className: 'play',
        initialize: function(){
            console.log("rendering views of plays");
            this.render();
        },
        templateMin: _.template('<h1><%= name %></h1><p>(<%= date %>)</p><button class="more">I WANT MOOORE!!!</button>'),
        templateMax: _.template('<h1><%= name %></h1><p>(<%= date %>)</p><p>Author: <%= author %></p><button class="less">Hide this. NOW!</button>'),
        events: {
            'click .more': 'fullInformation',
            'click .less': 'render'
        },
        fullInformation: function () {
            this.$el.html( this.templateMax( this.model.toJSON() ) );
        },

        render: function(){
            this.$el.html( this.templateMin( this.model.toJSON() ) );
            return this;
        }
    });

    App.Collections.PlayCollaction = Backbone.Collection.extend({
        model: App.Models.Play,
        initialize: function(){
            console.log("collection initialized");
        }
    });

    App.Views.PlayCollectionView = Backbone.View.extend({

        tagName: 'div',

        initialize: function() {

            console.log("rendering collection view");
            this.render();
            console.log(this.el);
        },

        render: function() {
            this.collection.each(function(play) {
                var playView = new App.Views.PlayView({model: play});
                this.$el.append(playView.render().el);
            }, this);
            return this;
        }

    });

    var collectionOfPlays = new App.Collections.PlayCollaction([
        {name: "Odesseya", author: "Gomer"},
        {name: "Natalka Poltavka", author: "Kotlyarevskii"},
        {name: "Imperia Angelov", author: "Veber"}
    ]);

    var playCollectionView = new App.Views.PlayCollectionView({collection: collectionOfPlays});

    $('#plot').append(playCollectionView.el);
    //хэлпер шаблона
    //window.template = function(id) {
    //    return _.template( $('#' + id).html() );
    //};

});















