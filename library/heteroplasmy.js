'use strict';

module.exports = (file) => {
    return require('fs')
        .readFileSync(file, 'utf-8')
        .split('\n')
        .filter(row => { return row.split('\t').length > 9 })
        .map(row => {
            row = row.split('\t');
            return { position: parseInt(row[3]), sequence: row[9].split('') }
        })
        .reduce((heteroplasmyMap, read) => {
            read.sequence.forEach((n, i) => {
                i += read.position;
                if (!heteroplasmyMap[i]) heteroplasmyMap[i] = (new Array(7)).fill(0);
                heteroplasmyMap[i]['ATGCN-U'.indexOf(n.match(/[ATGCN-]/i) || 'U')]++;
            });
            return heteroplasmyMap;
        }, [[0]])
        .map(p => { return Math.max(...p)/p.reduce((a, b) => { return a + b }) });
};