import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              <img src="/octofitapp-small.png" alt="OctoFit Logo" className="navbar-logo" />
              OctoFit Tracker
            </Link>
            <button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav"
              aria-controls="navbarNav" 
              aria-expanded="false" 
              aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/users">
                    <i className="bi bi-people-fill me-1"></i>
                    Users
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/activities">
                    <i className="bi bi-activity me-1"></i>
                    Activities
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/teams">
                    <i className="bi bi-people me-1"></i>
                    Teams
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/leaderboard">
                    <i className="bi bi-trophy-fill me-1"></i>
                    Leaderboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/workouts">
                    <i className="bi bi-clipboard-pulse me-1"></i>
                    Workouts
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={
            <div className="container mt-5">
              <div className="jumbotron text-center mb-5">
                <h1 className="display-3 mb-3">
                  <i className="bi bi-heart-pulse-fill text-gradient me-3"></i>
                  Welcome to OctoFit Tracker
                </h1>
                <p className="lead mb-4">
                  Track your fitness activities, compete with your team, and achieve your goals!
                </p>
                <hr className="my-4" />
                <p className="mb-4">
                  Get started by exploring the different sections of the app using the navigation menu above.
                </p>
                <Link to="/activities" className="btn btn-primary btn-lg me-2">
                  <i className="bi bi-play-circle me-2"></i>
                  Get Started
                </Link>
                <Link to="/leaderboard" className="btn btn-success btn-lg">
                  <i className="bi bi-trophy-fill me-2"></i>
                  View Leaderboard
                </Link>
              </div>

              {/* Feature Cards */}
              <div className="row g-4 mb-5">
                <div className="col-md-6 col-lg-4">
                  <div className="card h-100">
                    <div className="card-body text-center">
                      <div className="mb-3" style={{fontSize: '3rem'}}>
                        <i className="bi bi-activity text-primary"></i>
                      </div>
                      <h5 className="card-title">Track Activities</h5>
                      <p className="card-text">
                        Log your daily workouts including running, cycling, swimming, and more.
                      </p>
                      <Link to="/activities" className="btn btn-outline-primary">
                        View Activities
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4">
                  <div className="card h-100">
                    <div className="card-body text-center">
                      <div className="mb-3" style={{fontSize: '3rem'}}>
                        <i className="bi bi-people text-success"></i>
                      </div>
                      <h5 className="card-title">Join Teams</h5>
                      <p className="card-text">
                        Create or join teams to compete with others and stay motivated together.
                      </p>
                      <Link to="/teams" className="btn btn-outline-success">
                        View Teams
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4">
                  <div className="card h-100">
                    <div className="card-body text-center">
                      <div className="mb-3" style={{fontSize: '3rem'}}>
                        <i className="bi bi-trophy-fill text-warning"></i>
                      </div>
                      <h5 className="card-title">Compete</h5>
                      <p className="card-text">
                        Check out the leaderboard to see how you rank against other users.
                      </p>
                      <Link to="/leaderboard" className="btn btn-outline-warning">
                        View Leaderboard
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4">
                  <div className="card h-100">
                    <div className="card-body text-center">
                      <div className="mb-3" style={{fontSize: '3rem'}}>
                        <i className="bi bi-clipboard-pulse text-info"></i>
                      </div>
                      <h5 className="card-title">Workout Plans</h5>
                      <p className="card-text">
                        Get personalized workout suggestions tailored to your fitness level.
                      </p>
                      <Link to="/workouts" className="btn btn-outline-info">
                        View Workouts
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4">
                  <div className="card h-100">
                    <div className="card-body text-center">
                      <div className="mb-3" style={{fontSize: '3rem'}}>
                        <i className="bi bi-people-fill text-danger"></i>
                      </div>
                      <h5 className="card-title">User Profiles</h5>
                      <p className="card-text">
                        Manage user accounts and track individual fitness progress.
                      </p>
                      <Link to="/users" className="btn btn-outline-danger">
                        View Users
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4">
                  <div className="card h-100">
                    <div className="card-body text-center">
                      <div className="mb-3" style={{fontSize: '3rem'}}>
                        <i className="bi bi-graph-up text-primary"></i>
                      </div>
                      <h5 className="card-title">Track Progress</h5>
                      <p className="card-text">
                        Monitor your fitness journey with detailed statistics and insights.
                      </p>
                      <button className="btn btn-outline-primary" disabled>
                        Coming Soon
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Banner */}
              <div className="card bg-dark text-white mb-5">
                <div className="card-body">
                  <div className="row text-center">
                    <div className="col-md-4 mb-3 mb-md-0">
                      <h3 className="mb-0">
                        <i className="bi bi-people-fill me-2"></i>
                        100+
                      </h3>
                      <p className="text-muted mb-0">Active Users</p>
                    </div>
                    <div className="col-md-4 mb-3 mb-md-0">
                      <h3 className="mb-0">
                        <i className="bi bi-activity me-2"></i>
                        1000+
                      </h3>
                      <p className="text-muted mb-0">Activities Logged</p>
                    </div>
                    <div className="col-md-4">
                      <h3 className="mb-0">
                        <i className="bi bi-fire me-2"></i>
                        50K+
                      </h3>
                      <p className="text-muted mb-0">Calories Burned</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          } />
          <Route path="/users" element={<Users />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
