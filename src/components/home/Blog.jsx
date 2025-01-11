import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { db } from "../../db/Firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

const BlogSection = () => {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const articleCollectionRef = collection(db, "bloglar");
        const articleSnapshot = await getDocs(articleCollectionRef);
        const articleList = articleSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setArticles(articleList);
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      }
    };

    fetchArticles();
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("tr-TR", options);
  };

  return (
    <div className="py-20 px-4 lg:px-8 border-t">
      <div className="mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-gray-800">Blog</h2>
        </div>

        <div className="grid md:grid-cols-2 max-w-screen-xl mx-auto lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <motion.article
              key={article.id}
              whileHover={{ y: -5 }}
              className="bg-white h-full flex items-start justify-center flex-col rounded-xl shadow-lg overflow-hidden"
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-yesil">
                    {article.category}
                  </span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span className="text-sm text-gray-500">
                    {formatDate(article.createdAt)}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-gray-600 line-clamp-2">{article.excerpt}</p>

                <Link
                  to={`/blog/${article.id}`}
                  className="flex items-center gap-2 text-yesil hover:text-green-700 transition-colors mt-4"
                >
                  Devamını Oku
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSection;
