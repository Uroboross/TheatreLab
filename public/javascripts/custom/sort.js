var counter = 0;
var flag = true;
var resultCol;
var resultView;


function convertDate(date) {
    if(date.length === 0)
        return '';
    var day = date.slice(8);
    var month = date.slice(5,7);
    if(day.charAt(0) === '0')
        day = day.slice(1);
    var result = day + '.' + month;
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

App.Models.Sort = Backbone.Model.extend({
    defaults: {
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
        'click #pisun': 'sort',
        'click #clear': 'clear',
        'keypress #gogol': function(e){
            if (e.keyCode == 13) {
                $("#help").trigger('click');
            }
        }
    },
    templateSort: _.template('<div class="width"><label for="gogol" class="label">Поиск:</label><input id="gogol" class="form-control input-sm" type="search" style="width: 300px" placeholder="Введите название представления..." ></div><label for="theatre" class="label">Театр:</label><select id="theatre" class="form-control input-sm" style="width: 200px; display: inline"><option value="1">Все</option><option value="2">Театр им. Т.Г. Шевченко</option><option value="3">Дом Актёра</option><option value="4">ХНАТОБ</option><option value="5">Театр им. А.С. Пушкина</option><option value="6">ТЮЗ</option><option value="7">Театр Музкомедии</option><option value="8">Театр кукол</option><option value="9">Мадригал</option></select><label for="dateSort" class="label">Дата:</label><input id="dateSort" class="form-control input-sm" type="date" style="display: inline; width: 140px" min="2015-30-09"</input><button id="help" class="btn">Найти</button><label for="sort" class="label">Сортировать:</label><select id="sort" class="input-sm form-control" style="display: inline; width: 225px"><option value="0">Укажите параметр сортировки</option><option value="1">по возрастанию цены</option><option value="2">по убыванию цены</option><option value="3">по дате</option><option value="4">по популярности</option></select><button id="pisun" class="btn">Сортировать</button><button id="clear" class="btn">Очистить</button>'),
    clear: function(){
        $("#gogol").val("");
        $("select option[value=1]").attr('selected', 'true');
        $('#dateSort').val("");
        counter = 0;
        $('#plot').empty();
        playCollectionView.render();
        $('#plot').append(playCollectionView.el);
    },
    filter: function() {
        var selectedText = $("#theatre option:selected").text();
        var val = document.getElementById('gogol').value.toUpperCase();
        //var val = document.getElementById('gogol').value;
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

var sort = new App.Models.Sort();

var sortView = new App.Views.SortView({model: sort});

$('.sortMenu').append(sortView.el);