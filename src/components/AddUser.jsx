import React, { Fragment, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AddUser() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { name, phone_number, username, password };
      const response = await fetch("http://localhost:5000/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (response.status === 201) {
        setMessage("Account created successfully!");
      } else {
        const data = await response.json();
        setMessage(data.error || "Something went wrong.");
      }

      setShowMessage(true);
    } catch (err) {
      console.error(err.message);
      setMessage("Network error.");
      setShowMessage(true);
    }
  };

  const closeMessage = () => {
    setShowMessage(false);
    if (message === "Account created successfully!") {
      navigate('/users/login');
    }
  };

  // Auto-dismiss popup after 3 seconds
  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(closeMessage, 3000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  return (
    <Fragment>
      <div className='top-spacing mb-3'>
        <form onSubmit={onSubmitForm}>
          <div className="form-row">
            <div className='col-md-6 mb-2'>
              <input
                type="text"
                className='form-control'
                placeholder='Full Name'
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className='col-md-6 mb-2'>
              <input
                type="text"
                className='form-control'
                placeholder='Phone Number'
                value={phone_number}
                onChange={e => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <div className='col-md-6 mb-2'>
              <input
                type="text"
                className='form-control'
                placeholder='Username'
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
            <div className='col-md-6 mb-2'>
              <input
                type="password"
                className='form-control'
                placeholder='Password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <button className="btn btn-primary btn-block">Register</button>
          </div>
        </form>

        <button className='btn btn-success float-right mt-3' onClick={() => navigate('/users/login')}>Back</button>
      </div>

      {/* Popup Notification */}
      {showMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#ffe5e5',
          color: '#a10000',
          border: '1px solid #ff4d4d',
          borderRadius: '8px',
          padding: '16px 20px',
          zIndex: 1000,
          width: '300px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>Message</strong>
            <button onClick={closeMessage} style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              color: '#a10000',
              cursor: 'pointer',
            }}>
              &times;
            </button>
          </div>
          <div style={{ marginTop: '8px' }}>
            <p style={{ margin: 0 }}>{message}</p>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default AddUser;
