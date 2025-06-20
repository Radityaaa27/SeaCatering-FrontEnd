// src/pages/ContactUs.jsx
import { motion } from 'framer-motion'

export default function ContactUs() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="contact-page"
    >
      <h1>Contact Us</h1>
      <div className="contact-info">
        <h2>Get in Touch</h2>
        <p><strong>Manager:</strong> Brian</p>
        <p><strong>Phone:</strong> 08123456789</p>
        <p><strong>Email:</strong> contact@seacatering.com</p>
      </div>
      <div className="contact-form">
        <h2>Send Us a Message</h2>
        <form>
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input type="text" id="name" name="name" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="5"></textarea>
          </div>
          <button type="submit" className="submit-btn">Send Message</button>
        </form>
      </div>
    </motion.div>
  )
}