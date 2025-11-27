import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import TripCard from "./TripCard";
import TripDetailsModal from "./TripDetailsModal";

export default function SearchTrips() {
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searched, setSearched] = useState(false);
    const [locations, setLocations] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(null);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                // Fetch all unique start and end locations from the 'trips' table
                const { data, error } = await supabase
                    .from('trips')
                    .select('start_location, end_location');

                if (error) throw error;

                const allLocations = [
                    ...data.map(t => t.start_location),
                    ...data.map(t => t.end_location)
                ];
                const uniqueLocations = [...new Set(allLocations)].filter(Boolean).sort();
                setLocations(uniqueLocations);
            } catch (err) {
                console.error("Failed to fetch locations:", err);
                setError("Could not load locations. Please check your connection.");
            }
        };

        fetchLocations();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!start || !end) return;

        setLoading(true);
        setError(null);
        setSearched(true);

        try {
            const { data, error } = await supabase
                .from('trips')
                .select('*')
                .eq('start_location', start)
                .eq('end_location', end);

            if (error) throw error;

            // Map snake_case DB fields to camelCase for the UI
            const formattedResults = data.map(trip => ({
                id: trip.id,
                startLocation: trip.start_location,
                endLocation: trip.end_location,
                busNumber: trip.bus_number,
                departureTime: trip.departure_time,
                arrivalTime: trip.arrival_time,
                highway: trip.highway,
                routeNumber: trip.route_number,
                distance: trip.distance,
                busName: trip.bus_name,
                serviceType: trip.service_type,
                contactNumber: trip.contact_number,
                price: trip.price,
                stops: trip.stops, // Assuming this is stored as an array or JSON
                notes: trip.notes
            }));

            setResults(formattedResults);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch trips. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Find Your Bus</h2>
                <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>From</label>
                            <select
                                className="input-field"
                                value={start}
                                onChange={(e) => setStart(e.target.value)}
                                style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem top 50%', backgroundSize: '0.65rem auto' }}
                            >
                                <option value="">Select Location</option>
                                {locations.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>To</label>
                            <select
                                className="input-field"
                                value={end}
                                onChange={(e) => setEnd(e.target.value)}
                                style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem top 50%', backgroundSize: '0.65rem auto' }}
                            >
                                <option value="">Select Destination</option>
                                {locations.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ marginTop: '0.5rem' }}
                        disabled={loading}
                    >
                        {loading ? "Searching..." : "Search Trips"}
                    </button>
                </form>
            </div>

            {error && (
                <div style={{
                    padding: '1rem',
                    backgroundColor: '#fee2e2',
                    color: '#991b1b',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1rem',
                    textAlign: 'center'
                }}>
                    {error}
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {searched && !loading && results.length === 0 && !error ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                        <p>No trips found for this route.</p>
                    </div>
                ) : (
                    results.map((trip) => (
                        <TripCard
                            key={trip.id}
                            trip={trip}
                            onSelect={setSelectedTrip}
                        />
                    ))
                )}
            </div>

            {selectedTrip && (
                <TripDetailsModal
                    trip={selectedTrip}
                    onClose={() => setSelectedTrip(null)}
                />
            )}
        </div>
    );
}
