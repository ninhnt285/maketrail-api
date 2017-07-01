import { createTransport } from 'nodemailer';
import { MAIL_PASS, MAIL_USER } from '../../../app/config';

const transport = createTransport({
  service: 'Gmail',
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS
  }
});

function sendMail(from = 'support@maketrail.com', to, subject, html = null) {
  const mailOptions = {
    from,
    to,
    subject,
    html
  };
  transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      return console.log(err);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
}

export const NotifyMailType = {
};

const MailService = {
  async sendInviteMail(from, to, project) {
    const subject = `${from}invited you to join the board${project.name}on Maketrail`;
    const html = '';
    sendMail(from, to, subject, html);
  },

  async sendResetPassMail(name, to, token) {
    const subject = 'Forgot password?';
    let html = `Dear ${name}<br><br>`;
    html += 'To reset your password, click this link.<br><br>';
    html += `http://maketrail.com/password/reset/${token}<br><br>`;
    html += 'If you cannot access this link, copy and paste the entire URL into your browser.<br><br>';
    html += 'The Maketrail Team <br><br>';
    html += 'Copyright 2017 Thebigdev Company. All rights reserved.<br><br>';
    sendMail(null, to, subject, html);
  },

  async sendNotifyMail(from, to, type) {
    const subject = '';
    const html = '';
    switch (type) {

    }
    sendMail(from, to, subject, html);
  }
};

export default MailService;
