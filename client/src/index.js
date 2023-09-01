import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ContextWrapper } from "./context/OrganizationsContext";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import OrganizationDetails from './components/organization/OrganizationDetails';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ContextWrapper>
    <BrowserRouter>
			<Routes>
				<Route path="/" element={<App />} />
				<Route path="/:id" element={<OrganizationDetails />} />
			</Routes>
		</BrowserRouter>
    </ContextWrapper>
  </React.StrictMode>
);
