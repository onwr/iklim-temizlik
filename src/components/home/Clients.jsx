import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { db } from "../../db/Firebase";
import { collection, getDocs } from "firebase/firestore";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const testimonialsCollectionRef = collection(db, "testimonials");
        const testimonialsSnapshot = await getDocs(testimonialsCollectionRef);
        const testimonialsList = testimonialsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTestimonials(testimonialsList);
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <div className="py-16 px-4 lg:px-16 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            Müşteri Yorumları
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hizmet verdiğimiz müşterilerimizin memnuniyet ve deneyimleri
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow relative border border-yesil/10"
            >
              <Quote className="absolute text-yesil/10 w-24 h-24 -top-4 -left-4" />
              <div className="relative z-10">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yesil text-yesil" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-yesil">{testimonial.service}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Testimonials;
