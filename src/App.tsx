import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { BrandingSettings } from './pages/BrandingSettings';
import { RetirementTaxCalculator } from './components/calculators/RetirementTaxCalculator';
import { EmbeddedCalculator } from './pages/EmbeddedCalculator';
import { AuthGuard } from './components/AuthGuard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Embedded calculator routes - no auth or layout wrapper */}
        <Route path="/embed/calculator/retirement-tax" element={<EmbeddedCalculator />} />
        
        {/* Main app routes with auth and layout */}
        <Route element={<AuthGuard><Layout /></AuthGuard>}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="branding" element={<BrandingSettings />} />
          <Route path="calculator/retirement-tax" element={<RetirementTaxCalculator />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}