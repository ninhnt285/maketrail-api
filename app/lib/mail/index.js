import { createTransport } from 'nodemailer';
import { MAIL_PASS, MAIL_USER } from '../../../app/config';

const transport = createTransport({
  service: 'Gmail',
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS
  }
});

function sendMail(from, to, subject, html = null) {
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
}

export const MailService = {
  async sendInviteMail(from, to, project) {
    const subject = `${from}invited you to join the board${project.name}on LineSol`;
    const html = '';
    sendMail(from, to, subject, html);
  },

  async sendNotifyMail(from, to, type) {
    const subject = '';
    const html = '';
    switch (type){

    }
    sendMail(from, to, subject, html);
  }
};
