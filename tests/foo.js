
let cnt = 100

export let incr = () => {
    return cnt++
}


export class Incr {
    constructor(seed=0) {
        this.cnt = seed
    }
    incr() {
        return this.cnt++
    }
}