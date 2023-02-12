import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import Layout from "./Layout";
import CreatePost from "./pages/CreatePost";
import IndexPage from "./pages/IndexPage";
import LoginPages from "./pages/LoginPages";
import RegisterPage from "./pages/RegisterPage";
import { UserContextProvider } from "./userContext";
import PostPage from './pages/PostPage';
import EditPost from './pages/EditPost';

const App = () => {
  return (
    <BrowserRouter>
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route path="/login" element={<LoginPages />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/edit/:id" element={<EditPost />} />
          </Route>
          
        </Routes>
      </UserContextProvider>
    </BrowserRouter>
  );
};

export default App;
