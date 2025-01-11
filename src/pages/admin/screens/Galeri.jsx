import React, { useState, useEffect } from "react";
import { db } from "../../../db/Firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import Loader from "@components/Loader";
import { toast } from "sonner";

const YorumYonetim = () => {
  const [yorumlar, setYorumlar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [duzenleId, setDuzenleId] = useState(null);
  const [guncelYorum, setGuncelYorum] = useState(null);
  const [yeniYorum, setYeniYorum] = useState({
    name: "",
    service: "",
    content: "",
    rating: 5,
  });
  const [yukleniyorForm, setYukleniyorForm] = useState(false);

  useEffect(() => {
    const yorumlariGetir = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "testimonials"));
        const yorumListesi = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setYorumlar(yorumListesi);
      } catch (error) {
        console.error("Yorumlar yüklenirken hata:", error);
        toast.error("Yorumlar yüklenemedi!");
      } finally {
        setYukleniyor(false);
      }
    };

    yorumlariGetir();
  }, []);

  const yorumEkle = async (e) => {
    e.preventDefault();
    setYukleniyorForm(true);
    try {
      await addDoc(collection(db, "testimonials"), yeniYorum);
      setYorumlar([...yorumlar, yeniYorum]);
      setYeniYorum({
        name: "",
        service: "",
        content: "",
        rating: 5,
      });
      toast.success("Yorum başarıyla eklendi!");
    } catch (error) {
      console.error("Yorum eklenirken hata:", error);
      toast.error("Yorum eklenirken bir hata oluştu!");
    } finally {
      setYukleniyorForm(false);
    }
  };

  const yorumSil = async (id) => {
    if (window.confirm("Bu yorumu silmek istediğinize emin misiniz?")) {
      try {
        await deleteDoc(doc(db, "testimonials", id));
        setYorumlar(yorumlar.filter((yorum) => yorum.id !== id));
        toast.success("Yorum başarıyla kaldırıldı!");
      } catch (error) {
        console.error("Yorum silinirken hata:", error);
        toast.error("Silme işlemi başarısız oldu!");
      }
    }
  };

  const duzenlemeBaslat = (yorum) => {
    setDuzenleId(yorum.id);
    setGuncelYorum(yorum);
  };

  const yorumGuncelle = async () => {
    try {
      const yorumRef = doc(db, "testimonials", duzenleId);
      await updateDoc(yorumRef, {
        name: guncelYorum.name,
        service: guncelYorum.service,
        content: guncelYorum.content,
        rating: guncelYorum.rating,
      });

      setYorumlar(
        yorumlar.map((yorum) => (yorum.id === duzenleId ? guncelYorum : yorum))
      );
      setDuzenleId(null);
      toast.success("Başarıyla güncellendi!");
    } catch (error) {
      console.error("Yorum güncellenirken hata:", error);
      toast.error("Güncelleme işlemi başarısız oldu!");
    }
  };

  if (yukleniyor) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Yorumlar</h2>

        <form onSubmit={yorumEkle} className="mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              İsim
            </label>
            <input
              type="text"
              value={yeniYorum.name}
              onChange={(e) =>
                setYeniYorum({ ...yeniYorum, name: e.target.value })
              }
              className="w-full rounded-lg border p-2"
              placeholder="İsim"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hizmet
            </label>
            <input
              type="text"
              value={yeniYorum.service}
              onChange={(e) =>
                setYeniYorum({ ...yeniYorum, service: e.target.value })
              }
              className="w-full rounded-lg border p-2"
              placeholder="Hizmet"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Yorum
            </label>
            <textarea
              value={yeniYorum.content}
              onChange={(e) =>
                setYeniYorum({ ...yeniYorum, content: e.target.value })
              }
              className="w-full rounded-lg border p-2"
              rows={3}
              placeholder="Yorum"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Puan
            </label>
            <input
              type="number"
              value={yeniYorum.rating}
              onChange={(e) =>
                setYeniYorum({ ...yeniYorum, rating: e.target.value })
              }
              className="w-full rounded-lg border p-2"
              placeholder="Puan"
              min="1"
              max="5"
              required
            />
          </div>
          <button
            type="submit"
            disabled={yukleniyorForm}
            className="flex items-center justify-center rounded-lg bg-yesil px-4 py-2 text-white"
          >
            {yukleniyorForm ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Yükleniyor...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-5 w-5" />
                Yorum Ekle
              </>
            )}
          </button>
        </form>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {yorumlar.map((yorum) => (
            <div key={yorum.id} className="rounded-lg border p-4 shadow-sm">
              {duzenleId === yorum.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={guncelYorum.name}
                    onChange={(e) =>
                      setGuncelYorum({ ...guncelYorum, name: e.target.value })
                    }
                    className="w-full rounded border p-2"
                    placeholder="İsim"
                  />
                  <input
                    type="text"
                    value={guncelYorum.service}
                    onChange={(e) =>
                      setGuncelYorum({
                        ...guncelYorum,
                        service: e.target.value,
                      })
                    }
                    className="w-full rounded border p-2"
                    placeholder="Hizmet"
                  />
                  <textarea
                    value={guncelYorum.content}
                    onChange={(e) =>
                      setGuncelYorum({
                        ...guncelYorum,
                        content: e.target.value,
                      })
                    }
                    className="w-full rounded border p-2"
                    rows={3}
                    placeholder="Yorum"
                  />
                  <input
                    type="number"
                    value={guncelYorum.rating}
                    onChange={(e) =>
                      setGuncelYorum({
                        ...guncelYorum,
                        rating: e.target.value,
                      })
                    }
                    className="w-full rounded border p-2"
                    placeholder="Puan"
                    min="1"
                    max="5"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={yorumGuncelle}
                      className="flex items-center gap-1 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                    >
                      Kaydet
                    </button>
                    <button
                      onClick={() => setDuzenleId(null)}
                      className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold">{yorum.name}</h3>
                  <p className="mt-2 text-gray-600">{yorum.service}</p>
                  <p className="text-gray-600">{yorum.content}</p>
                  <p className="text-gray-600">Puan: {yorum.rating}</p>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => duzenlemeBaslat(yorum)}
                      className="flex items-center gap-1 rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                    >
                      <Pencil className="h-4 w-4" />
                      Düzenle
                    </button>
                    <button
                      onClick={() => yorumSil(yorum.id)}
                      className="flex items-center gap-1 rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
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

        {yorumlar.length === 0 && (
          <div className="text-center text-gray-500">
            Henüz yorum bulunmamaktadır.
          </div>
        )}
      </div>
    </div>
  );
};

export default YorumYonetim;
