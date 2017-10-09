import {Store} from "vuex";

export declare interface subscriptions {
	[propName: string]: (state: any) => any|Array<(state: any) => any>
}

const _subscriptions : {
	[propName: string]: Array<(state: any) => any>
} = {};

const pushSubscriptions = (state : Store<any>, subscriptions : Array<(state: any) => any>) => {
	subscriptions.forEach(subscription => subscription(state))
};

export default function addSubscriptions({
	subscriptions = <subscriptions>{},
	subscriber = store => handler => store.subscribe(handler)
										 } = {}) {
	for (let sub in subscriptions) {
		if (_subscriptions[sub] !== undefined) {
			_subscriptions[sub] = <Array<(state: any) => any>>[]
		}
		_subscriptions[sub].push(subscriptions[sub]);
	}
	return store => {
		subscriber(store)((mutation, state) => {
			if (_subscriptions.hasOwnProperty(mutation)) {
				pushSubscriptions(state, _subscriptions[mutation]);
			}
		});
	}

}