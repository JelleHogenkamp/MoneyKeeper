// Import database connection
import * as db from './../websql/database.js';


// Add log data to table
export function addLogData(name, action, value) {
    var datetime = new Date().toLocaleString();

    db.connect.transaction(function (tx) {
        tx.executeSql('INSERT INTO Logs (datetime, name, action, value) VALUES ("' + datetime + '", "' + name + '",  "' + action + '", ' + value + ')');
    });
    return;
}

// get log data from table
export function getLogAction() {
    return new Promise((resolve, reject) => {
        var result = [];
        db.connect.transaction(function (tx) {
            tx.executeSql('SELECT * FROM Log_action ORDER BY rowid DESC', [], function (tx, rs) {
                if (rs.rows.length > 0) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        result.push(rs.rows.item(i));
                    }
                    resolve(result);
                } else {
                    reject(false);
                }
            }, null);
        });
    });
}

// get log data from table
export function getLogData() {
    return new Promise((resolve, reject) => {
        var result = [];
        db.connect.transaction(function (tx) {
            tx.executeSql('SELECT * FROM Logs ORDER BY rowid DESC', [], function (tx, rs) {
                if (rs.rows.length > 0) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        result.push(rs.rows.item(i));
                    }
                    resolve(result);
                } else {
                    reject(false);
                }
            }, null);
        });
    });
}
