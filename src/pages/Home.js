import SearchTrips from "../components/SearchTrips";

export default function Home() {
    return (
        <div>
            <div style={{
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                padding: '4rem 1rem',
                textAlign: 'center',
                marginBottom: '2rem'
            }}>
                <div className="container">
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'white' }}>Sri Lanka Highway Bus Timetable</h1>
                    <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
                        Find the fastest and most convenient highway bus routes across Sri Lanka.
                    </p>
                </div>
            </div>

            <div style={{ paddingBottom: '4rem' }}>
                <SearchTrips />
            </div>
        </div>
    );
}
