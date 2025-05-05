import React from "react";
import { Route, Routes } from "react-router-dom";
import UserSignup from "./Page/UserSignup";
import GarbageCollectorSignup from "./Page/GarbageCollectorSignup";
import Login from "./Page/Login";
import HomePage from "./Page/User/HomePage";
import SchedulePage from "./Page/User/SchedulePage";
import HistoryPage from "./Page/User/HistoryPage";
import ContactPage from "./Page/User/ContactPage";
import ViewPost from "./Page/User/ViewPost";
import AdminHomePage from "./Page/Admin/AdminHomePage";
import AddPostPage from "./Page/Admin/AddPostPage";
import EditPostPage from "./Page/Admin/EditPostPage";
import NoticePage from "./Page/Admin/NoticePage";
import RequestPage from "./Page/Admin/Requestpage";
import TrafficePage from "./Page/Admin/TrafficePage";
import CollectorHistoryPage from "./Page/Admin/CollectorHistoryPage";
import UsersPage from "./Page/Admin/UsersPage";
import GCHomePage from "./Page/GC/GCHomePage";
import PickUpPage from "./Page/GC/PickUpPage";
import LandingPage from "./Page/LandingPage";
import GCViewPost from "./Page/GC/GCViewpost";
import CollectionForm from "./Page/User/CollectionForm";
import GCHistoryPage from "./Page/GC/GCHistoryPage";
import GCContactPage from "./Page/GC/GCContactPage";
import PaymentForm from "./components/PaymentForm";
import Success from "./components/Success";
import Failure from "./components/Failure";
function App() {
  return (
    <div>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/signup/user" element={<UserSignup />} />
        <Route path="/signup/garbage-collector" element={<GarbageCollectorSignup />} />
        <Route path="/login" element={<Login />} />

        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />

        {/* User Routes */}
        <Route path="/userHome" element={<HomePage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/viewPost" element={<ViewPost />} />
        <Route path="/schedule/new" element={<CollectionForm />} />

        {/* Admin Routes */}
        <Route path="/adminHome" element={<AdminHomePage />} />
        <Route path="/addPost" element={<AddPostPage />} />
        <Route path="/editPost" element={<EditPostPage />} />
        <Route path="/notice" element={<NoticePage />} />
        <Route path="/traffic" element={<TrafficePage />} />
        <Route path="/Requestpage" element={<RequestPage />} />
        <Route path="/GarbageCollectorHistory" element={<CollectorHistoryPage />} />
        <Route path="/users" element={<UsersPage />} />

        {/* Garbage Collector Routes */}
        <Route path="/gcHome" element={<GCHomePage />} />
        <Route path="/pickup" element={<PickUpPage />} />
        <Route path="/gcHistory" element={<GCHistoryPage />} />
        <Route path="/gcContact" element={<GCContactPage />} />
        <Route path="/gcviewpost" element={<GCViewPost />} />

        {/* Payment Routes */}
        <Route path="/payment" element={<PaymentForm />} />
        <Route path="/payment-success" element={<Success />} />
        <Route path="/payment-failure" element={<Failure />} />

      </Routes>


    </div>
  );
}

export default App;
