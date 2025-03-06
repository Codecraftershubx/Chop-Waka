import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Your page content goes here */}
        <h1 className="text-3xl font-bold mb-6 text-red-500">Welcome to Our Store</h1>
        <p className="mb-4">This is a sample page to demonstrate the responsive header and footer.</p>
        <div className="bg-gray-100 p-8 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
          <p>Your products would be displayed here.</p>
          <p class="text-red-500">This is red text.</p>
          <p class="text-blue-700">This is blue text.</p>
          <p class="text-green-600">This is green text.</p>
          <p class="text-yellow-500">This is yellow text.</p>
          <p class="text-purple-800">This is purple text.</p>
          <p class="text-gray-500">This is gray text.</p>
          <p class="text-white">This is white text.</p>
          <p class="text-black">This is black text.</p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;