import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { SiCcleaner } from "react-icons/si";
import { db } from "../../db/Firebase";
import { doc, getDoc } from "firebase/firestore";
import Loader from "../../components/Loader";

const Hero = () => {
  const [heroData, setHeroData] = useState({
    unvan: "",
    title: "",
    text: "",
    description: "",
  });
  const [telefon, setTelefon] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const docRef = doc(db, "hero", "content");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setHeroData(docSnap.data());
        } else {
          console.error("Hero içeriği bulunamadı!");
        }
      } catch (error) {
        console.error("Hata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  useEffect(() => {
    const telCek = async () => {
      try {
        const docRef = doc(db, "iletisim", "bilgi");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTelefon(docSnap.data().telefon);
        } else {
          console.error("Telefon bilgisi bulunamadı!");
        }
      } catch (error) {
        console.error("Telefon çekme hatası:", error);
      }
    };

    telCek();
  }, []);

  const scrollToContact = (e) => {
    e.preventDefault();
    const element = document.getElementById("iletisim");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 lg:px-16 relative overflow-hidden">
      <div
        className="absolute inset-0 z-0 opacity-5"
        style={{
          backgroundImage: "url('/images/arkaplan.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="flex flex-col items-center w-full max-w-4xl z-20 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 text-siyah/70 mb-4"
          >
            <SiCcleaner className="w-5 h-5" />
            <span className="font-medium text-siyah/60">{heroData.unvan}</span>
          </motion.div>
          <h2 className="text-3xl font-bold text-siyah">{heroData.title}</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6"
        >
          <h1
            className="text-4xl lg:text-6xl font-bold text-siyah leading-tight"
            dangerouslySetInnerHTML={{ __html: heroData.text }}
          />
          <p className="text-lg text-siyah/70 max-w-2xl mx-auto">
            {heroData.description}
          </p>

          <div className="flex justify-center gap-4">
            <motion.a
              href={"tel:" + telefon}
              onClick={scrollToContact}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-sarı text-siyah px-8 py-3 rounded-full text-lg font-medium hover:bg-siyah hover:text-sarı transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <Phone className="w-5 h-5" />
              Hemen Ara
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
