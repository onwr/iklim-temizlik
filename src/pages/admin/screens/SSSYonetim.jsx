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

const TestYonetim = () => {
  const [baslik, setBaslik] = useState("");
  const [aciklama, setAciklama] = useState("");
  const [image, setImage] = useState("");
  const [sorular, setSorular] = useState([{ question: "", options: [""] }]);
  const [testler, setTestler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [duzenleId, setDuzenleId] = useState(null);
  const imgBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
  const [guncelTest, setGuncelTest] = useState({
    title: "",
    description: "",
    image: "",
    questions: [{ question: "", options: [""] }],
  });

  const testleriGetir = async () => {
    try {
      const testCollectionRef = collection(db, "psychologicalTests");
      const testSnapshot = await getDocs(testCollectionRef);
      const testList = testSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTestler(testList);
    } catch (error) {
      console.error("Testler yüklenirken hata:", error);
      toast.error("Testler yüklenemedi!");
    }
  };

  useEffect(() => {
    testleriGetir();
  }, []);

  const testEkle = async (e) => {
    e.preventDefault();

    if (!baslik.trim() || !aciklama.trim() || !sorular.length) {
      toast.error("Lütfen tüm alanları doldurunuz.");
      return;
    }

    setYukleniyor(true);

    try {
      const testCollectionRef = collection(db, "psychologicalTests");
      const yeniTest = {
        title: baslik,
        description: aciklama,
        image: image,
        questions: sorular,
      };

      await addDoc(testCollectionRef, yeniTest);
      setTestler([...testler, yeniTest]);
      setBaslik("");
      setAciklama("");
      setImage("");
      setSorular([{ question: "", options: [""] }]);
      toast.success("Test başarıyla eklendi!");
    } catch (error) {
      console.error("Test eklenirken hata:", error);
      toast.error("Test eklenirken bir hata oluştu!");
    } finally {
      setYukleniyor(false);
    }
  };

  const testSil = async (id) => {
    if (window.confirm("Bu testi silmek istediğinize emin misiniz?")) {
      try {
        const docRef = doc(db, "psychologicalTests", id);
        await deleteDoc(docRef);
        setTestler(testler.filter((test) => test.id !== id));
        toast.success("Test başarıyla silindi!");
      } catch (error) {
        console.error("Test silinirken hata:", error);
        toast.error("Silme işlemi başarısız oldu!");
      }
    }
  };

  const duzenlemeBaslat = (test, index) => {
    setDuzenleId(index);
    setGuncelTest(test);
  };

  const testGuncelle = async () => {
    try {
      const yeniTestler = [...testler];
      yeniTestler[duzenleId] = guncelTest;

      const docRef = doc(db, "psychologicalTests", guncelTest.id);
      await updateDoc(docRef, guncelTest);

      setTestler(yeniTestler);
      setDuzenleId(null);
      toast.success("Test başarıyla güncellendi!");
    } catch (error) {
      console.error("Test güncellenirken hata:", error);
      toast.error("Güncelleme işlemi başarısız oldu!");
    }
  };

  const handleQuestionChange = (index, e) => {
    const { name, value } = e.target;
    const newQuestions = [...sorular];
    newQuestions[index][name] = value;
    setSorular(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, e) => {
    const newQuestions = [...sorular];
    newQuestions[qIndex].options[oIndex] = e.target.value;
    setSorular(newQuestions);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
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
    }
  };

  const addQuestion = () => {
    setSorular([...sorular, { question: "", options: [""] }]);
  };

  const addOption = (index) => {
    const newQuestions = [...sorular];
    newQuestions[index].options.push("");
    setSorular(newQuestions);
  };

  const removeQuestion = (index) => {
    const newQuestions = sorular.filter((_, i) => i !== index);
    setSorular(newQuestions);
  };

  const removeOption = (qIndex, oIndex) => {
    const newQuestions = [...sorular];
    newQuestions[qIndex].options = newQuestions[qIndex].options.filter(
      (_, i) => i !== oIndex
    );
    setSorular(newQuestions);
  };

  return (
    <div className="w-full space-y-8">
      <div className="container mx-auto w-full rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-8 text-2xl font-bold text-gray-800">Test Yönetimi</h2>

        <form onSubmit={testEkle} className="mb-8 space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Başlık
            </label>
            <input
              type="text"
              value={baslik}
              onChange={(e) => setBaslik(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-[#26355e]/70 focus:outline-none focus:ring-1 focus:ring-[#26355e]"
              placeholder="Başlığı giriniz"
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
              placeholder="Açıklamayı giriniz"
              rows={4}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Test Görseli
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
                alt="Test görseli"
                className="mt-2 h-32 w-32 rounded-lg object-cover"
              />
            )}
          </div>

          {sorular.map((soru, index) => (
            <div key={index} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Soru {index + 1}
                </label>
                <input
                  type="text"
                  name="question"
                  value={soru.question}
                  onChange={(e) => handleQuestionChange(index, e)}
                  className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-[#26355e]/70 focus:outline-none focus:ring-1 focus:ring-[#26355e]"
                  placeholder="Soruyu giriniz"
                />
              </div>
              {soru.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, oIndex, e)}
                    className="flex-1 rounded-lg border border-gray-300 p-2.5 focus:border-[#26355e]/70 focus:outline-none focus:ring-1 focus:ring-[#26355e]"
                    placeholder={`Seçenek ${oIndex + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(index, oIndex)}
                    className="flex items-center justify-center rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addOption(index)}
                className="flex items-center justify-center rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                Seçenek Ekle
              </button>
              <button
                type="button"
                onClick={() => removeQuestion(index)}
                className="flex items-center justify-center rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Soruyu Sil
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addQuestion}
            className="flex items-center justify-center rounded-lg bg-green-500 px-6 py-3 text-white hover:bg-green-600"
          >
            <Plus className="mr-2 h-5 w-5" />
            Yeni Soru Ekle
          </button>

          <button
            type="submit"
            disabled={yukleniyor}
            className="flex w-full items-center justify-center rounded-lg bg-[#26355e]/90 px-6 py-3 text-white transition-colors hover:bg-[#26355e] disabled:bg-[#26355e]/50"
          >
            {yukleniyor ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Yükleniyor...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-5 w-5" />
                Test Ekle
              </>
            )}
          </button>
        </form>

        <div className="space-y-4">
          {testler.map((test, index) => (
            <div key={index} className="rounded-lg border p-4">
              {duzenleId === index ? (
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Başlık
                    </label>
                    <input
                      type="text"
                      value={guncelTest.title}
                      onChange={(e) =>
                        setGuncelTest({ ...guncelTest, title: e.target.value })
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
                      value={guncelTest.description}
                      onChange={(e) =>
                        setGuncelTest({
                          ...guncelTest,
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
                      Test Görseli
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        handleImageUpload(e).then((imageUrl) => {
                          setGuncelTest({ ...guncelTest, image: imageUrl });
                        });
                      }}
                      className="w-full rounded-lg border border-gray-300 p-2.5"
                    />
                    {guncelTest.image && (
                      <img
                        src={guncelTest.image}
                        alt="Test görseli"
                        className="mt-2 h-32 w-32 rounded-lg object-cover"
                      />
                    )}
                  </div>
                  {guncelTest.questions.map((soru, index) => (
                    <div key={index} className="space-y-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Soru {index + 1}
                        </label>
                        <input
                          type="text"
                          name="question"
                          value={soru.question}
                          onChange={(e) => {
                            const newQuestions = [...guncelTest.questions];
                            newQuestions[index].question = e.target.value;
                            setGuncelTest({
                              ...guncelTest,
                              questions: newQuestions,
                            });
                          }}
                          className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-[#26355e]/70 focus:outline-none focus:ring-1 focus:ring-[#26355e]"
                          placeholder="Soruyu giriniz"
                        />
                      </div>
                      {soru.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newQuestions = [...guncelTest.questions];
                              newQuestions[index].options[oIndex] =
                                e.target.value;
                              setGuncelTest({
                                ...guncelTest,
                                questions: newQuestions,
                              });
                            }}
                            className="flex-1 rounded-lg border border-gray-300 p-2.5 focus:border-[#26355e]/70 focus:outline-none focus:ring-1 focus:ring-[#26355e]"
                            placeholder={`Seçenek ${oIndex + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newQuestions = [...guncelTest.questions];
                              newQuestions[index].options = newQuestions[
                                index
                              ].options.filter((_, i) => i !== oIndex);
                              setGuncelTest({
                                ...guncelTest,
                                questions: newQuestions,
                              });
                            }}
                            className="flex items-center justify-center rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const newQuestions = [...guncelTest.questions];
                          newQuestions[index].options.push("");
                          setGuncelTest({
                            ...guncelTest,
                            questions: newQuestions,
                          });
                        }}
                        className="flex items-center justify-center rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Seçenek Ekle
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <button
                      onClick={testGuncelle}
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
                  <h3 className="mb-2 text-lg font-semibold">{test.title}</h3>
                  <p className="mb-4 text-gray-600">{test.description}</p>
                  {test.image && (
                    <img
                      src={test.image}
                      alt="Test görseli"
                      className="mb-4 h-32 w-32 rounded-lg object-cover"
                    />
                  )}
                  {test.questions.map((soru, index) => (
                    <div key={index} className="mb-4">
                      <h4 className="font-semibold">
                        {index + 1}. {soru.question}
                      </h4>
                      <ul className="list-disc pl-5">
                        {soru.options.map((option, oIndex) => (
                          <li key={oIndex}>{option}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <button
                      onClick={() => duzenlemeBaslat(test, index)}
                      className="flex items-center gap-1 rounded-lg bg-[#26355e] px-4 py-2 text-white hover:bg-[#26355e]/90"
                    >
                      <Pencil className="h-4 w-4" />
                      Düzenle
                    </button>
                    <button
                      onClick={() => testSil(test.id)}
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

export default TestYonetim;
