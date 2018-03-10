import express from 'express';
import nodemailer from 'nodemailer';

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

router.get('/dogs', async (req, res) => {
  console.log('Start');

  const result = await getDogs();

  res.status(200).send(result);

  console.log('Finish');
});

// Send email through gmail
router.post('/send-email', (req, res) => {

  console.log(req.body);

  nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'hectorglara@gmail.com',
        pass: 'Google^*0619=25'
      }
    });

    // setup email data with unicode symbols
    let mailOptions = {
      from: `${req.body.name} "👻" <${req.body.email}>`, // sender address
      to: 'hectorglara@gmail.com; hectorglara@outlook.com', // list of receivers
      subject: req.body.subject, // Subject line
      text: req.body.message // plain text body
      //html: '<b>Hello world?</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
  });

  res.send('api works');
});

module.exports = router;
