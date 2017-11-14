import {Store} from "vuex";

export declare interface subscription {
	(state: any): any
}

export declare interface subscriptions {
	[propName: string]: subscription | subscription[]
}

const _subscriptions: {
	[propName: string]: Array<(state: any) => any>
} = {};

const pushSubscriptions = (state: Store<any>, subscriptions: Array<(state: any) => any>) => {
	subscriptions.forEach(subscription => subscription(state))
};

export default function addSubscriptions({
											 subscriptions = <subscriptions>{},
											 subscriber = store => handler => store.subscribe(handler)
										 } = {}) {
	Object.entries(subscriptions).reduce((prev, [key, value]) => {
		if (!Array.isArray(value)) {
			value = [value]
		}
		if (!prev.hasOwnProperty(key)) {
			_subscriptions[key] = []
		}
		_subscriptions[key] = _subscriptions[key].concat(value)
		return _subscriptions
	}, _subscriptions)

	return store => {
		subscriber(store)((mutation, state) => {
			if (_subscriptions.hasOwnProperty(mutation.type)) {
				pushSubscriptions(state, _subscriptions[mutation.type]);
			}
		});
	}

}