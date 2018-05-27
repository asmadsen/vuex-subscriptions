import {ModuleTree, Store} from "vuex";
import {Vue} from 'vue/types/vue'

declare module 'vuex/types/index' {
	interface Module<S, R> {
		subscriptions? : subscriptions
	}
}

export interface subscription {
	(store: Store<any>): any
}

export interface subscriptions {
	[propName: string]: subscription | subscription[]
}


export default function addSubscriptions({
											 modules = <ModuleTree<any>>{},
											 subscriptions = <subscriptions>{},
											 subscriber = store => handler => store.subscribe(handler)
										 }) {
	let _subscriptions: {
		[propName: string]: Array<(store: Store<any>) => any>
	} = {};

	const pushSubscriptions = (store: Store<any> , subscriptions: Array<subscription>) => {
		subscriptions.forEach(subscription => subscription(store))
	};

	if (modules) {
		subscriptions = Object.entries(modules).reduce((prev, [key, _module]) => {
			if (_module.hasOwnProperty('subscriptions')) {
				prev = Object.entries(_module.subscriptions).reduce((result, [sub, value]) => {
					sub = _module.namespaced ? key + '/' + sub : sub
					result[sub] = value
					return result
				}, prev)
			}
			return prev
		}, subscriptions)
	}
	_subscriptions = Object.entries(subscriptions).reduce((prev, [key, value]) => {
		if (!Array.isArray(value)) {
			value = [value]
		}
		if (!prev.hasOwnProperty(key)) {
			prev[key] = []
		}
		prev[key] = prev[key].concat(value)
		return prev
	}, _subscriptions)

	return store => {
		subscriber(store)((mutation) => {
			if (_subscriptions.hasOwnProperty(mutation.type)) {
				pushSubscriptions(store, _subscriptions[mutation.type]);
			}
		});
	}

}