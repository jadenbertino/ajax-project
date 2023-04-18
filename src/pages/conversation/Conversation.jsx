import { collection, doc } from '@firebase/firestore';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Modal from '../../components/Modal';
import { db } from '../../firebase/init';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useSubdocument } from '../../hooks/useSubdocument';
import './Conversation.css';

export default function Conversation() {
  const { conversationID } = useParams();
  const { user } = useAuthContext();
  const [conversationsRef, setConversationsRef] = useState(null);
  const nav = useNavigate();
  const { document: conversationDoc } = useSubdocument(conversationsRef, conversationID);
  const [profilePhotoSrc, setProfilePhotoSrc] = useState('./avatar.jpg');
  const [conversationName, setConversationName] = useState('');
  const [modalPrompt, setModalPrompt] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  // console.log(conversationDoc);

  useEffect(() => {
    if (!user) {
      nav('/');
      return;
    }

    const usersRef = collection(db, 'users');
    const userDocRef = doc(usersRef, user.uid);
    const conversationsRef = collection(userDocRef, 'conversations');
    setConversationsRef(conversationsRef);
  }, [user, nav]);

  useEffect(() => {
    if (!conversationDoc) return;
    const { profilePhotoSrc, name } = conversationDoc;
    setProfilePhotoSrc(profilePhotoSrc);
    setConversationName(name);
  }, [conversationDoc]);

  function handleNewMessage(e) {
    e.preventDefault()
    console.log('submit')
  }

  function closeModal() {
    setModalPrompt(null)
  }

  return (
    <div className='conversation container'>
      <nav>
        <img src={profilePhotoSrc} alt='' className='profile-photo' />
        <h2 className='name'>{conversationName}</h2>
        <Link to='/' className='house-icon-wrapper'>
          <i className='fa-solid fa-house'></i>
        </Link>
      </nav>
      <main>
        <div className='history'>
          <div className='content'></div>
          <div className='new-message-btns'>
            <div className='btn received' onClick={() => setModalPrompt('Add Her Message')}>
              Add Her Message
            </div>
            <div className='btn sent' onClick={() => setModalPrompt('Add Your Message')}>
              Add Your Message
            </div>
          </div>
        </div>
        <div className='message-generation'>{/* for later */}</div>
      </main>
      {modalPrompt && (
        <Modal closeModal={closeModal}>
          <form onSubmit={handleNewMessage} className={`new-message-form ${modalPrompt === 'Add Her Message' ? 'received' : 'sent'}`}>
            <h2>{modalPrompt}</h2>
            <textarea onChange={(e) => setNewMessage(e.target.value)} value={newMessage} required />
            <div className="btns">
              <button className="btn cancel" type='button' onClick={closeModal}>Cancel</button>
              <button className='btn submit'>Add New Message</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
