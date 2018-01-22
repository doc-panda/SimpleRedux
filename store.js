//这个store就是个参考，reducer和action与原版redux没有区别
import { createStore, applyMiddleware } from './lib/redux-ft/redux'
import { reducer } from './reducer/index'

const loggingMiddleware = ({ getState }) => next => action => {
	console.info('before', getState())
	console.info('action', action)
	const result = next(action)
	console.info('after', getState())
	return result
}

const thunkMiddleware = ({ dispatch, getState }) => next => action => {
	if (typeof action === 'function') {
		return action({dispatch, getState})
	}
	return next(action)
}

const bundelMiddelware = applyMiddleware(
	thunkMiddleware,
	loggingMiddleware
)

export const store = createStore(reducer, bundelMiddelware)