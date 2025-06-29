'use client';

import Image from "next/image";
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';

export default function Home() {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;
    
    try {
      const docRef = await addDoc(collection(db, 'users'), {
        name: inputValue,
        createdAt: serverTimestamp()
      });
      console.log("Döküman eklendi, ID:", docRef.id);
      setInputValue('');
    } catch (error) {
      console.error("Hata oluştu:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold mb-6">Kullanıcı Yönetimi</h1>
          
          <div className="flex gap-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Kullanıcı adı girin"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
