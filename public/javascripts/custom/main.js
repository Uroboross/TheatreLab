 function play () {
     console.log("inside");
     var Play = Backbone.Model.extend({urlRoot: '/play'});
     var solaris = new Play({id: "first_play.json"});
     solaris._changing = true;
     solaris.fetch({success: function(){console.log("success");}, error: function(){ console.log("error"); }});
     console.log(JSON.stringify(solaris));
}