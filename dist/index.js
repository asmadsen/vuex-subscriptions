"use strict";
exports.__esModule = true;
var _subscriptions = {};
var pushSubscriptions = function (state, subscriptions) {
    subscriptions.forEach(function (subscription) { return subscription(state); });
};
function addSubscriptions(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.subscriptions, subscriptions = _c === void 0 ? {} : _c, _d = _b.subscriber, subscriber = _d === void 0 ? function (store) { return function (handler) { return store.subscribe(handler); }; } : _d;
    for (var sub in subscriptions) {
        if (_subscriptions[sub] === undefined) {
            _subscriptions[sub] = [];
        }
        _subscriptions[sub].push(subscriptions[sub]);
    }
    return function (store) {
        subscriber(store)(function (mutation, state) {
            if (_subscriptions.hasOwnProperty(mutation)) {
                pushSubscriptions(state, _subscriptions[mutation]);
            }
        });
    };
}
exports["default"] = addSubscriptions;
