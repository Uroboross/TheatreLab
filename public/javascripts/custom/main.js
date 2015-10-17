
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

    //model to validate
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

    //some extension of validation callbacks
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



    //this is the main view for the current task
    App.Views.CheckoutView = Backbone.View.extend({
        events: {
            'blur #email': 'emailIsValid',
            'blur #account': 'accountIsValid',
            'blur #cvv': 'cvvIsValid',
            'click #checkIfNext': function(){
                this.signUp();
                //$('#next').trigger('click');
            },
            'click .orderType[value=book]': function(){
                $('#account').val("").closest('.form-group').removeClass('has-error').removeClass('has-success').find('.help-block').html('').addClass('hidden');
                $('#cvv').val("").closest('.form-group').removeClass('has-error').removeClass('has-success').find('.help-block').html('').addClass('hidden');
                this.valid[1] = true;
                this.valid[2] = true;
                this.signUp();
            },
            'click .orderType[value=buy]': function(){
                this.cvvIsValid();
                this.accountIsValid();
            }
        },
        valid: [false, false, false],
        emailIsValid: function(){
            $('#checkIfNext').trigger('click');
            var data = this.$el.serializeObject();
            this.model.set(data);
            var isValid = this.model.isValid('email');
            this.valid[0] = (isValid)?true:false;
            console.log(this.valid);
            this.signUp();
        },
        accountIsValid: function(){
            var data = this.$el.serializeObject();
            this.model.set(data);
            var isValid = this.model.isValid('account');
            this.valid[1] = (isValid)?true:false;
            console.log(this.valid);
            this.signUp();
        },
        cvvIsValid: function(){
            var data = this.$el.serializeObject();
            this.model.set(data);
            var isValid = this.model.isValid('cvv');
            this.valid[2] = (isValid)?true:false;
            console.log(this.valid);
            this.signUp();
        },
        initialize: function () {
            // This hooks up the validation
            // See: http://thedersen.com/projects/backbone-validation/#using-form-model-validation/validation-binding
            Backbone.Validation.bind(this);
        },

        signUp: function () {
            if(this.valid[0]&&this.valid[1]&&this.valid[2])
                formValidation = true;
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
            this.clearFields();
            this.arrOfPlaces = [];
        },
        events: {
            'click .place': 'choose'
        },
        clearFields: function(){
            //clearing fields of the form
            //this mustn't be here I know, I will move it and make it easier
            $('#account').val("").closest('.form-group').removeClass('has-error').removeClass('has-success').find('.help-block').html('').addClass('hidden');
            $('#email').val("").closest('.form-group').removeClass('has-error').removeClass('has-success').find('.help-block').html('').addClass('hidden');
            $('#cvv').val("").closest('.form-group').removeClass('has-error').removeClass('has-success').find('.help-block').html('').addClass('hidden');
            $('#student').removeAttr('checked');
            $('#renter').removeAttr('checked');
            $('#buyradio').trigger('click');
        },
        choose: function(e){
            var placeClass = ($("#"+e.target.id).hasClass('cheap'))? 0:($("#"+e.target.id).hasClass('medium'))? 1:2;
            if($("#"+e.target.id).css("backgroundColor") == "rgb(255, 0, 0)")
            {
                if(placeClass == 0){
                    $("#"+e.target.id).css("backgroundColor", "rgb(177, 232, 154)");
                }
                else if(placeClass == 1) {
                    $("#"+e.target.id).css("backgroundColor", "rgb(146, 216, 251)");
                }
                else {
                    $("#"+e.target.id).css("backgroundColor", "rgb(255, 237, 169)");
                }
                $('#r_'+e.target.id).remove();
                $('#p_'+e.target.id).remove();
                this.arrOfPlaces.splice(_.indexOf(this.arrOfPlaces, this.model.get('price')[placeClass]), 1);

                if(this.arrOfPlaces.length == 0)
                    disableNext();
                $('.ticketPrice').remove();
                $(".priceContainer").append('<p class="ticketPrice">Сумма:&nbsp&nbsp&nbsp&nbsp&nbsp'+ _.reduce(this.arrOfPlaces, function(memo, num){ return memo + num; }, 0) +' грн</p>');
            }
            else
            {
                $("#"+e.target.id).css("backgroundColor","red");
                var arr = e.target.id.split('_');
                $(".choosenContainer").append('<p class="chosen_row" id="r_'+ e.target.id +'">Ряд: '+ arr[0] +'</p><p class="chosen_place" id="p_'+ e.target.id+'">Место: '+ arr[1] +'</p>');
                this.arrOfPlaces.push(this.model.get('price')[placeClass]);
                $('.ticketPrice').remove();
                $(".priceContainer").append('<p class="ticketPrice">Сумма:&nbsp&nbsp&nbsp&nbsp&nbsp'+ _.reduce(this.arrOfPlaces, function(memo, num){ return memo + num; }, 0) +' грн</p>');
                next();
            }
        },
        makeView: function(){
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
                if(i == 14 || i == 1)//проходы
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
                            offsetLeft = 14;
                        }
                        if(i<6)
                            hall+="<div class=\"place expensive\" id=\""+i+"_"+count+"\" style=\"margin-left:"+offsetLeft+"px; margin-top:"+offsetTop+"px\">"+count+"</div>";
                        else if(i>5 && i<14)
                            hall+="<div class=\"place medium\" id=\""+i+"_"+count+"\" style=\"margin-left:"+offsetLeft+"px; margin-top:"+offsetTop+"px\">"+count+"</div>";
                        else
                            hall+="<div class=\"place cheap\" id=\""+i+"_"+count+"\" style=\"margin-left:"+offsetLeft+"px; margin-top:"+offsetTop+"px\">"+count+"</div>";
                        offsetLeft = 0;
                    }
                }
                if(i == 14 || i == 1)
                    offsetTop = 0;

            }
            hall += "</div><div class='choosenContainer'></div><div class='legend'><div class=\"expensive\"></div><p class='expensivePrice'>"+this.model.get('price')[2]+" грн</p><div class=\" medium\"></div><p class='mediumPrice'>"+this.model.get('price')[1]+" грн</p><div class=\"cheap\"></div><p class='cheapPrice'>"+this.model.get('price')[0]+" грн</p></div><div class='priceContainer'></div></div>";
            return hall;
        },
        render: function(){
            var smth = this.makeView();
            this.$el.html( smth );
            return this;
        }
    });



    App.Views.PlayView = Backbone.View.extend({
        tagName: 'div',
        className: 'play',
        initialize: function(){
            this.model.on('destroy', this.remove, this);
            this.model.on('change', this.render, this);
            console.log("rendering views of plays");
            this.render();
        },
        templateMin: _.template('<img src="/images/<%= picture%>"><h1><%= name %></h1><div class="right"><p><%= date %></p><p><%= time %></p><button type="button" data-toggle="modal" data-target="#myModal" class="btn btn-primary"></div><p>Театр: <span><%= theatre %></span></p><p>Труппа: <span><%= troupe %></span></p><div class="price"><p>Цена:<span> от <%= price %>грн</span></p></div><button class="more">Подробнее</button>'),
        templateMax: _.template('<img src="/images/<%= picture%>"><h1><%= name %></h1><div class="right"><p><%= date %></p><p><%= time %></p><button type="button" data-toggle="modal" data-target="#myModal" class="btn btn-primary"></div><p>Театр: <span><%= theatre %></span></p><p>Труппа: <span><%= troupe %></span></p><div class="price"><p>Цена:<span> от <%= price %>грн</span></p></div><button class="less">Скрыть</button><div class="add"><p>Актёры: <span><%= starring %></span></p><p>О чём: <span><%= summary %></span></p></div>'),
        events: {
            'click .more': 'fullInformation',
            'click .less': 'briefInformation',
            'click .btn-primary': 'buyTicket',
            'mouseover .btn-primary': 'prompt'
        },

        prompt: function(){
            nhpup.popup('Купить',{'width': 60});
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


    var collectionOfPlays = new App.Collections.PlayCollection();
    collectionOfPlays.fetch();

    var playCollectionView = new App.Views.PlayCollectionView({collection: collectionOfPlays});
    playCollectionView.render();

    $('#plot').append(playCollectionView.el);




    //pop-up initialization

    $('#myModal').modalSteps({
        btnCancelHtml: 'Отмена',
        btnPreviousHtml: 'Назад',
        btnNextHtml: 'Далее',
        btnLastStepHtml: 'Завершить',
        disableNextButton: false,
        completeCallback: function(){},
        callbacks: {
            '*': function(){
                console.log("steps");
            },
            '1': function(){
                disableNext();
            },
            '2': function(){
                //disableNext();
            },
            '3': function(){
                disablePrevious();
            }
        }
    });

    //event handlers to enable enter button

    $("#myModal").keypress(function(e){
        if(e.keyCode==13){
            $("#next").trigger('click');
        }
    });

    $("#gogol").keypress(function(e){
        if(e.keyCode==13){
            $("#help").trigger('click');
        }
    });


    //here it is a try to catch click on next button
    $('#next').click(function(e){
        //here it checks if it is the second step window
        if($('#actual-step').attr('value')== "2"&&!formValidation){

            //some unlucky tries

            //$('#checkIfNext').trigger('click');
            //$('#previous').trigger('click');
            //console.log(collectionOfPlays.playView);
        }
    });


    //it's all about disabling and enabling pop-up navigation buttons
    function disableNext(){
        $("#next").attr('disabled', 'disabled');
    }
    function next(){
        $("#next").removeAttr('disabled');
    }
    function disablePrevious(){
        $("#previous").attr('disabled', 'disabled');
    }

    //this event handler disables two fields when we turn to book mode and vice versa
    $('.orderType').on('click', function(e){
        if(e.target.value == "book") {
            //disableNext();
            $('.orderType[value=book]').attr("checked","true");
            $("input[name=account]").attr('disabled', 'disabled');
            $("input[name=cvv]").attr('disabled', 'disabled');
        }
        else {
            //disableNext();
            $('.orderType[value=book]').removeAttr("checked");
            $("input[name=account]").removeAttr('disabled');
            $("input[name=cvv]").removeAttr('disabled');
        }
    });



    //хэлпер шаблона
    //window.template = function(id) {
    //    return _.template( $('#' + id).html() );
    //};




