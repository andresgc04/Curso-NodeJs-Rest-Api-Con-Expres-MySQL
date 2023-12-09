const mysql = require("mysql");
const config = require("../config");

const dbConfig = {
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
};

let conexion;

function conexionMysql() {
  conexion = mysql.createConnection(dbConfig);

  conexion.connect((error) => {
    if (error) {
      console.log("[db error]", error);
      setTimeout(conexionMysql, 200);
    } else {
      console.log("DB Conectada");
    }
  });

  conexion.on("error", (error) => {
    console.log("[db error]", error);

    if (error.code === "PROTOCOL_CONNECTION_LOST") {
      conexionMysql();
    } else {
      throw error;
    }
  });
}

conexionMysql();

function todos(tabla) {
  return new Promise((resolve, reject) => {
    conexion.query(`SELECT * FROM ${tabla}`, (error, result) => {
      return error ? reject(error) : resolve(result);
    });
  });
}

function uno(tabla, id) {
  return new Promise((resolve, reject) => {
    conexion.query(`SELECT * FROM ${tabla} WHERE ID=${id}`, (error, result) => {
      return error ? reject(error) : resolve(result);
    });
  });
}

function insertar(tabla, data) {
  return new Promise((resolve, reject) => {
    conexion.query(`INSERT INTO ${tabla} SET ?`, data, (error, result) => {
      return error ? reject(error) : resolve(result);
    });
  });
}

function actualizar(tabla, data) {
  return new Promise((resolve, reject) => {
    conexion.query(
      `UPDATE ${tabla} SET ? WHERE ID = ?`,
      [data, data.id],
      (error, result) => {
        return error ? reject(error) : resolve(result);
      }
    );
  });
}

function agregar(tabla, data) {
  if (data && data.id == 0) {
    return insertar(tabla, data);
  } else {
    return actualizar(tabla, data);
  }
}

function eliminar(tabla, data) {
  return new Promise((resolve, reject) => {
    conexion.query(
      `DELETE FROM ${tabla} WHERE ID = ?`,
      data.id,
      (error, result) => {
        return error ? reject(error) : resolve(result);
      }
    );
  });
}

module.exports = {
  todos,
  uno,
  agregar,
  eliminar,
};
