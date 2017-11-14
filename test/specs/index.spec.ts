import Vue from "vue"
import Vuex from "vuex"
import addSubscriptions from "./../../src"
import {expect} from "chai";

Vue.use(Vuex);

describe("Subscription", () => {

	it("subscribed method gets run", () => {
		const store = new Vuex.Store({
			plugins:   [
				addSubscriptions({
					subscriptions: {
						changeProperty: (state) => {
							store.commit("setDone", true);
						}
					}
				})
			],
			state:     {
				property: "value",
				done:     false
			},
			mutations: {
				changeProperty(state, payload) {
					state.property = payload;
				},
				setDone(state, payload) {
					state.property = "changed again";
					state.done     = payload;
				}
			}
		})
		store.commit("changeProperty", "changed");
		expect(store.state.property).to.equal("changed again")
	})

	it('multiple subscription for one mutation', () => {
		const store = new Vuex.Store({
			plugins: [
				addSubscriptions({
					subscriptions: {
						changeProperty: [
							(state) => {
								store.commit('updateFirst', true)
							},
							(state) => {
								store.commit('updateSecond', true)
							}
						]
					}
				})
			],
			state: {
				property: "value",
				first: false,
				second: false
			},
			mutations: {
				changeProperty(state, payload) {
					state.property = payload
				},
				updateFirst(state, payload) {
					state.first = payload
				},
				updateSecond(state, payload) {
					state.second = payload
				}
			}
		})
		store.commit("changeProperty", "first change")
		expect(store.state.first).to.equal(true)
		expect(store.state.second).to.equal(true)
	})
})