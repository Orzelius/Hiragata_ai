import fs from 'fs';
import { deleteAllFiles, copyFiles } from '../utils';
import t54 from '../../data/source/t56.json';
import etlc1_chars from '../../data/source/ETL1/JIS_X_0201_dataFormat.json'
import * as wanakana from 'wanakana';
import * as bitwise from 'bitwise';
import { Bit } from 'bitwise/types';
import { PNG } from 'pngjs'
// ETLC 4 n 5
// const WIDTH = 72;
// const HEIGTH = 76;

// ETLC 1
const WIDTH = 64;
const HEIGTH = 63;

const chars = t54.map(x => {
  const data: Bit[] = [];
  for (let i = 0; i < x.char.length; i++) {
    const element = x.char[i];
    data.push(element === "1" ? 1 : 0);
  }
  return (
    { char: x.char, data }
  )
})

export default async () => {
  // deleteAllFiles('./tests/');
  // const rawData = fs.readFileSync('./data/source/ETL5/ETL5C');
  const rawData = fs.readFileSync('data/source/ETL1/ETL1/ETL1C_13');
  const imagesNumber = fs.readdirSync('./data/data/katakana/').length;
  // console.log(rawData.length);
  // for (let i = 5000; i < 10600; i++) {
  //   readChar_ETL45(i, rawData);
  // }
  const images = 4133;
  const fromStart = true;
  const chars = 'ヱヲン';

  let nameNumber = images + imagesNumber;
  const from = fromStart ? 0 : images / 2;
  const to = fromStart ? images / 2 : images
  for (let i = from; i < images; i++) {
    const char = chars[Math.floor(i / (images / 3))];
    readChar_ETL1(i, rawData, nameNumber, char);
    nameNumber++;
  }
}

const readChar_ETL1 = (pos: number, rawData: Buffer, nameNum: number, char: string) => {
  const charData = rawData.slice(pos * 2052, pos * 2052 + 2052);
  const charCodeData = charData.slice(3, 4);
  console.log(charCodeData.toString('ascii'));
  

  const pixelBuffer = charData.slice(33, 2048);
  const bits = bitwise.buffer.read(pixelBuffer);

  const image = new PNG({
    width: WIDTH,
    height: HEIGTH,
    // colorType: 0,
    bgColor: {
      blue: 255,
      green: 255,
      red: 255,
    }
  });

  for (let pixel = 0; pixel < bits.length / 4; pixel++) {
    const pixelBits: Bit[] = [0, 0, 0, 0, ...bits.slice(pixel * 4, pixel * 4 + 4)]
    let correctBits = bitwise.buffer.create(pixelBits);
    // console.log(correctBits);
    const pixelVal = Math.round(correctBits.readIntBE(0, 1) / 16 * 254)

    image.data[pixel * 4 + 0] = pixelVal;
    image.data[pixel * 4 + 1] = pixelVal;
    image.data[pixel * 4 + 2] = pixelVal;
    image.data[pixel * 4 + 3] = 255;
  }
  image
    .pack()
    .pipe(fs.createWriteStream(`./tests/${char}_${nameNum}.png`));
  // console.log(char);
}

