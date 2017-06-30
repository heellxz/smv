var timer = setInterval(refresh, 10000);
var data = [];

function refresh () {
	var nickname = $('#nickname').val();

steem.api.getAccountHistory(nickname, -1, 100, function(err, result) {
	var historial = '';
	var counter = 0;
	for (i = result.length - 1; i > 0; i--) { 
		var operation = result[i][1]['op'];
		if(operation[0] == 'fill_order' && counter < 10){
			if(operation[1]['current_pays'].search('SBD') > 0){
				current_pays = operation[1]['current_pays'].replace(' SBD','');
				open_pays = operation[1]['open_pays'].replace(' STEEM','');
				historial += 'BUY ' + open_pays + ' STEEM @ ' + Math.round(current_pays*10000000/open_pays)/10000000 + ' (STEEM/SBD)<br>';				
			}
				else{
				current_pays = operation[1]['current_pays'].replace(' STEEM','');
				open_pays = operation[1]['open_pays'].replace(' SBD','');
				historial += 'SELL ' + open_pays + ' STEEM @ ' + Math.round(open_pays*10000000/current_pays)/10000000 + ' (STEEM/SBD)<br>';		
			}
		counter++;
		}
	}
	if(historial.length > 0){
		$('#last').html(historial);
	}
	else{
		$('#last').html('START TRADING BRO !');
	}
	
});
	
	steem.api.getAccounts([nickname], function(err, response){
		var balance = response[0]['balance'] + ' + ' + response[0]['sbd_balance'];
		$('#balance').html(balance);
	});

	steem.api.getOrderBook(1, function(err, response){
		var ask = response['asks'][0]['real_price'];
		var bids = response['bids'][0]['real_price'];
		var milli = (new Date).getTime();

		data.push({'a' : ask, 'b' : bids, "y" : milli});

		if(data.length > 50){
			data.shift();
		};

		grafo.setData(data);
	});
};

var grafo = Morris.Line({
	element: 'grafo',
	xkey: 'y',
	hideHover: false,
	xlabels: "second",
	ykeys: ['a', 'b'],
	labels: ['Lowest ask', 'Highest bid'],
	lineColors: ['#F11D6C', '#00C176'],
	ymax: 'auto',
	ymin: 'auto',
	axes: false,
	grid: false,
	pointSize: 6,
	lineWidth: 2


});

refresh();