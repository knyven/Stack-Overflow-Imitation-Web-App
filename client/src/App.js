// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import './stylesheets/App.css';
import FakeStackOverflow from './components/fakestackoverflow.js';
import { AuthProvider } from './components/authContext.js';
import React from 'react';

function App() {
  return (
    <AuthProvider>
    <section className="fakeso">
      <FakeStackOverflow />
    </section>
    </AuthProvider>
  );
}

export default App;
