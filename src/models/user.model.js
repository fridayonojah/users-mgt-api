const query = require("../db/db");
const { multipleColumeSet } = require('../utils/common.utils'); 
const Role = require('../utils/userRole.utils');


class UserModel {
    tblName = 'user';

    find = async (params = {}) => {
        let sql = `SELECT * FROM ${this.tblName} ORDER BY id DESC`;

        //check for the length of the params
        if(!Object.keys(params).length){
            return await query(sql);
        }

        const { setColumn, values } = multipleColumeSet(params);
        sql += `WHERE ${setColumn}`;

        return await query(sql, [...values]);
    };

    findOne = async(params) => {
        const { setColumn, values } = multipleColumeSet(params);

        const sql = `SELECT * FROM ${this.tblName} WHERE ${setColumn} ORDER BY id DESC`;

        const result = await query(sql, [...values]);

        // get the first row from from tbl(user)
        return result[0];
    };

    create = async ({ username, password, firstname, lastname, email, role = Role.SuperUser, age = 0 }) => {
        const sql = `INSERT INTO ${this.tblName} 
        (username, password, firstname, lastname, email, role, age) VALUES(?,?,?,?,?,?,?)`;

        const result = await query(sql, [username, password, firstname, lastname, email, role, age]);
        // const afftectedRows = result ? result.afftectedRows : 0;

        //return the affected rows
        // return afftectedRows;
        return result;
    };

    update = async (params, id) => {
        const { setColumn, values} = multipleColumeSet(params);

        const sql = `UPDATE ${this.tblName} SET ${setColumn} WHERE id = ?`;

        const result = await query(sql, [...values, id]);
        return result;
    };

    delete = async (id) => {
        const sql = `DELETE FROM ${this.tblName} 
        WHERE id = ?`;

        const result = await query(sql, [id]);
        // const afftectedRows = result ? result.afftectedRows : 0;

        // return afftectedRows;
        return result;
    };
}

// export this class and also init it
module.exports = new UserModel;