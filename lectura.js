var timer = setInterval(refresh, 30000);
var data = [];

function refresh () {
	var nickname = $('#nickname').val();
	
	steem.api.getAccounts([nickname], function(err, response){
		console.log(response);
		var balance = response[0]['balance'] + ' + ' + response[0]['sbd_balance'];
		$('#balance').html(balance);
	});

	steem.api.getOrderBook(1, function(err, response){
		var ask = response['asks'][0]['real_price'];
		var bids = response['bids'][0]['real_price'];
		var milli = (new Date).getTime();

		data.push({'a' : Math.round(ask*100000)/100000, 'b' : Math.round(bids*100000)/100000, "y" : milli});

		if(data.length > 100){
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
	labels: ['ask', 'bid'],
	lineColors: ['#F11D6C', '#9CEF29'],
	smooth: false,
	ymax: 'auto',
	ymin: 'auto',
	axes: false,
	grid: false,
	pointSize: 10

});

refresh();