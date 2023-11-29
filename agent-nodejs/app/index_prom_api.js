const express = require("express");
const defaultMetricsRoute = require("./metrics/appMetrics");

const app = express();
const port = 3003;

defaultMetricsRoute.setMetricsRoute(app);

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});