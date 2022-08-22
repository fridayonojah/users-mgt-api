const dotenv = require('dotenv');
dotenv.config();
const mysql2 = require('mysql2');

class DbConnection{
    constructor(){
        this.db = mysql2.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            connectionLimit: 100
        });

        this.checkConnection();
    }

    // set connnection settings
    checkConnection(){
        this.db.getConnection((err, connection) => {
            if(err){
                if(err.code === 'PROTOCOL_CONNECTION_LOST'){
                    console.error('Datebase connection was closed.');
                }
                if(err.code === 'ER_CON_COUNT_ERROR'){
                    console.log('Database has too many connections');
                }
                if(err.code === 'ECONNREFUSED'){
                    console.log('Database connection was refused');
                }
            }
            if(connection){
                connection.release();
            }
            return;
        });
    }

    query = async (sql, values) => {
        return new Promise((resolve, reject) => {
            const callback = (error, result) => {
                if(error){
                    reject(error);
                    return;
                }
                resolve(result);
            }
            // This execult function will internal call prepare and query
            this.db.execute(sql, values, callback);
        }).catch(err => {
            const mysqlErrorList = Object.keys(HttpStatusCodes);
            // comvert mysql errors in the mysqlErrorList
            err.status = mysqlErrorList.includes(err.code) ? HttpStatusCodes[err.code] : err.status;
            
            throw err;
        });
    }
    
}

const HttpStatusCodes = Object.freeze({
    ER_TRUNCATED_WRONG_VALUE_FIELD: 422,
    ER_DUP_ENTRY: 409
});

// export the database class and also init the class
module.exports = new DbConnection().query;