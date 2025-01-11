import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../db/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { ArrowLeft } from "lucide-react";

const BlogPost = () => {
  const [article, setArticle] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const articleDoc = doc(db, "bloglar", id);
        const articleSnapshot = await getDoc(articleDoc);
        if (articleSnapshot.exists()) {
          setArticle({ id: articleSnapshot.id, ...articleSnapshot.data() });
        }
      } catch (error) {
        console.error("Makale çekme hatası:", error);
      }
    };

    fetchArticle();
  }, [id]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("tr-TR", options);
  };

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yesil"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-yesil hover:text-green-700 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Anasayfaya Dön
        </Link>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-yesil">
              {article.category}
            </span>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <span className="text-sm text-gray-500">
              {formatDate(article.createdAt)}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-gray-800">{article.title}</h1>

          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full rounded-xl"
          />

          <div className="prose max-w-none">
            {article.content.split("\n\n").map((paragraph, index) => (
              <p
                key={index}
                className="text-gray-600 text-lg leading-relaxed mb-6"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
