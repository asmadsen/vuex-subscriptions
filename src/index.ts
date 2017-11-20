import {ModuleTree, Store} from "vuex";
import {Vue} from 'vue/types/vue'

declare module 'vuex/types/index' {
	interface Module<S, R> {
		subscriptions? : subscriptions
	}
}

export interface subscription {
	(state: any, store: Store<any>): any
}

export interface subscriptions {
	[propName: string]: subscription | subscription[]
}

let _subscriptions: {
	[propName: string]: Array<(state: any, store?: Store<any>) => any>
} = {};

const pushSubscriptions = (state: any, store: Store<any> , subscriptions: Array<subscription>) => {
	subscriptions.forEach(subscription => subscription(state, store))
};

export default function addSubscriptions({
											 modules = <ModuleTree<any>>{},
											 subscriptions = <subscriptions>{},
											 subscriber = store => handler => store.subscribe(handler)
										 } = {}) {
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
		subscriber(store)((mutation, state) => {
			if (_subscriptions.hasOwnProperty(mutation.type)) {
				pushSubscriptions(state, store, _subscriptions[mutation.type]);
			}
		});
	}

}