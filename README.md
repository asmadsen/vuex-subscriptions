# vuex-subscriptions

Subscribe to Vuex mutations

[![npm](https://img.shields.io/npm/v/vuex-subscriptions.svg)](https://www.npmjs.com/package/vuex-subscriptions)

## Requirements

- [Vue.js](https://vuejs.org) (v2.0.0+)
- [Vuex](http://vuex.vuejs.org) (v2.0.0+)

## Installation
Using Yarn
```bash
$ yarn add vuex-subscriptions
```

Or NPM
```bash
$ npm install vuex-subscriptions
```

## Usage

```js
import addSubscriptions from 'vuex-subscriptions'

const store = new Vuex.Store({
  // ...
  plugins: [
  	addSubscriptions({
  		subscriptions: {
  			// Options...
  		}
  	})
  ]
})
```

## API

### `addSubscriptions([options])`

Creates a new instance of the plugin with the given options. The following options
**HAS TO** be provided to configure the plugin for your specific needs:

- `subscriptions <Object>`: The keys are the mutations you want to listen for(including namespaces divided my forward-slash) and the value is the a callback function witch takes the state.

## Example

If you have multiple callback functions for one mutation you just add the different functions in an array.


```js
import { Store } from 'vuex'
import addSubscriptions from 'vuex-subscriptions'

const store = new Store({
  // ...
  plugins: [
    addSubscriptions({
      subscriptions: {
      	"user/loggedIn": (state) => {
      		// fetch profile info
      	},
      	"user/loggedOut": [
      		(state) => {
      			// delete some data
      		},
      		(state) => {
      			// navigate to another route
      		}
      	]
      }
    })
  ]
})
```

## License

MIT © Andreas Storesund Madsen