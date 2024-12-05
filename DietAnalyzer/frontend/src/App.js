import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecipeGeneration from '@/components/RecipeGeneration/index';
import AllRecipes from './components/RecipeGeneration/AllRecipes';
import { Provider, useSelector } from 'react-redux';
import appStore from './store/appStore';
import SignIn from './components/Auth/SignIn';
import MealLogging from '@/components/MealLogging';
import AuthLayout from './components/Auth/Layout';
import Dashboard from './components/Dashboard';
import RecipeForm from './components/RecipeGeneration/RecipeForm';
import GenerateReport from './components/GeneratePDF/GenerateReport';

const ConditionalRoute = ({ children }) => {
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  
  if (isAuthenticated) {
    return <Navigate to="/meal-logging" />;
  }

  return children;
};

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  return <AuthLayout>{children}</AuthLayout>;
};

function App() {
  return (
    <Provider store={appStore}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={
            <ConditionalRoute>
              <HomePage />
            </ConditionalRoute>
          } />
          <Route path="/signin" element={
            <Navigate to="/" state={{ scrollToSignIn: true }} />
          } />          
          {/* Protected routes */}
          <Route path="/meal-logging" element={
            <ProtectedRoute>
              <MealLogging />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/recipe-generation" element={
            <ProtectedRoute>
              <RecipeGeneration />
            </ProtectedRoute>
          } />
          
          
          <Route path="/recipe-form" element={
            <ProtectedRoute>
              <RecipeForm />
            </ProtectedRoute>
          } />
          
          <Route path="/all-recipes" element={
            <ProtectedRoute>
              <AllRecipes />
            </ProtectedRoute>
          } />

          <Route path="/generate-report" element={
            <ProtectedRoute>
              <GenerateReport />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;