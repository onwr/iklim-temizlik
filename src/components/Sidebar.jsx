import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AiOutlineHome, AiOutlinePhone, AiOutlineStar } from "react-icons/ai";
import {
  RiArticleLine,
  RiMenuLine,
  RiCloseLine,
  RiGalleryFill,
} from "react-icons/ri";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../db/Firebase";
import { Building } from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("anasayfa");
  const [telefon, setTelefon] = useState("");

  useEffect(() => {
    const telCek = async () => {
      try {
        const docRef = doc(db, "iletisim", "bilgi");
        const docSnap = await getDoc(docRef);
        setTelefon(docSnap.data().telefon);
      } catch (error) {
        console.error("Telefon çekme hatası:", error);
      }
    };

    telCek();
  }, []);

  const menuItems = [
    { id: "anasayfa", title: "Anasayfa", icon: <AiOutlineHome size={24} /> },
    { id: "hakkimda", title: "Hakkımızda", icon: <Building size={24} /> },
    { id: "makale", title: "Blog", icon: <RiArticleLine size={24} /> },
    {
      id: "referanslar",
      title: "Referanslarımız",
      icon: <AiOutlineStar size={24} />,
    },
    { id: "galeri", title: "Galeri", icon: <RiGalleryFill size={24} /> },
    { id: "iletisim", title: "İletişim", icon: <AiOutlinePhone size={24} /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = menuItems.map((item) =>
        document.getElementById(item.id)
      );
      const scrollPosition = window.scrollY + 200;

      sections.forEach((section) => {
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.clientHeight;

          if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionTop + sectionHeight
          ) {
            setActiveSection(section.id);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sidebarVariants = {
    open: {
      x: 0,
    },
    closed: {
      x: "-100%",
    },
  };

  const MenuItem = ({ item, isMobile = false }) => (
    <motion.a
      href={`#${item.id}`}
      whileTap={{ scale: 0.97 }}
      className={`flex items-center ${
        isMobile ? "px-6" : "lg:pl-5"
      } gap-4 w-full py-4 transition-colors ${
        activeSection === item.id
          ? "bg-yesil/40 text-yesil"
          : "text-gray-700 hover:bg-yesil/20 hover:text-yesil"
      }`}
      onClick={() => isMobile && setIsOpen(false)}
    >
      {item.icon}
      <span className="font-medium">{item.title}</span>
    </motion.a>
  );

  const SocialAndContact = ({ isMobile = false }) => (
    <div className={`px-4 py-0 ${isMobile ? "mt-4" : "mt-auto"}`}>
      <div className="text-center w-full rounded-full md:rounded-t-full bg-yesil">
        <a
          href={"tel:" + telefon}
          className="text-xl font-bold  text-white text-transparent hover:from-green-500 hover:to-green-300 transition-all"
        >
          {telefon}
        </a>
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md flex items-center justify-between px-4 lg:hidden z-50">
        <img src="/images/logo.png" alt="Psikolog Sena Düz" className="h-14" />
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-yesil">
          {isOpen ? <RiCloseLine size={24} /> : <RiMenuLine size={24} />}
        </button>
      </div>
      <div className="hidden border-r-2 border-yesil/60 lg:block fixed left-0 w-80 h-screen overflow-y-auto">
        <div className="h-full bg-white shadow-xl flex flex-col">
          <div className="px-4 py-6">
            <img
              src="/images/logo.png"
              alt="Psikolog Sena Düz"
              className="w-48 mx-auto"
            />
          </div>
          <nav className="w-full flex-1">
            {menuItems.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </nav>
          <SocialAndContact />
        </div>
      </div>

      <motion.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className="lg:hidden fixed top-0 left-0 h-screen bg-white shadow-xl w-64 z-40"
      >
        <nav className="mt-20">
          {menuItems.map((item) => (
            <MenuItem key={item.id} item={item} isMobile={true} />
          ))}
        </nav>
        <SocialAndContact isMobile={true} />
      </motion.div>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black lg:hidden z-30"
        />
      )}
    </>
  );
};

export default Sidebar;
