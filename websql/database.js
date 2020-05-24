// Export database connection
export var connect = prepareDatabase();

// Check if this browser supports Web SQL
function getOpenDatabase() {
    try {
        if (!!window.openDatabase) {
            return window.openDatabase;
        } else {
            return undefined;
        }
    } catch (e) {
        return undefined;
    }
}

// Open the Web SQL database
function prepareDatabase() {
    var odb = getOpenDatabase();
    if (!odb) {
        // Browser does not support Web SQL
        alert('Web SQL Not Supported');
        window.history.back();
    } else {
        // Create new database
        var db = openDatabase('MoneyKeeper', '1.0', 'MoneyKeeper DB', 5 * 1024 * 1024);
        db.transaction(function (tx) {
            // Create users table
            tx.executeSql('CREATE TABLE IF NOT EXISTS Users (' +
                'id INTEGER PRIMARY KEY, ' +
                'name TEXT, ' +
                'password TEXT, ' +
                'money_total FLOAT, ' +
                'beer_total INTEGER, ' +
                'times_present INTEGER)');
            
            // Create Logs table
            tx.executeSql('CREATE TABLE IF NOT EXISTS Logs (' +
                'datetime TEXT, ' +
                'name TEXT, ' +
                'action INTEGER, ' +
                'value INTEGER)');
            
            // Create Log_action table
            tx.executeSql('CREATE TABLE IF NOT EXISTS Log_action(' +
                'id INTEGER UNIQUE, ' +
                'action TEXT)');
            
            // Insert default values into Log_action
            tx.executeSql('INSERT OR IGNORE INTO Log_action (id, action)' +
                          'VALUES (1, "Gebruiker toegevoegd"), (2, "Geld toegevoegd"), (3, "Bier gepakt"),  (4, "Avond aanwezig")');
        });
        return db;
    }
}
