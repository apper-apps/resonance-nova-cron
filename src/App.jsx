import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import MusicPlayer from '@/components/pages/MusicPlayer';
import Settings from '@/components/pages/Settings';

function App() {
  return (
<Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<MusicPlayer />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </Router>
  );
}

export default App;