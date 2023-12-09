import jsonPath from './jsonpath.js'

export let is_function = (a) => typeof a === 'function'

export let is_object = (a) => a !== null
    && a instanceof Object
    && a.constructor === Object

export let is_empty = (a) => (a==null)
    || (a==='')
    || (Array.isArray(a) && a.length===0)


export let data_set = async (root, path, value) => {
    let keys = path.split('.')
    let lastKey = keys.pop()

    var r = root || {}
    keys.forEach(k => {
        if (!(k in r)) r[k] = {}
        r = r[k]
    })

    if (is_function(r[lastKey])) {
        return await r[lastKey].call(r, value)
    }

    r[lastKey] = value
    return r[lastKey]
}

export let data_get = async (root, path, defaultValue) => {
    let keys = path.split('.')

    let r = root || {}
    let p
    for (let k of keys) {
        if (!(k in r)) return defaultValue
        p = r
        r = r[k]
    }

    if (is_function(r)) {
        return await r.call(p)
    }

    return r
}


export let data_query = (root, path, defaultValue) => {
    let rs = jsonPath(root, path)
    return rs === false
        ? defaultValue
        : rs
}