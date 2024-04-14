const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");
const pug = require("pug");
const htmlToText = require("html-to-text");
// const catchAsync = require("./catchAsync");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `MhL <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      //sendgrid
      const mailgunAuth = {
        auth: {
          api_key: process.env.MAILGUN_KEY,
          domain: process.env.MAILGUN_DOMAIN,
        },
      };
      return nodemailer.createTransport(mg(mailgunAuth));
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    // 1. render html based on a pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      },
    );

    // 2. define email options
    let mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };

    if (process.env.NODE_ENV === "production") {
      mailOptions = {
        from: this.from,
        to: this.to, // An array if you have multiple recipients.
        subject,
        html,
        text: htmlToText.convert(html),
      };
    }

    // 3. create a transport and send email
    await this.newTransport().sendMail(mailOptions, (err, info) => {
      if (err) return console.log(err);
      console.log(info, "message sent 💌");
    });
  }

  async sendWelcome() {
    await this.send("welcome", "welcome to the natours family");
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your password reset token (valid for only 10 minutes)",
    );
  }
};

// * it's not a good idea to use gmail in production because we will quickly get spammed and 500 per day limit
// * ACTIVE IN GMAIL: LESS SECURE APP
//   const transporter = nodemailer.createTransport({
//     service: "Gmail",
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });
