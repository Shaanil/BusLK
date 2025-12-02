import { lazy, Suspense } from "react";

const Home = lazy(() => import("./pages/Home"));

function App() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1 }}>
                <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>}>
                    <Home />
                </Suspense>
            </div>
            <footer style={{ textAlign: 'center', margin: '1rem 0', padding: '1rem' }}>
                <a href="/privacy.html" style={{ color: 'var(--text-secondary)', textDecoration: 'none', margin: '0 0.5rem' }}>Privacy Policy</a> |
                <a href="/terms.html" style={{ color: 'var(--text-secondary)', textDecoration: 'none', margin: '0 0.5rem' }}>Terms of Service</a> |
                <a href="/about.html" style={{ color: 'var(--text-secondary)', textDecoration: 'none', margin: '0 0.5rem' }}>About Us</a>
                {/* Add the line break here */}
                <br />

                © 2025 Cinnamonhouse Villa. All rights reserved.
            </footer>
        </div>
    );
}

export default App;
