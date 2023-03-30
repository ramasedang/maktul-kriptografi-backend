import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import rsa from './rsa.js';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';

let pubkey = JSON.parse(fs.readFileSync('publicKey.json'));
let privkey = JSON.parse(fs.readFileSync('privateKey.json'));
pubkey = JSON.parse(await rsa.fromBase64(pubkey));
privkey = JSON.parse(await rsa.fromBase64(privkey));
const app = express();

app.use(bodyParser.json());
app.use(cors());

const prisma = new PrismaClient();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/daftar', async (req, res) => {
  try {
    const x = req.body;
    const { data } = x;
    let chipertext = await rsa.fromBase64(data);
    const decryptedData = await rsa.decrypt(chipertext, privkey);
    const parsedData = JSON.parse(decryptedData);

    //save data to database
    await prisma.peserta.create({
      data: parsedData,
    });

    res.status(200).json({
      status: 'success',
      message: 'Data berhasil didaftarkan',
    });
  } catch (error) {
    console.log(error);
  }
});

app.get('/peserta', async (req, res) => {
  try {
    const data = await prisma.peserta.findMany();
    let chipertext = await rsa.encrypt(JSON.stringify(data), pubkey);
    chipertext = await rsa.toBase64(chipertext);
    res.status(200).json({
      status: 'success',
      message: 'Data berhasil didapatkan',
      data: chipertext,
    });
    // console.log(data);
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
