import React from 'react';

export default function TripDetailsModal({ trip, onClose }) {
    if (!trip) return null;

    return (
        <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 id="modal-title">Trip Details</h2>
                    <button className="close-btn" onClick={onClose} aria-label="Close modal">&times;</button>
                </div>

                <div className="modal-body">
                    <div className="detail-section">
                        <h3>Route Information</h3>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <span className="label">Route No:</span>
                                <span className="value">{trip.routeNumber || "N/A"}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Distance:</span>
                                <span className="value">{trip.distance || "N/A"}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">From:</span>
                                <span className="value">{trip.startLocation}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">To:</span>
                                <span className="value">{trip.endLocation}</span>
                            </div>
                        </div>
                    </div>

                    <div className="detail-section">
                        <h3>Bus Details</h3>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <span className="label">Bus Name:</span>
                                <span className="value">{trip.busName || "N/A"}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Bus Number:</span>
                                <span className="value">{trip.busNumber}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Service Type:</span>
                                <span className="value">{trip.serviceType || (trip.highway ? "Highway" : "Normal")}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Contact:</span>
                                <span className="value">{trip.contactNumber || "N/A"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="detail-section">
                        <h3>Schedule & Pricing</h3>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <span className="label">Departure:</span>
                                <span className="value">{trip.departureTime}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Arrival:</span>
                                <span className="value">{trip.arrivalTime}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Ticket Price:</span>
                                <span className="value highlight">{trip.price ? `LKR ${trip.price}` : "N/A"}</span>
                            </div>
                        </div>
                    </div>

                    {trip.stops && trip.stops.length > 0 && (
                        <div className="detail-section">
                            <h3>Stops</h3>
                            <ul className="stops-list">
                                {trip.stops.map((stop, index) => (
                                    <li key={index}>{stop}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {trip.notes && (
                        <div className="detail-section">
                            <h3>Notes</h3>
                            <p className="notes-text">{trip.notes}</p>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn btn-primary" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}