var urls = artoo.scrape('a', function() {
	if (this.getAttribute('href').indexOf('../biere/index.php?num_biere=') === -1) return;
	return {
		title: this.getAttribute('text'),
		url: this.getAttribute('href')
	};
}).filter(function(beer){ return !!beer; }).map(function(beer){return beer.url});

var images = artoo.scrape('a', function() {
	if (this.getAttribute('href').indexOf('../biere/index.php?num_biere=') === -1) return;
	return {
		title: this.innerText,
		url: this.getAttribute('href')
	};
}).filter(function(beer){ return !!beer; }).map(function(beer){
	beer.id = +beer.url.replace('../biere/index.php?num_biere=', '');
	return beer;
});
artoo.savePrettyJson(images);

var beers = artoo.scrapeTable('table[class="stripedTab"]', {

	data: function() {return this.innerText

					.replace(/\n/g,'')

					.replace(/\r/g,'')

					.trim();
	}

}).map(function(data) {
	return ['name','taste','bitterness','thirsty', 'alcoholic','brewery','country','fermentation','note']
		.reduce(function(memo, current, index) {
			memo[current] = data[index];
			return memo;
		}, {});
}).map(function(data) {
	data.alcoholic = +data.alcoholic;
	data.bitterness = +data.bitterness;
	data.taste = +data.taste;
	data.thirsty = +data.thirsty;
	return data;
});
artoo.savePrettyJson(beers);

artoo.ajaxSpider(
	function(i) {
		return urls[i];
	},
	{
		method: 'get',
		process: function(data) {
			function epure(text) {
				return $('<div/>')
					.html(text)
					.text()
					.replace(/\n/g,'')
					.replace(/\r/g,'')
					.replace(/\s\s/g,' ')
					.trim();
			}
			return {
				name: epure($(data).find('div[id="titre"]').text()),
				country: epure($(data).find('a[title="voir toutes les bi�res not�es de ce pays"]').text()),
				brewery: epure($(data).find('a[title="voir la fiche de cette brasserie"]').text()),
				comment: epure($(data).find('p[itemprop="reviewBody"]').text()),
				grades: {
					taste: +$(data).find('span[itemprop="reviewRating"]').text(),
					thirsty: +$(data).find('span[id="noteSoif"]').text(),
					bitterness: +$(data).find('span[id="noteAmer"]').text()
				},
				notes: $(data).find('p[style="text-align:justify"]')[1]
					.innerHTML
					.split('<br>')
					.map(epure)
			}
		},
		limit: urls.length
	},
	artoo.savePrettyJson
);