import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function RouteSuggestionForm({ defaultStart, defaultEnd }) {
    const [startLocation, setStartLocation] = useState(defaultStart || "");
    const [endLocation, setEndLocation] = useState(defaultEnd || "");
    const [preferredTime, setPreferredTime] = useState("");
    const [notes, setNotes] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!startLocation || !endLocation) return;

        try {
            setSubmitting(true);
            setMessage(null);

            const { error } = await supabase
                .from("route_suggestions")
                .insert([
                    {
                        start_location: startLocation,
                        end_location: endLocation,
                        preferred_time: preferredTime || null,
                        notes: notes || null,
                        contact_email: contactEmail || null,
                    },
                ]);

            if (error) {
                console.error(error);
                setMessage("Could not send suggestion. Please try again.");
                return;
            }

            setMessage("Thank you! Your route suggestion has been recorded.");
            setPreferredTime("");
            setNotes("");
            // keep start/end so they see what they submitted
        } catch (err) {
            console.error(err);
            setMessage("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ marginTop: "0.75rem" }}>
            {!isOpen ? (
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    style={{
                        border: "none",
                        background: "none",
                        padding: 0,
                        margin: 0,
                        color: "var(--primary-color)",
                        fontSize: "0.85rem",
                        textDecoration: "underline",
                        cursor: "pointer",
                    }}
                >
                    Can't find your route? Suggest one.
                </button>
            ) : (
                <div
                    style={{
                        marginTop: "0.5rem",
                        padding: "0.75rem",
                        border: "1px solid #eee",
                        borderRadius: 6,
                        fontSize: "0.85rem",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "0.5rem",
                        }}
                    >
                        <h4 style={{ margin: 0, fontSize: "0.95rem" }}>Suggest a route</h4>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            style={{
                                border: "none",
                                background: "none",
                                fontSize: "0.85rem",
                                cursor: "pointer",
                                color: "var(--text-secondary)",
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        style={{ marginTop: "0.25rem", display: "grid", gap: "0.4rem" }}
                    >
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem" }}>
                            <div>
                                <label style={{ fontSize: "0.8rem" }}>From</label>
                                <input
                                    type="text"
                                    value={startLocation}
                                    onChange={(e) => setStartLocation(e.target.value)}
                                    required
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: "0.8rem" }}>To</label>
                                <input
                                    type="text"
                                    value={endLocation}
                                    onChange={(e) => setEndLocation(e.target.value)}
                                    required
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: "0.8rem" }}>Preferred time (optional)</label>
                            <input
                                type="text"
                                placeholder="e.g.7–9am"
                                value={preferredTime}
                                onChange={(e) => setPreferredTime(e.target.value)}
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: "0.8rem" }}>Extra details (optional)</label>
                            <textarea
                                placeholder="Bus name, frequency, notes..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={2}
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: "0.8rem" }}>Contact Number (optional)</label>
                            <input
                                type="text"
                                placeholder="If you want us to contact you"
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                className="input-field"
                            />
                        </div>

                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                            <button type="submit" disabled={submitting} className="btn btn-primary">
                                {submitting ? "Sending..." : "Send"}
                            </button>
                            {message && (
                                <div style={{ fontSize: "0.8rem" }}>
                                    {message}
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}