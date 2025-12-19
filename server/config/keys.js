const {PORT,MONGO_URI,JWT_SECRET_KEY,SEND_EMAIL,EMAIL_SECRET}=process.env;

module.exports={
    port:PORT,
    connectionUrl:MONGO_URI,
    jwtSecret:JWT_SECRET_KEY,
    senderEmail:SEND_EMAIL,
    emailPass:EMAIL_SECRET
}