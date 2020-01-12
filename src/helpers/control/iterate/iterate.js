(function(root, factory) {
	if (typeof define === 'function' && define.amd && define.amd.dust === true) {
		define(['dust.core'], factory);
	} else if (typeof module === 'object') {
		module.exports = factory(require('dustjs-linkedin'));
		module.exports.registerWith = factory;
	} else {
		factory(root.dust);
	}
}(this, function (dust) {

	/* eslint max-depth: ["error", 6]*/
	dust.helpers.iterate = function (chunk, context, bodies, params) {
		var body = bodies.block,
			sort,
			arr,
			i,
			k,
			obj,
			compareFn;

		params = params || {};

		function desc(a, b) {
			if (a < b) {
				return 1;
			} else if (a > b) {
				return -1;
			}
			return 0;
		}

		function processBody(key, value) {
			return body(chunk, context.push({
				$key: key,
				$value: value,
				$type: typeof value
			}));
		}

		if (params.key) {
			obj = dust.helpers.tap(params.key, chunk, context);

			if (body) {
				if ( !! params.sort) {
					sort = dust.helpers.tap(params.sort, chunk, context);
					arr = [];
					for (k in obj) {
						if (obj.hasOwnProperty(k)) {
							arr.push(k);
						}
					}
					compareFn = context.global[sort];
					if (!compareFn && sort === 'desc') {
						compareFn = desc;
					}
					if (compareFn) {
						arr.sort(compareFn);
					} else {
						arr.sort();
					}
					for (i = 0; i < arr.length; i++) {
						chunk = processBody(arr[i], obj[arr[i]]);
					}
				} else {
					for (k in obj) {
						if (obj.hasOwnProperty(k)) {
							chunk = processBody(k, obj[k]);
						}
					}
				}
			} else {
				console.log('Missing body block in the iter helper.');
			}
		} else {
			console.log('Missing parameter \'key\' in the iter helper.');
		}
		return chunk;

	};
	return dust;
}));
