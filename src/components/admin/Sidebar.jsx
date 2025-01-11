import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ArrowUp, Menu } from "lucide-react";

const Sidebar = ({ screen }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dropdownState, setDropdownState] = useState({});

  const toggleDropdown = (name) => {
    setDropdownState((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  };

  const dropdownVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto" },
  };

  return (
    <div className="relative">
      <button
        className="absolute left-4 top-4 z-50"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="text-3xl text-black" />
      </button>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col bg-white shadow-lg md:relative md:inset-auto md:w-64 md:shadow-none"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
          >
            <div className="mt-5 flex justify-center">
              <img
                src="/images/logo.png"
                alt="Logo"
                className="w-24 cursor-pointer"
                onClick={() => screen(0)}
              />
            </div>

            <div className="mt-8 space-y-4 px-4">
              {[
                {
                  label: "Anasayfa Yönetimi",
                  items: [{ label: "Başlık", action: () => screen(4) }],
                },
                {
                  label: "Yorum Yönetimi",
                  items: [{ label: "Yorumlar", action: () => screen(1) }],
                },
                {
                  label: "Blog",
                  items: [{ label: "Bloglar", action: () => screen(2) }],
                },
                {
                  label: "Psikolojik Testler",
                  items: [{ label: "Test Yönetimi", action: () => screen(3) }],
                },
                {
                  label: "İletişim",
                  items: [{ label: "Düzenle", action: () => screen(5) }],
                },
              ].map((menu, index) => (
                <div key={index}>
                  <button
                    onClick={() => toggleDropdown(menu.label)}
                    className="flex w-full items-center justify-between rounded-lg bg-yesil px-4 py-2 text-white"
                  >
                    <span>{menu.label}</span>
                    {dropdownState[menu.label] ? <ArrowDown /> : <ArrowUp />}
                  </button>

                  <AnimatePresence>
                    {dropdownState[menu.label] && (
                      <motion.div
                        className="overflow-hidden rounded-lg bg-gray-100 shadow-lg"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={dropdownVariants}
                        transition={{ duration: 0.3 }}
                      >
                        <ul className="flex flex-col">
                          {menu.items.map((item, idx) => (
                            <li key={idx}>
                              <button
                                onClick={item.action}
                                className="block w-full px-4 py-2 hover:bg-gray-200"
                              >
                                {item.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sidebar;
