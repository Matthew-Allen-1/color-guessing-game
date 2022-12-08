import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

const modal = document.getElementById('modal')
const modalCloseBtn = document.getElementById('modal-close-btn')
   
  setTimeout(function(){
      modal.style.display = 'block'
  }, 1500)
  
  modalCloseBtn.addEventListener('click', function(){
      modal.style.display = 'none'
  })
