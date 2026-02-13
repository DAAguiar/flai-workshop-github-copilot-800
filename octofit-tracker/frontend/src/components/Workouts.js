import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    activity_type: 'Cardio',
    duration: '',
    difficulty: 'Beginner',
    calories_estimate: ''
  });

  const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`;

  const fetchWorkouts = () => {
    console.log('Workouts component - Fetching from:', apiUrl);
    
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Workouts component - Fetched data:', data);
        const workoutsData = data.results || data;
        setWorkouts(Array.isArray(workoutsData) ? workoutsData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Workouts component - Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchWorkouts();
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
        console.log('Workout created:', data);
        setShowModal(false);
        setFormData({
          name: '',
          description: '',
          activity_type: 'Cardio',
          duration: '',
          difficulty: 'Beginner',
          calories_estimate: ''
        });
        fetchWorkouts();
      })
      .catch(error => {
        console.error('Error creating workout:', error);
        alert('Error creating workout. Please try again.');
      });
  };

  const getDifficultyBadge = (difficulty) => {
    if (!difficulty) return 'secondary';
    switch(difficulty.toLowerCase()) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'warning';
      case 'advanced':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getWorkoutIcon = (type) => {
    if (!type) return '🏃';
    switch(type.toLowerCase()) {
      case 'cardio':
        return '❤️';
      case 'strength':
        return '💪';
      case 'flexibility':
        return '🧘';
      case 'hiit':
        return '⚡';
      default:
        return '🏃';
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading workouts...</p>
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
          <i className="bi bi-clipboard-pulse me-2"></i>
          Workout Suggestions
        </h2>
        <button 
          className="btn btn-success"
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add Workout
        </button>
      </div>

      <div className="row">
        {workouts.length > 0 ? (
          workouts.map(workout => (
            <div key={workout.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex align-items-start mb-3">
                    <span className="me-2" style={{fontSize: '2rem'}}>
                      {getWorkoutIcon(workout.activity_type)}
                    </span>
                    <div className="flex-grow-1">
                      <h5 className="card-title mb-1">{workout.name}</h5>
                      <span className={`badge bg-${getDifficultyBadge(workout.difficulty)}`}>
                        {workout.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  <p className="card-text flex-grow-1">{workout.description}</p>
                  
                  <div className="mt-auto">
                    <hr />
                    <div className="row g-2">
                      <div className="col-4">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-tag me-2 text-primary"></i>
                          <div>
                            <small className="text-muted d-block">Type</small>
                            <strong>{workout.activity_type}</strong>
                          </div>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-clock me-2 text-primary"></i>
                          <div>
                            <small className="text-muted d-block">Duration</small>
                            <strong>{workout.duration} min</strong>
                          </div>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-fire me-2 text-danger"></i>
                          <div>
                            <small className="text-muted d-block">Calories</small>
                            <strong>{workout.calories_estimate}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="btn btn-primary w-100 mt-3">
                      <i className="bi bi-play-circle me-2"></i>
                      Start Workout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="alert alert-info text-center" role="alert">
              <i className="bi bi-inbox me-2"></i>
              No workouts found. Add your first workout to get started!
            </div>
          </div>
        )}
      </div>

      <div className="mt-3">
        <p className="text-muted">
          <i className="bi bi-info-circle me-2"></i>
          Available Workouts: <strong>{workouts.length}</strong>
        </p>
      </div>

      {/* Modal for adding new workout */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Workout</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Workout Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Morning Run"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Describe the workout..."
                    ></textarea>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="activity_type" className="form-label">Type</label>
                      <select
                        className="form-select"
                        id="activity_type"
                        name="activity_type"
                        value={formData.activity_type}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="Cardio">Cardio</option>
                        <option value="Strength">Strength</option>
                        <option value="Flexibility">Flexibility</option>
                        <option value="HIIT">HIIT</option>
                        <option value="Yoga">Yoga</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="difficulty" className="form-label">Difficulty</label>
                      <select
                        className="form-select"
                        id="difficulty"
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="duration" className="form-label">Duration (minutes)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        required
                        min="1"
                        placeholder="30"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="calories_estimate" className="form-label">Estimated Calories</label>
                      <input
                        type="number"
                        className="form-control"
                        id="calories_estimate"
                        name="calories_estimate"
                        value={formData.calories_estimate}
                        onChange={handleInputChange}
                        required
                        min="1"
                        placeholder="300"
                      />
                    </div>
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
                    Add Workout
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

export default Workouts;
