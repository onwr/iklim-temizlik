import React, { useEffect, useState } from "react";
import Sidebar from "@components/Sidebar";
import HomeComponent from "@components/Home";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../db/Firebase";
import { FaWhatsapp } from "react-icons/fa";

const Home = () => {
  const [telefon, setTelefon] = useState("");

  useEffect(() => {
    const telCek = async () => {
      try {
        const docRef = doc(db, "iletisim", "bilgi");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const rawPhone = docSnap.data().telefon || "";
          const formattedPhone = rawPhone.replace(/[^+\d]/g, "");
          setTelefon(formattedPhone);
        } else {
          console.warn("Belirtilen belge bulunamadı.");
        }
      } catch (error) {
        console.error("Telefon çekme hatası:", error);
      }
    };

    telCek();
  }, []);

  return (
    <div className="flex min-h-screen relative">
      <Sidebar />
      <main className="flex-1 lg:ml-80">
        <HomeComponent />
      </main>

      {telefon && (
        <a
          href={`https://wa.me/+905525464545`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-4 right-4 flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition"
          aria-label="WhatsApp ile iletişim kur"
        >
          <FaWhatsapp className="w-7 h-7" />
        </a>
      )}
    </div>
  );
};

export default Home;
