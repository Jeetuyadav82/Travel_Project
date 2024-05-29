import React from 'react';
import { BrowserRouter , Routes, Route } from 'react-router-dom';
import ProtectedAdminRoute from './ProtectedAdminRoute';
import ProtectedUserRoute from './ProtectedUserRoute';
import AddUser from './AddUser';
import AddTravelPlan from './AddTravelPlan';
import UsersListWithAllDetails from './UsersListWithAllDetails';
import TravelPlanList from './TravelPlanList';
import UserBookPlan from './UserBookPlan';
import UserBookedPlans from './UserBookedPlans';
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Admin from './Admin'
import User from './User'
import LoginPage from './LoginPage'
import Logout from './Logout'
import ResetPassword from './ResetPassword'
import TestingPage from './TestingPage'


const App = () => {
  return (
    <BrowserRouter>
                <Routes>
                  <Route path="/"  element={<TestingPage/>} />
                  <Route path="/login"  element={<LoginPage/>} />
                  <Route path="/logout" element={<Logout/>}/>
                  <Route path="/reset-password/:uid/:token" element={<ResetPassword/>} />

                  <Route element={<ProtectedAdminRoute />}>
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/add-user" element={<AddUser />} />
                    <Route path="/admin/users" element={<UsersListWithAllDetails />} />
                    <Route path="/admin/add-plan" element={<AddTravelPlan />} />
                    <Route path="/admin/travel-plans" element={<TravelPlanList/>} />
                  </Route>

                  <Route element={<ProtectedUserRoute />}>
                    <Route path="/user" element={<User />} />
                    <Route path="/user/book-plan" element={<UserBookPlan />} />
                    <Route path="/user/bookings" element={<UserBookedPlans />} />
                    <Route path="/travel/plans" element={<TravelPlanList/>} />
                  </Route>

                </Routes>

    </BrowserRouter>
  );
};

export default App;
