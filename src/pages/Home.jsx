import React from "react";
import Sidebar from "@components/Sidebar";
import HomeComponent from "@components/Home";

const Home = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-80">
        <HomeComponent />
      </main>
    </div>
  );
};

export default Home;
