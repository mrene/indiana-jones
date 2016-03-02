var fs = require('fs');

function someFunction(someValue) {
	if (someValue % 2 === 0) {
		console.log('foo');
	} else {
		console.log('bar');
	}


	switch(someValue) {
		case 0:
		case 20:
		console.log('nope');
		break;

		case 11:
		try {
			console.log('maybe', 1234 / 0);

			throw new Error(':)');
		} catch(e) {
			void 0;
			console.log('e', e);
		}
		break;

		case 42:
		fs.readFile('./nonexistant', (err, data) => {
			if (err) {
				return 10;
			}

			console.log('Data:', data);
		});
	}
}

someFunction(42);
someFunction(11);
