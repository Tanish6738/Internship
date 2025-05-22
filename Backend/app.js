import express from 'express';
const app = express();
import morgan from 'morgan';
import cors from 'cors';

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.send('Hello World!');
});

export default app;