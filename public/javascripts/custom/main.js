
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
            this.model.on('destroy', this.remove, this);
            this.model.on('change', this.render, this); //!!!!!!!!!!! ВАЖНО и НУЖНО для обновления вида при изменении модели
            console.log("rendering views of plays");
            this.render();
        },


        /*.play
         img(src="/images/1412317350.jpg")
         h1= title
         .right
         p(class="date") 22.10
         p(class="date") 19:00
         img(src="/images/ticket.png")
         p Театр: им. Т.Г.Шевченко
         p Труппа: Аркадия
         .price
         p Цена: от 50грн
         button Подробнее*/


        
        templateMin: _.template('<img src="/images/<%= picture%>"><h1><%= name %></h1><div class="right"><p><%= date %></p><p><%= time %></p><img src="/images/ticket.png"></div><p>Театр: <%= theatre %></p><p>Труппа: <%= troupe %></p><div class="price">Цена: от <%= price %>грн</div><button>Подробнее</button>'),
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
        },
        remove: function  () {
            this.$el.remove();
        }
    });

    App.Collections.PlayCollection = Backbone.Collection.extend({
        model: App.Models.Play,
        initialize: function(){
            console.log("collection initialized");
        },
        url: '/play/collection.json'
    });

    App.Views.PlayCollectionView = Backbone.View.extend({

        tagName: 'div',

        initialize: function() {

            console.log("rendering collection view");
            this.collection.on('add', this.addOne, this);
            console.log(this.el);

        },
        addOne: function(play) {
            var playView = new App.Views.PlayView({ model: play });
            this.$el.append( playView.render().el );
        },
        render: function() {
            this.$el.empty();
            this.collection.each(this.addOne, this);
            return this;
        }

    });

    var collectionOfPlays = new App.Collections.PlayCollection();
    collectionOfPlays.fetch();

    var playCollectionView = new App.Views.PlayCollectionView({collection: collectionOfPlays});
    playCollectionView.render();

    $('#plot').append(playCollectionView.el);
    //хэлпер шаблона
    //window.template = function(id) {
    //    return _.template( $('#' + id).html() );
    //};















