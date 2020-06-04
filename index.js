'use strict';

document.getElementById('container').hidden = false;

const crypto = window.crypto || window.msCrypto;

const $input = document.getElementById('input');
const $hash = document.getElementById('hash');
const $output = document.getElementById('output');

if(crypto.subtle) {
  $hash.addEventListener('click', onClick);
} else {
  $output.innerText = "No crypto API supported!"
  $hash.disabled = true;
  $input.disabled = true;
}

function convertStringToArrayBuffer(str) {
  const bytes = new Uint8Array(str.length);
  for(let i = 0; i < str.length; i++) {
    bytes[i] = str.charCodeAt(i);
  }
  return bytes;
}

function convertArrayBufferToHex(buffer) {
  const view = new DataView(buffer);
  let len = view.byteLength;
  let hex = '';

  for(let i = 0; i < len; i++) {
    let c = view.getUint8(i).toString(16);
    if (c.length < 2) c = '0' + c;
    hex += c;
  }
  return hex;
}

async function generateHash(buffer) {
  const hashBuffer = await crypto.subtle.digest({name: 'SHA-256'}, buffer);
  return convertArrayBufferToHex(hashBuffer);
}

async function onClick() {
  const data = $input.value;
  const buffer = convertStringToArrayBuffer(data);
  const hashValue = await generateHash(buffer);
  $output.innerHTML = hashValue;

  console.info(data, hashValue);
}