import express from 'express';
import nodemailer from 'nodemailer';
import axios from 'axios';
import { check, validationResult } from 'express-validator/check';

const router = express.Router();

router.get('/test-json', (req, res) => {
  res.status(200).send(JSON.stringify({a:1, b:2}));
});

function sendEmail(name, email, subject, message){
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env['APPSETTING_GMAILEMAIL'],
      pass: process.env['APPSETTING_GMAILPASS']
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: `${name} "👻" <${email}>`, // sender address
    to: 'hectorglara@gmail.com; hectorglara@outlook.com', // list of receivers
    subject: subject, // Subject line
    text: message // plain text body
    //html: '<b>Hello world?</b>' // html body
  };

  return new Promise((resolve) => {
  // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(true);
    });
  });
}

async function verifyToken(captchaResponse) {

  console.info('secret key', process.env['APPSETTING_SECRETKEYGOOGLE']);
  console.info(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env['APPSETTING_SECRETKEYGOOGLE']}&response=${captchaResponse}`);

  let opts = {
    method: 'post',
    url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env['APPSETTING_SECRETKEYGOOGLE']}&response=${captchaResponse}`
  };

  return await axios(opts);
}

// Send email through gmail
router.post('/send-email', [
  check('name')
    .isLength({ min: 1})
    .withMessage('Name is required.'),

  check('email')
    .isLength({ min: 1})
    .withMessage('Email is required.'),

  check('email')
    .isEmail()
    .withMessage('Email must be valid.'),

  check('subject')
    .isLength({ min: 1})
    .withMessage('Subject is required.'),

  check('message')
    .isLength({ min: 1})
    .withMessage('Subject is required.')

], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json( errors.mapped() );
  }

  let pass = await verifyToken(req.body.captchaResponse);
  let emailResponse = false;

  console.log(pass.data.success);

  if (pass.data.success) {
    emailResponse = await sendEmail(req.body.name, req.body.email, req.body.subject, req.body.message);
    res.status(200).send({ ok: (pass && emailResponse) });
  }
  else
    res.status(400).send('Mmm, you\'re not human.');
});

module.exports = router;
