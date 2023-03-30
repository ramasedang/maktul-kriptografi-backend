  import fs from 'fs';

  // fungsi untuk menghasilkan bilangan prima secara acak
  const generatePrime = async (min, max) => {
    let prime = 0;
    while (!(await isPrime(prime))) {
      prime = Math.floor(Math.random() * (max - min + 1) + min);
    }
    return prime;
  };

  // fungsi untuk memeriksa apakah sebuah bilangan prima atau tidak
  const isPrime = async (n) => {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i == 0) return false;
    }
    return true;
  };

  // fungsi untuk mencari invers modular
  const modInverse = async (e, phi) => {
    let m0 = phi;
    let y = 0,
      x = 1;
    if (phi == 1) return 0;
    while (e > 1) {
      let q = Math.floor(e / phi);
      let t = phi;
      phi = e % phi;
      e = t;
      t = y;
      y = x - q * y;
      x = t;
    }
    if (x < 0) x += m0;
    return x;
  };

  // generate key pair
  const generateKeyPair = async () => {
    let p = await generatePrime(100, 1000);
    let q = await generatePrime(1000, 10000);
    let n = p * q;
    let phi = (p - 1) * (q - 1);
    let e = 3; // bilangan e harus relatif prima dengan phi
    while (phi % e == 0) e++;
    let d = await modInverse(e, phi);
    return {
      publicKey: { n, e },
      privateKey: { n, d },
    };
  };

  // enkripsi pesan
  const encrypt = async (plaintext, publicKey) => {
    let ciphertext = '';
    console.log('Data dienkripsi');
    let { n, e } = publicKey;

    for (let i = 0; i < plaintext.length; i++) {
      let c = plaintext.charCodeAt(i);
      let crypted = BigInt(c) ** BigInt(e) % BigInt(n);
      ciphertext += crypted.toString() + ' ';
    }
    ciphertext = ciphertext.trim();

    return ciphertext;
  };

  // dekripsi pesan
  const decrypt = async (ciphertext, privateKey) => {
    let plaintext = '';

    console.log('Data didekripsi');
    let { n, d } = privateKey;

    let blocks = ciphertext.split(' ');
    for (let i = 0; i < blocks.length; i++) {
      let decrypted = BigInt(blocks[i]) ** BigInt(d) % BigInt(n);
      plaintext += String.fromCharCode(parseInt(decrypted.toString()));
    }

    return plaintext;
  };

  //to base64
  const toBase64 = async (str) => {
    return Buffer.from(str).toString('base64');
  };

  //from base64
  const fromBase64 = async (str) => {
    return Buffer.from(str, 'base64').toString('ascii');
  };

  export default { encrypt, decrypt, toBase64, fromBase64 };
