import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    team_id: ''
  });

  const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;
  const teamsApiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;

  const fetchUsers = () => {
    console.log('Users component - Fetching from:', apiUrl);
    
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Users component - Fetched data:', data);
        const usersData = data.results || data;
        setUsers(Array.isArray(usersData) ? usersData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Users component - Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      });
  };

  const fetchTeams = () => {
    console.log('Users component - Fetching teams from:', teamsApiUrl);
    
    fetch(teamsApiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Users component - Fetched teams:', data);
        const teamsData = data.results || data;
        setTeams(Array.isArray(teamsData) ? teamsData : []);
      })
      .catch(error => {
        console.error('Users component - Error fetching teams:', error);
      });
  };

  useEffect(() => {
    fetchUsers();
    fetchTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const url = editMode ? `${apiUrl}${currentUserId}/` : apiUrl;
    const method = editMode ? 'PATCH' : 'POST';
    
    // For edit mode, only send password if it's been changed
    const dataToSend = { ...formData };
    if (editMode && !dataToSend.password) {
      delete dataToSend.password;
    }
    
    // Convert empty team_id to null
    if (dataToSend.team_id === '') {
      dataToSend.team_id = null;
    }
    
    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend)
    })
      .then(response => response.json())
      .then(data => {
        console.log(editMode ? 'User updated:' : 'User created:', data);
        setShowModal(false);
        setEditMode(false);
        setCurrentUserId(null);
        setFormData({ username: '', email: '', password: '', team_id: '' });
        fetchUsers();
      })
      .catch(error => {
        console.error(`Error ${editMode ? 'updating' : 'creating'} user:`, error);
        alert(`Error ${editMode ? 'updating' : 'creating'} user. Please try again.`);
      });
  };

  const handleEdit = (user) => {
    setEditMode(true);
    setCurrentUserId(user.id);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      team_id: user.team_id || ''
    });
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditMode(false);
    setCurrentUserId(null);
    setFormData({ username: '', email: '', password: '', team_id: '' });
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <i className="bi bi-people-fill me-2"></i>
          Users Management
        </h2>
        <button 
          className="btn btn-primary"
          onClick={handleAddNew}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add New User
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
              <th>Team</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>{user.username}</strong>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    {user.team_name || user.team ? (
                      <span className="badge bg-primary">
                        {user.team_name || user.team}
                      </span>
                    ) : (
                      <span className="badge bg-secondary">No team</span>
                    )}
                  </td>
                  <td>{new Date(user.date_joined).toLocaleDateString()}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleEdit(user)}
                      title="Edit user"
                    >
                      <i className="bi bi-pencil"></i> Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  <i className="bi bi-inbox me-2"></i>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3">
        <p className="text-muted">
          <i className="bi bi-info-circle me-2"></i>
          Total Users: <strong>{users.length}</strong>
        </p>
      </div>

      {/* Modal for adding/editing user */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editMode ? 'Edit User' : 'Add New User'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => {
                    setShowModal(false);
                    setEditMode(false);
                    setCurrentUserId(null);
                  }}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="team_id" className="form-label">Team</label>
                    <select
                      className="form-select"
                      id="team_id"
                      name="team_id"
                      value={formData.team_id}
                      onChange={handleInputChange}
                    >
                      <option value="">No team</option>
                      {teams.map(team => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password {editMode && <small className="text-muted">(leave blank to keep current)</small>}
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required={!editMode}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setShowModal(false);
                      setEditMode(false);
                      setCurrentUserId(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-save me-2"></i>
                    {editMode ? 'Update User' : 'Save User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
