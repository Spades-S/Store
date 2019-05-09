const Store = require('../lib/index.js').default;

function reducer(preState, action) {
	switch (action.type) {
		case 'INC':
			preState.count++;
			break;
		case 'DEC':
			preState.count--;
			break;
		default:
			break;
	}
}

const store = new Store(
	{
		count: 0,
	},
	reducer,
);

function watcher() {
	console.log('count listener....');
}
const toDelete = store.subscribe(store.state, 'count', () => {
	console.log('toDelete...');
});
store.subscribe(store.state, 'count', watcher);

store.dispatch({ type: 'INC' });

store.unsubscribe(store.state, 'count', toDelete);

store.dispatch({ type: 'DEC' });
