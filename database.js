const db = require('quick.db');

module.exports = {
    get: (site, key) => {
        return new Promise(async (resolve, reject) => {
            try {
                let table;
                switch (site) {
                    case 'komikindo':
                        table = new db.table('komikindo');
                        break;

                    case 'otakudesu':
                        table = new db.table('otakudesu');
                        break;
                }

                const is = table.get(key);
                if (!is) return resolve(null);

                resolve(is);
            } catch (err) {
                reject(err);
            }
        });
    },

    set: (site, key, data) => {
        return new Promise((resolve, reject) => {
            try {
                let table;
                switch (site) {
                    case 'komikindo':
                        table = new db.table('komikindo');
                        //typeof if data is array
                        if (!Array.isArray(data)) return reject('data must be array');
                        break;
                    case 'otakudesu':
                        table = new db.table('otakudesu');
                        break;
                }

                if (typeof data !== 'object') return reject({ success: false, message: 'Data must be an object' });
                table.set(key, data);

                resolve({ success: true, data });
            } catch (err) {
                reject(err);
            }
        });
    }
}
