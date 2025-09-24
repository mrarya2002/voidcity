// src/components/Card.jsx
export default function Card({ serial }) {
  return (
    <div
      onClick={() => window.open(serial.blogUrl, "_blank")}
      className="cursor-pointer bg-[#111] rounded-2xl shadow-lg overflow-hidden hover:scale-105 transform transition duration-300"
    >
      <img src={serial.poster} alt={serial.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-bold text-white">{serial.title}</h3>
        <p className="text-gray-400 text-sm mt-1">{serial.description}</p>
      </div>
    </div>
  );
}
