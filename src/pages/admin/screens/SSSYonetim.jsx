import React, { useState, useEffect } from "react";
import axios from "axios";
import { db } from "../../../db/Firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { Plus, Loader2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const GaleriYonetim = () => {
  const [baslik, setBaslik] = useState("");
  const [aciklama, setAciklama] = useState("");
  const [image, setImage] = useState("");
  const [resimler, setResimler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [duzenleId, setDuzenleId] = useState(null);
  const imgBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
  const [guncelResim, setGuncelResim] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });

  const resimleriGetir = async () => {
    try {
      const galleryCollectionRef = collection(db, "galeri");
      const gallerySnapshot = await getDocs(galleryCollectionRef);
      const galleryList = gallerySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setResimler(galleryList);
    } catch (error) {
      console.error("Resimler yüklenirken hata:", error);
      toast.error("Resimler yüklenemedi!");
    }
  };

  useEffect(() => {
    resimleriGetir();
  }, []);

  const resimEkle = async (e) => {
    e.preventDefault();

    if (!baslik.trim() || !aciklama.trim() || !image) {
      toast.error("Lütfen tüm alanları doldurunuz.");
      return;
    }

    setYukleniyor(true);

    try {
      const galleryCollectionRef = collection(db, "galeri");
      const yeniResim = {
        title: baslik,
        description: aciklama,
        imageUrl: image,
        createdAt: new Date().toISOString(),
      };

      await addDoc(galleryCollectionRef, yeniResim);
      setResimler([...resimler, yeniResim]);
      setBaslik("");
      setAciklama("");
      setImage("");
      toast.success("Resim başarıyla eklendi!");
    } catch (error) {
      console.error("Resim eklenirken hata:", error);
      toast.error("Resim eklenirken bir hata oluştu!");
    } finally {
      setYukleniyor(false);
    }
  };

  const resimSil = async (id) => {
    if (window.confirm("Bu resmi silmek istediğinize emin misiniz?")) {
      try {
        const docRef = doc(db, "galeri", id);
        await deleteDoc(docRef);
        setResimler(resimler.filter((resim) => resim.id !== id));
        toast.success("Resim başarıyla silindi!");
      } catch (error) {
        console.error("Resim silinirken hata:", error);
        toast.error("Silme işlemi başarısız oldu!");
      }
    }
  };

  const duzenlemeBaslat = (resim, index) => {
    setDuzenleId(index);
    setGuncelResim(resim);
  };

  const resimGuncelle = async () => {
    try {
      const yeniResimler = [...resimler];
      yeniResimler[duzenleId] = guncelResim;

      const docRef = doc(db, "galeri", guncelResim.id);
      await updateDoc(docRef, {
        title: guncelResim.title,
        description: guncelResim.description,
        imageUrl: guncelResim.imageUrl,
        updatedAt: new Date().toISOString(),
      });

      setResimler(yeniResimler);
      setDuzenleId(null);
      toast.success("Resim başarıyla güncellendi!");
    } catch (error) {
      console.error("Resim güncellenirken hata:", error);
      toast.error("Güncelleme işlemi başarısız oldu!");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      setYukleniyor(true);
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imgBB_API_KEY}`,
        formData
      );
      const imageUrl = res.data.data.url;
      setImage(imageUrl);
      toast.success("Görsel başarıyla yüklendi!");
    } catch (error) {
      console.error("Görsel yüklenirken hata:", error);
      toast.error("Görsel yüklenirken bir hata oluştu!");
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      <div className="container mx-auto w-full rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-8 text-2xl font-bold text-gray-800">
          Galeri Yönetimi
        </h2>

        <form onSubmit={resimEkle} className="mb-8 space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Başlık
            </label>
            <input
              type="text"
              value={baslik}
              onChange={(e) => setBaslik(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-[#26355e]/70 focus:outline-none focus:ring-1 focus:ring-[#26355e]"
              placeholder="Resim başlığını giriniz"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Açıklama
            </label>
            <textarea
              value={aciklama}
              onChange={(e) => setAciklama(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-[#26355e]/70 focus:outline-none focus:ring-1 focus:ring-[#26355e]"
              placeholder="Resim açıklamasını giriniz"
              rows={4}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Resim
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-[#26355e]/70 focus:outline-none focus:ring-1 focus:ring-[#26355e]"
            />
            {image && (
              <img
                src={image}
                alt="Yüklenen resim"
                className="mt-2 h-32 w-32 rounded-lg object-cover"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={yukleniyor}
            className="flex w-full items-center justify-center rounded-lg bg-yesil/90 px-6 py-3 text-white transition-colors hover:bg-yesil disabled:bg-yesil/50"
          >
            {yukleniyor ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Yükleniyor...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-5 w-5" />
                Resim Ekle
              </>
            )}
          </button>
        </form>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resimler.map((resim, index) => (
            <div key={index} className="rounded-lg border p-4">
              {duzenleId === index ? (
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Başlık
                    </label>
                    <input
                      type="text"
                      value={guncelResim.title}
                      onChange={(e) =>
                        setGuncelResim({
                          ...guncelResim,
                          title: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border p-2"
                      placeholder="Başlık"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Açıklama
                    </label>
                    <textarea
                      value={guncelResim.description}
                      onChange={(e) =>
                        setGuncelResim({
                          ...guncelResim,
                          description: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border p-2"
                      placeholder="Açıklama"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Resim
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        handleImageUpload(e).then((imageUrl) => {
                          setGuncelResim({
                            ...guncelResim,
                            imageUrl: imageUrl,
                          });
                        });
                      }}
                      className="w-full rounded-lg border border-gray-300 p-2.5"
                    />
                    {guncelResim.imageUrl && (
                      <img
                        src={guncelResim.imageUrl}
                        alt="Güncel resim"
                        className="mt-2 h-32 w-32 rounded-lg object-cover"
                      />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={resimGuncelle}
                      className="flex items-center gap-1 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                    >
                      Kaydet
                    </button>
                    <button
                      onClick={() => setDuzenleId(null)}
                      className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <img
                    src={resim.imageUrl}
                    alt={resim.title}
                    className="mb-4 h-48 w-full rounded-lg object-cover"
                  />
                  <h3 className="mb-2 text-lg font-semibold">{resim.title}</h3>
                  <p className="mb-4 text-gray-600">{resim.description}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => duzenlemeBaslat(resim, index)}
                      className="flex items-center gap-1 rounded-lg bg-[#26355e] px-4 py-2 text-white hover:bg-[#26355e]/90"
                    >
                      <Pencil className="h-4 w-4" />
                      Düzenle
                    </button>
                    <button
                      onClick={() => resimSil(resim.id)}
                      className="flex items-center gap-1 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                      Sil
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GaleriYonetim;
