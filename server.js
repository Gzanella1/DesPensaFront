
// server.js (ESM)
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve o conteúdo de 'templete' como raiz -> /index.html, /sidebar.html, /teste.html
app.use(express.static(path.join(__dirname, "templete")));


/**
 * Pastas estáticas - ajuste os nomes se algum estiver diferente no disco.
 * Estou expondo:
 *  - /asset            -> pasta 'asset'
 *  - /css              -> pasta 'css'
 *  - /scriptTemplete   -> pasta 'scriptTemplete'
 *  - /templete         -> pasta 'templete' (contém index.html)
 *
 * Se quiser servir outras pastas, adicione mais app.use(...) similarmente.
 */


// Também exponha as outras pastas estáticas (se precisar)
app.use("/asset", express.static(path.join(__dirname, "asset")));
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/scriptTemplete", express.static(path.join(__dirname, "scriptTemplete")));
app.use("/services", express.static(path.join(__dirname, "services")));



// Logger simples para debugar pedidos
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()}  ${req.method} ${req.url}`);
  next();
});

// opcional: servir toda a pasta src se você tiver uma (descomente se existir)
// app.use(express.static(path.join(__dirname, 'src')));

// rota padrão — envia o index.html dentro de templete
app.get("/", (req, res) => {
  const indexPath = path.join(__dirname, "templete", "index.html");
  console.log("Tentando servir:", indexPath);
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error("Erro ao enviar index:", err.message);
      res.status(err.status || 500).send("Erro ao carregar a página.");
    }
  });
});


// 404
app.use((req, res) => res.status(404).send("Arquivo não encontrado."));

app.listen(PORT, () => {
  console.log(`Frontend rodando em http://localhost:${PORT}`);
});
