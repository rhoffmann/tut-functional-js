
var allBeers = require('./data/beers.json').beers;

// var beerTemplate = document.getElementById('tmpl-beer').textContent;
var beerTemplate = document.getElementById('tmpl-beer-grouped').textContent;
var beerList = document.getElementById('beerList');
var averageAbv = document.getElementById('averageAbv');
var filters = document.getElementById('filters');
var filterLinks = filters.querySelectorAll('a');

var R = require('ramda');
var _ = require('lodash');
var rl = require('rich-lib');

import { Dog, Wolf } from './modules/zoo-es6';
var myDog = new Dog('James', 'labrador');
console.log(myDog.bark());

function renderBeers(beers) {
  var beerGroups = rl.groupBy(beers, function(beer) {
    return beer.locale;
  });
  
  beerList.innerHTML = _.template(beerTemplate)({ beers: beerGroups });
  averageAbv.innerHTML = 'Average ABV: ' + getAverageAbv(beers) + '%';
}

function setActiveFilter(active) {
  var i;
  for (i=0; i<filterLinks.length; i++) {
    filterLinks[i].classList.remove('btn-active');
  }
  active.classList.add('btn-active');
}

function roundDecimal(number, places) {
  var factor = Math.pow(10, places);
  return Math.round(number * factor) / factor;
}

function getAverageAbv(beers) {
  var mean = rl.mean(beers, 'abv');
  return roundDecimal(mean, 2);
}

var filterByLocale = rl.makeFilter(allBeers, 'locale');
var filterByType = rl.makeFilter(allBeers, 'type');


renderBeers(allBeers);


filters.addEventListener('click', function (e) {
  e.preventDefault();
  var clicked = e.target;
  var filterName = clicked.dataset.filter;
  var filteredBeers = [];

  setActiveFilter(clicked);
      
  switch (filterName) {
    case 'all':
      filteredBeers = allBeers;
      break;
    case 'domestic':
      filteredBeers = filterByLocale('domestic');
      break;
    case 'imports':
      filteredBeers = filterByLocale('import');
      break;
    case 'ale':
      filteredBeers = allBeers.filter(function(beer) {
        return beer.type === 'ale' || beer.type === 'ipa';
      });
      break;
    case 'lager':
      filteredBeers = filterByType('lager');
      break;
    case 'stout':
      filteredBeers = filterByType('stout');
      break;
    case 'surprise':
      filteredBeers = [_.sample(allBeers)];
      break;
  }
    
  renderBeers(filteredBeers);

});