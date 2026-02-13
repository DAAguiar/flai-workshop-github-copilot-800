import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`;

  useEffect(() => {
    console.log('Leaderboard component - Fetching from:', apiUrl);
    
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Leaderboard component - Fetched data:', data);
        const leaderboardData = data.results || data;
        setLeaderboard(Array.isArray(leaderboardData) ? leaderboardData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Leaderboard component - Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [apiUrl]);

  const getRankBadge = (rank) => {
    switch(rank) {
      case 1:
        return <span className="badge bg-warning text-dark fs-6">🥇 1st</span>;
      case 2:
        return <span className="badge bg-secondary fs-6">🥈 2nd</span>;
      case 3:
        return <span className="badge fs-6" style={{backgroundColor: '#cd7f32', color: 'white'}}>🥉 3rd</span>;
      default:
        return <span className="badge bg-primary">{rank}</span>;
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading leaderboard...</p>
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
      <div className="mb-4">
        <h2 className="mb-0">
          <i className="bi bi-trophy-fill me-2 text-warning"></i>
          Leaderboard
        </h2>
        <p className="text-muted mt-2">Top performers based on calories burned</p>
      </div>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <div className="row mb-5">
          {/* 2nd Place */}
          <div className="col-4 d-flex flex-column align-items-center">
            <div className="card w-100" style={{marginTop: '40px'}}>
              <div className="card-body text-center">
                <div className="mb-2">🥈</div>
                <h5 className="card-title">{leaderboard[1].user_name || leaderboard[1].user}</h5>
                <p className="card-text">
                  <strong className="text-secondary fs-4">{leaderboard[1].total_calories}</strong>
                  <br />
                  <small className="text-muted">calories</small>
                </p>
                <span className="badge bg-secondary">2nd Place</span>
              </div>
            </div>
          </div>
          
          {/* 1st Place */}
          <div className="col-4 d-flex flex-column align-items-center">
            <div className="card w-100 border-warning" style={{borderWidth: '3px'}}>
              <div className="card-body text-center">
                <div className="mb-2" style={{fontSize: '2rem'}}>🏆</div>
                <h5 className="card-title text-warning">{leaderboard[0].user_name || leaderboard[0].user}</h5>
                <p className="card-text">
                  <strong className="text-warning fs-3">{leaderboard[0].total_calories}</strong>
                  <br />
                  <small className="text-muted">calories</small>
                </p>
                <span className="badge bg-warning text-dark">Champion</span>
              </div>
            </div>
          </div>
          
          {/* 3rd Place */}
          <div className="col-4 d-flex flex-column align-items-center">
            <div className="card w-100" style={{marginTop: '40px'}}>
              <div className="card-body text-center">
                <div className="mb-2">🥉</div>
                <h5 className="card-title">{leaderboard[2].user_name || leaderboard[2].user}</h5>
                <p className="card-text">
                  <strong className="fs-4" style={{color: '#cd7f32'}}>{leaderboard[2].total_calories}</strong>
                  <br />
                  <small className="text-muted">calories</small>
                </p>
                <span className="badge" style={{backgroundColor: '#cd7f32', color: 'white'}}>3rd Place</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <h4 className="mb-3">
        <i className="bi bi-list-ol me-2"></i>
        Full Rankings
      </h4>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Total Calories</th>
              <th>Total Activities</th>
              <th>Average per Activity</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.length > 0 ? (
              leaderboard.map((entry, index) => (
                <tr key={entry.id || index} className={index < 3 ? 'table-active' : ''}>
                  <td>{getRankBadge(index + 1)}</td>
                  <td>
                    <strong>{entry.user_name || entry.user}</strong>
                  </td>
                  <td>
                    <span className="badge bg-success">
                      {entry.total_calories} cal
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-info">
                      {entry.total_activities} activities
                    </span>
                  </td>
                  <td>
                    {entry.total_activities > 0 
                      ? Math.round(entry.total_calories / entry.total_activities) 
                      : 0} cal/activity
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  <i className="bi bi-inbox me-2"></i>
                  No leaderboard data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3">
        <p className="text-muted">
          <i className="bi bi-info-circle me-2"></i>
          Total Participants: <strong>{leaderboard.length}</strong>
        </p>
      </div>
    </div>
  );
}

export default Leaderboard;
