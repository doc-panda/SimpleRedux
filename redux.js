//最简单的redux
export function combineReducers (reducers) {
	const reducerKeys = Object.keys(reducers);
	return function combination(state = {}, action) {
		const nextState = {}
		for (let i = 0; i < reducerKeys.length; i++) {
			const key = reducerKeys[i];
			const reducer = reducers[key]
			const previousStateForKey = state[key]
			const nextStateForKey = reducer(previousStateForKey, action)
			nextState[key] = nextStateForKey;
		}
		return nextState;
	}
}

export function createStore (reducer, middleware) {
	let state
	const subscribers = []
	const coreDispatch = ( action ) => {
		state = reducer(state, action)
		subscribers.forEach(handler => handler())
	}
	const getState = () => state
	const store = {
		dispatch: coreDispatch,
		getState,
		subscribe: ( handler ) => {
			subscribers.push(handler)
			return () => {
				const index = subscribers.indexOf(handler)
				if (index > 0) {
					subscribers.splice(index, 1)
				}
			}
		}
	}
	if (middleware) {
		const dispatch = action => store.dispatch(action)
		store.dispatch = middleware({
			dispatch,
			getState
		})(coreDispatch)
	}
	coreDispatch({})
	return store
}

export function applyMiddleware (...middlewares) {
	return (store) => {
		if (middlewares.length === 0) {
			return dispatch => dispatch
		}
		if (middlewares.length === 1) {
			return middlewares[0]
		}
		const boundMiddlewares = middlewares.map(middleware =>
			middleware(store)
		)
		return boundMiddlewares.reduce((a, b) =>
			next => a(b(next))
		)
	}
}
