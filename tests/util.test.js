import {
    assertEquals,
    describe,
    it,
} from './deps.js'

import {
    data_set,
    data_get,
    data_query,
} from '../mod.js'

describe('util', () => {

    it ('sets value', async () => {
        let a = {}
        assertEquals(await data_set(a, 'b.c.d.e', 1), 1)
        assertEquals(a.b.c.d.e, 1)
    })


    it ('calls set function', async () => {
        let a = {}
        data_set(a, 'b.f', function(v) {
            this._f = v;
            return new Promise((ok) => setTimeout(() => ok(v + 10), 1))
        })
        assertEquals(await data_set(a, 'b.f', 123), 133)
        assertEquals(a.b._f, 123)
    })


    it ('gets value', async () => {
        let a = {}
        await data_set(a, 'b.c.d.e', 1), 1
        assertEquals(await data_get(a, 'b.c.d.e'), 1)

        // returns default value
        assertEquals(await data_get(a, 'foo', 1), 1)
    })


    it ('calls get function', async () => {
        let a = {
            b: {
                _f: 123,
                f: function() {
                    let me = this
                    return new Promise((ok) => setTimeout(() => ok(me._f + 10), 1))
                }
            },
        }
        assertEquals(await data_get(a, 'b.f'), 133)
    })


    it ('queries value', async () => {
        let a = {b:[{c:1}, {c:2}]}
        assertEquals(await data_query(a, '$..c'), [1,2])

        // returns default value
        assertEquals(await data_query(a, '$.x', 111), 111)
    })


    it ('does not call queried function', async () => {
        let a = {b:{
            _f: 123,
            f: function() {
                let me = this
                return new Promise((ok) => setTimeout(() => ok(me._f + 10), 1))
            }
        }}
        assertEquals(await data_query(a, '$.b.f'), [a.b.f])
    })


})