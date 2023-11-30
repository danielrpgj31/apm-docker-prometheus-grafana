const client = require("prom-client");
let gc25counter = null;

function InitGc25Counter(client, register) {

  gc25counter = new client.Counter({
    name: "gc25counter",
    help: "Uma métrica que identifica quantos eventos de GC ocorreram cujo do tempo \
           seja entre 25% a 50% do intervalo de tempo entre o ultimo gc.",
    labelNames: ["tipo"],
  });
  
  register.registerMetric(gc25counter);

}

function IncGc25Counter() {
  gc25counter.inc({ tipo: "gc25counter" });
}

module.exports = { InitGc25Counter, IncGc25Counter };