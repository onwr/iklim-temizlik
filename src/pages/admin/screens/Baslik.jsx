import React, { useEffect, useState } from "react";
import { db } from "../../../db/Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import JoditEditor from "jodit-react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Loader from "../../../components/Loader";

const Baslik = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    unvan: "",
    title: "",
    text: "",
    description: "",
  });

  // Jodit Editor Config
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

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "hero", "content");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFormData(docSnap.data());
        }
      } catch (error) {
        console.error("Hata:", error);
        toast.error("Veriler yüklenemedi!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle editor content change
  const handleEditorChange = (newContent) => {
    setFormData((prev) => ({
      ...prev,
      text: newContent,
    }));
  };

  // Save changes
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const docRef = doc(db, "hero", "content");
      await updateDoc(docRef, formData);
      toast.success("Değişiklikler kaydedildi!");
    } catch (error) {
      console.error("Hata:", error);
      toast.error("Kaydetme sırasında bir hata oluştu!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">
          Hero Bölümü Yönetimi
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Unvan
            </label>
            <input
              type="text"
              name="unvan"
              value={formData.unvan}
              onChange={handleInputChange}
              className="w-full rounded-lg border p-2"
              placeholder="Örn: Psikolog"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              İsim Soyisim
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full rounded-lg border p-2"
              placeholder="Örn: Sena DÜZ"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ana Başlık
            </label>
            <JoditEditor
              value={formData.text}
              config={config}
              onBlur={handleEditorChange}
              tabIndex={1}
            />
            <p className="mt-1 text-sm text-gray-500">
              HTML düzenleyici ile metin stilini ve rengini
              özelleştirebilirsiniz.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Açıklama Metni
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full rounded-lg border p-2"
              rows={3}
              placeholder="Açıklama metni giriniz"
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center rounded-lg bg-yesil px-4 py-2 text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              "Kaydet"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Baslik;
