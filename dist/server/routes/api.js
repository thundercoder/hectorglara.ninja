'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/test-json', function (req, res) {
  res.status(200).send((0, _stringify2.default)({ a: 1, b: 2 }));
});

function getDogs() {
  return new _promise2.default(function (resolve) {
    return resolve({
      a: 1,
      b: [2, 3, 4, 5]
    });
  });
}

router.get('/dogs', function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
    var result;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log('Start');

            _context.next = 3;
            return getDogs();

          case 3:
            result = _context.sent;


            res.status(200).send(result);

            console.log('Finish');

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

// Send email through gmail
router.post('/send-email', function (req, res) {

  console.log(req.body);

  _nodemailer2.default.createTestAccount(function (err, account) {
    // create reusable transporter object using the default SMTP transport
    var transporter = _nodemailer2.default.createTransport({
      service: 'gmail',
      auth: {
        user: 'hectorglara@gmail.com',
        pass: 'Google^*0619=25'
      }
    });

    // setup email data with unicode symbols
    var mailOptions = {
      from: req.body.name + ' "\uD83D\uDC7B" <' + req.body.email + '>', // sender address
      to: 'hectorglara@gmail.com; hectorglara@outlook.com', // list of receivers
      subject: req.body.subject, // Subject line
      text: req.body.message // plain text body
      //html: '<b>Hello world?</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', _nodemailer2.default.getTestMessageUrl(info));

      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
  });

  res.send('api works');
});

module.exports = router;