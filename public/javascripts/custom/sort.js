/**
 * Created by Ткаченко on 20.10.2015.
 */
App.Models.Sort = Backbone.Model.extend({});

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
    templateSort: _.template('<div class="width"><label for="gogol" class="label">Поиск:</label><input id="gogol" class="form-control input-sm" type="search" style="width: 300px" placeholder="Введите название представления..." ></div><label for="theatre" class="label">Театр:</label><select id="theatre" class="form-control input-sm" style="width: 200px; display: inline"><option value="1">Все</option><option value="2">Театр им. Т.Г. Шевченко</option><option value="3">Дом Актёра</option><option value="4">ХНАТОБ</option><option value="5">Театр им. А.С. Пушкина</option><option value="6">ТЮЗ</option><option value="7">Театр Музкомедии</option><option value="8">Театр кукол</option><option value="9">Мадригал</option></select><label for="dateSort" class="label">Дата:</label><input id="dateSort" class="form-control input-sm" type="date" style="display: inline; width: 140px" min="2015-30-09"</input><button id="help" class="btn">Найти</button><label for="sort" class="label">Сортировать:</label><select id="sort" class="input-sm form-control" style="display: inline; width: 225px"><option value="0">Укажите параметр сортировки</option><option value="1">по возрастанию цены</option><option value="2">по убыванию цены</option><option value="3">по дате</option></select><button id="pisun" class="btn">Сортировать</button>'),
    counter:0,
    flag: true,
    sortFlag: true,
    resultCol: Object,
    resultView : Object,
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
        if (val === '' && this.counter === 0 && selectedText === 'Все' && dateText === ''){}
        else if (val === '' && this.counter === 1 && selectedText === 'Все' && dateText === '' ){
            this.counter = 0;
            $('#plot').empty();
            playCollectionView.render();
            $('#plot').append(playCollectionView.el);
        }
        else
        {
            this.counter = 1;
            var result;
            if(val !== '')
            {
                this.flag = false;
                result = collectionOfPlays.where({name: val});
                this.resultCol = new App.Collections.PlayCollection(result);
            }
            if(selectedText !== 'Все')
            {
                if(this.flag === true)
                    result = collectionOfPlays.where({theatre: selectedText});
                else
                    result = this.resultCol.where({theatre: selectedText});
                this.flag = false;
                this.resultCol = new App.Collections.PlayCollection(result);
            }
            if(dateText !== '')
            {
                if(this.flag === true)
                    result = collectionOfPlays.where({date: dateText});
                else
                    result = this.resultCol.where({date: dateText});
                this.resultCol = new App.Collections.PlayCollection(result);
            }
            this.flag = true;
            $('#plot').empty();
            this.resultView = new App.Views.PlayCollectionView({collection: this.resultCol});
            this.resultView.render();
            $('#plot').append(this.resultView.el);
        }
    },
    sort: function() {
        function convertSortDate(date)
        {
            var day;
            var month;
            if(date.length === 4) {
                day = '0'+date.charAt(0);
                month = date.slice(2);
            }
            else {
                day = date.slice(0,2);
                month = date.slice(3);
            }
            return '2015-'+month+'-'+day;
        }
        var sortColView;
        var sortCol;
        var selectedText = $("#theatre option:selected").text();
        var selectedVal = $('#sort option:selected').val();
        var sortRes;
        if(selectedVal === '0'){}
        else {
            if (this.counter === 0 && selectedText !== 'Укажите параметр сортировки') {
                this.sortFlag = false;
                if (selectedVal === '1')
                    sortRes = collectionOfPlays.sortBy(function (play) {
                        return play.get("price");
                    });
                else if (selectedVal === '2')
                    sortRes = collectionOfPlays.sortBy(function (play) {
                        return -play.get("price");
                    });
                else if (selectedVal === '3')
                    sortRes = collectionOfPlays.sortBy(function (play) {
                        return convertSortDate(play.get("date"));
                    });
            }
            else if (this.counter === 1 && selectedText !== 'Укажите параметр сортировки') {
                this.sortFlag = false;
                if (selectedVal === '1')
                    sortRes = this.resultCol.sortBy(function (play) {
                        return play.get("price");
                    });
                else if (selectedVal === '2')
                    sortRes = this.resultCol.sortBy(function (play) {
                        return -play.get("price");
                    });
                else if (selectedVal === '3')
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