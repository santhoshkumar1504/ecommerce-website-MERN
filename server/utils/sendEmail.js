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

    const message={
        to:emailTo,
        subject:subject,
        html:`
        <div>
        <center>
            <h2>ECOMMERCE</h2>
            <h3 style="margin:3px;padding:2px;">Use this below ${subContent} to ${content}</h3>
            <p style="margin:3px;padding:2px;">
                <strong>${subContent}:</strong> ${code}
            </p>
            </center>
        </div>
        `
    }

    await transporter.sendMail(message);
}

module.exports=sendEmail;