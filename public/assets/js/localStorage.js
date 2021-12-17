/* Local Storage */
const storage = window.localStorage;
const db = {
    get: function (key) {
        return JSON.parse(storage.getItem(key));
    },
    set: function (key, value) {
        storage.setItem(key, JSON.stringify(value));
    },
    remove: function (key) {
        storage.removeItem(key);
    }
}

module.exports = db;