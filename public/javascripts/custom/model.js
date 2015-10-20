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

    App.Collections.PlayCollection = Backbone.Collection.extend({
        model: App.Models.Play,
        initialize: function(){
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