import RenderMessages from './RenderMessages';
import AddNewMessageModal from './AddNewMessageModal';

export default function ConversationHistory({ messageHistory, conversationRef, modalActive, setModalActive }) {

  const closeModal = () => setModalActive('') 

  return (
    <div className='conversation-history'>
      <RenderMessages messages={messageHistory} />
      <div className='new-message-btns'>
        <button className='btn received' onClick={() => setModalActive('ADD_RECEIVED_MESSAGE')}>
          Add Her Message
        </button>
        <button className='btn sent' onClick={() => setModalActive('ADD_SENT_MESSAGE')}>
          Add Your Message
        </button>
      </div>
      {(modalActive === 'ADD_SENT_MESSAGE' || modalActive === 'ADD_RECEIVED_MESSAGE') && (
        <AddNewMessageModal
          closeModal={closeModal}
          modalActive={modalActive}
          conversationRef={conversationRef}
        />
      )}
    </div>
  );
}
