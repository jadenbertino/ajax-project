import { Timestamp, getDoc, setDoc } from '@firebase/firestore';
import { useState } from 'react';

// components
import Modal from '../../components/Modal';

export default function AddNewMessageModal({ closeModal, modalActive, conversationRef }) {
  const [newMessageText, setNewMessageText] = useState('');

  async function addMessageToFirestore(e) {
    e.preventDefault();
    try {
      const newMessageType = modalActive === 'ADD_RECEIVED_MESSAGE' ? 'RECEIVED' : 'SENT';
      const newMessage = {
        type: newMessageType,
        content: newMessageText,
        timestamp: Timestamp.now(),
      };

      const conversationSnap = await getDoc(conversationRef);
      if (!conversationSnap.exists()) throw new Error('Invalid conversationRef');
      const { messages } = conversationSnap.data();
      messages.push(newMessage);
      await setDoc(conversationRef, { messages }, { merge: true });

      setNewMessageText('');
      closeModal();
    } catch (err) {
      console.log(err.message);
      setNewMessageText('');
      closeModal();
    }
  }

  return (
    <Modal closeModal={closeModal}>
      <form
        onSubmit={addMessageToFirestore}
        className={`new-message-form ${
          modalActive === 'ADD_RECEIVED_MESSAGE' ? 'received' : 'sent'
        }`}
      >
        <h2>{modalActive === 'ADD_RECEIVED_MESSAGE' ? 'Add Her Message' : 'Add Your Message'}</h2>
        <textarea
          onChange={(e) => setNewMessageText(e.target.value)}
          value={newMessageText}
          required
          autoFocus
        />
        <div className='btns'>
          <button className='btn cancel' type='button' onClick={closeModal}>
            Cancel
          </button>
          <button className='btn submit'>Add New Message</button>
        </div>
      </form>
    </Modal>
  );
}
