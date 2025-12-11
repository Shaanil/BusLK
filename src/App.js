import React, { Suspense, lazy } from 'react';

const Home = lazy(() => import("./pages/Home"));

function App() {
    return (
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>Loading...</div>}>
            <Home />
        </Suspense>
    );
}

export default App;
