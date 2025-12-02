export default function TripCard({ trip, onSelect }) {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(trip);
        }
    };

    return (
        <div
            className="card"
            onClick={() => onSelect(trip)}
            onKeyDown={handleKeyDown}
            tabIndex="0"
            role="button"
            aria-label={`View details for trip from ${trip.startLocation} to ${trip.endLocation}`}
            style={{ cursor: 'pointer' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-color)' }}>
                    {trip.startLocation} <span style={{ color: 'var(--text-secondary)', margin: '0 0.5rem' }}>→</span> {trip.endLocation}
                </h3>
                <span style={{
                    backgroundColor: trip.highway ? '#dcfce7' : '#f1f5f9',
                    color: trip.highway ? '#166534' : '#334155',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                }}>
                    {trip.highway ? "Highway" : "Normal"}
                </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Departure</p>
                    <p style={{ fontWeight: '600', fontSize: '1.125rem' }}>{trip.departureTime}</p>
                </div>
                <div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Arrival</p>
                    <p style={{ fontWeight: '600', fontSize: '1.125rem' }}>{trip.arrivalTime}</p>
                </div>
            </div>

            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Bus Number: <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{trip.busNumber}</span>
                </p>
                <span className="btn btn-primary" style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}>
                    View Details
                </span>
            </div>
        </div>
    );
}
