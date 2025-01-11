import React, { useEffect, useState } from "react";
import Sidebar from "@components/admin/Sidebar";
import Galeri from "./screens/Galeri";
import HizmetEkle from "./screens/HizmetEkle";
import SSSYonetim from "./screens/SSSYonetim";
import Baslik from "./screens/Baslik";
import IletisimYonetim from "./screens/Iletisim";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../db/Firebase";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loggedIn = localStorage.getItem("aniliscenanisAdminLoggedenIn");
    if (loggedIn === "true") {
      onLogin();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "admin", "bilgiler");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const adminData = docSnap.data();
        if (adminData.kullanici === username && adminData.sifre === password) {
          localStorage.setItem("aniliscenanisAdminLoggedenIn", "true");
          onLogin();
          setError("");
        } else {
          setError("Kullanıcı adı veya şifre hatalı!");
        }
      } else {
        setError("Admin bilgileri bulunamadı!");
      }
    } catch (error) {
      setError("Giriş yapılırken bir hata oluştu!");
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="container max-w-screen-lg rounded bg-white p-6 shadow-md">
        <img src="/images/logo.png" alt="Figür Örgü" className="mx-auto w-56" />
        <h2 className="mb-4 mt-5 text-center text-lg font-bold">Giriş Yap</h2>
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">
            Kullanıcı Adı
          </label>
          <input
            type="text"
            className="w-full rounded border px-3 py-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">Şifre</label>
          <input
            type="password"
            className="w-full rounded border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className="w-full rounded bg-[#5e17eb] py-2 text-white hover:bg-black/80"
          onClick={handleLogin}
        >
          Giriş Yap
        </button>
      </div>
    </div>
  );
};

const Panel = () => {
  const [selectIndex, setSelectedIndex] = useState(0);

  return (
    <div className="flex min-h-screen">
      <Sidebar screen={setSelectedIndex} />
      <div className="flex w-full flex-1 items-center justify-center bg-neutral-100">
        {selectIndex === 1 && <Galeri />}
        {selectIndex === 2 && <HizmetEkle />}
        {selectIndex === 3 && <SSSYonetim />}
        {selectIndex === 4 && <Baslik />}
        {selectIndex === 5 && <IletisimYonetim />}
      </div>
    </div>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedLogin = localStorage.getItem("isLoggedIn");
    if (storedLogin === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div>
      {isLoggedIn ? <Panel /> : <Login onLogin={() => setIsLoggedIn(true)} />}
    </div>
  );
};

export default App;
