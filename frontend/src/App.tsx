import { useState } from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import client from './apollo/client';
import ProjectDashboard from './components/ProjectDashboard';
import ProjectDetail from './components/ProjectDetail';
import { Select } from './components/ui/Input';
import './index.css';

function App() {
  // For demo purposes, we'll have a simple organization selector
  // In a real app, this would come from authentication
  const [organizationSlug, setOrganizationSlug] = useState('acme-corp');

  const organizations = [
    { value: 'acme-corp', label: 'Acme Corporation' },
    { value: 'techstart', label: 'TechStart Inc' },
  ];

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-900">
          {/* Top Navigation */}
          <nav className="bg-slate-800 border-b border-slate-700">
            <div className="max-w-7xl mx-auto px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-bold text-white">Project Manager</h1>
                  <div className="h-6 w-px bg-slate-600"></div>
                  <div className="w-64">
                    <Select
                      value={organizationSlug}
                      onChange={(e) => setOrganizationSlug(e.target.value)}
                      options={organizations}
                    />
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Routes */}
          <Routes>
            <Route
              path="/"
              element={<ProjectDashboard organizationSlug={organizationSlug} />}
            />
            <Route
              path="/projects/:id"
              element={<ProjectDetail organizationSlug={organizationSlug} />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
