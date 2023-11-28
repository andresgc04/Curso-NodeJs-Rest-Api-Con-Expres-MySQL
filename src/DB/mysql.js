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
      if (error) return reject(error);
      resolve(result);
    });
  });
}

function uno(tabla, id) {}

function agregar(tabla, data) {}

function eliminar(tabla, id) {}

module.exports = {
  todos,
  uno,
  agregar,
  eliminar,
};
