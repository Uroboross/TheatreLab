
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


    App.Models.Checkout = Backbone.Model.extend({
        validation: {
            email: [{
                pattern: 'email',
                msg: "поле 'Email' должен содержать символ '@'"
            },{
                required: true,
                msg: "Поле 'Email' обязательно для заполнения"
            },{
                rangeLength: [3, 30],
                msg: "Поле Email должно иметь не менее 3х и не более 30 символов"
            }],
            account: [{
                pattern: /[0-9]{16}/,
                msg: "Поле 'Номер счёта' должно содержать только цифры и содержать 16 символов"
            },{
                required: true,
                msg: "Поле 'Номер счёта' обязательно для заполнения"
            }],
            cvv: [{
                pattern: /[0-9]{3}/,
                msg: "Поле 'CVV' должно содержать только цифры и содержать 3 символа"
            },{
                required: true,
                msg: "Поле 'CVV' обязательно для заполнения"
            }]
        },
        defaults: {
            discount: false
        }
    });



    App.Views.CheckoutView = Backbone.View.extend({
        tagName:'div',
        className: "row hide",
        initialize: function() {
            this.$el.attr('data-step', "2");
            this.$el.attr('data-title', "Оформление заказа");
            console.log("CV created");
            this.setHandlers();
        },
        setHandlers: function(){
            //не яботает
            console.log("set");
            $("#email").onclick = function(){
                console.log("event");
                var email = $('#email').innerHTML;
                this.model.set('email', email);
            };
        },
        makeView: function(){
            return '<div class=\"popUpContent\"><form role="form" class="checkoutForm"><div class="form-group"><label for="email">Email:</label><input type="email" class="form-control col-xs-2" id="email" placeholder="Введите свой email" required></div><div class="form-group"><label for="account">Номер счёта:</label><input type="text" class="form-control" id="account" placeholder="XXXX XXXX XXXX XXXX"><label for="cvv">CVV:</label><input type="text" id="cvv" class="form-control" placeholder="введите последние 3 цифры cvv" ></div><div class="checkbox"><label><input type="checkbox"> Я студент</label></div><button type="submit" class="btn btn-default">Submit</button></form></div>';
        },
        render: function(){
            var smth = this.makeView();
            this.$el.html( smth );
            return this;
        }
    });


    App.Views.AudienceView = Backbone.View.extend({
        tagName:'div',
        className: "row hide",
        initialize: function() {
            this.$el.attr('data-step', "1");
            this.$el.attr('data-title', "Выбор мест");
            console.log("AV created");
        },
        events: {
                    'click .place': 'choose',
                    'click .buy': 'buy',
                    //some button when you already bought them
                    'click .reserve': 'reserve',
                    'click .checkout': 'checkout'
                },
        cancel: function(){
            console.log("cancelled");
        },
        checkout: function(){
            //new step new view
        },
        buy: function(){

        },
        reserve: function(){
            //add class so that it is marked chosen
        },
        choose: function(e){
            if($("#"+e.target.id).css("backgroundColor") == "rgb(146, 216, 251)")
            {
                $("#"+e.target.id).css("backgroundColor","red");
                var arr = e.target.id.split('_');
                $(".choosenContainer").append('<p class="chosen_place" id="_'+ e.target.id +'">Ряд: '+ arr[0] +' Место: '+ arr[1] +'</p>')
            }
            else
            {
                $("#"+e.target.id).css("backgroundColor", "rgb(146, 216, 251)");
                $('#_'+e.target.id).remove();
            }
        },
        makeView: function(){


            //поддержка функции чуз
            var hall = "<div class=\"popUpContent\"><div class='rows'>";

            for(var i = 1; i<=19; i++){
                if(i == 1)
                    hall+="<div class=\"audienceRow\" id=\"r"+i+"\" style=\"margin-top: 56px\">р "+i+"</div>";
                else if(i == 14){
                    hall+="<div class=\"audienceRow\" id=\"r"+i+"\" style=\"margin-top: 28px\">р "+i+"</div>";
                }
                else
                    hall+="<div class=\"audienceRow\" id=\"r"+i+"\">р "+i+"</div>";
            }
            hall += "</div><div id=\"placeholder\"><div id=\"stage\"><p>Сцена</p></div>";
            var offsetLeft = 0, offsetTop = 0, lim = 26;
            for(var i = 1; i<=19; i++)
            {
                if(i == 14 || i == 1)
                    offsetTop = 28;
                for (var j= 1, count=1; j<=lim; j++, count++)
                {
                    if(i > 14 && j < i-13 || i > 14 && j > lim-(i-14))
                    {
                        offsetLeft = 14*(i-14);
                        count--;
                    }
                    else{
                        if(j == 8 || j == 20) // проход
                            {
                                offsetLeft = 28;
                            }
                        hall+="<div class=\"place\" id=\""+i+"_"+count+"\" style=\"margin-left:"+offsetLeft+"px; margin-top:"+offsetTop+"px\">"+count+"</div>";
                        offsetLeft = 0;
                    }
                }
                if(i == 14 || i == 1)
                    offsetTop = 0;

            }
            hall += "</div><div class='choosenContainer'></div></div>";
            return hall;
        },
        render: function(){
            var smth = this.makeView();
            // Load the compiled HTML into the Backbone "el"
            this.$el.html( smth );
            return this;
            //var id = "";
            //for(var i=0; i<this.model.reserved.length; i++)
            //{
            //    id="";
            //    for(var j=0; j<2; j++)
            //    {
            //        id += this.model.reserved[i][j];
            //    }
            //    $("#"+id).addClass("reserved");
            //}
        }
    });



    //App.Views.SortsView = Backbone.View.extend({
    //    template: _.template($('.sortMenu').html()),
    //    render: function() {
    //        $(this.el).html(this.template(this.model.toJSON()));
    //        this.setContent();
    //        return this;
    //    }
    //});


    App.Views.PlayView = Backbone.View.extend({
        tagName: 'div',
        className: 'play',
        initialize: function(){
            this.model.on('destroy', this.remove, this);
            this.model.on('change', this.render, this); //!!!!!!!!!!! ВАЖНО и НУЖНО для обновления вида при изменении модели
            console.log("rendering views of plays");
            this.render();
        },
        /*<button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#myModal">Open Large Modal</button>*/
        templateMin: _.template('<img src="/images/<%= picture%>"><h1><%= name %></h1><div class="right"><p><%= date %></p><p><%= time %></p><button type="button" data-toggle="modal" data-target="#myModal" class="btn btn-primary"></div><p>Театр: <span><%= theatre %></span></p><p>Труппа: <span><%= troupe %></span></p><div class="price"><p>Цена:<span> от <%= price %>грн</span></p></div><button class="more">Подробнее</button>'),
        templateMax: _.template('<img src="/images/<%= picture%>"><h1><%= name %></h1><div class="right"><p><%= date %></p><p><%= time %></p><button type="button" data-toggle="modal" data-target="#myModal" class="btn btn-primary"></div><p>Театр: <span><%= theatre %></span></p><p>Труппа: <span><%= troupe %></span></p><div class="price"><p>Цена:<span> от <%= price %>грн</span></p></div><button class="less">Скрыть</button><div class="add"><p>Актёры: <span><%= starring %></span></p><p>О чём: <span><%= summary %></span></p></div>'),
        events: {
            'click .more': 'fullInformation',
            'click .less': 'briefInformation'
        },

        briefInformation: function () {
            this.$el.html( this.templateMin( this.model.toJSON() ) );
            this.$el.css("height", "300px");
            this.$(".right").css("height", "300px");
            if(this.$el.offset().left > 500)
                this.$el.css("float", "left");

        },

        fullInformation: function () {
            this.$el.html( this.templateMax( this.model.toJSON() ) );
            if(this.$el.offset().left > 500)
                this.$el.css("float", "right");
            this.$el.css("height", "630px");
            this.$(".right").css("height", "630px");
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


    var audienceView = new App.Views.AudienceView();
    $('.modal-body').append( audienceView.render().$el);

    var checkoutModel = new App.Models.Checkout();
    var checkoutView = new App.Views.CheckoutView({model: checkoutModel});
    $('.modal-body').append(checkoutView.render().$el);

    $('#cancel').on('click', function(){
        $('.row .hide').remove();
        $('.modal-body').append( audienceView.render().$el);
    });
    $('#myModal').modalSteps({
        btnCancelHtml: 'Отмена',
        btnPreviousHtml: 'Назад',
        btnNextHtml: 'Далее',
        btnLastStepHtml: 'Купить',
        disableNextButton: false,
        completeCallback: function(){
            $('.row .hide').remove();
            $('.modal-body').append( audienceView.render().$el);
        },
        callbacks: {
            '*': function(){
                console.log("steps");
            }
        }
    });

    //хэлпер шаблона
    //window.template = function(id) {
    //    return _.template( $('#' + id).html() );
    //};




