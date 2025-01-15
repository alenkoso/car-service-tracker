import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import VehicleList from './pages/VehicleList'
import ServiceList from './pages/ServiceList'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<VehicleList />} />
          <Route path="/services" element={<ServiceList />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App