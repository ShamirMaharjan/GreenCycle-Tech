import React from "react";
import { Route, Routes } from "react-router-dom";
import Signup from "./Page/Signup";
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
import TrafficePage from "./Page/Admin/TrafficePage";
import UsersPage from "./Page/Admin/UsersPage";
import GCHomePage from "./Page/GC/GCHomePage";
import PickUpPage from "./Page/GC/PickUpPage";
import LandingPage from "./Page/LandingPage";
import CollectionForm from "./Page/User/CollectionForm";
import GCHistoryPage from "./Page/GC/GCHistoryPage";
import GCContactPage from "./Page/GC/GCContactPage";

function App() {
  return (
    <div>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/signup" element={<Signup />} />
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
        <Route path="/users" element={<UsersPage />} />

        {/* Garbage Collector Routes */}
        <Route path="/gcHome" element={<GCHomePage />} />
        <Route path="/pickup" element={<PickUpPage />} />
        <Route path="/gcHistory" element={<GCHistoryPage />} />
        <Route path="/gcContact" element={<GCContactPage />} />
      </Routes>
    </div>
  );
}

export default App;
