import React, { useState, useEffect } from "react";
import { db } from "../../../db/Firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { Plus, X, Loader2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const BlogYonetim = () => {
  const [baslik, setBaslik] = useState("");
  const [icerik, setIcerik] = useState("");
  const [kategori, setKategori] = useState("");
  const [resim, setResim] = useState(null);
  const [resimUrl, setResimUrl] = useState("");
  const [yukleniyorForm, setYukleniyorForm] = useState(false);
  const [basarili, setBasarili] = useState(false);
  const [hata, setHata] = useState("");
  const imgBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
  const [bloglar, setBloglar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [duzenleId, setDuzenleId] = useState(null);
  const [guncelBlog, setGuncelBlog] = useState(null);

  useEffect(() => {
    bloglariGetir();
  }, []);

  const bloglariGetir = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "bloglar"));
      const blogListesi = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBloglar(blogListesi);
    } catch (error) {
      console.error("Bloglar yüklenirken hata:", error);
      toast.error("Bloglar yüklenemedi!");
    } finally {
      setYukleniyor(false);
    }
  };

  const resimYukle = async () => {
    const formData = new FormData();
    formData.append("image", resim);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${imgBB_API_KEY}`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    return data.data.url;
  };

  const blogKaydet = async (e) => {
    e.preventDefault();

    try {
      setYukleniyorForm(true);
      setHata("");

      if (!baslik || !icerik || !kategori || !resim) {
        throw new Error("Lütfen tüm zorunlu alanları doldurunuz.");
      }

      const resimUrl = await resimYukle();

      await addDoc(collection(db, "bloglar"), {
        title: baslik,
        content: icerik,
        category: kategori,
        image: resimUrl,
        createdAt: Timestamp.now(),
      });

      setBasarili(true);
      setBaslik("");
      setIcerik("");
      setKategori("");
      setResim(null);
      setResimUrl("");

      await bloglariGetir();
      toast.success("Blog başarıyla eklendi!");

      setTimeout(() => setBasarili(false), 3000);
    } catch (error) {
      setHata(error.message);
      toast.error("Blog eklenirken hata oluştu!");
    } finally {
      setYukleniyorForm(false);
    }
  };

  const blogSil = async (id) => {
    if (window.confirm("Bu blogu silmek istediğinize emin misiniz?")) {
      try {
        await deleteDoc(doc(db, "bloglar", id));
        setBloglar(bloglar.filter((blog) => blog.id !== id));
        toast.success("Blog başarıyla silindi!");
      } catch (error) {
        console.error("Blog silinirken hata:", error);
        toast.error("Silme işlemi başarısız oldu!");
      }
    }
  };

  const duzenlemeBaslat = (blog) => {
    setDuzenleId(blog.id);
    setGuncelBlog(blog);
  };

  const blogGuncelle = async () => {
    try {
      const blogRef = doc(db, "bloglar", duzenleId);
      await updateDoc(blogRef, {
        title: guncelBlog.title,
        content: guncelBlog.content,
        category: guncelBlog.category,
        image: guncelBlog.image,
      });

      setBloglar(
        bloglar.map((blog) => (blog.id === duzenleId ? guncelBlog : blog))
      );
      setDuzenleId(null);
      toast.success("Blog başarıyla güncellendi!");
    } catch (error) {
      console.error("Blog güncellenirken hata:", error);
      toast.error("Güncelleme işlemi başarısız oldu!");
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Yeni Blog Ekleme Formu */}
      <div className="container mx-auto w-full rounded-xl bg-white p-6 shadow-lg">
        <h1 className="mb-8 text-2xl font-bold text-gray-800">
          Yeni Blog Ekle
        </h1>

        <form onSubmit={blogKaydet} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Başlık *
            </label>
            <input
              type="text"
              value={baslik}
              onChange={(e) => setBaslik(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-[#5e17eb]/70 focus:outline-none focus:ring-1 focus:ring-[#5e17eb]"
              placeholder="Blog başlığını giriniz"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              İçerik *
            </label>
            <textarea
              value={icerik}
              onChange={(e) => setIcerik(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-[#5e17eb]/70 focus:outline-none focus:ring-1 focus:ring-[#5e17eb]"
              placeholder="Blog içeriğini giriniz"
              rows={4}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Kategori *
            </label>
            <input
              type="text"
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-[#5e17eb]/70 focus:outline-none focus:ring-1 focus:ring-[#5e17eb]"
              placeholder="Kategori giriniz"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Resim *
            </label>
            <input
              type="file"
              onChange={(e) => setResim(e.target.files[0])}
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-[#5e17eb]/70 focus:outline-none focus:ring-1 focus:ring-[#5e17eb]"
              accept="image/*"
            />
          </div>

          {hata && (
            <div className="rounded-lg bg-red-50 p-4 text-red-600">{hata}</div>
          )}
          {basarili && (
            <div className="rounded-lg bg-green-50 p-4 text-green-600">
              Blog başarıyla eklendi!
            </div>
          )}

          <button
            type="submit"
            disabled={yukleniyorForm}
            className="flex w-full items-center justify-center rounded-lg bg-yesil/90 px-6 py-3 text-white transition-colors hover:bg-yesil disabled:bg-[#5e17eb]/50"
          >
            {yukleniyorForm ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Yükleniyor...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-5 w-5" />
                Blog Ekle
              </>
            )}
          </button>
        </form>
      </div>

      <div className="container mx-auto w-full rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-8 text-2xl font-bold text-gray-800">Blog Listesi</h2>

        {yukleniyor ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#5e17eb]" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bloglar.map((blog) => (
              <div
                key={blog.id}
                className="h-fit rounded-lg border p-4 shadow-sm"
              >
                {duzenleId === blog.id ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={guncelBlog.title}
                      onChange={(e) =>
                        setGuncelBlog({
                          ...guncelBlog,
                          title: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border p-2"
                      placeholder="Başlık"
                    />
                    <textarea
                      value={guncelBlog.content}
                      onChange={(e) =>
                        setGuncelBlog({
                          ...guncelBlog,
                          content: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border p-2"
                      rows={3}
                      placeholder="İçerik"
                    />
                    <input
                      type="text"
                      value={guncelBlog.category}
                      onChange={(e) =>
                        setGuncelBlog({
                          ...guncelBlog,
                          category: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border p-2"
                      placeholder="Kategori"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={blogGuncelle}
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
                    <h3 className="mb-2 text-lg font-semibold">{blog.title}</h3>
                    <p className="mb-4 text-gray-600">{blog.content}</p>
                    <p className="mb-4 text-gray-600">
                      Kategori: {blog.category}
                    </p>
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-48 object-contain mb-4"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => duzenlemeBaslat(blog)}
                        className="flex items-center gap-1 rounded-lg bg-yesil px-4 py-2 text-white hover:bg-yesil/90"
                      >
                        <Pencil className="h-4 w-4" />
                        Düzenle
                      </button>
                      <button
                        onClick={() => blogSil(blog.id)}
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
        )}
      </div>
    </div>
  );
};

export default BlogYonetim;
