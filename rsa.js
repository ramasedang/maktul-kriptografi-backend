import fs from "fs";

// fungsi untuk menghasilkan bilangan prima secara acak
function generatePrime(min, max) {
  let prime = 0;
  while (!isPrime(prime)) {
    prime = Math.floor(Math.random() * (max - min + 1) + min);
  }
  return prime;
}

// fungsi untuk memeriksa apakah sebuah bilangan prima atau tidak
function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i == 0) return false;
  }
  return true;
}

// fungsi untuk mencari invers modular
function modInverse(e, phi) {
  let m0 = phi;
  let y = 0, x = 1;
  if (phi == 1) return 0;
  while (e > 1) {
    let q = Math.floor(e / phi);
    let t = phi;
    phi = e % phi, e = t;
    t = y;
    y = x - q * y;
    x = t;
  }
  if (x < 0) x += m0;
  return x;
}

// generate key pair
function generateKeyPair() {
  let p = generatePrime(100, 1000);
  let q = generatePrime(1000, 10000);
  let n = p * q;
  let phi = (p - 1) * (q - 1);
  let e = 3; // bilangan e harus relatif prima dengan phi
  while (phi % e == 0) e++;
  let d = modInverse(e, phi);
  return {
    publicKey: { n, e },
    privateKey: { n, d },
  };
}

// enkripsi pesan
function encrypt(plaintext, publicKey) {
  let { n, e } = publicKey;
  let ciphertext = "";
  for (let i = 0; i < plaintext.length; i++) {
    let c = plaintext.charCodeAt(i);
    let crypted = BigInt(c) ** BigInt(e) % BigInt(n);
    ciphertext += crypted.toString() + " ";
  }
  return ciphertext.trim();
}

// dekripsi pesan
function decrypt(ciphertext, privateKey) {
  let { n, d } = privateKey;
  let plaintext = "";
  let blocks = ciphertext.split(" ");
  for (let i = 0; i < blocks.length; i++) {
    let decrypted = BigInt(blocks[i]) ** BigInt(d) % BigInt(n);
    plaintext += String.fromCharCode(parseInt(decrypted.toString()));
}
return plaintext;
}

//to base64
function toBase64(str) {
    return Buffer.from(str).toString('base64');
}

//from base64
function fromBase64(str) {
    return Buffer.from(str, 'base64').toString('ascii');
}

// generate key pair
// let { publicKey, privateKey } = generateKeyPair();

// // simpan kunci publik dan kunci pribadi ke dalam file
// fs.writeFileSync("publicKey.json", JSON.stringify(toBase64(JSON.stringify(publicKey))));
// fs.writeFileSync("privateKey.json", JSON.stringify(toBase64(JSON.stringify(privateKey))));

// enkripsi pesan

const publicKey = JSON.parse(fromBase64(JSON.parse(fs.readFileSync("publicKey.json"))));
const privateKey = JSON.parse(fromBase64(JSON.parse(fs.readFileSync("privateKey.json"))));

// let plaintext = "Hello World";

// let ciphertext = encrypt(plaintext, publicKey);
// ciphertext = toBase64(ciphertext);
// console.log("Ciphertext: " + ciphertext);

// // dekripsi pesan

// let decrypted = fromBase64(ciphertext);
// console.log("Decrypted: " + decrypted);
// decrypted = decrypt(decrypted, privateKey);

// console.log("Plaintext: " + decrypted);

export {encrypt, decrypt, toBase64, fromBase64 };



