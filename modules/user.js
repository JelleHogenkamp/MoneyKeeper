// Import database connection
import * as db from './../websql/database.js';


// Add user to database
export function addUser(name, password, money) {
    var beerLeft = money * 2;

    db.connect.transaction(function (tx) {
        tx.executeSql('INSERT INTO Users (name, password, money_total, beer_total, times_present) VALUES ("' + name + '", "' + password + '", ' + money + ', ' + '0' + ', ' + '1)');
    });
    return;
}

// Select all users from database
export function SelectAllUsers() {
    return new Promise((resolve, reject) => {
        var result = [];
        db.connect.transaction(function (tx) {
            tx.executeSql('SELECT * FROM Users', [], function (tx, rs) {
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

export function selectUserById(id) {
    return new Promise((resolve, reject) => {
        db.connect.transaction(function (tx) {
            tx.executeSql('SELECT * FROM Users WHERE id = ' + id, [], function (tx, rs) {
                if (rs.rows.length > 0) {
                    resolve(rs.rows.item(0));
                } else {
                    reject(false);
                }
            }, null);
        });
    });
}

export function selectUserByIdPassword(id, password) {
    return new Promise((resolve, reject) => {
        db.connect.transaction(function (tx) {
            tx.executeSql('SELECT * FROM Users WHERE id = ' + id + " AND password = " + password, [], function (tx, rs) {
                if (rs.rows.length > 0) {
                    resolve(rs.rows.item(0));
                } else {
                    reject(false);
                }
            }, null);
        });
    });
}

export function selectUserByNamePassword(name, password) {
    db.connect.transaction(function (tx) {
        tx.executeSql('SELECT * FROM Users WHERE name LIKE "' + name + '" AND password = ' + password, [], function (tx, rs) {
            if (rs.rows.length > 0) {
                return rs.rows.item(0);
            } else {
                return false;
            }
        }, null);
    });
}

export function userPresent(id) {
    db.connect.transaction(function (tx) {
        tx.executeSql('UPDATE Users SET times_present = times_present + 1 WHERE id = ' + id, [], function (tx, rs) {
        }, null);
    });
}

export function addMoneyToUser(id, amount) {
    db.connect.transaction(function (tx) {
        tx.executeSql('UPDATE Users SET money_total = money_total + ' + amount + ' WHERE id = ' + id, [], function (tx, rs) {
        }, null);
    });
}

export function takeBeer(id) {
    db.connect.transaction(function (tx) {
        tx.executeSql('UPDATE Users SET beer_total = beer_total + 1 WHERE id = ' + id, [], function (tx, rs) {
        }, null);
    });
}
