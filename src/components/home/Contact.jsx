import React, { useEffect, useState } from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { db } from "../../db/Firebase";
import { doc, getDoc } from "firebase/firestore";
import Loader from "../../components/Loader";

const Contact = () => {
  const [contactInfo, setContactInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const docRef = doc(db, "iletisim", "bilgi");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setContactInfo([
            {
              icon: <Phone className="w-6 h-6" />,
              title: "Telefon",
              details: [data.telefon],
            },
            {
              icon: <Mail className="w-6 h-6" />,
              title: "E-posta",
              details: [data.mail],
            },

            {
              icon: <Clock className="w-6 h-6" />,
              title: "Çalışma Saatleri",
              details: Array.isArray(data.saatler)
                ? data.saatler
                : [data.saatler],
            },
            {
              icon: <MapPin className="w-6 h-6" />,
              title: "Adres",
              details: [data.adres],
            }
          ]);
        } else {
          console.log("Belge bulunamadı!");
        }
      } catch (error) {
        console.log("Hata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="py-20 px-4 lg:px-16 border-t">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-gray-800">İletişim</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Bana aşağıdaki iletişim kanallarından ulaşabilirsiniz.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {contactInfo.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg space-y-4"
            >
              <div className="w-12 h-12 bg-yesil/10 rounded-full flex items-center justify-center text-yesil">
                {item.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{item.title}</h3>
                {item.details.map((detail, idx) => (
                  <p key={idx} className="text-gray-600">
                    {detail}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;
