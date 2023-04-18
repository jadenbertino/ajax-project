import { Timestamp, addDoc, collection, doc } from '@firebase/firestore';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../../firebase/init';
import { useAuthContext } from '../../hooks/useAuthContext';

// styles
import './Create.css';
import avatar from './avatar.jpg';

export default function Create() {
  const [name, setName] = useState('');
  const [imgSrc, setImgSrc] = useState('');
  const [previewImgSrc, setPreviewImgSrc] = useState(avatar);
  const [error, setError] = useState('');
  const { user } = useAuthContext();
  const nav = useNavigate();

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
      setPreviewImgSrc(img.src);
    } catch {
      setPreviewImgSrc(avatar);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    try {
      // imgSrc must 1) point to valid img or 2) be empty
      if (imgSrc !== previewImgSrc && imgSrc !== '') {
        throw new Error('Please enter a valid img url or leave empty');
      }

      const newConversation = {
        name,
        profilePhotoSrc: imgSrc,
        messages: [],
        createdAt: Timestamp.now(),
      };

      // add new conversation as document in /users/{userID}/conversations/{conversationID}
      const userDocRef = doc(db, 'users', user.uid);
      const conversationsCollectionRef = collection(userDocRef, 'conversations');
      await addDoc(conversationsCollectionRef, newConversation);

      nav('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className='fullscreen dfa'>
      <div className='container dfa'>
        <div className='create'>
          <h1 className='header'>Create New Conversation</h1>
          <div className='form-wrapper'>
            <div className='preview dfa'>
              <img src={previewImgSrc} alt='' className='preview-img' />
            </div>
            <form onSubmit={handleSubmit}>
              <label>
                <span>Name</span>
                <input
                  required
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label>
                <span>Profile Image URL</span>
                <input
                  className='img-src'
                  type='text'
                  placeholder='optional'
                  value={imgSrc}
                  onChange={(e) => handleImgSrcChange(e.target.value)}
                />
              </label>
              {error && <p className='error'>{error}</p>}
              <div className='btns'>
                <Link to='/'>
                  <button className='btn cancel'>Cancel</button>
                </Link>
                <button className='btn'>Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
