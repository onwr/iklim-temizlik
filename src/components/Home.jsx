import React from "react";
import Hero from "./home/Hero";
import About from "./home/About";
import Contact from "./home/Contact";
import BlogSection from "./home/Blog";
import Clients from "./home/Clients";
import Footer from "./Footer";
import Gallery from "./home/Gallery";

const Home = () => {
  return (
    <div>
      <section id="anasayfa">
        <Hero />
      </section>
      <section id="hakkimda">
        <About />
      </section>
      <section id="makale">
        <BlogSection />
      </section>
      <section id="referanslar">
        <Clients />
      </section>
      <section id="galeri">
        <Gallery />
      </section>
      <section id="iletisim">
        <Contact />
      </section>
      <Footer />
    </div>
  );
};

export default Home;
