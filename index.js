import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import Joi from 'joi';
import * as rsa from './rsa.js';
import fs from 'fs';

let pubkey = JSON.parse(fs.readFileSync("publicKey.json"));
let privkey = JSON.parse(fs.readFileSync("privateKey.json"));
pubkey = JSON.parse(rsa.fromBase64(pubkey));
privkey = JSON.parse(rsa.fromBase64(privkey));
const app = express();

app.use(bodyParser.json());
app.use(cors());

const schema = Joi.object().keys({
  nama: Joi.string().required(),
  email: Joi.string().email().required(),
  asal_institut: Joi.string().required(),
  no_hp: Joi.string().required(),
  alamat: Joi.string().required(),
  jenis_lomba: Joi.string().required(),
  link_pembayaran: Joi.string().uri()
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/daftar', (req, res) => {
  try {
    schema.validate(req.body);
    let plaintext = JSON.stringify(req.body);
    let ciphertext = rsa.encrypt(plaintext, pubkey);
    ciphertext = rsa.toBase64(ciphertext);
    let decrypted = rsa.decrypt(rsa.fromBase64(ciphertext), privkey);
    console.log(decrypted);
    res.status(200).json({
        status: 'success',
        message: 'Data berhasil disimpan',
        data: ciphertext,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
