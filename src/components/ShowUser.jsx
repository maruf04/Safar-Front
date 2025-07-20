import React, { useState, useEffect, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from './AppContext';
import Modal from 'react-modal';
import ErrorModal from './ErrorModal';
import './showuserpg.css';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    padding: '2rem',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(5px)'
  }
};

const isFutureDate = (inputDate) => {
  const today = new Date();
  const journey = new Date(inputDate);

  today.setHours(0, 0, 0, 0);
  journey.setHours(0, 0, 0, 0);

  return journey > today;
};

const ShowUser = () => {
  const navigate = useNavigate();
  const { loginState, userId, setUserId, name, setName, setLoginState } = useData();
  const { id } = useParams();

  const [userData, setUserData] = useState(null);
  const [ticketData, setTicketData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [error, setError] = useState('');
  const [showTickets, setShowTickets] = useState(false);

  const [password, setPassword] = useState('');
  const [new_password, setNewPassword] = useState('');

  const [modalIsOpen, setIsOpen] = useState(false);
  const [errMessage, setErrMessage] = useState('');
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [deletePassword, setDeletePassword] = useState('');
  const [delModal, setDelModal] = useState(false);

  useEffect(() => {
    if (!loginState || userId === null || userId.toString() !== id) {
      navigate(`/`);
      return;
    }

    const fetchUserData = async () => {
      try {
        if (id === '') return;
        setLoadingUser(true);
        const response = await fetch(`http://localhost:5000/user/info/${id}`);
        const rec = await response.json();

        if (rec.data && rec.data.result) {
          setUserData(rec.data.result);
        } else {
          setUserData({
            first_name: 'NULL',
            last_name: 'NULL',
            phone_number: 'NULL',
          });
        }
      } catch (error) {
        console.error(error.message);
        setUserData({
          first_name: 'NULL',
          last_name: 'NULL',
          phone_number: 'NULL',
        });
      } finally {
        setLoadingUser(false);
      }
    };

    const fetchTickets = async () => {
      try {
        setLoadingTickets(true);
        const res = await fetch(`http://localhost:5000/user/printTicket/${id}`);
        const json = await res.json();

        if (json.success) {
          setTicketData(json.data);
          setError('');
        } else {
          setTicketData(null);
          setError(json.error || 'No ticket history found');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch ticket history.');
      } finally {
        setLoadingTickets(false);
      }
    };

    fetchUserData();
    fetchTickets();
  }, [id, loginState, userId, navigate]);

  const groupedByDate = () => {
    if (!ticketData || !ticketData.seat_reservations) return {};
    return ticketData.seat_reservations.reduce((acc, seat) => {
      const date = seat.date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(seat);
      return acc;
    }, {});
  };

  const groupedSeats = groupedByDate();

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setErrMessage('');
    setSuccessMessage('');
    setPassword('');
    setNewPassword('');
  };

  const closeErrorModal = () => setErrorModalIsOpen(false);

  const UpdateInformation = async (e) => {
    e.preventDefault();
    try {
      if (!password) {
        setErrMessage('Please enter your current password to confirm the changes.');
        setErrorModalIsOpen(true);
        return;
      }
      const body = { password, new_password };
      const res = await fetch(`http://localhost:5000/user/info/update/${userData.user_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.status === 200) {
        setSuccessMessage('Password updated successfully!');
        setTimeout(closeModal, 2000);
      } else {
        const errorMessage = await res.json();
        setErrMessage(errorMessage.error);
        setErrorModalIsOpen(true);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const resetInfo = () => {
    setPassword('');
    setNewPassword('');
  };

  const logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    setName('');
    setUserId('');
    setLoginState(false);
    navigate('/');
  };

  const handleDeleteConfirmation = async () => {
    try {
      if (!deletePassword) {
        setErrMessage('Please enter your password to delete the account.');
        setErrorModalIsOpen(true);
        return;
      }

      const body = { password: deletePassword };
      const response = await fetch(`http://localhost:5000/user/info/delete/${userData.user_id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.status === 200) {
        logOut();
      } else {
        const errorMessage = await response.json();
        setErrMessage(errorMessage.error);
        setErrorModalIsOpen(true);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleCancelTicketForDate = async (ticketId) => {
    if (!window.confirm(`Are you sure you want to cancel this ticket?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/booking/cancelTicket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ ticket_id: ticketId }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Cancellation failed');
      }

      alert('Ticket canceled successfully.');

      setLoadingTickets(true);
      const res = await fetch(`http://localhost:5000/user/printTicket/${id}`);
      const json = await res.json();
      if (json.success) {
        setTicketData(json.data);
        setError('');
      } else {
        setTicketData(null);
        setError(json.error || 'No ticket history found');
      }
      setLoadingTickets(false);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <Fragment>
      <div style={{
        padding: '2rem',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        paddingTop: '100px' // This is the only change made to prevent navbar overlap
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          animation: 'slideUp 0.6s ease-out'
        }}>
          {(loadingUser || loadingTickets) && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '20px',
              padding: '3rem',
              textAlign: 'center'
            }}>
              <p>Loading...</p>
            </div>
          )}

          {!loadingUser && userData && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '3rem',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              marginBottom: '2rem'
            }}>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '2rem',
                textAlign: 'center'
              }}>User Dashboard</h1>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '3rem'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#667eea',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>First Name</div>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#333'
                  }}>{userData.first_name}</div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#667eea',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Last Name</div>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#333'
                  }}>{userData.last_name}</div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#667eea',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Phone Number</div>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#333'
                  }}>{userData.phone_number}</div>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
              }}>
                <button 
                  onClick={openModal}
                  style={{
                    padding: '1rem 2rem',
                    border: 'none',
                    borderRadius: '15px',
                    fontWeight: '600',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #ffd89b, #19547b)',
                    color: 'white',
                    boxShadow: '0 4px 15px rgba(255, 216, 155, 0.4)'
                  }}
                >
                  🔐 Edit Password
                </button>
                
                <button 
                  onClick={() => setShowTickets(prev => !prev)}
                  style={{
                    padding: '1rem 2rem',
                    border: 'none',
                    borderRadius: '15px',
                    fontWeight: '600',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                  }}
                >
                  {showTickets ? '🎫 Hide Tickets' : '🎫 Show Tickets'}
                </button>
              </div>

              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end',
                marginTop: '2rem'
              }}>
                <button 
                  onClick={() => setDelModal(true)}
                  style={{
                    padding: '1rem 2rem',
                    border: 'none',
                    borderRadius: '15px',
                    fontWeight: '600',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
                    color: 'white',
                    boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)'
                  }}
                >
                  🗑️ Delete Account
                </button>
                
                <button 
                  onClick={logOut}
                  style={{
                    padding: '1rem 2rem',
                    border: 'none',
                    borderRadius: '15px',
                    fontWeight: '600',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #fd79a8, #e84393)',
                    color: 'white',
                    boxShadow: '0 4px 15px rgba(253, 121, 168, 0.4)'
                  }}
                >
                  🚪 Log Out
                </button>
              </div>
            </div>
          )}

          {showTickets && !loadingTickets && ticketData && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '3rem',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '2rem',
                textAlign: 'center'
              }}>Ticket History</h2>
              
              {error && <p style={{ color: '#ff6b6b', textAlign: 'center' }}>{error}</p>}
              
              {(!ticketData.seat_reservations || ticketData.seat_reservations.length === 0) && (
                <p style={{ textAlign: 'center' }}>No tickets booked yet.</p>
              )}
              
              {Object.keys(groupedSeats).map((date) => (
                <div
                  key={date}
                  style={{
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '1.5rem',
                    background: 'rgba(255, 255, 255, 0.8)',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                    position: 'relative',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <h5 style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span>Journey Date: {new Date(date).toLocaleDateString()}</span>
                    {isFutureDate(date) && (
                      <button
                        style={{
                          padding: '0.5rem 1rem',
                          background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          transition: 'all 0.3s ease'
                        }}
                        onClick={() => {
                          const ticketId = groupedSeats[date][0]?.ticket_id;
                          if (!ticketId) {
                            alert("Ticket ID not found for this date.");
                            return;
                          }
                          handleCancelTicketForDate(ticketId);
                        }}
                      >
                        Cancel Ticket
                      </button>
                    )}
                  </h5>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <thead>
                    <tr style={{ 
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))'
                    }}>
                      <th style={{ 
                        padding: '12px', 
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#667eea'
                      }}>Seat Number</th>
                      <th style={{ 
                        padding: '12px', 
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#667eea'
                      }}>Class</th>
                      <th style={{ 
                        padding: '12px', 
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#667eea'
                      }}>Train</th>
                      <th style={{ 
                        padding: '12px', 
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#667eea'
                      }}>From</th>
                      <th style={{ 
                        padding: '12px', 
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#667eea'
                      }}>To</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedSeats[date].map((seat, idx) => (
                      <tr 
                        key={idx} 
                        style={{ 
                          borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <td style={{ 
                          padding: '12px',
                          color: '#333'
                        }}>{seat.seat_number}</td>
                        <td style={{ 
                          padding: '12px',
                          color: '#333'
                        }}>{seat.class_code}</td>
                        <td style={{ 
                          padding: '12px',
                          color: '#333'
                        }}>{seat.train_code}</td>
                        <td style={{ 
                          padding: '12px',
                          color: '#333'
                        }}>{seat.from_station}</td>
                        <td style={{ 
                          padding: '12px',
                          color: '#333'
                        }}>{seat.to_station}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>

  {/* Password Modal */}
  <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles}>
    <div style={{ marginBottom: '1.5rem' }}>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '600',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '1rem'
      }}>Update Password</h2>
      <button 
        onClick={closeModal} 
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'none',
          border: 'none',
          fontSize: '1.5rem',
          cursor: 'pointer',
          color: '#667eea'
        }}
      >
        &times;
      </button>
    </div>
    <form onSubmit={UpdateInformation}>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{
          display: 'block',
          fontSize: '0.9rem',
          fontWeight: '600',
          color: '#667eea',
          marginBottom: '0.5rem'
        }}>New Password</label>
        <input
          type="password"
          placeholder="Enter new password"
          value={new_password || ''}
          onChange={e => setNewPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            borderRadius: '8px',
            background: 'rgba(102, 126, 234, 0.05)',
            marginBottom: '1rem',
            outline: 'none',
            transition: 'all 0.3s ease'
          }}
        />
        
        <label style={{
          display: 'block',
          fontSize: '0.9rem',
          fontWeight: '600',
          color: '#667eea',
          marginBottom: '0.5rem'
        }}>Current Password</label>
        <input
          type="password"
          placeholder="Enter your current password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            borderRadius: '8px',
            background: 'rgba(102, 126, 234, 0.05)',
            marginBottom: '1rem',
            outline: 'none',
            transition: 'all 0.3s ease'
          }}
        />
      </div>
      
      {successMessage && (
        <div style={{
          padding: '0.75rem',
          background: 'rgba(40, 167, 69, 0.2)',
          color: '#28a745',
          borderRadius: '8px',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>{successMessage}</div>
      )}
      
      <div style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'flex-end'
      }}>
        <button 
          type="button" 
          onClick={resetInfo}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
            color: 'white',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          Reset
        </button>
        <button 
          type="submit"
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          Confirm
        </button>
      </div>
    </form>
    <ErrorModal isOpen={errorModalIsOpen} errorMessage={errMessage} closeModal={closeErrorModal} />
  </Modal>

  {/* Delete Modal */}
  <Modal isOpen={delModal} onRequestClose={() => setDelModal(false)} style={customStyles}>
    <div style={{ marginBottom: '1.5rem' }}>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '600',
        background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '1rem'
      }}>Delete Account</h2>
      <button 
        onClick={() => setDelModal(false)} 
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'none',
          border: 'none',
          fontSize: '1.5rem',
          cursor: 'pointer',
          color: '#ff6b6b'
        }}
      >
        &times;
      </button>
    </div>
    
    <div style={{ marginBottom: '1.5rem' }}>
      <p style={{ marginBottom: '1rem', color: '#333' }}>
        Are you sure you want to delete your account?
      </p>
      <p style={{ marginBottom: '1.5rem', color: '#ff6b6b', fontWeight: '600' }}>
        Warning: This action cannot be undone. All your tickets will be canceled.
      </p>
      
      <label style={{
        display: 'block',
        fontSize: '0.9rem',
        fontWeight: '600',
        color: '#667eea',
        marginBottom: '0.5rem'
      }}>Confirm Password</label>
      <input
        type="password"
        placeholder="Enter your password to confirm"
        value={deletePassword}
        onChange={e => setDeletePassword(e.target.value)}
        style={{
          width: '100%',
          padding: '0.75rem',
          border: '1px solid rgba(102, 126, 234, 0.3)',
          borderRadius: '8px',
          background: 'rgba(102, 126, 234, 0.05)',
          marginBottom: '1rem',
          outline: 'none',
          transition: 'all 0.3s ease'
        }}
      />
    </div>
    
    <div style={{
      display: 'flex',
      gap: '1rem',
      justifyContent: 'flex-end'
    }}>
      <button 
        onClick={() => setDelModal(false)}
        style={{
          padding: '0.75rem 1.5rem',
          border: 'none',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #6c757d, #495057)',
          color: 'white',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
      >
        Cancel
      </button>
      <button 
        onClick={handleDeleteConfirmation}
        style={{
          padding: '0.75rem 1.5rem',
          border: 'none',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
          color: 'white',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
      >
        Delete Account
      </button>
    </div>
    
    <ErrorModal isOpen={errorModalIsOpen} errorMessage={errMessage} closeModal={closeErrorModal} />
  </Modal>

  <style>{`
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    button:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2) !important;
    }
    
    input:focus {
      border-color: #667eea !important;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
    }
    
    @media (max-width: 768px) {
      .dashboard-card {
        padding: 2rem 1rem !important;
      }
      
      .dashboard-title {
        font-size: 2rem !important;
      }
      
      .user-info {
        grid-template-columns: 1fr !important;
      }
      
      .actions-container {
        grid-template-columns: 1fr !important;
      }
      
      .danger-actions {
        flex-direction: column !important;
      }
    }
  `}</style>
</Fragment>
);
};

export default ShowUser;