App.Models.Sort = Backbone.Model.extend({});

App.Views.SortView = Backbone.View.extend({
    tagName: 'div',
    className: 'sorttab',
    initialize: function(){
        this.render();
    },
    events:{
        'click #help': 'filter',
        'click #pisun': 'sort',
        'click #clear': 'clear',
        'keypress #gogol': function(e){
            if (e.keyCode == 13) {
                $("#help").trigger('click');
            }
        }
    },
    templateSort: _.template('<div class="width"><label for="gogol" class="label">Поиск:</label><input id="gogol" class="form-control input-sm" type="search" style="width: 300px" placeholder="Введите название представления..." ></div><label for="theatre" class="label">Театр:</label><select id="theatre" class="form-control input-sm" style="width: 200px; display: inline"><option value="1">Все</option><option value="2">Театр им. Т.Г. Шевченко</option><option value="3">Дом Актера</option><option value="4">ХНАТОБ</option><option value="5">Театр им. А.С. Пушкина</option><option value="6">ТЮЗ</option><option value="7">Театр Музкомедии</option><option value="8">Театр кукол</option><option value="9">Мадригал</option></select><label for="dateSort" class="label">Дата:</label><input id="dateSort" class="form-control input-sm" type="date" style="display: inline; width: 140px" min="2015-30-09"</input><button id="help" class="btn">Найти</button><label for="sort" class="label">Сортировать:</label><select id="sort" class="input-sm form-control" style="display: inline; width: 225px"><option value="0">Укажите параметр сортировки</option><option value="1">по возрастанию цены</option><option value="2">по убыванию цены</option><option value="3">по дате</option></select><button id="pisun" class="btn">Сортировать</button><button id="clear" class="btn">Очистить</button>'),
    counter:0,
    flag: true,
    sortFlag: true,
    resultCol: Object,
    resultView : Object,
    clear: function(){
        $("#gogol").val("");
        $("#theatre option[value=1]").attr('selected', 'true');
        $("#sort option[value=0]").attr('selected', 'true');
        $('#dateSort').val("");
        this.counter = 0;
        $('#plot').empty();
        playCollectionView.render();
        $('#plot').append(playCollectionView.el);
    },
    convertDate: function(date){
        if(date.length === 0)
            return '';
        var day = date.slice(8);
        var month = date.slice(5,7);
        if(day.charAt(0) === '0')
            day = day.slice(1);
        return day + '.' + month;
    },
    filter: function() {
        var selectedText = $("#theatre option:selected").text();
        var val = document.getElementById('gogol').value.toUpperCase();
        var dateText = this.convertDate(document.getElementById('dateSort').value);
        if (val === '' && this.counter === 1 && selectedText === 'Все' && dateText === '' ){
            this.counter = 0;
            $('#plot').empty();
            playCollectionView.render();
            $('#plot').append(playCollectionView.el);
        }
        else
        {
            this.counter = 1;
            if(val !== '')
            {
                this.flag = false;
                this.resultCol = new App.Collections.PlayCollection(collectionOfPlays.where({name: val}));
            }
            if(selectedText !== 'Все')
            {
                if(this.flag === true)
                    this.resultCol = new App.Collections.PlayCollection(collectionOfPlays.where({theatre: selectedText}));
                else
                    this.resultCol = new App.Collections.PlayCollection(this.resultCol.where({theatre: selectedText}));
                this.flag = false;
            }
            if(dateText !== '')
            {
                if(this.flag === true)
                    this.resultCol = new App.Collections.PlayCollection(collectionOfPlays.where({date: dateText}));
                else
                    this.resultCol = new App.Collections.PlayCollection(this.resultCol.where({date: dateText}));
            }
            this.flag = true;
            $('#plot').empty();
            this.resultView = new App.Views.PlayCollectionView({collection: this.resultCol});
            this.resultView.render();
            $('#plot').append(this.resultView.el);
        }
        if(this.resultCol.length === 0) {
            $('#plot').append('<img src="/images/OSCAR.jpg" height="20%" width="95%">');
            $('#plot').append('<h3 style="color: red" align="center">Поиск не дал результатов :)</br>Попробуйте еще раз</h3>');
        }
    },
    sort: function() {
        function convertSortDate(date) {
            var day;
            var month;
            if (date.length === 4) {
                day = '0' + date.charAt(0);
                month = date.slice(2);
            }
            else {
                day = date.slice(0, 2);
                month = date.slice(3);
            }
            return '2015-' + month + '-' + day;
        }
        var sortColView;
        var sortCol;
        var selectedText = $("#theatre option:selected").text();
        var selectedVal = $('#sort option:selected').val();
        var sortRes;
        if(selectedVal != '0'){
            if (this.counter === 0 && selectedText !== 'Укажите параметр сортировки') {
                this.sortFlag = false;
                if (selectedVal != '3')
                    sortRes = collectionOfPlays.sortBy(function (play) {
                        return (selectedVal=='1')? play.get("price")[0]:-play.get("price")[0];
                    });
                else
                    sortRes = collectionOfPlays.sortBy(function (play) {
                        return convertSortDate(play.get("date"));
                    });
            }
            else if (this.counter === 1 && selectedText !== 'Укажите параметр сортировки') {
                this.sortFlag = false;
                if (selectedVal != '3')
                    sortRes = this.resultCol.sortBy(function (play) {
                        return (selectedVal==='1')? play.get("price")[0]:-play.get("price")[0];
                    });
                else
                    sortRes = this.resultCol.sortBy(function (play) {
                        return convertSortDate(play.get("date"));
                    });
            }
            sortCol = new App.Collections.PlayCollection(sortRes);
            $('#plot').empty();
            sortColView = new App.Views.PlayCollectionView({collection: sortCol});
            sortColView.render();
            $('#plot').append(sortColView.el);
        }
    },
    render: function(){
        this.$el.html(this.templateSort(this.model.toJSON()));
        return this;
    }
});

var sort = new App.Models.Sort();

var sortView = new App.Views.SortView({model: sort});

$('.sortMenu').append(sortView.el);