import '../assets/styles/auth.css';
import '../assets/styles/contact.css';

const Contact = () => {
  return (
    <div>
        <div>
<div className="contact-section">
  <h2 className="contact-title">Contact Us</h2>

  <p className="contact-text">
    Have questions, feedback, or need help with your order?  
    The ShopNexa support team is here to assist you.
  </p>

  <p className="contact-text">
    Reach out to us anytime and we’ll get back to you as soon as possible.
  </p>

  <div className="contact-email">
    <strong>Email us at:</strong>{' '}
    <a href="mailto:shopnexa.onlineshop@gmail.com">
      shopnexa.onlineshop@gmail.com
    </a>
  </div>
    <div className="contact-email">
    <strong>Contact us at:</strong>{' '}
    <a href="tel:+919874561232">
      +919874561232
    </a>
  </div>
</div>

        </div>
    <div className='form-boxs'>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1964.0560849400822!2d78.67421952345497!3d10.08989439326889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0061677da08e1d%3A0x76d5faf920d752da!2skeelayapatti!5e0!3m2!1sen!2sin!4v1766757422982!5m2!1sen!2sin" width="600" height="450" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className='ms-5 border'></iframe>

        <div className='login-forms'>
    
          <form action="" method="post">

             <label htmlFor="name" className='form-label'>Name</label>
            <input type="text" name="name" id="name" className='form-control' placeholder='Enter user name'/>
    
            <label htmlFor="email" className='form-label'>Email</label>
            <input type="email" name="email" id="email" className='form-control' placeholder='Enter your email'/>

            <label htmlFor="phone" className='form-label mt-2'>Phone</label>
            <input type="tel" name="phone" id="phone" className='form-control' placeholder='Enter your phone number'/>

            <label htmlFor="msg" className='form-label mt-2'>Message</label>
            <textarea name="message" id="msg" className='form-control' placeholder='Enter your message' rows={5}></textarea>
    
            <div className='d-grid gap-2'>
            <button type="submit" className='btn btn-success mt-3'>Send Message</button>
            </div>
          </form>              
        </div>
    
        </div>
        </div>
  )
}

export default Contact
