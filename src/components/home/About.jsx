import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Shield, Phone } from "lucide-react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../db/Firebase";
import Loader from "../../components/Loader";

const About = () => {
  const [aboutData, setAboutData] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [telefon, setTelefon] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const aboutDoc = await getDoc(doc(db, "about", "content"));
      if (aboutDoc.exists()) {
        setAboutData(aboutDoc.data());
        setLoading(false);
      } else {
        console.log("No such document!");
        setLoading(false);
      }

      const specializationsSnapshot = await getDocs(
        collection(db, "specializations")
      );
      const specializationsList = [];
      specializationsSnapshot.forEach((doc) => {
        specializationsList.push({ id: doc.id, ...doc.data() });
      });
      setSpecializations(specializationsList);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="py-20 px-4 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4"
        >
          <h2 className="text-4xl font-bold text-gray-800">Hakkımızda</h2>
          <div className="w-24 h-1 bg-siyah mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-semibold text-gray-800">
              {aboutData.title}
            </h3>
            <p
              className="text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: aboutData.description }}
            ></p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-sarı rounded-lg">
                <Clock className="w-6 h-6 text-siyah mb-2" />
                <h4 className="font-semibold text-gray-800">7/24 Hizmet</h4>
              </div>
              <div className="p-4 bg-sarı rounded-lg">
                <Shield className="w-6 h-6 text-siyah mb-2" />
                <h4 className="font-semibold text-gray-800">Garantili İş</h4>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-square flex items-center justify-center rounded-2xl overflow-hidden shadow-xl">
              <img
                src={aboutData.imageUrl}
                alt="4 İklim Temizlik"
                className="w-80 h-full object-contain"
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h3 className="text-2xl font-semibold text-gray-800 text-center">
            Temizlik Hizmetlerimiz
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {specializations.map((spec) => (
              <div
                key={spec.id}
                className="bg-sarı/50 p-6 rounded-xl shadow-md text-center hover:bg-sarı/70 hover:text-siyah transition-colors duration-300"
              >
                {spec.name}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-sarı/60 p-8 rounded-2xl text-center space-y-6"
        >
          <h3 className="text-2xl font-semibold text-gray-800">
            Profesyonel temizlik hizmetimizden faydalanmak ister misiniz?
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Uzman ekibimiz, en kaliteli temizlik hizmetini sunmak için hazır.
            Hemen iletişime geçin!
          </p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={"tel:" + telefon}
            className="bg-siyah text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-siyah/90 transition-colors flex items-center justify-center gap-2 w-fit mx-auto"
          >
            <Phone className="w-5 h-5" />
            Hemen Arayın
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
