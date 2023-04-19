import { createPortal } from 'react-dom'
import './Modal.css'

export default function Modal({ children, className, closeModal }) {
  const root = document.querySelector('#root')
  
  return createPortal((
    <div className="modal-backdrop">
      <div className={`modal ${className ? className : ''}`}>
        {children}
      </div>
      <div className="close-modal-overlay" onClick={closeModal}></div>
    </div>
  ), root)
}