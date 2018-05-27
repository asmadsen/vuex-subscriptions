import Vue from "vue"
import Vuex from "vuex"
import addSubscriptions from "./../../src"
import {expect} from "chai";

Vue.config.productionTip = false
Vue.config.devtools = false


describe("Subscription", () => {

	it("subscribed method gets run", () => {
		Vue.use(Vuex);
		const store = new Vuex.Store({
			plugins:   [
				addSubscriptions({
					subscriptions: {
						changeProperty: ({state, commit}) => {
							commit("setDone", true);
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
		Vue.use(Vuex);
		const store = new Vuex.Store({
			plugins: [
				addSubscriptions({
					subscriptions: {
						changeProperty: [
							({commit}) => {
								commit('updateFirst', true)
							},
							({commit}) => {
								commit('updateSecond', true)
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

	it('multiple subscription inside modules', () => {
		Vue.use(Vuex);
		const modules = {
			user: {
				namespaced: true,
				subscriptions: {
					changeProperty({commit}) {
						commit('user/changeFirst', true)
					}
				},
				state: {
					property: "value",
					first: false
				},
				mutations: {
					changeProperty(state, payload) {
						state.property = payload
					},
					changeFirst(state, payload) {
						state.first = payload
					}
				}
			}
		}
		const store = new Vuex.Store({
			plugins: [
				addSubscriptions({
					modules
				})
			],
			state: <any>{},
			modules
		})
		store.commit("user/changeProperty", "first change")
		expect(store.state.user.first).to.equal(true)
	})
})