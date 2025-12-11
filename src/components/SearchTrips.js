import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import TripCard from "./TripCard";
import TripDetailsModal from "./TripDetailsModal";
import RouteSuggestionForm   from "./RouteSuggestionForm";

export default function SearchTrips() {
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searched, setSearched] = useState(false);
    const [locations, setLocations] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [allRoutes, setAllRoutes] = useState([]);


    useEffect(() => {
        const fetchLocations = async () => {
            try {
                // Fetch all unique start and end locations from the 'routes' table
                const { data, error } = await supabase
                    .from('routes')
                    .select('start_location, end_location');

                if (error) throw error;

                // Save all route pairs for later filtering
                setAllRoutes(data);

                // Start dropdown shows unique start locations
                const uniqueStarts = [...new Set(data.map(t => t.start_location))]
                    .filter(Boolean)
                    .sort();
                setLocations(uniqueStarts);
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
            // Step 1: find matching routes for selected start/end
            const { data: routeMatches, error: routeError } = await supabase
                .from('routes')
                .select('id, start_location, end_location, route_number, distance, price, service_type, highway, notes')
                .eq('start_location', start)
                .eq('end_location', end);

            if (routeError) throw routeError;

            if (!routeMatches || routeMatches.length === 0) {
                setResults([]);
                setLoading(false);
                return;
            }

            const routeIds = routeMatches.map(r => r.id);

            // Step 2: load trips for those routes, including related route and bus info
            const { data: tripData, error: tripError } = await supabase
                .from('trip')
                .select(`
                    id,
                    departure_time,
                    arrival_time,
                    route:routes(
                        id,
                        start_location,
                        end_location,
                        route_number,
                        distance,
                        price,
                        service_type,
                        highway,
                        notes
                    ),
                    bus:buses(
                        id,
                        bus_number,
                        bus_name,
                        contact_numb
                    )
                `)
                .in('route_id', routeIds)
                .order('departure_time', { ascending: true });

            if (tripError) throw tripError;

            // Build a map of vote counts from the Vote table
            let voteMap = {};
            const tripIds = (tripData || []).map(trip => trip.id);

            if (tripIds.length > 0) {
                const { data: voteData, error: voteError } = await supabase
                    .from('Vote')
                    .select('id, count')
                    .in('id', tripIds);

                if (!voteError && voteData) {
                    voteMap = voteData.reduce((acc, v) => {
                        acc[v.id] = v.count;
                        return acc;
                    }, {});
                }
            }

            // Map DB rows (with nested route & bus) to UI shape
            const formattedResults = (tripData || []).map(trip => ({
                id: trip.id,
                startLocation: trip.route?.start_location,
                endLocation: trip.route?.end_location,
                busNumber: trip.bus?.bus_number,
                departureTime: trip.departure_time,
                arrivalTime: trip.arrival_time,
                highway: trip.route?.highway,
                routeNumber: trip.route?.route_number,
                distance: trip.route?.distance,
                busName: trip.bus?.bus_name,
                serviceType: trip.route?.service_type,
                contactNumber: trip.bus?.contact_numb,
                price: trip.route?.price,
                stops: trip.route?.stops ?? [], // adjust if you later add stops
                notes: trip.route?.notes,
                voteCount: voteMap[trip.id] ?? 0,
            }));

            setResults(formattedResults);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch trips. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (tripId, delta) => {
        try {
            // Find current count from state
            const currentTrip = results.find(t => t.id === tripId);
            const currentCount = currentTrip?.voteCount ?? 0;
            const newCount = currentCount + delta;

            // Optimistically update UI
            setResults(prev =>
                prev.map(t =>
                    t.id === tripId ? { ...t, voteCount: newCount } : t
                )
            );

            // Persist to Supabase Vote table
            const { error: voteError } = await supabase
                .from('Vote')
                .upsert({ id: tripId, count: newCount }, { onConflict: 'id' });

            if (voteError) {
                console.error('Failed to save vote:', voteError);
                setError('Could not save your vote.');
            }
        } catch (err) {
            console.error('Error while voting:', err);
            setError('Could not save your vote.');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Find Your Bus</h2>
                <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label htmlFor="start-location" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>From</label>
                            <select
                                id="start-location"
                                className="input-field"
                                value={start}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setStart(value);
                                }}
                                style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem top 50%', backgroundSize: '0.65rem auto' }}
                            >
                                <option value="">Select Location</option>
                                {allRoutes
                                    .filter(route => !end || route.end_location === end)
                                    .map(route => route.start_location)
                                    .filter(Boolean)
                                    .filter((value, index, self) => self.indexOf(value) === index)
                                    .sort()
                                    .map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="end-location" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>To</label>
                            <select
                                id="end-location"
                                className="input-field"
                                value={end}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setEnd(value);
                                }}
                                style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem top 50%', backgroundSize: '0.65rem auto' }}
                            >
                                <option value="">Select Destination</option>
                                {allRoutes
                                    .filter(route => !start || route.start_location === start)
                                    .map(route => route.end_location)
                                    .filter(Boolean)
                                    .filter((value, index, self) => self.indexOf(value) === index)
                                    .sort()
                                    .map(city => (
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
                        {searched && !loading && results.length === 0 && (
                            <RouteSuggestionForm
                                defaultStart={start}
                                defaultEnd={end}
                            />
                        )}
                    </div>
                ) : (
                    results.map((trip) => (
                        <TripCard
                            key={trip.id}
                            trip={trip}
                            onSelect={setSelectedTrip}
                            onVote={handleVote}
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
