import { useState, useEffect } from 'react';
import api from '../../lib/api.js';

const PasswordResets = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/educators/password-resets');
      setRequests(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load password reset requests');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (id) => {
    if (!window.confirm("Are you sure you want to reset this student's password to 'password'?")) return;
    setActionLoading(id);
    try {
      await api.post(`/educators/password-resets/${id}/reset`);
      // Remove from list after successful reset
      setRequests((prev) => prev.filter(r => r._id !== id));
      alert('Password reset successfully.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="panel">Loading requests...</div>;
  if (error) return <div className="panel"><div className="alert-error">⚠️ {error}</div></div>;

  return (
    <div className="panel" style={{ animation: 'slideUp 0.4s ease' }}>
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Password Reset Requests</h2>
          <p className="panel-subtitle">Students who forgot their password</p>
        </div>
        <button className="button button--secondary" onClick={fetchRequests}>
          🔄 Refresh
        </button>
      </div>

      {requests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
          <p style={{ fontSize: '18px', fontWeight: '500' }}>No pending password reset requests.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Date Requested</th>
                <th>Student Name</th>
                <th>Student ID</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req._id}>
                  <td>{new Date(req.createdAt).toLocaleString()}</td>
                  <td>{req.studentId?.name || 'Unknown'}</td>
                  <td><span className="badge badge-info">{req.studentId?.studentId || 'N/A'}</span></td>
                  <td>{req.studentId?.email || req.email}</td>
                  <td>
                    <button 
                      className="button button--primary button--sm" 
                      onClick={() => handleReset(req._id)}
                      disabled={actionLoading === req._id}
                    >
                      {actionLoading === req._id ? 'Resetting...' : 'Reset to "password"'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PasswordResets;
