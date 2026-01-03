const nodemailer=require('nodemailer');
const {senderEmail,emailPass}=require('../config/keys');

const sendNodification=async ({emailTo,subject,head,body})=>{
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
    border:1px solid #e0e0e0;
    border-radius:8px;
    overflow:hidden;
  ">

    <!-- HEADER -->
    <div style="
      background:linear-gradient(to right, #cc5500, #ffbf00);
      padding:20px;
      text-align:center;
      color:#ffffff;
    ">
      <h2 style="
        margin:0;
        font-size:28px;
        letter-spacing:1px;
      ">
        SHOPNEXA
      </h2>
      <h4 style="
        margin:5px 0 0;
        font-weight:normal;
        font-size:14px;
      ">
        Next Level Shopping
      </h4>
    </div>

    <!-- CONTENT -->
    <div style="padding:25px;color:#333333;">
      <h3 style="
        margin-bottom:15px;
        font-size:18px;
        font-weight:600;
      ">
        ${head}
      </h3>

      <p style="
        font-size:14px;
        line-height:1.6;
        background:#f7f7f7;
        padding:15px;
        border-radius:6px;
      ">
        ${body}
      </p>
    </div>

    <!-- FOOTER -->
    <div style="
      text-align:center;
      background:#fafafa;
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

module.exports=sendNodification;