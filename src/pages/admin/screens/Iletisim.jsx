import React, { useState, useEffect } from "react";
import { db } from "../../../db/Firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import JoditEditor from "jodit-react";

const IletisimYonetim = () => {
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [basarili, setBasarili] = useState(false);
  const [hata, setHata] = useState("");

  const [formData, setFormData] = useState({
    telefon: "",
    mail: "",
    saatler: "",
    adres: "",
    instagram: "",
    about: {
      title: "",
      description: "",
      imageUrl: "",
    },
    specializations: [],
  });

  const config = {
    buttons: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "eraser",
      "font",
      "fontsize",
      "brush",
      "paragraph",
    ],
    width: "100%",
    height: 200,
    toolbarAdaptive: false,
    language: "tr",
  };

  useEffect(() => {
    const veriGetir = async () => {
      try {
        const docRef = doc(db, "iletisim", "bilgi");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData((prev) => ({
            ...prev,
            ...docSnap.data(),
          }));
        }

        const aboutDocRef = doc(db, "about", "content");
        const aboutDocSnap = await getDoc(aboutDocRef);
        if (aboutDocSnap.exists()) {
          setFormData((prev) => ({
            ...prev,
            about: aboutDocSnap.data(),
          }));
        }

        const specializationsSnapshot = await getDocs(
          collection(db, "specializations")
        );
        const specializationsList = [];
        specializationsSnapshot.forEach((doc) => {
          specializationsList.push({ id: doc.id, ...doc.data() });
        });
        setFormData((prev) => ({
          ...prev,
          specializations: specializationsList,
        }));
      } catch (error) {
        setHata("Veriler yüklenirken bir hata oluştu.");
        console.error("Veri çekme hatası:", error);
      } finally {
        setYukleniyor(false);
      }
    };

    veriGetir();
  }, []);

  const formGonder = async (e) => {
    e.preventDefault();
    setKaydediliyor(true);
    setHata("");

    try {
      const docRef = doc(db, "iletisim", "bilgi");
      await updateDoc(docRef, {
        telefon: formData.telefon,
        mail: formData.mail,
        saatler: formData.saatler,
        adres: formData.adres,
        instagram: formData.instagram,
      });

      const aboutDocRef = doc(db, "about", "content");
      await updateDoc(aboutDocRef, formData.about);

      const specializationsCollectionRef = collection(db, "specializations");
      for (const spec of formData.specializations) {
        if (spec.id) {
          const specDocRef = doc(db, "specializations", spec.id);
          await updateDoc(specDocRef, spec);
        } else {
          await addDoc(specializationsCollectionRef, spec);
        }
      }

      setBasarili(true);
      setTimeout(() => setBasarili(false), 3000);
    } catch (error) {
      setHata("Bilgiler kaydedilirken bir hata oluştu.");
      console.error("Güncelleme hatası:", error);
    } finally {
      setKaydediliyor(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAboutChange = (e) => {
    if (e?.target) {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        about: {
          ...prev.about,
          [name]: value,
        },
      }));
    }
  };

  const handleEditorChange = (newContent) => {
    setFormData((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        description: newContent,
      },
    }));
  };

  const handleSpecializationsChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newSpecializations = [...prev.specializations];
      newSpecializations[index] = {
        ...newSpecializations[index],
        [name]: value,
      };
      return { ...prev, specializations: newSpecializations };
    });
  };

  const addSpecialization = () => {
    setFormData((prev) => ({
      ...prev,
      specializations: [...prev.specializations, { name: "" }],
    }));
  };

  const removeSpecialization = (index) => {
    setFormData((prev) => {
      const newSpecializations = [...prev.specializations];
      if (newSpecializations[index].id) {
        const specDocRef = doc(
          db,
          "specializations",
          newSpecializations[index].id
        );
        deleteDoc(specDocRef).catch(console.error);
      }
      newSpecializations.splice(index, 1);
      return { ...prev, specializations: newSpecializations };
    });
  };

  if (yukleniyor) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">
          İletişim Bilgileri Yönetimi
        </h2>

        <form onSubmit={formGonder} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Telefon
            </label>
            <input
              type="text"
              name="telefon"
              value={formData.telefon}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-[#26355e]/50 focus:outline-none focus:ring-1 focus:ring-[#26355e]/80"
              placeholder="Telefon Numarası giriniz"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              E-Mail
            </label>
            <input
              type="text"
              name="mail"
              value={formData.mail}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-[#26355e]/50 focus:outline-none focus:ring-1 focus:ring-[#26355e]/80"
              placeholder="E-Mail Adresi"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Çalışma Saatleri
            </label>
            <input
              type="text"
              name="saatler"
              value={formData.saatler}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-[#26355e]/50 focus:outline-none focus:ring-1 focus:ring-[#26355e]/80"
              placeholder="Çalışma Saatleri giriniz"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Adres
            </label>
            <input
              type="text"
              name="adres"
              value={formData.adres}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-[#26355e]/50 focus:outline-none focus:ring-1 focus:ring-[#26355e]/80"
              placeholder="Adres giriniz"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Instagram
            </label>
            <input
              type="text"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-[#26355e]/50 focus:outline-none focus:ring-1 focus:ring-[#26355e]/80"
              placeholder="Instagram Adresi giriniz"
            />
          </div>

          <h3 className="mt-6 mb-4 text-xl font-semibold text-gray-800">
            Hakkımda Bilgileri
          </h3>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Başlık
            </label>
            <input
              type="text"
              name="title"
              value={formData.about.title}
              onChange={handleAboutChange}
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-[#26355e]/50 focus:outline-none focus:ring-1 focus:ring-[#26355e]/80"
              placeholder="Başlık giriniz"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Açıklama
            </label>
            <JoditEditor
              value={formData.about.description}
              config={config}
              onChange={handleEditorChange}
              tabIndex={1}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Resim URL
            </label>
            <input
              type="text"
              name="imageUrl"
              value={formData.about.imageUrl}
              onChange={handleAboutChange}
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-[#26355e]/50 focus:outline-none focus:ring-1 focus:ring-[#26355e]/80"
              placeholder="Resim URL'si giriniz"
            />
          </div>

          <h3 className="mt-6 mb-4 text-xl font-semibold text-gray-800">
            Uzmanlık Alanları
          </h3>

          {formData.specializations.map((spec, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  name="name"
                  value={spec.name}
                  onChange={(e) => handleSpecializationsChange(index, e)}
                  className="w-3/4 rounded-lg border border-gray-300 p-2.5 focus:border-[#26355e]/50 focus:outline-none focus:ring-1 focus:ring-[#26355e]/80"
                  placeholder="Uzmanlık Alanı"
                />
                <button
                  type="button"
                  onClick={() => removeSpecialization(index)}
                  className="rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addSpecialization}
            className="flex items-center justify-center gap-2 rounded-lg bg-green-500 px-6 py-3 text-white hover:bg-green-600"
          >
            <Plus className="h-5 w-5" />
            Yeni Uzmanlık Ekle
          </button>

          {hata && (
            <div className="rounded-lg bg-red-50 p-4 text-red-600">{hata}</div>
          )}

          {basarili && (
            <div className="rounded-lg bg-green-50 p-4 text-green-600">
              Bilgiler başarıyla güncellendi!
            </div>
          )}

          <button
            type="submit"
            disabled={kaydediliyor}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#26355e]/95 px-6 py-3 text-white hover:bg-[#26355e] disabled:bg-[#26355e]/30"
          >
            {kaydediliyor ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Değişiklikleri Kaydet
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default IletisimYonetim;
