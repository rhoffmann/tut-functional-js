var allBeers = require('./data/beers.json').beers;

// var beerTemplate = document.getElementById('tmpl-beer').textContent;
var beerTemplate = document.getElementById('tmpl-beer-grouped').textContent;
var beerList = document.getElementById('beerList');
var averageAbv = document.getElementById('averageAbv');
var filters = document.getElementById('filters');
var filterLinks = filters.querySelectorAll('a');

var rl = require('rich-lib');

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


function getAverageAbv(beers) {
  var abvs = rl.map(beers, function(beer) {
    return beer.abv;
  });

  var total = rl.reduce(abvs, rl.add, 0);

  return Math.round(total / beers.length * 10) / 10;
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
      filteredBeers = rl.filter(allBeers, function(beer) {
        return beer.type === 'ale' || beer.type === 'ipa';
      });
      break;
    case 'lager':
      filteredBeers = filterByType('lager');
      break;
    case 'stout':
      filteredBeers = filterByType('stout');
      break;
  }
    
  renderBeers(filteredBeers);

});