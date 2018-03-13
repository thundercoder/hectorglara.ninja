import express from 'express';
import nodemailer from 'nodemailer';
import axios from 'axios';

const router = express.Router();

router.get('/test-json', (req, res) => {
  res.status(200).send(JSON.stringify({a:1, b:2}));
});

function getDogs() {
  return new Promise (resolve => resolve({
    a: 1,
    b: [2,3,4,5]
  }));
}

async function verifyRecaptcha(secretKey, tokenResponse){
  const res = await axios.post('https://www.google.com/recaptcha/api/siteverify', JSON.stringify({secret: secretKey, response: tokenResponse}));

  console.log(res);

  return res;
}

router.get('/dogs', async (req, res) => {
  console.log('Start');

  const result = await getDogs();

  res.status(200).send(result);

  console.log('Finish');
});

function sendEmail(name, email, subject, message){
  return new Promise((resolve, reject) => {
    nodemailer.createTestAccount((err, account) => {
      // create reusable transporter object using the default SMTP transport
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

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        }
        resolve(true);

        //console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      });
    });
  })
}

// Send email through gmail
router.post('/send-email', async (req, res, next) => {

  let isHuman = await verifyRecaptcha(process.env['APPSETTING_SECRETKEYGOOGLE'], req.body.captchaResponse);

  if (!isHuman.success)
    next('Mmm, you\'re not human. :P');

  let messageResponse = await sendEmail(req.body.name, req.body.email, req.body.subject, req.body.message);

  let response = {
    apiGoogle: isHuman,
    sendEmailService: messageResponse
  }

  res.send(response);
});

module.exports = router;
