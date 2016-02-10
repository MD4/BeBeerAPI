var beers = require('./beers.json');
var beersDetails = require('./beers_details.json');
var beersImages = require('./images.json');

module.exports.getMergedData = function() {
    return beers.map(function(beer) {
        var details = beersDetails.filter(function(beerDetails) {
            return beerDetails.name === beer.name;
        })[0];
        var images = beersImages.filter(function(beerImage) {
            return beerImage.title === beer.name;
        })[0];

        return {
            _id: images.id + '',
            name: beer.name,
            country: details.country,
            brewery: details.brewery,
            comment: details.comment,
            grades: details.grades,
            notes: details.notes,
            fermentation: beer.fermentation,
            shortDescription: beer.shortDescription,
            image: 'http://www.guide-biere.fr/biere/illustrations/' + images.id + '.JPG'
        };
    });
};