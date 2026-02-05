export default function CardGrid({ data }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {data.map((item) => (
        <div
          key={item.id}
          className="rounded-lg overflow-hidden shadow hover:shadow-lg transition"
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-32 object-cover"
          />
          <div className="p-2 text-sm font-medium text-center">
            {item.title}
          </div>
        </div>
      ))}
    </div>
  );
}