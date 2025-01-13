import React, { useEffect, useState } from "react";
import { db } from "../../db/Firebase";
import { collection, getDocs } from "firebase/firestore";
import { Loader2, Play } from "lucide-react";

const Gallery = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  const videos = [
    "/videos/video1.mp4",
    "/videos/video2.mp4",
    "/videos/video3.mp4",
    "/videos/video4.mp4",
    "/videos/video5.mp4",
    "/videos/video6.mp4",
    "/videos/video7.mp4",
    "/videos/video8.mp4",
    "/videos/video9.mp4",
    "/videos/video10.mp4",
    "/videos/video11.mp4",
  ].map((url, index) => ({
    id: `video-${index + 1}`,
    type: 'video',
    url
  }));

  useEffect(() => {
    const fetchGalleryMedia = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "galeri"));
        const imageData = [];
        querySnapshot.forEach((doc) => {
          imageData.push({ 
            id: doc.id, 
            type: 'image',
            url: doc.data().imageUrl,
            ...doc.data() 
          });
        });
        setMediaItems([...imageData, ...videos]);
      } catch (error) {
        console.log("Hata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryMedia();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const imageItems = mediaItems.filter(item => item.type === 'image');
  const videoItems = mediaItems.filter(item => item.type === 'video');

  const MediaCard = ({ item }) => (
    <div
      className="break-inside-avoid group cursor-pointer"
      onClick={() => setSelectedItem(item)}
    >
      <div className="bg-white rounded-2xl shadow-md overflow-hidden transform transition duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="relative">
          {item.type === 'image' ? (
            <img
              src={item.url}
              alt={item.title}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="relative aspect-video bg-gray-100">
              <video
                src={item.url}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Play className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
        </div>
        {item.type === 'image' && (
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {item.title}
            </h3>
            {item.description && (
              <p className="text-gray-600 leading-relaxed">
                {item.description}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="border-t min-h-screen py-20 px-4 lg:px-16">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          <h2 className="text-5xl font-bold text-gray-800 tracking-tight">
            Resim ve Videolar
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Çalışmalarımızdan bazı örnekler
          </p>
        </div>

        {imageItems.length > 0 && (
          <div>
            <h3 className="text-3xl font-semibold text-gray-800 mb-8">Resimler</h3>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
              {imageItems.map((item) => (
                <MediaCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {videoItems.length > 0 && (
          <div>
            <h3 className="text-3xl font-semibold text-gray-800 mb-8">Videolar</h3>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
              {videoItems.map((item) => (
                <MediaCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedItem && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedItem.type === 'image' ? (
              <>
                <img
                  src={selectedItem.url}
                  alt={selectedItem.title}
                  className="w-full h-full object-contain max-h-[80vh]"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    {selectedItem.title}
                  </h3>
                  {selectedItem.description && (
                    <p className="text-gray-600">{selectedItem.description}</p>
                  )}
                </div>
              </>
            ) : (
              <video
                src={selectedItem.url}
                controls
                className="w-full h-full object-contain"
                autoPlay
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;