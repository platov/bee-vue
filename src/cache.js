class Cache {
    constructor() {
        this._cache = {};
    }

    set(id, data) {
        this._cache[id] = data;
    }

    get(id) {
        return this._cache[id];
    }
}

export default new Cache();