import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "@pages/Home";
import Panel from "@pages/admin/Panel";
import { Toaster } from "sonner";
import BlogPost from "@pages/BlogDetay";

const App = () => (
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/yonetici/panel" element={<Panel />} />
      </Routes>
    </BrowserRouter>
    <Toaster richColors position="top-center" />
  </>
);

export default App;
