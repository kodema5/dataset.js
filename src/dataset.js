import { data_get, data_set, data_query, is_function } from "./util.js";


export class Dataset {

    constructor(seed = {}) {
        this._data = seed

        return new Proxy(this, {
            set(me, prop, value) {
                // if internal
                if (!prop || prop === '_data') {
                    me._data = value
                    return me._data
                }

                // set _data
                return me.set(prop, value)
            },

            get(me, prop, scope) {
                // if internal
                if (!prop || prop === '_data') {
                    return me._data
                }

                // if method
                let a = me[prop]
                if (is_function(a)) {
                    return function(...args) {
                        return a.apply(this === scope ? me : this, args)
                    }
                }

                // if $query
                if (prop.indexOf('$.') === 0 && !('$' in me._data)) {
                    return me.query(prop)
                }

                // if #first
                if (prop.indexOf('#.') === 0 && !('#' in me._data)) {
                    return me.first(prop.replace('#.', '$.'))
                }

                // get from _data
                return me.get(prop)
            },
        })
    }

    async set(path, value) {
        return await Dataset.set(this._data, path, value)
    }

    async get(path, alt) {
        return await Dataset.get(this._data, path, alt)
    }

    async query(path, alt) {
        return await Dataset.query(this._data, path, alt)
    }

    async first(path, alt) {
        let arr = await Dataset.query(this._data, path, [])
        return arr.length === 0 ? alt : arr[0]
    }

    static set = data_set
    static get = data_get
    static query = data_query
}