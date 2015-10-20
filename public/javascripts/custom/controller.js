
var collectionOfPlays = new App.Collections.PlayCollection();
collectionOfPlays.fetch();

var playCollectionView = new App.Views.PlayCollectionView({collection: collectionOfPlays});
playCollectionView.render();

$('#plot').append(playCollectionView.el);