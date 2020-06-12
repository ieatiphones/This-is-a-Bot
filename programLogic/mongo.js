const config = new require('../config.json');

module.exports = async function (MongoClient, DBI) {
    MongoClient.connect(config.mongodb.dbUrl, { useUnifiedTopology: true }, (err, client) => {
        if (err) return;
        console.log('Conencted to MongoDB');
    
        let mongoDB = client.db(config.mongodb.dbName);
        DBI.stat = mongoDB.collection(config.mongodb.statsDB);
        DBI.serverPrefs = mongoDB.collection(config.mongodb.serverPrefsDB);
        DBI.webPanelUsers = mongoDB.collection(config.mongodb.webPanelUsersDB);
    });
}