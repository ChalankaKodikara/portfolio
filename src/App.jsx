import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Projects from "./components/Projects.jsx";
import Experience from "./components/Experience.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import Admin from "./pages/Admin.jsx";
import Login from "./pages/Login.jsx";
import { isAuthed } from "./lib/auth.js";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import AdminExperience from "./pages/AdminExperience.jsx";
import AdminPhotos from "./pages/AdminPhotos.jsx";
import AdminComments from "./pages/AdminComments.jsx";
import AdminProjects from "./pages/AdminProjects.jsx";
import NewsPaper from "./components/NewsPaper.jsx";
import Comments from "./components/Comments.jsx";
import NewsDetail from "./pages/NewsDetail.jsx";
import CustomCursor from "./components/CustomCursor.jsx";
import FloatingShapes from "./components/FloatingShapes.jsx";
import MoleculeBackdrop from "./components/MoleculeBackdrop.jsx";
import RibbonPattern from "./components/RibbonPattern.jsx";
function App() {
  const [route, setRoute] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setRoute(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const isAdmin = route === "/admin";
  const projectMatch = route.startsWith("/project/")
    ? route.replace("/project/", "")
    : null;
  const newsMatch = route.startsWith("/news/")
    ? route.replace("/news/", "")
    : null;
  const adminSub = route.startsWith("/admin/")
    ? route.split("/admin/")[1]
    : null;

  return (
    <div className="relative min-h-dvh text-slate-900 selection:bg-cyan-500/20">
      {/* ✨ Background Layer */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#f7faff] to-white overflow-hidden">
        <RibbonPattern color="#1d77b3" opacity={0.1} position="top" />
        <RibbonPattern color="#1d77b3" opacity={0.08} position="bottom" />
        {/* <MoleculeBackdrop color="#1d77b3" /> */}
        <FloatingShapes color="#1d77b3" count={10} />
      </div>

      {/* ✨ Interactive Cursor */}
      <CustomCursor />

      {/* ✨ Main Content */}
      <Header />

      {isAdmin ? (
        isAuthed() ? (
          <Admin />
        ) : (
          <Login />
        )
      ) : adminSub ? (
        isAuthed() ? (
          adminSub === "projects" ? (
            <AdminProjects />
          ) : adminSub === "experience" ? (
            <AdminExperience />
          ) : adminSub === "photos" ? (
            <AdminPhotos />
          ) : adminSub === "comments" ? (
            <AdminComments />
          ) : (
            <Admin />
          )
        ) : (
          <Login />
        )
      ) : projectMatch ? (
        <ProjectDetail id={projectMatch} />
      ) : newsMatch ? (
        <NewsDetail id={newsMatch} />
      ) : (
        <>
          <Hero />
          <Projects />
          <Experience />
          <NewsPaper />
          <Comments />
          <Contact />
        </>
      )}

      <Footer />
    </div>
  );
}

export default App;
