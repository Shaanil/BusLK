import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function TripDetailsModal({ trip, onClose }) {
    const [feedbackUseful, setFeedbackUseful] = useState(null); // true / false
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState(null);

    if (!trip) return null;

    const handleSubmitFeedback = async () => {
        if (feedbackUseful === null) {
            setFeedbackMessage('Please select Yes or No first.');
            return;
        }

        try {
            setSubmitting(true);
            setFeedbackMessage(null);

            const { error } = await supabase
                .from('trip_feedback')
                .insert([
                    {
                        trip_id: trip.id,
                        useful: feedbackUseful,
                        comment: comment || null,
                    },
                ]);

            if (error) {
                console.error(error);
                setFeedbackMessage('Could not save your feedback. Please try again.');
                return;
            }

            setFeedbackMessage('Thank you for your feedback!');
            setComment('');
        } catch (err) {
            console.error(err);
            setFeedbackMessage('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Trip Details</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
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
                            {trip.stops && trip.stops.length > 0 && (
                                <div className="detail-item detail-full-width">
                                    <span className="label">Stops :</span>
                                    <span className="value">
                                        {trip.stops.join(', ')}
                                    </span>
                                </div>
                            )}
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

                    <div className="detail-section">
                        <h3>Feedback</h3>
                        <p style={{ marginBottom: '0.5rem', fontWeight: 500 }}>
                            Was this information useful?
                        </p>

                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <button
                                type="button"
                                onClick={() => setFeedbackUseful(true)}
                                disabled={submitting}
                                className={feedbackUseful === true ? 'btn btn-primary' : 'btn btn-outline'}
                            >
                                👍 Yes
                            </button>
                            <button
                                type="button"
                                onClick={() => setFeedbackUseful(false)}
                                disabled={submitting}
                                className={feedbackUseful === false ? 'btn btn-primary' : 'btn btn-outline'}
                            >
                                👎 No
                            </button>
                        </div>

                        <textarea
                            placeholder="Optional: tell us why..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={3}
                            style={{ width: '100%', marginBottom: '0.5rem' }}
                            disabled={submitting}
                        />

                        <button
                            type="button"
                            onClick={handleSubmitFeedback}
                            disabled={submitting}
                            className="btn btn-secondary"
                        >
                            {submitting ? 'Sending...' : 'Submit feedback'}
                        </button>

                        {feedbackMessage && (
                            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                                {feedbackMessage}
                            </div>
                        )}
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-primary" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}
