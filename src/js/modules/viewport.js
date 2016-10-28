var width = 0,
	height = 0,
	prevWidth,
	prevHeight,
	listeners = {},
	timer = null,
	variables = require('json!../../variables.json'),
	breakpoints = {},
	update = function(){

		prevWidth = width;
		prevHeight = height;

		width = window.innerWidth;
		height = window.innerHeight;

		$.each(listeners, function(){
			this(prevWidth !== width, prevHeight !== height);
		});

	};

$(window).on('resize', function(){

	clearTimeout(timer);
	timer = setTimeout(update, 300);

});

update();

Object.keys(variables.breakpoints).forEach(function(name){
	var value = variables.breakpoints[name];

	if( variables['media-query-units'] === 'em' ){
		value /= variables['browser-default-font-size'] || 16;
	}

	breakpoints[name] = value;
});

module.exports = {
	width: function(){
		return width;
	},
	height: function(){
		return height;
	},
	addListener: function(name, listener){
		listeners[name] = listener;
	},
	removeListener: function(name){
		delete listeners[name];
	},
	mq: function(name, max){
		var
			value = breakpoints[name],
			ems = variables['media-query-units'] === 'em';

		if( !value ){
			console.warn('Unknown breakpoint name');
			return false;
		}

		if( max ){
			value -= ems ? 0.01 : 1;
		}

		return Modernizr.mq([
			'only screen and (',
			(max ? 'max' : 'min'),
			'-width: ',
			value,
			ems ? 'em' : 'px',
			')',
		].join(''));
	},
};
