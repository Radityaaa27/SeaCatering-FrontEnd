import { motion } from 'framer-motion'
import { useState } from 'react'
import { FiPlus, FiMinus } from 'react-icons/fi'

export default function MealCard({ meal, onSubscribe }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div 
      className="meal-card"
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="meal-image">
        <img src={meal.image} alt={meal.name} />
      </div>
      <div className="meal-content">
        <h3>{meal.name}</h3>
        <p className="price">Rp{meal.price.toLocaleString('id-ID')}/meal</p>
        <p className="description">{meal.shortDescription}</p>
        
        <button 
          className="toggle-btn"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <FiMinus /> Less Details
            </>
          ) : (
            <>
              <FiPlus /> More Details
            </>
          )}
        </button>

        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="expanded-details"
          >
            <p>{meal.longDescription}</p>
            <ul className="benefits">
              {meal.benefits.map((benefit, i) => (
                <li key={i}>{benefit}</li>
              ))}
            </ul>
            <button 
              className="subscribe-btn"
              onClick={() => onSubscribe(meal)}
            >
              Choose Plan
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}