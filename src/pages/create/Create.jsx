import avatar from './avatar.jpg'

// styles
import { useState } from 'react'
import './Create.css'

export default function Create() {
  const [name, setName] = useState('')
  const [imgSrc, setImgSrc] = useState('')
  const [previewImgSrc, setPreviewImgSrc] = useState(avatar)

  function handleProfileSrcChange(e) {

  }

  return (
    <div className="full-page-centered">
      <form className="create">
        <h1 className='header'>Create New Conversation</h1>
        <div className="row">
          <div className="col left-col">
            <img src={previewImgSrc} alt="" className='preview-img' />
          </div>
          <div className="col right-col">
            <label>
              <span>Name</span>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </label>
            <label>
              <span>Profile Image URL</span>
              <input
                type="text"
                value={imgSrc}
                onChange={e => handleProfileSrcChange(e.target.value)}
              />
            </label>
            <p>~ Or ~</p>
            <label>
              <span>Upload Profile Photo</span>
              <input
                type="text"
              />
            </label>
            <div className="btns">
              <button className="btn cancel">Cancel</button>
              <button className="btn">Save</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}