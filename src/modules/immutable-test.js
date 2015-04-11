var Immutable = require('immutable');
var assert = require('assert');

export function start() {

	console.log('start');

	var map1 = Immutable.Map({a:1, b:2, c:3, d:4});
	var map2 = map1.set('b', 50);
	var map3 = map1.set('b', 2);

	assert(map1 === map3);
	assert(map1 !== map2);

	var list1 = Immutable.List.of(1, 2);
	var list2 = list1.push(3, 4, 5);
	var list3 = list2.unshift(0);
	var list4 = list1.concat(list2, list3);

	assert(list1.size === 2);
	assert(list2.size === 5);
	assert(list3.size === 6);
	assert(list4.size === 13);
	assert(list4.get(0) === 1);

	var mapRes = map1.map((v, k) => k.toUpperCase()).join();
	console.log(mapRes);

	var obj = {d:100, o:200, g:300};
	var map3 = map1.merge(map2, obj);

	var mappedMap = Immutable.Seq(map3).map(x => x * x).toObject();
	console.dir(mappedMap);
	
	var result1 = Immutable.Range(1, Infinity)
  		.skip(1000)
  		.map(n => -n)
  		.filter(n => n % 2 === 0)
  		.take(2)
  		.reduce((r, n) => r * n, 1);

  	console.log(result1);
}
