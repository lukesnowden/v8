
/*!
* 	V8 - Event Frequency API
* 	https://github.com/lukesnowden/v8
* 	http://luke.sno.wden.co.uk/v8
* 	Copyright 2014 Luke Snowden
* 	Released under the MIT license:
* 	http://www.opensource.org/licenses/mit-license.php
*/

;( function ( $ ) {

	$.fn.v8 = function (opts)
	{
		var opts = $.extend({

			maxFrequency : 10,

			milliseconds : 1000,

			updateFrequency : 100,

			keyBind : [],

			preventClickAndTouch : false

		}, opts);

		var touchDevice = 'touchstart' in window;

		var touchstart = touchDevice ? 'touchstart' : 'mousedown';

		var touchend = touchDevice ? 'touchend' : 'mouseup';

		var listener = function( _elm, _namespace, _callback ) {
		    var touching = false;
		    var count = 0;
		    function bind( namespace, callback ) {
		        _elm.on( touchstart + '.' + namespace, function(e){
		            if( ! touching ) {
		                touching = true;
		                count++;
		                callback( count );
		                _elm.off( touchstart + '.' + namespace ).on( touchend + '.' + namespace, function(e){
		                    touching = false;
		                    _elm.off( touchend + '.' + namespace );
		                    bind( namespace, callback );
		                });
		            } else {
		                e.preventDefault();
		                return false;
		            }
		        });
		    }
		    bind( _namespace, _callback );
		};

		/**
		 * [init description]
		 * @param  {[type]} elm [description]
		 * @return {[type]}     [description]
		 */

		var init = function( elm ) {

			var that = elm;

			var obj = $( that );

			var timeTotal = 0;

			var clickTimes = [];

			var spark = null;

			var highest = 0;

			var peaks = 0;

			var numberOfMilliseconds = opts.milliseconds;

			var start = function() {

				var currentTime = ( new Date() ).getTime();

				timeTotal += currentTime;

				clickTimes.push( currentTime );

				if( spark === null ) {

					spark = setInterval( function() {

						if( numberOfMilliseconds === opts.milliseconds && clickTimes.length === 0 ) {

							clearInterval( spark );
							spark = null;
							timeTotal = 0;
							peaks = 0;
							highest = 0;
							clickTimes = [];

						} else {

							var currentTime = ( new Date() ).getTime();

							while( clickTimes.length && ( currentTime - clickTimes[0] > opts.milliseconds ) ) {
								timeTotal -= clickTimes.shift();
							}

							if ( clickTimes.length > 0 ) {
								numberOfMilliseconds = clickTimes[clickTimes.length - 1] - clickTimes[0];
							} else {
								numberOfMilliseconds = opts.milliseconds;
							}

							var ev = $.Event( 'tick.v8' );
							ev.milliseconds = numberOfMilliseconds;
							ev.clickCount = clickTimes.length;
							ev.updateFrequency = opts.updateFrequency;
							ev.targetPercentage = Number( ( clickTimes.length * 100 / opts.maxFrequency ).toFixed(0) );

							if( ev.targetPercentage > 100 ) {
								ev.targetPercentage = 100;
							}
							if( ev.targetPercentage > highest ) {
								highest = ev.targetPercentage;
							}
							if( ev.targetPercentage == 100 ) {
								peaks++;
							} else {
								peaks = 0;
							}

							ev.peaks = peaks;
							ev.highestPercentage = highest;
							obj.trigger( ev );

						}

					}, opts.updateFrequency );

				}

			}

			if( ! opts.preventClickAndTouch ) {
				new listener( obj, 'v8', start );
			}

			if( opts.keyBind.length !== 0 ) {
				obj.keyup( function( e ) {
					if( $.inArray( e.which, opts.keyBind ) !== -1 ) {
						start();
					}
				});
			}

		};

		/**
		 * [description]
		 * @param  {[type]} i [description]
		 * @return {[type]}   [description]
		 */

		return $(this).each( function ( i ) {
			init( this );
		});

	};

})( jQuery );