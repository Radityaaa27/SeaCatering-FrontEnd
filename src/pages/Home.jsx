import { motion } from 'framer-motion'
import heroImage from '../assets/meal1.jpg'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    review: 'SEA Catering has transformed my eating habits. The meals are delicious and nutritious!',
    rating: 5
  },
  {
    id: 2,
    name: 'Michael Chen',
    review: 'As a busy professional, SEA Catering saves me so much time while keeping me healthy.',
    rating: 4
  },
  {
    id: 3,
    name: 'David Wilson',
    review: 'The variety and quality of meals is outstanding. Highly recommend!',
    rating: 5
  }
]

export default function Home() {
    const navigate = useNavigate()
    const change = () => {
        navigate('./Menu')
    }
    axios.get('htt')
  return (
    <div className="home-page">
      <section className="hero">
        <motion.div 
          className="hero-content"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1>SEA Catering</h1>
          <h2>Healthy Meals, Anytime, Anywhere</h2>
          <p>
            Customizable healthy meal service with delivery all across Indonesia. 
            Enjoy chef-prepared meals tailored to your dietary needs.
          </p>
          <button className="cta-button" onClick={change}>Explore Our Menu</button>
        </motion.div>
        <motion.div 
          className="hero-image"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img src={heroImage} alt="Healthy meal" />
        </motion.div>
      </section>

      <section className="features">
        <h2>Why Choose SEA Catering?</h2>
        <div className="feature-grid">
          {[
            {
              title: 'Customizable Meals',
              description: 'Tailor your meals to your dietary preferences and restrictions.'
            },
            {
              title: 'Nationwide Delivery',
              description: 'We deliver to all major cities across Indonesia.'
            },
            {
              title: 'Nutrition Tracking',
              description: 'Detailed nutritional information for every meal.'
            },
            {
              title: 'Flexible Plans',
              description: 'Choose your meals, delivery days, and subscription length.'
            }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              className="feature-card"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="testimonials">
        <h2>What Our Customers Say</h2>
        <div className='testimonial-grid'>
          {testimonials.map((testimonials)=>(
            <motion.div
            key={testimonials.id}
            className='testimonial-card'
            initial={{scale:0.9,opacity:0}}
            animate={{scale:1,opacity:1}}
            transition={{duration:0.5}}
            >
              <div className='testimonial-rating'>
                {'★'.repeat(testimonials.rating)}
                {'☆'.repeat(5-testimonials.rating)}
              </div>
              <p className='testimonial-text'>"{testimonials.review}"</p>
              <p className='testemonial-author'>- {testimonials.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="contact-preview">
        <h2>Ready to Start Your Healthy Journey?</h2>
        <p>Contact us for more information or to place your first order.</p>
        <div className="contact-info">
          <p><strong>Manager:</strong> Brian</p>
          <p><strong>Phone:</strong> 08123456789</p>
        </div>
      </section>
    </div>
  )
}