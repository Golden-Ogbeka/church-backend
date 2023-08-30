const nodemailer = require('nodemailer');
const MailGen = require('mailgen');

// eslint-disable-next-line consistent-return
const sendEmail = async (recipient, subject, email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_HOST,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailGenerator = new MailGen({
      theme: 'salted',
      product: {
        // Appears in header & footer of e-mails
        name: 'TFH Admin',
        link: 'https://tfhconline.org.ng/',
        // Optional logo
        // logo: 'https://mailgen.js/img/logo.png'
      },
    });

    const emailText = mailGenerator.generate(email);

    await transporter.sendMail({
      from: process.env.email_sender,
      to: recipient,
      subject: subject,
      html: emailText,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Couldn't send mail");
  }
};

module.exports = { sendEmail };
