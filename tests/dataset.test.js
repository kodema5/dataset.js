import {
    assert,
    assertEquals,
    describe,
    it,
} from './deps.js'

import { Dataset } from '../mod.js'

describe('data', () => {

    it ('direct access-methods', async () => {
        let ds = new Dataset()
        assertEquals(await ds.set('b.c.d.e', 1), 1)

        assertEquals(await ds.get('b.c.d.e'), 1)
        assertEquals(await ds.get('b.c.d.x', 0), 0)

        assertEquals(ds.query('$.b.c.d'), [{e:1}])
        assertEquals(ds.query('$.b.c.x', 0), 0)

        assertEquals(ds.first('$.b.c.d'), {e:1})
        assertEquals(ds.first('$.b.c.x', 0), 0)

        await ds.set('b.c.d.f', (a,b)=>a+b)
        assertEquals(ds.call('b.c.d.f', 1, 2), 3)

    })

    it('proxies properties', async () => {
        let ds = new Dataset()

        // set-get root
        ds[''] = {a:1}
        assertEquals(await ds[''], {a:1})

        // set-get field
        ds['b.c'] = {f:2}
        assertEquals(await ds['b.c'], {f:2})
        assertEquals(await ds['b.x'], undefined)

        // get-query
        assertEquals(ds['$.b.c'], [{f:2}])
        assertEquals(ds['$.b.x'], undefined)

        // get-first
        assertEquals(ds['#.b.c'], {f:2})
        assertEquals(ds['#.b.x'], undefined)

    })


    it('accesses array', async () => {
        let ds = new Dataset()
        ds['b.d'] = [1,2,3]
        assertEquals(await ds['b.d'], [1,2,3])
        assertEquals(await ds['b.d.length'], 3)
        assertEquals(await ds['b.d.1'], 2)
    })


    it('accesses imported modules', async () => {
        let ds = new Dataset()
        ds['mods.foo'] = await import('./foo.js')
        assertEquals(await ds['mods.foo.incr'], 100)
        assertEquals(await ds['mods.foo.incr'], 101)

        // to access function directly
        let fn = ds['#.mods.foo.incr']
        assertEquals(fn(), 102)

        // to access a class directly
        let Cls = ds['#.mods.foo.Incr']
        let obj = new Cls(111)
        assertEquals(obj.incr(), 111)
        assertEquals(obj.incr(), 112)
    })

})
