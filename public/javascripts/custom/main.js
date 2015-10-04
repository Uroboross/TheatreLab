
    window.App = {
        Models: {},
        Views: {},
        Collections: {}
    };
    var counter = 0;
    var flag = true;
    var resultCol;
    var resultView;
    function convertDate(date) {
        var day = date.slice(8);
        var month = date.slice(4,7);
        if(day.charAt(0) === '0')
            day = day.slice(1);
        var result = day+month;
        return result;
    }
    function convertVal(val){
        var changeAr = val.split(" ");
        var newVal;
        for(var i = 0; i < changeAr.length; i++)
        {
            changeAr[i].charAt(0).toUpperCase();
            if(i === 0)
                newVal = changeAr[i];
            else
                newVal += " " + changeAr[i];
        }
        console.log(newVal);
    }
    App.Models.Play = Backbone.Model.extend({
        defaults: {
            name: 'play',
            date: "22/10/11"
        }
    });
    App.Models.Sort = Backbone.Model.extend({
        defaults: {
            //array: ["Все", "Театр им. Т.Г. Шевченко", "Дом Актёра", "ХНАТОБ", "Театр им. А.С. Пушкина", "ТЮЗ", "Театр Музкомедии", "Театр кукол", "Мадригал"],
            //arrayoftypes: ["по возрастанию цены", "по убыванию цены", "по дате", "по популярности"]
        }
    });
    App.Views.SortView = Backbone.View.extend({
        tagName: 'div',
        className: 'sorttab',
        initialize: function(){
            this.render();
        },
        events:{
            'click #help': 'filter',
            'click #pisun': 'sort'
        },
        templateSort: _.template('<label for="gogol">Поиск</label><input id="gogol" type="search" placeholder="Введите название представления..." style="width: 300px"</input><label for="theatre">Театр</label><select id="theatre"><option value="1">Все</option><option value="2">Театр им. Т.Г. Шевченко</option><option value="3">Дом Актёра</option><option value="4">ХНАТОБ</option><option value="5">Театр им. А.С. Пушкина</option><option value="6">ТЮЗ</option><option value="7">Театр Музкомедии</option><option value="8">Театр кукол</option><option value="9">Мадригал</option></select><label for="dateSort">Дата:</label><input id="dateSort" type="date", min="2015-30-09"</input><label for="sort">Сортировать:</label><select id="sort"><option value="0">Укажите параметр сортировки</option><option value="1">по возрастанию цены</option><option value="2">по убыванию цены</option><option value="3">по дате</option><option value="4">по популярности</option></select><button id="help">Найти</button><button id="pisun">Сортировать</button>'),

        filter: function() {
            var selectedText = $("#theatre option:selected").text();
            var val = document.getElementById('gogol').value;
            convertVal(val);
            var dateText = convertDate(document.getElementById('dateSort').value);
            if (val === '' && counter === 0 && selectedText === 'Все' && dateText === '')
                return;
            else if (val === '' && counter === 1 && selectedText === 'Все' && dateText === '' ){
                counter = 0;
                $('#plot').empty();
                playCollectionView.render();
                $('#plot').append(playCollectionView.el);
            }
            else
            {
                counter = 1;
                var result;
                if(val !== '')
                {
                    flag = false;
                    result = collectionOfPlays.where({name: val});
                    resultCol = new App.Collections.PlayCollection(result);
                }
                if(selectedText !== 'Все')
                {
                    if(flag === true)
                        result = collectionOfPlays.where({theatre: selectedText});
                    else
                        result = resultCol.where({theatre: selectedText});
                    flag = false;
                    resultCol = new App.Collections.PlayCollection(result);
                }
                if(dateText !== '')
                {
                    if(flag === true)
                        result = collectionOfPlays.where({date: dateText});
                    else
                        result = resultCol.where({date: dateText});
                    resultCol = new App.Collections.PlayCollection(result);
                }
                flag = true;
                $('#plot').empty();
                resultView = new App.Views.PlayCollectionView({collection: resultCol});
                resultView.render();
                $('#plot').append(resultView.el);
            }
        },
        sort: function() {
            var selectedItem = $('#sort option:selected').val();
            if(counter === 0)
            {
                if(selectedItem === 1)
                    collectionOfPlays.pluck('price');
                else if(selectedItem === 2)
                    collectionOfPlays.pluck('price');
                else if(selectedItem === 3)
                    collectionOfPlays.pluck('date');
                playCollectionView.render();
                $('#plot').append(playCollectionView.el);
            }
            else
            {
                if(selectedItem === 1)
                    resultCol.pluck('price');
                else if(selectedItem === 2)
                    resultCol.pluck('price');
                else if(selectedItem === 3)
                    resultCol.pluck('date');
                resultView.render();
                $('#plot').append(resultView.el);
            }
        },
        render: function(){
            this.$el.html(this.templateSort(this.model.toJSON()));
            return this;
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

        templateMin: _.template('<img src="/images/<%= picture%>"><h1><%= name %></h1><div class="right"><p><%= date %></p><p><%= time %></p><img class="buy" src="/images/ticket.png"></div><p>Театр: <span><%= theatre %></span></p><p>Труппа: <span><%= troupe %></span></p><div class="price"><p>Цена:<span> от <%= price %>грн</span></p></div><button class="more">Подробнее</button>'),
        templateMax: _.template('<img src="/images/<%= picture%>"><h1><%= name %></h1><div class="right"><p><%= date %></p><p><%= time %></p><img class="buy" src="/images/ticket.png"></div><p>Театр: <span><%= theatre %></span></p><p>Труппа: <span><%= troupe %></span></p><div class="price"><p>Цена:<span> от <%= price %>грн</span></p></div><button class="less">Скрыть</button><div class="add" data-transition="slidedown"><p>Актёры: <span><%= starring %></span></p><p>О чём: <span><%= summary %></span></p></div>'),
        events: {
            'click .more': 'briefInformation',
            'click .less': 'fullInformation',
            'click .buy': 'popUp'
        },

        fullInformation: function () {
            this.$el.html( this.templateMin( this.model.toJSON() ) );
            //определить справа или слева и выставить соответствующий float
            this.$el.removeClass("bigPlay");
            this.$el.addClass("smallPlay");
        },

        briefInformation: function () {
            this.$el.html( this.templateMax( this.model.toJSON() ) );
            this.$el.removeClass("smallPlay");
            this.$el.addClass("bigPlay");
        },

        popUp: function(){
            console.log("buying");
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
        comparator: function(a){
            var selectedItem = $('#sort option:selected').val();
            if(selectedItem === 0)
                return;
            else
                return a.get('price');
        },
        url: '/play/collection.json'
    });

    App.Views.PlayCollectionView = Backbone.View.extend({
        tagName: 'div',
        initialize: function() {
            console.log("rendering collection view");
            this.collection.on('add', this.addOne, this);
            this.collection.on('change', this.sortThisBitch, this);
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

    var sort = new App.Models.Sort();

    var sortView = new App.Views.SortView({model: sort});

    var collectionOfPlays = new App.Collections.PlayCollection();
    collectionOfPlays.fetch();

    var playCollectionView = new App.Views.PlayCollectionView({collection: collectionOfPlays});
    playCollectionView.render();

    $('.sortMenu').append(sortView.el);
    $('#plot').append(playCollectionView.el);
    //хэлпер шаблона
    //window.template = function(id) {
    //    return _.template( $('#' + id).html() );
    //};















