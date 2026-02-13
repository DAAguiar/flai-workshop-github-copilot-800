import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    user: '',
    activity_type: 'Running',
    duration: '',
    distance: '',
    calories_burned: '',
    date: new Date().toISOString().split('T')[0]
  });

  const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`;

  const fetchActivities = () => {
    console.log('Activities component - Fetching from:', apiUrl);
    
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Activities component - Fetched data:', data);
        const activitiesData = data.results || data;
        setActivities(Array.isArray(activitiesData) ? activitiesData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Activities component - Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchActivities();
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
    
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Activity created:', data);
        setShowModal(false);
        setFormData({
          user: '',
          activity_type: 'Running',
          duration: '',
          distance: '',
          calories_burned: '',
          date: new Date().toISOString().split('T')[0]
        });
        fetchActivities();
      })
      .catch(error => {
        console.error('Error creating activity:', error);
        alert('Error creating activity. Please try again.');
      });
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading activities...</p>
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
          <i className="bi bi-activity me-2"></i>
          Activity Tracking
        </h2>
        <button 
          className="btn btn-success"
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Log Activity
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Activity Type</th>
              <th>Duration (mins)</th>
              <th>Distance (km)</th>
              <th>Calories</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <tr key={activity.id}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>{activity.user_name || activity.user}</strong>
                  </td>
                  <td>
                    <span className="badge bg-info">{activity.activity_type}</span>
                  </td>
                  <td>{activity.duration}</td>
                  <td>{activity.distance}</td>
                  <td>
                    <span className="badge bg-warning text-dark">
                      {activity.calories_burned} cal
                    </span>
                  </td>
                  <td>{new Date(activity.date).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  <i className="bi bi-inbox me-2"></i>
                  No activities found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3">
        <p className="text-muted">
          <i className="bi bi-info-circle me-2"></i>
          Total Activities: <strong>{activities.length}</strong>
        </p>
      </div>

      {/* Modal for adding new activity */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Log New Activity</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="user" className="form-label">User ID</label>
                    <input
                      type="number"
                      className="form-control"
                      id="user"
                      name="user"
                      value={formData.user}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter user ID"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="activity_type" className="form-label">Activity Type</label>
                    <select
                      className="form-select"
                      id="activity_type"
                      name="activity_type"
                      value={formData.activity_type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Running">Running</option>
                      <option value="Cycling">Cycling</option>
                      <option value="Swimming">Swimming</option>
                      <option value="Walking">Walking</option>
                      <option value="Gym">Gym</option>
                      <option value="Yoga">Yoga</option>
                    </select>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="duration" className="form-label">Duration (mins)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        required
                        min="1"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="distance" className="form-label">Distance (km)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        id="distance"
                        name="distance"
                        value={formData.distance}
                        onChange={handleInputChange}
                        required
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="calories_burned" className="form-label">Calories Burned</label>
                    <input
                      type="number"
                      className="form-control"
                      id="calories_burned"
                      name="calories_burned"
                      value={formData.calories_burned}
                      onChange={handleInputChange}
                      required
                      min="1"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="date" className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    <i className="bi bi-check-circle me-2"></i>
                    Log Activity
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

export default Activities;