const readChar_ETL45 = (pos: number, rawData: Buffer) => {
  const t56s = '0123456789[#@:>? ABCDEFGHI&.](<  JKLMNOPQR-$*);\'|/STUVWXYZ ,%="!';
  // const rawData = Buffer.from("00007A185000001389B1", "hex")
  const charData = rawData.slice(pos * 2952, pos * 2952 + 2952);
  // console.log(charData)
  let letterCode =
    chars[getNumValueFromBuffer(charData, 25, 26)].char +
    chars[getNumValueFromBuffer(charData, 26, 27)].char +
    chars[getNumValueFromBuffer(charData, 27, 28)].char +
    chars[getNumValueFromBuffer(charData, 28, 29)].char;

  while (letterCode[0] === ' ') letterCode = letterCode.slice(1);

  const image = new PNG({
    width: WIDTH,
    height: HEIGTH,
    // colorType: 0,
    bgColor: {
      blue: 255,
      green: 255,
      red: 255,
    }
  });
  const bits = bitwise.buffer.read(charData, 1).slice(1);
  for (let pixel = 0; pixel < (HEIGTH * WIDTH) - 2; pixel++) {
    let correctBits = bits.slice((289 * 6) + (pixel * 4), (289 * 6) + (pixel * 4) + 4);

    while (correctBits.length % 8 !== 0) {
      const bit: Bit = 0;
      correctBits = [bit, ...correctBits];
    }
    const pixelVal = Math.round(bitwise.buffer.create(correctBits).readIntBE(0, correctBits.length / 8) / 16 * 254)
    // console.log(pixelVal);
    image.data[pixel * 4 + 0] = pixelVal;
    image.data[pixel * 4 + 1] = pixelVal;
    image.data[pixel * 4 + 2] = pixelVal;
    image.data[pixel * 4 + 3] = 255;
  }
  image
    .pack()
    .pipe(fs.createWriteStream(`./tests/${pos}_${letterCode}.png`));
  return ({
    // serialDataNumber: getNumValueFromBuffer(charData, 1, 6),
    // serialSheetNumber: getNumValueFromBuffer(charData, 7, 12),
    // scanDate: getNumValueFromBuffer(charData, 85, 90),
    letterCode
  })
}


function getNumValueFromBuffer(charData: Buffer, elStart: number, elEnd: number) {
  // charData = charData.slice(1);
  const bits = bitwise.buffer.read(charData)
  let correctBits = bits.slice(elStart * 6, elEnd * 6);
  // console.log(bits.slice(24 * 6, 29 * 6));

  while (correctBits.length % 8 !== 0) {
    const bit: Bit = 0;
    correctBits = [bit, ...correctBits];
  }
  return (bitwise.buffer.create(correctBits).readIntBE(0, correctBits.length / 8))
}

// ETL 4 and 5 structure (6 bit byte)
// 1 – 6           	6          	Integer          	Serial Data Number
// 7 – 12          	6          	Integer          	Serial Sheet Number
// 13-18           	6          	Binary           	JIS Code (Effective bits  = Left 8 bits) (JIS X 0201)
// 19 – 24          6          	Binary           	EBCDIC Code (Effective bits = Left 8 bits)
// 25 – 28          4          	T56Code          	4 Character Code (ex. “N  0”, “A  A”, “S  +”, “K KA” )
// 29-30           	2          	T56Code          	Spaces
// 31 – 36          6          	Integer          	Evaluation of Individual Character Image (0=clean, 1, 2, 3)
// 37 – 42          6          	Integer          	Evaluation of Character Group (0=clean, 1, 2)
// 43 – 48          6          	Integer          	Sample Position Y on Sheet
// 49 – 54          6          	Integer          	Sample Position X on Sheet
// 55 – 60          6          	Integer          	Male-Female (Gender) Code ( 1=male, 2=female ) (JIS X 0303)
// 61 – 72          6          	Integer          	Industry Classification Code (JIS X 0403)
// 73 – 78          6          	Integer          	Occupation Classification Code (JIS X 0404)
// 79 – 84          6          	Integer          	Sheet Gatherring Date
// 85 – 90          6          	Integer          	Scanning Date
// 91 – 96          6          	Integer          	Number of X-Axis Sampling Points (image width)
// 97 – 102         6          	Integer          	Number of Y-Axis Sampling Points (image height)
// 103 – 108        6          	Integer          	Number of Levels of Pixel
// 109 – 114        6          	Integer          	Magnification of Scanning Lenz
// 115 – 120        6          	Integer          	Serial Data Number (old)
// 121 – 288        168         unused
// 289 – 3936       3648        Packed           	image data of 72 x 76 (width x height) = 5472 pixels with 16 gray levels (4bits / pixel)