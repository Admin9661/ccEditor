import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import Signup from './components/Signup';
import Editor from './components/Editor';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Landing from './components/Landing';

function App() {
    return (
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                        <Route path="/documents/:id" element={<PrivateRoute><Editor /></PrivateRoute>} />
                    </Routes>
                </Layout>
            </Router>
    );
}

export default App;
