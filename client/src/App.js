import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import About from "./pages/About";
import Article from "./pages/Article";
import ArticlesList from "./pages/ArticlesList";
import NotFound from "./pages/NotFound";
import SearchPage from "./pages/SearchPage";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-background dark:bg-primary text-text-main dark:text-white font-body transition-colors duration-300">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/articles-list" element={<ArticlesList />} />
              <Route path="/articles/:name" element={<Article />} />
              <Route path="/search" element={<SearchPage />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
