import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import MainLayout from './components/layout/MainLayout';

import Dashboard from './pages/Dashboard';
import UsersPage from './pages/UsersPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import TaxCalculationPage from './pages/TaxCalculationPage';
import TariffAiPage from './pages/TariffAiPage';
import RaporDeneme from './pages/RaporDeneme';
import MyCompaniesPage from './pages/MyCompaniesPage';
import BTBPage from './pages/BTBPage';
import KpiReportPage from './pages/KpiReportPage';

function App() {
    return (
        <ConfigProvider theme={{ token: { fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" } }}>
            <Router>
                <MainLayout>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/analytics" element={<Dashboard />} />
                        <Route path="/users" element={<UsersPage />} />
                        <Route path="/reports" element={<ReportsPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/tax-calculation" element={<TaxCalculationPage />} />
                        <Route path="/tariff-ai" element={<TariffAiPage />} />
                        <Route path="/rapor-deneme" element={<RaporDeneme />} />
                        <Route path="/firmalarim" element={<MyCompaniesPage />} />
                        <Route path="/btb" element={<BTBPage />} />
                        <Route path="/reports/kpi" element={<KpiReportPage />} />
                    </Routes>
                </MainLayout>
            </Router>
        </ConfigProvider>
    );
}

export default App;
