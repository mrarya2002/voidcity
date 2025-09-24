import React, { useEffect, useState } from "react";
import axios from "axios";
import { Play, ArrowRight } from "lucide-react";

// Top Header Component
const TopHeader = () => (
  <header className="bg-black text-white px-6 py-4 flex justify-between items-center">
    <h1 className="text-3xl font-bold">
      <span className="text-cyan-400">VOID</span>{" "}
      <span className="text-blue-500">CITY</span>
    </h1>
    <span className="text-gray-300 text-sm">A city that you have dreamed</span>
  </header>
);

// Navigation Header
const NavigationHeader = () => (
  <nav className="bg-black text-white px-6 py-3 flex justify-end items-center">
    <div className="flex items-center space-x-3">
      {["Home", "Suggestion", "Login", "Signup"].map((btn) => (
        <button
          key={btn}
          className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded text-sm font-medium transition-colors"
        >
          {btn}
        </button>
      ))}
    </div>
  </nav>
);

// Section Header
const SectionHeader = () => (
  <div className="px-6 py-4 bg-black">
    <h2 className="text-white text-lg font-medium">TV Shows</h2>
  </div>
);

// Episode Card
const EpisodeCard = ({ episode }) => (
  <div className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors cursor-pointer group flex-shrink-0 w-72">
    <div className="relative">
      <img
        src={episode.image || episode.thumbnail} // use episode image from backend
        alt={episode.title}
        className="w-full h-48 object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <Play className="w-12 h-12 text-white" fill="white" />
      </div>
    </div>
    <div className="p-4">
      <h3 className="text-white font-semibold text-lg mb-1">{episode.title}</h3>
      <div className="flex items-center text-gray-400 text-sm space-x-2">
        {episode.code && <span>{episode.code}</span>}
        {episode.duration && (
          <>
            <span>•</span>
            <span>{episode.duration}</span>
          </>
        )}
        {episode.date && (
          <>
            <span>•</span>
            <span>{new Date(episode.date).toLocaleDateString()}</span>
          </>
        )}
      </div>
    </div>
  </div>
);

// Serial Section
const SerialSection = ({ serial }) => (
  <section className="mb-8">
    <div className="px-6 py-8 bg-black">
      <h1 className="text-6xl font-bold text-white mb-2">{serial.title}</h1>
    </div>
    <div className="px-6 py-6 bg-black">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Episodes</h2>
        <button className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors">
          <span className="mr-2">Scroll for more</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex space-x-6 pb-4" style={{ width: "max-content" }}>
          {serial.episodes.map((ep) => (
            <EpisodeCard key={ep._id || ep.id} episode={ep} />
          ))}
        </div>
      </div>
    </div>
  </section>
);

// Serials Container
const SerialsContainer = ({ serials }) => (
  <div className="space-y-0">
    {serials.map((serial, index) => (
      <div key={serial._id || serial.id} className={index > 0 ? "border-t border-gray-900" : ""}>
        <SerialSection serial={serial} />
      </div>
    ))}
  </div>
);

// Main Home Component
const Home = () => {
  const [serials, setSerials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSerials = async () => {
      try {
        const { data } = await axios.get("https://illegal-backend.vercel.app/api/serials");
        // For each serial, fetch episodes
        const serialsWithEpisodes = await Promise.all(
          data.data.map(async (serial) => {
            const episodesRes = await axios.get(`https://illegal-backend.vercel.app/api/serials/${serial._id}/episodes`);
            return { ...serial, episodes: episodesRes.data.data };
          })
        );
        setSerials(serialsWithEpisodes);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching serials:", err);
        setLoading(false);
      }
    };
    fetchSerials();
  }, []);

  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-black">
      <TopHeader />
      <NavigationHeader />
      <SectionHeader />
      <main>
        <SerialsContainer serials={serials} />
      </main>
    </div>
  );
};

export default Home;
