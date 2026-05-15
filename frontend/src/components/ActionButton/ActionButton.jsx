import React from 'react'
import './ActionButton.css'

export function ActionButton({ 
  icon, 
  label, 
  onClick, 
  large = false,
  className = ''
}) {
  return (
    <button 
      type="button"
      className={`content-action ${large ? 'content-action--large' : 'content-action--small'} ${className}`}
      onClick={onClick}
    >
      <span className="content-action__icon">{icon}</span>
      <span className="content-action__label">{label}</span>
    </button>
  )
}

export default ActionButton
