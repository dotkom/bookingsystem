const nodemailer = require('nodemailer');
require('dotenv').config();
import { ErrorHandler } from './error';
import { validEmail } from '../utils/validators';

const createTransporter = async (): Promise<null | ReturnType<
  typeof nodemailer.createTransport
>> => {
  const transporter = nodemailer.createTransport({
    pool: true,
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: process.env.SENDER,
      serviceClient: process.env.EMAILSERVICECLIENT,
      privateKey: process.env.EMAILPRIVATEKEY,
    },
  });
  try {
    await transporter.verify();
    return transporter;
  } catch (err) {
    throw new ErrorHandler(500, { status: 'Mailer Error' });
  }
};

const checkEmails = (emailadressses: string[]) => {
  emailadressses.forEach(email => {
    if (!validEmail(email)) {
      throw new ErrorHandler(400, { status: 'Validation Error' });
    }
  });
};

export const sendMail = async (
  list: Array<string>,
  replier: string,
  subject: string,
  email: string,
) => {
  checkEmails([...list, replier]);
  const mailOptions = {
    from: process.env.SENDER,
    to: list.join(),
    replyTo: replier,
    subject: subject,
    text: email,
  };
  const transporter = await createTransporter();
  try {
    const info = await transporter.sendMail(mailOptions);
  } catch (err) {
    throw new ErrorHandler(500, { status: 'Mail Error' });
  }
};
