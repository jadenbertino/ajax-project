import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import { doc, Timestamp, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase/init'

// styles
import './Create.css'
import avatar from './avatar.jpg'

export default function Create() {
  const [name, setName] = useState('')
  const [imgSrc, setImgSrc] = useState('')
  const [previewImgSrc, setPreviewImgSrc] = useState(avatar)
  const [error, setError] = useState('')
  const { user } = useAuthContext()
  const nav = useNavigate()
  
  function loadImg(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }
  
  async function handleImgSrcChange(src) {
    setImgSrc(src);
    try {
      const img = await loadImg(src); // throws error if invalid url
      setPreviewImgSrc(img.src); // valid img url => change to it
    } catch {
      setPreviewImgSrc(avatar); // invalid img url => default to placeholder value
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    
    try {
      // validation: imgSrc must 1) point to valid img or 2) be empty
      if (imgSrc !== previewImgSrc && imgSrc !== '') {
        throw new Error('Please enter a valid img url or leave empty')
      }

      const newConversation = {
        name,
        profilePhoto: imgSrc,
        conversationContent: [],
        createdAt: Timestamp.now()
      }
      
      // push newConversation to user doc 
      const userDocRef = doc(db, "users", user.uid)
      const userDocSnap = await getDoc(userDocRef)
      if (!userDocSnap.exists()) throw new Error("Document doesn't exist")
      const { conversations } = userDocSnap.data()
      conversations.push(newConversation)
      await setDoc(userDocRef, { conversations }, { merge: true })
      nav('/')
    } catch (err) {
      setError(err.message)
    }
  }
  
  return (
    <div className="fullscreen dfa">
      <form className="create" onSubmit={handleSubmit}>
        <h1 className='header'>Create New Conversation</h1>
        <div className="row">
          <div className="col left-col">
            <img src={previewImgSrc} alt="" className='preview-img' />
          </div>
          <div className="col right-col">
            <label>
              <span>Name</span>
              <input
                required
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </label>
            <label>
              <span>Profile Image URL</span>
              <input
                className='img-src'
                type="text"
                placeholder='optional'
                value={imgSrc}
                onChange={e => handleImgSrcChange(e.target.value)}
              />
            </label>
            {error && <p className='error'>{error}</p>}
            <div className="btns">
              <Link to="/">
                <button className="btn cancel">Cancel</button>
              </Link>
              <button className="btn">Save</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}