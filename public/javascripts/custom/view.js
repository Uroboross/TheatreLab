    App.Views.PlayView = Backbone.View.extend({
        tagName: 'div',
        className: 'play',
        initialize: function(){
            this.model.on('destroy', this.remove, this);
            this.model.on('change', this.render, this);
            this.render();
        },
        templateMin: _.template($('#minPlayTemplate').html()),
        templateMax: _.template($('#maxPlayTemplate').html()),
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
            var popUpView = new App.Views.PopUpView();
            var audienceView = new App.Views.AudienceView({model: this.model});
            $('.modal-body').append( audienceView.render().$el);
        },
        render: function(){
            this.$el.html( this.templateMin( this.model.toJSON() ) );
            return this;
        },
        remove: function  () {
            this.$el.remove();
        }
    });



    App.Views.PlayCollectionView = Backbone.View.extend({

        tagName: 'div',

        initialize: function() {
            console.log("rendering collection view");
            this.collection.on('add', this.addOne, this);
            //this.render();
            //$('#plot').append(this.el);
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

    App.Views.PopUpView = Backbone.View.extend({
        tagName: 'div',
        className: 'modal fade',
        id: 'myModal',
        flag: false,
        attributes: {
            'role': 'dialog',
            'aria-labelledby': 'myModalLabel',
            'aria-hidden': 'true',
            'tabindex': '1'
        },
        template: _.template($('#myModalTemplate').html()),
        initialize: function(){
            $('#myModal').remove();
            this.render();
            this.checkoutModel = new App.Models.Checkout();
            this.checkoutView = new App.Views.CheckoutView({model: this.checkoutModel});
        },
        events: {
            'keydown .modal-dialog': function(e){
                if (e.keyCode == 13) {
                    $("#next").trigger('click');
                }
            },
            'click #next': function(){
                if($('#actual-step').attr('value') == "2"){
                    if(this.flag)
                        this.checkoutView.signUp();
                    else
                        this.flag = true;
                }
            }
        },
        render: function(){
            this.$el.html( this.template( {} ) );
            $('#plot').append(this.el);
            this.initializeModal();

        },
        disableNext: function(){
            $("#next").attr('disabled', 'disabled');
        },
        disablePrevious: function(){
            $("#previous").attr('disabled', 'disabled');
        },
        initializeModal: function(){
            var thisRef = this;
            this.$el.modalSteps({
                btnCancelHtml: 'Отмена',
                btnPreviousHtml: 'Назад',
                btnNextHtml: 'Далее',
                btnLastStepHtml: 'Завершить',
                disableNextButton: false,
                completeCallback: function () {
                },
                callbacks: {
                    '1': function () {
                        thisRef.disableNext();
                    },
                    '3': function () {
                        thisRef.disablePrevious();
                    }
                },
                nextValidationCallback: function () {
                    return !($('#actual-step').attr('value') == "2" && !thisRef.checkoutView.signUp());
                }
            });
        }
    });


    App.Views.AudienceView = Backbone.View.extend({
        tagName:'div',
        className: "row hide",
        attributes: {
            'data-step': "1",
            'data-title': "Выбор мест"
        },
        arrOfPlaces: [],
        initialize: function() {
            this.arrOfPlaces = [];
        },
        events: {
            'click .place': 'choose'
        },
        next: function(){
            $("#next").removeAttr('disabled');
        },
        disableNext: function(){
            $("#next").attr('disabled', 'disabled');
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
                    this.disableNext();
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
                this.next();
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

    App.Views.CheckoutView = Backbone.View.extend({
        tagName:'form',
        className: "form-horizontal",
        attributes:{
            'role': "form"
        },
        template: _.template($('#formTemplate').html()),
        initialize: function () {
            this.render();
            Backbone.Validation.bind(this);
        },
        events: {
            'blur #email': 'emailIsValid',
            'blur #account': 'accountIsValid',
            'blur #cvv': 'cvvIsValid',
            'click .orderType[value=book]': function(){
                $('.orderType[value=book]').attr("checked", "true");
                $("input[name=account]").attr('disabled', 'disabled');
                $("input[name=cvv]").attr('disabled', 'disabled');
                $('#account').val("").closest('.form-group').removeClass('has-error').removeClass('has-success').find('.help-block').html('').addClass('hidden');
                $('#cvv').val("").closest('.form-group').removeClass('has-error').removeClass('has-success').find('.help-block').html('').addClass('hidden');
            },
            'click .orderType[value=buy]': function(){
                $('.orderType[value=book]').removeAttr("checked");
                $("input[name=account]").removeAttr('disabled');
                $("input[name=cvv]").removeAttr('disabled');
                this.signUp();
            }
        },
        //refactor this in one function
        emailIsValid: function(){
            var data = this.$el.serializeObject();
            this.model.set(data);
            this.model.isValid('email');
        },
        accountIsValid: function(){
            var data = this.$el.serializeObject();
            this.model.set(data);
            this.model.isValid('account');
        },
        cvvIsValid: function(){
            var data = this.$el.serializeObject();
            this.model.set(data);
            this.model.isValid('cvv');
        },

        signUp: function () {
            var data = this.$el.serializeObject();
            this.model.set(data);
            if($('.orderType[value=book]').attr("checked") == "checked")
                return this.model.isValid('email');
            else
                return this.model.isValid(true);
        },

        remove: function() {
            Backbone.Validation.unbind(this);
            return Backbone.View.prototype.remove.apply(this, arguments);
        },

        render: function(){
            this.$el.html( this.template( {} ) );
            $('.checkoutForm').append(this.el);
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

