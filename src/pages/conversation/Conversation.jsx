import { Link, useParams } from 'react-router-dom';

// styles
import './Conversation.css';

export default function Conversation() {
  const { conversationID } = useParams();

  return (
    <div className='conversation'>
      <nav>
        <Link to='/'>
          <i className='fa-solid fa-house'></i>
        </Link>
      </nav>
    </div>
  );
}
