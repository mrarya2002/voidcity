import React, { useEffect, useState } from "react";
import axios from "axios";
import { Play, ArrowRight } from "lucide-react";

// Top Header Component
const TopHeader = () => (
  <header className="bg-zinc-900 text-white px-6 py-4 flex justify-between items-center">
    <h1 className="text-3xl font-bold">
      <span className="text-cyan-400">VOID</span>{" "}
      <span className="text-blue-500">CITY</span>
    </h1>
    <span className="text-gray-300 text-sm text-right">A city that <br /> you have dreamed</span>
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
  <div className="px-6 py-4 bg-zinc-900">
    <h2 className="text-white text-lg font-medium">TV Shows</h2>
  </div>
);

// Episode Card
const EpisodeCard = ({ episode, serialName }) => {
  const blogBaseUrls = {
    "Anupama": import.meta.env.VITE_ANUPAMA_BLOG,
    "Yeh Rishta Kya Kehlata Hai": import.meta.env.VITE_BHAGYA_LAKSHMI_BLOG,
    // "Tum Se Tum Tak": import.meta.env.VITE_TUM_SE_TUM_TAK_BLOG,
    // "Saas Bhi Kabhi Bahu Thi": import.meta.env.VITE_SAAS_BHI_KABHI_BAHU_THI_BLOG
  };

  const blogUrl = blogBaseUrls[serialName]
    ? `${blogBaseUrls[serialName]}/#${episode.episodeNo}`
    : "#"; // fallback

  return (
    <a href={blogUrl} target="_blank" rel="noopener noreferrer">
      {/* 🔹 Responsive width: smaller on mobile, bigger on md+ */}
      <div className="bg-gray-900 rounded-lg overflow-hidden cursor-pointer group flex-shrink-0 w-44 sm:w-52 md:w-64 lg:w-72">
        <div className="relative">
          <img
            src={episode.image || episode.thumbnail}
            alt={episode.title}
            className="w-full h-32 sm:h-40 md:h-44 lg:h-48 object-cover"
          />
        </div>
        <div className="p-3 sm:p-4">
          <h3 className="text-white font-semibold text-sm sm:text-base mb-1">
            {episode.title}
          </h3>
          <div className="flex flex-wrap items-center text-gray-400 text-xs sm:text-sm space-x-2">
            {episode.episodeNo && <span>{episode.episodeNo}</span>}
            <span>•</span>
            <span>25m</span>
            {episode.createdAt && (
              <>
                <span>•</span>
                <span>{new Date(episode.createdAt).toLocaleDateString("en-GB")}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </a>
  );
};



// Serial Section
const SerialSection = ({ serial }) => (
  <section className="mb-8">
    <div className="px-6 py-4 bg-black">
      <h1 className="text-4xl font-bold text-white">{serial.name}</h1>
    </div>
    <div className="px-6 py-6 bg-black">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-white">Episodes</h2>
        <button className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors">
          <span className="mr-2">Scroll for more</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex space-x-6 pb-4" style={{ width: "max-content" }}>
          {serial.episodes
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // newest first
            .map((ep) => (
              <EpisodeCard key={ep._id || ep.id} episode={ep} serialName={serial.name} />
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
