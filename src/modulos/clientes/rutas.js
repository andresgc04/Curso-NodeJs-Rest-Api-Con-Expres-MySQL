const express = require("express");

const respuesta = require("../../red/respuestas");
const controlador = require("./controlador");

const router = express.Router();

router.get("/", async function (req, res) {
  const items = await controlador.todos();
  respuesta.success(req, res, items, 200);
});

module.exports = router;
