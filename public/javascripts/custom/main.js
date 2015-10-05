
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
    App.Models.Play = Backbone.Model.extend({
        defaults: {
            name: 'play',
            date: "22/10/11"
        }
    });
    App.Models.Checkout = Backbone.Model.extend({
        validation: {
            email: [{
                required: true,
                msg: "Поле 'Email' обязательно для заполнения"
            },{
                pattern: 'email',
                msg: "поле 'Email' должно содержать реальный email адрес"
            },{
                rangeLength: [3, 30],
                msg: "Поле Email должно иметь не менее 3х и не более 30 символов"
            }],
            account: [{
                required: true,
                msg: "Поле 'Номер счёта' обязательно для заполнения"
            },{
                pattern: /[0-9]{16}/,
                msg: "Поле 'Номер счёта' должно содержать 16 цифр без пробелов"
            }],
            cvv: [{
                required: true,
                msg: "Поле 'CVV' обязательно для заполнения"
            },{
                pattern: /[0-9]{3}/,
                msg: "Поле 'CVV' должно содержать 3 цифры без пробела"
            }]
        },
        defaults: {
            discount: false
        }
    });



    _.extend(Backbone.Validation.callbacks, {
        valid: function (view, attr, selector) {
            var $el = view.$('[name=' + attr + ']'),
                $group = $el.closest('.form-group');
            $group.removeClass('has-error');
            $group.addClass('has-success');
            $group.find('.help-block').html('').addClass('hidden');
        },
        invalid: function (view, attr, error, selector) {
            var $el = view.$('[name=' + attr + ']'),
                $group = $el.closest('.form-group');
            console.log();
            if( ($el.attr('name') == "account" || $el.attr('name') == "cvv") && $('.orderType[value=book]').attr("checked") == "checked")
            {
                $group.removeClass('has-error');
                $group.find('.help-block').html('').addClass('hidden');
            }
            else{
                $group.addClass('has-error');
                $group.find('.help-block').html(error).removeClass('hidden');
            }
        }
    });

    $.fn.serializeObject = function () {
        "use strict";
        var a = {}, b = function (b, c) {
            var d = a[c.name];
            "undefined" != typeof d && d !== null ? $.isArray(d) ? d.push(c.value) : a[c.name] = [d, c.value] : a[c.name] = c.value
        };
        return $.each(this.serializeArray(), b), a
    };


    //


    App.Views.CheckoutView = Backbone.View.extend({
        events: {
            'click #signUpButton': function (e) {
                e.preventDefault();
                this.signUp();
            }
        },

        initialize: function () {

            // This hooks up the validation
            // See: http://thedersen.com/projects/backbone-validation/#using-form-model-validation/validation-binding
            Backbone.Validation.bind(this);
        },

        signUp: function () {
            var data = this.$el.serializeObject();

            this.model.set(data);

            // Check if the model is valid before saving
            // See: http://thedersen.com/projects/backbone-validation/#methods/isvalid
            if(this.model.isValid(true)||$('.orderType[value=book]').attr("checked") == "checked"){
                next();
                //$("#next").removeAttr('disabled');
            }
        },

        remove: function() {
            // Remove the validation binding
            // See: http://thedersen.com/projects/backbone-validation/#using-form-model-validation/unbinding
            Backbone.Validation.unbind(this);
            return Backbone.View.prototype.remove.apply(this, arguments);
        },

        render: function(){
        }
    });


    App.Views.AudienceView = Backbone.View.extend({
        tagName:'div',
        className: "row hide",
        arrOfPlaces: [],
        initialize: function() {
            this.$el.attr('data-step', "1");
            this.$el.attr('data-title', "Выбор мест");
            console.log("AV created");
            this.arrOfPlaces = [];
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
                $(".choosenContainer").append('<p class="chosen_place" id="_'+ e.target.id +'">Ряд: '+ arr[0] +' Место: '+ arr[1] +'</p>');
                this.arrOfPlaces.push(e.target.id);
                $('.ticketPrice').remove();
                $(".priceContainer").append('<p class="ticketPrice">Сумма:'+ this.arrOfPlaces.length*this.model.get('price') +'</p>');
                next();
            }
            else
            {
                $("#"+e.target.id).css("backgroundColor", "rgb(146, 216, 251)");
                $('#_'+e.target.id).remove();
                var i;
                for(i = 0; i<this.arrOfPlaces.length; i++)
                    if(this.arrOfPlaces[i] == e.target.id)
                        break;
                this.arrOfPlaces.splice(i, 1);
                if(this.arrOfPlaces.length == 0)
                    disableNext();
                $('.ticketPrice').remove();
                $(".priceContainer").append('<p class="ticketPrice">Сумма:'+ this.arrOfPlaces.length*this.model.get('price') +'</p>');
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
            hall += "</div><div class='choosenContainer'></div><div class='priceContainer'></div></div>";
            return hall;
        },
        render: function(){
            var smth = this.makeView();
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
        templateSort: _.template('<div class="width"><label for="gogol" class="label">Поиск:</label><input id="gogol" class="form-control input-sm" type="search" style="width: 300px" placeholder="Введите название представления..." ></div><label for="theatre" class="label">Театр:</label><select id="theatre" class="form-control input-sm" style="width: 200px; display: inline"><option value="1">Все</option><option value="2">Театр им. Т.Г. Шевченко</option><option value="3">Дом Актёра</option><option value="4">ХНАТОБ</option><option value="5">Театр им. А.С. Пушкина</option><option value="6">ТЮЗ</option><option value="7">Театр Музкомедии</option><option value="8">Театр кукол</option><option value="9">Мадригал</option></select><label for="dateSort" class="label">Дата:</label><input id="dateSort" class="form-control input-sm" type="date" style="display: inline; width: 140px" min="2015-30-09"</input><button id="help" class="btn">Найти</button><label for="sort" class="label">Сортировать:</label><select id="sort" class="input-sm form-control" style="display: inline; width: 225px"><option value="0">Укажите параметр сортировки</option><option value="1">по возрастанию цены</option><option value="2">по убыванию цены</option><option value="3">по дате</option><option value="4">по популярности</option></select><button id="pisun" class="btn">Сортировать</button>'),

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
            'click .less': 'briefInformation',
            'click .btn-primary': 'buyTicket'
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
        buyTicket: function(){
            //$('#plot').empty();
            //$('#myModal').empty();
            //$('#myModal').append('<div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h4 class="js-title-step"></h4></div><div class="modal-body"><div data-step="2" data-title="Оформление" class="row hide"><div class="checkoutForm"><form role="form" class="form-horizontal"><div class="form-group"><label for="email" class="col-lg-2 control-label">Email</label><div class="col-lg-10"><input id="email" type="email" name="email" placeholder="Введите свой email" class="form-control"><span class="help-block hidden"></span></div></div><div class="form-group"><label for="account" class="col-lg-2 control-label">Номер счёта:</label><div class="col-lg-10"><input id="account" type="text" name="account" placeholder="введите номер счёта (16 цифр)" class="form-control"><span class="help-block hidden"></span></div></div><div class="form-group"><label for="cvv" class="col-lg-2 control-label">CVV</label><div class="col-lg-10"><input id="cvv" type="text" name="cvv" placeholder="введите последние 3 цифры cvv" class="form-control"><span class="help-block hidden"></span></div></div><div class="form-group"><div class="col-lg-offset-2 col-lg-10"><div class="checkbox"><label class="control-label"><input id="terms" type="checkbox" value="true" name="discount">Я студент</label><span class="help-block hidden"></span></div></div></div><div class="form-group"><div class="col-lg-offset-2 col-lg-10"><button id="signUpButton" type="button" class="btn btn-success">Проверить</button></div> </div></form></div></div><div data-step="3" data-title="Завершение оформления заказа" class="row hide"><div class="lastStep"><p>Билеты будут высланы Вам на указанный email адрес в течении получаса.</p><p>При желании Вы можете распечатать билеты прямо сейчас.</p><p>Спасибо за использование нашего сервиса!</p><button id="print" type="button" class="btn btn-success">Распечатать билет</button></div></div></div><div class="modal-footer"><button type="button" id="cancel" data-orientation="cancel" data-dismiss="modal" class="btn btn-default js-btn-step pull-left"></button><button type="button" id="previous" data-orientation="previous" class="btn btn-warning js-btn-step"></button><button type="button" id="next" data-orientation="next" class="btn btn-success js-btn-step"></button></div></div></div>');

            $('.row[data-step=1]').remove();
            var audienceView = new App.Views.AudienceView({model: this.model});
            $('.modal-body').append( audienceView.render().$el);
            var checkoutModel = new App.Models.Checkout();
            var checkoutView = new App.Views.CheckoutView({el: 'form', model: checkoutModel});

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
            //this.collection.on('change', this.sortThisBitch, this);
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


    //var audienceView = new App.Views.AudienceView();
    //$('.modal-body').append( audienceView.render().$el);


    //checkoutView.setHandlers();


    function disableNext(){
        $("#next").attr('disabled', 'disabled');
    }
    function next(){
        $("#next").removeAttr('disabled');
    }
    function disablePrevious(){
        $("#previous").attr('disabled', 'disabled');
    }


    $('.orderType').on('click', function(e){
        if(e.target.value == "book") {
            disableNext();
            $('.orderType[value=book]').attr("checked","true");
            $("input[name=account]").attr('disabled', 'disabled');
            $("input[name=cvv]").attr('disabled', 'disabled');
        }
        else {
            disableNext();
            $('.orderType[value=book]').removeAttr("checked");
            $("input[name=account]").removeAttr('disabled');
            $("input[name=cvv]").removeAttr('disabled');
        }
    });
    //$('#cancel').on('click', function(){
    //    $('.js-title-step').empty();
    //    $('.row[data-step=1]').remove();
    //});
    $('#myModal').modalSteps({
        btnCancelHtml: 'Отмена',
        btnPreviousHtml: 'Назад',
        btnNextHtml: 'Далее',
        btnLastStepHtml: 'Завершить',
        disableNextButton: false,
        completeCallback: function(){
            //$('.row .hide').remove();
            //$('.modal-body').append( audienceView.render().$el);
        },
        callbacks: {
            '*': function(){
                console.log("steps");
            },
            '1': function(){
                disableNext();
            },
            '2': function(){
                disableNext();
            },
            '3': function(){
                disablePrevious();
            }
        }
    });


    //хэлпер шаблона
    //window.template = function(id) {
    //    return _.template( $('#' + id).html() );
    //};




