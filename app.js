import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

//import { registerRouter } from './routes/registerRouter.js';
import { Router } from './routes/Router.js';
import { logger } from './config/logger.js';
import { db } from './models/index.js';
//conexão com o banco
(async () => {
  try {
    await db.mongoose.connect(db.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('Conectado ao banco de dados');
  } catch (error) {
    logger.error(`Erro ao conectar no banco de dados! ${error}`);

    process.exit();
  }
})();

const app = express();

// var corsOptions = {
//   origin: 'https://evernotche.vercel.app',
//   optionsSuccessStatus: 200,
// };

function handleCors(req, res, callback) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE,OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Authorization');

  // CORS OPTIONS request, simply return 200
  if (req.method == 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    callback.onOptions();
    return;
  }
}

callback.onContinue();

app.use(cors(handleCors()));
app.use(express.json());

//define o dominio de origem para consumo do servico
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(Router);

app.listen(process.env.PORT || 8081, () => {
  logger.info(`Servidor em execução na porta ${process.env.PORT}`);
});
