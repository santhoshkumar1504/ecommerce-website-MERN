const nodemailer=require('nodemailer');
const {senderEmail,emailPass}=require('../config/keys');

const sendEmail=async ({emailTo,subject,code,content,subContent})=>{
    const transporter=nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:465,
        secure:true,
        auth:{
            user:senderEmail,
            pass:emailPass
        }
    })

    const message = {
  to: emailTo,
  subject: subject,
  html: `
  <div style="
    max-width:600px;
    margin:0 auto;
    font-family:Arial, Helvetica, sans-serif;
    background:#ffffff;
    border-radius:8px;
    overflow:hidden;
    border:1px solid #e0e0e0;
  ">

    <!-- HEADER -->
    <div style="
      background:linear-gradient(to right, #cc5500, #ffbf00);
      padding:20px;
      text-align:center;
      color:#ffffff;
    ">
      <h2 style="margin:0;font-size:28px;letter-spacing:1px;">
        SHOPNEXA
      </h2>
      <p style="margin:5px 0 0;font-size:14px;">
        Next Level Shopping
      </p>
    </div>

    <!-- BODY -->
    <div style="padding:25px;color:#333333;">
      <h3 style="margin-bottom:15px;font-size:18px;">
        Use the ${subContent} below to ${content}
      </h3>

      <div style="
        background:#f7f7f7;
        padding:15px;
        text-align:center;
        border-radius:6px;
        margin:20px 0;
      ">
        <p style="margin:0;font-size:14px;">
          <strong>${subContent}</strong>
        </p>
        <p style="
          margin:10px 0 0;
          font-size:24px;
          font-weight:bold;
          letter-spacing:4px;
          color:#cc5500;
        ">
          ${code}
        </p>
      </div>

      <p style="font-size:14px;line-height:1.6;">
        If you did not request this, please ignore this email.
      </p>

      <p style="font-size:14px;">
        Thank you for choosing <strong>ShopNexa</strong>.
      </p>
    </div>

    <!-- FOOTER -->
    <div style="
      background:#fafafa;
      text-align:center;
      padding:12px;
      font-size:12px;
      color:#777777;
      border-top:1px solid #e0e0e0;
    ">
      © ${new Date().getFullYear()} ShopNexa. All rights reserved.
    </div>

  </div>
  `
};


    await transporter.sendMail(message);
}

module.exports=sendEmail;