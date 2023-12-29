const express = require("express");
const appMetrics = require("./metrics/defaultMetrics");
const log = require("./utils/log");
const general = require("./utils/general");
const axios = require('axios');
const app = express();
const port = 7002;

appMetrics.setMetricsRoute(app);

function processamentoAssincrono() {
  return new Promise((resolve) => {
    general.delay(20000);
    resolve("Processamento (20s) REST Api finalizada.");
  });
}

async function fetchAsyncRestApiJava() {
  try {
    //const response = await axios.get("http://app1v1-service:7001/api/asyncnow");
    const response = await axios.get("http://localhost:7002/api/asyncnow");
    return response.data;
  } catch (error) {
    log.logMessage("Erro ao obter dados:" + error.message);
    //console.error("Erro ao obter dados:", error.message);
  }
}


//Api Request/Response sincrono
app.get("/api/app2/gethex", async (req, res) => {

  log.logMessage("Recebida chamada REST Api /api/app2/gethex, processando...");
  log.logMessage("Executando chamada externa para api destino /api/asyncnow");

  await fetchAsyncRestApiJava().then((retorno) => {

    log.logMessage(`Retorno: ${retorno}`);

    res.json({
      retorno: retorno,
    });
  
  })

});

//Api que tem retorno imediato
//porém é atrasado diretamente pela latência do eventLoop.
app.get("/api/asyncnow", async (req, res) => {
  try {
    log.logMessage("Recebida chamada REST Api /now, processando...");
    await processamentoAssincrono().then((resultado) => {
      log.logMessage("Finalizado processamento da REST Api /now. (20s).");
      res.json("" + resultado);
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao processar api '/now'" });
  }
});

//Api que tem retorno imediato
//porém é atrasado diretamente pela latência do eventLoop.
app.get("/api/syncnow", (req, res) => {
  try {
    log.logMessage("Recebida chamada REST Api /now, processando...");
    log.logMessage("Finalizado processamento da REST Api /now. (20s).");
    res.status(200).json("Retorno da api /now.");
  } catch (error) {
    res.status(500).json({ error: "Erro ao processar api '/now'" });
  }
});

//Seta o interval:: Vai ocupar o eventloop de forma a impactar toda a app
//assim que o codigo principal dentro das chaves {}, for executado, vai parar
//toda a aplicação, lembrando que é single-thread.
/*
setInterval(() => {
  general.delay(12000);
}, 8000);
*/

// Inicia o servidor
app.listen(port, () => {
  log.logMessage(`Servidor rodando em http://localhost:${port}`);
});