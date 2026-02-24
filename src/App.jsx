import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import ChatWidget from './components/ChatWidget';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/UsersPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import TaxCalculationPage from './pages/TaxCalculationPage';

function App() {
    return (
        <Router>
            <MainLayout>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/analytics" element={<Dashboard />} />
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/tax-calculation" element={<TaxCalculationPage />} />
                </Routes>
            </MainLayout>
            <ChatWidget />
        </Router>
    );
}

export default App;
