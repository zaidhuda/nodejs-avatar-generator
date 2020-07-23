const express = require('express');
const app = express();
const { createCanvas, registerFont } = require('canvas');
const initials = require('initials');
const md5 = require('md5');
const fontColorContrast = require('font-color-contrast');

registerFont('fonts/Roboto-Regular.ttf', { family: 'Roboto Regular' })

app.get('/', function (req, res) {
  const {
    name = 'John Doe',
    color,
    bg,
  } = req.query;
  let {
    size = 64,
    ratio = 2,
    rounded = false,
  } = req.query;

  size = parseInt(size, 10);
  ratio = parseInt(ratio, 10);
  rounded = rounded === 'true';

  const canvas = createCanvas(size, size);
  const context = canvas.getContext('2d');
  const bgColor = `#${md5(name).substr(0, 6)}`;
  const fontColor = fontColorContrast(bgColor);

  context.fillStyle = bgColor;
  if(rounded) {
    context.arc(size/2, size/2, size/2, 0, 2 * Math.PI);
    context.fill();
  } else {
    context.fillRect(0, 0, size, size);
  }

  context.font = `${size/ratio}px Roboto Regular`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = fontColor;
  context.fillText(initials(name), size/2, size/2);

  const buffer = canvas.toBuffer('image/png')

  res.writeHead(200, { 'content-type': 'image/png' });
  res.write(buffer)
})

app.listen(3000, () => console.log('server started'));
