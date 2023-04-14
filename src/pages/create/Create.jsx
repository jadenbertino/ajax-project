import avatar from './avatar.jpg'

// styles
import { useState } from 'react'
import './Create.css'
import { Link } from 'react-router-dom'

export default function Create() {
  const [name, setName] = useState('')
  const [imgSrc, setImgSrc] = useState('')
  const [previewImgSrc, setPreviewImgSrc] = useState(avatar)

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

  return (
    <div className="fullscreen dfa">
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