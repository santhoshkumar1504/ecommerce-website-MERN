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

    const message={
        to:emailTo,
        subject:subject,
        html:`
        <div>
        <center>
            <h2>ECOMMERCE</h2>
            <h3 style="margin:3px;padding:2px;">${head}</h3>
            <p style="margin:3px;padding:2px;">
                <strong>${body}</strong>
            </p>
            </center>
        </div>
        `
    }

    await transporter.sendMail(message);
}

module.exports=sendNodification;