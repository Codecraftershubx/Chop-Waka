import { useEffect, useState } from 'react';

export default function Menu() {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/menu')
      .then(res => res.json())
      .then(data => setMenu(data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Our Menu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {menu.map(item => (
          <div key={item.id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">{item.name}</h3>
            <p className="text-gray-600">${item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}