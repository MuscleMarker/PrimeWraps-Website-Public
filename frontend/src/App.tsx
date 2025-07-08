// Import necessary components from react-router-dom for routing
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Import components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

// Import page components
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Contact from './pages/Contact'
import Gallery from './pages/Gallery'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'

/**
 * The main application component.
 * It sets up the routing and layout for the entire application.
 */
function App() {
  return (
    // Router component to handle client-side routing
    <Router>
      {/* Component to scroll to the top of the page on route changes */}
      <ScrollToTop />
      {/* Main container with a minimum height of the screen */}
      <div className="min-h-screen flex flex-col">
        {/* Navigation bar component */}
        <Navbar />
        {/* Main content area that grows to fill available space */}
        <main className="flex-grow">
          {/* Routes component to define the application's routes */}
          <Routes>
            {/* Route for the home page */}
            <Route path="/" element={<Home />} />
            {/* Route for the about page */}
            <Route path="/about" element={<About />} />
            {/* Route for the services page */}
            <Route path="/services" element={<Services />} />
            {/* Route for the gallery page */}
            <Route path="/gallery" element={<Gallery />} />
            {/* Route for the contact page */}
            <Route path="/contact" element={<Contact />} />
            {/* Route for the login page */}
            <Route path="/login" element={<Login />} />
            {/* Route for the admin dashboard page */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            
          </Routes>
        </main>
        {/* Footer component */}
        <Footer />
      </div>
    </Router>
  )
}

// Export the App component as the default export
export default App