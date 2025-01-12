import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../db/Firebase";

const Footer = () => {
  const [contactInfo, setContactInfo] = useState([]);

  const izmirDistricts = [
    "Aliağa",
    "Balçova",
    "Bayındır",
    "Bayraklı",
    "Bergama",
    "Beydağ",
    "Bornova",
    "Buca",
    "Çeşme",
    "Çiğli",
    "Dikili",
    "Foça",
    "Gaziemir",
    "Güzelbahçe",
    "Karabağlar",
    "Karaburun",
    "Karşıyaka",
    "Kemalpaşa",
    "Kınık",
    "Kiraz",
    "Konak",
    "Menderes",
    "Menemen",
    "Narlıdere",
    "Ödemiş",
    "Seferihisar",
    "Selçuk",
    "Tire",
    "Torbalı",
    "Urla",
  ];

  useEffect(() => {
    const veriCek = async () => {
      try {
        const docRef = doc(db, "iletisim", "bilgi");
        const docSnap = await getDoc(docRef);
        setContactInfo(docSnap.data());
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      }
    };

    veriCek();
  }, []);

  return (
    <footer className="border-t">
      <div className="max-w-7xl mx-auto px-4 lg:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              4 İklim Temizlik
            </h3>
            <p className="text-gray-600 mb-4">
              Profesyonel ev ve iş yeri temizlik hizmetleri ile 7/24
              hizmetinizdeyiz. Güvenilir ve kaliteli temizlik için bizi tercih
              edin.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">İletişim</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-600">
                <Phone className="w-5 h-5 text-yesil" />
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="hover:text-yesil transition-colors"
                >
                  {contactInfo.telefon}
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Mail className="w-5 h-5 text-yesil" />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="hover:text-yesil transition-colors"
                >
                  {contactInfo.mail}
                </a>
              </li>
              <li className="flex items-start gap-2 text-gray-600">
                <MapPin className="w-5 h-5 text-yesil shrink-0" />
                <span>{contactInfo.adres}</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Sosyal Medya
            </h3>
            <div className="flex gap-4">
              <a
                href={contactInfo.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-500 hover:text-red-500/80 transition-colors"
              >
                <FaInstagram className="w-6 h-6" />
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 pt-8 border-t border-gray-200"
        >
          <h4 className="text-sm font-semibold text-gray-600 mb-4">
            Hizmet Verdiğimiz Bölgeler - İzmir
          </h4>
          <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-8">
            {izmirDistricts.map((district, index) => (
              <span key={index}>
                {district} Temizlik Hizmetleri
                {index !== izmirDistricts.length - 1 ? "," : ""}{" "}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-gray-200 pt-8 text-center text-gray-600"
        >
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-bold">4 İklim Temizlik</span>. Tüm hakları
            saklıdır.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
