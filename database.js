const fs = require("fs");

const dbFile = ".chat.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const dbWrapper = require("sqlite");
dbWrapper
 .open({
    filename : dbFile,
    driver: sqlite3.Database
 })
 .then(async dBase => {
    db = dBase;
 try{
    if (!exists) {
        await db.run(
            `CREATE TABLE user(
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                login TEXT,
                password TEXT
            );`
        );
        await db.run(
            `Insert INTO user (login, password) VALUES
            ('admin', 'admin'),
            ('JavaScript', 'banana'),
            ('user1', 'password');`                       
         );
         await db.run(
            `CREATE TABLE message(
                msg_id INTEGET PRIMARY KEY AUTOINCREMENT,
                content TEXT,
                autor INTENGER,
                FOREIGN KEY(autor) REFERENCES user(user_id)
            );`
         );
    } else {
        console.log(await db.all("SELECT * from user"));
    }
 } catch (dbError) {
    console.error(dbError);
 }
 });
module.exports = {
    getMessages: async () => {
        try {
            return await db.all(
                `SELECT msg_id, content, login, user_id from message
                JOIN user ON message.autor = user.user_id`
            );
        } catch (dbError) {
            console.error(dbError);
        }
    },
    addMessage: async (msg, userId) => {
        await db.run(
            `INSERT INTO message (content, autor) VALUES (?,?)`,
            [msg, userId]
        );
    }
};