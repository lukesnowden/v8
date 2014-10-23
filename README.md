#v8 - EVENT FREQUENCY API

more information http://luke.sno.wden.co.uk/v8

###initiate the plugin:

```javascript
$(window).on( 'tick.v8', function(e) {
	console.log(e);
})
.v8({
	updateFrequency 		: 100,
	maxFrequency 			: 20,
	milliseconds 			: 1000,
	keyBind 				: [90,88],
	preventClickAndTouch 	: true
});
```