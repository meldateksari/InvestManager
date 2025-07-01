'use client';

import { useState } from 'react';
import { db, auth } from '../../../lib/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useCountries } from '../../hooks/useCountries';
import { useCities } from '../../hooks/useCities';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleModal: () => void;
}

const SignUpModal = ({ isOpen, onClose, onToggleModal }: SignUpModalProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    country: '',
    city: ''
  });

  const [loading, setLoading] = useState(false);
  const { countries, loading: countriesLoading } = useCountries();
  const { cities, loading: citiesLoading } = useCities(formData.country);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Email adresini temizle ve küçük harfe çevir
      const cleanEmail = formData.email.trim().toLowerCase();

      console.log('Kayıt denemesi başladı:', { 
        email: cleanEmail,
        firstName: formData.firstName,
        lastName: formData.lastName
      });

      // Önce Authentication ile kullanıcı oluştur
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        cleanEmail,
        formData.password
      );

      // Kullanıcı UID'sini al
      const uid = userCredential.user.uid;
      console.log('Authentication başarılı, kullanıcı oluşturuldu:', uid);

      // Firestore'da users koleksiyonunda kullanıcı dökümanı oluştur
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: cleanEmail,
        country: formData.country,
        city: formData.city,
        createdAt: new Date(),
        uid: uid // UID'yi de saklayalım
      };

      await setDoc(doc(db, 'users', uid), userData);
      console.log('Firestore dökümanı oluşturuldu:', userData);
      
      onClose();
      alert('Kayıt başarıyla tamamlandı! Şimdi giriş yapabilirsiniz.');
    } catch (error: any) {
      console.error('Kayıt hatası detayları:', {
        code: error.code,
        message: error.message,
        email: formData.email
      });
      
      let errorMessage = 'Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Bu email adresi zaten kullanımda.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Geçersiz email formatı.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Şifre en az 6 karakter olmalıdır.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/şifre girişi şu anda devre dışı.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Ağ bağlantısı hatası. İnternet bağlantınızı kontrol edin.';
          break;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'email' ? value.trim() : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full transform transition-transform duration-300 hover:scale-105">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <span className="text-gray-800 text-sm">Invest Manager Company</span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create your account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Enter your first name"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Enter your last name"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter your email"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter your password (min. 6 characters)"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              disabled={loading || countriesLoading}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
            >
              <option value="">Select your country</option>
              {countries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              disabled={!formData.country || citiesLoading || loading}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
            >
              <option value="">Select your city</option>
              {cities.map((city: any) => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-4 transform transition-transform duration-300 hover:scale-105 disabled:opacity-50"
          >
            {loading ? 'Signing up...' : 'Sign up'}
          </button>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button 
              onClick={onToggleModal}
              disabled={loading}
              className="text-blue-500 hover:underline bg-transparent border-none p-0 transform transition-transform duration-300 hover:scale-110 inline-block"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpModal; 