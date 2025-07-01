'use client';

import { useState } from 'react';
import { auth, db } from '../../../lib/firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleModal: () => void;
}

const LoginModal = ({ isOpen, onClose, onToggleModal }: LoginModalProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Email ve şifreyi temizle
      const cleanEmail = formData.email.trim().toLowerCase();
      const cleanPassword = formData.password;

      console.log('Giriş denemesi:', { email: cleanEmail });

      // Firebase Auth ile giriş yap
      const userCredential = await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        cleanPassword
      );

      // Kullanıcı bilgilerini Firestore'dan al
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (userDoc.exists()) {
        console.log('Kullanıcı bilgileri:', userDoc.data());
        onClose();
      } else {
        console.error('Kullanıcı dökümanı bulunamadı');
        alert('Kullanıcı bilgileri eksik. Lütfen yönetici ile iletişime geçin.');
      }
    } catch (error: any) {
      console.error('Giriş hatası detayları:', {
        code: error.code,
        message: error.message,
        email: formData.email
      });
      
      let errorMessage = 'Giriş sırasında bir hata oluştu. Lütfen bilgilerinizi kontrol edip tekrar deneyin.';
      
      switch (error.code) {
        case 'auth/invalid-credential':
          errorMessage = 'Email veya şifre hatalı. Lütfen bilgilerinizi kontrol ediniz.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Geçersiz email formatı.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Bu hesap devre dışı bırakılmış.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyin.';
          break;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordReset = async () => {
    if (!formData.email.trim()) {
      alert('Lütfen şifre sıfırlama için email adresinizi girin.');
      return;
    }

    setResetLoading(true);
    try {
      const cleanEmail = formData.email.trim().toLowerCase();
      await sendPasswordResetEmail(auth, cleanEmail);
      setResetEmailSent(true);
      alert('Şifre sıfırlama bağlantısı email adresinize gönderildi. Lütfen email kutunuzu kontrol edin.');
    } catch (error: any) {
      console.error('Şifre sıfırlama hatası:', error);
      
      let errorMessage = 'Şifre sıfırlama sırasında bir hata oluştu.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Bu email adresi ile kayıtlı bir kullanıcı bulunamadı.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Geçersiz email formatı.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.';
          break;
      }
      
      alert(errorMessage);
    } finally {
      setResetLoading(false);
    }
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

        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Welcome back</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
              disabled={loading}
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
              placeholder="Enter your password"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
              disabled={loading}
            />
          </div>

          <div className="flex justify-between items-center">
            <button 
              type="button"
              onClick={handlePasswordReset}
              className="text-sm text-blue-600 hover:text-blue-800 bg-transparent border-none p-0 transform transition-all duration-300 hover:scale-105 disabled:opacity-50"
              disabled={resetLoading || loading}
            >
              {resetLoading ? 'Gönderiliyor...' : 'Şifremi unuttum'}
            </button>
            {resetEmailSent && (
              <span className="text-xs text-green-600">
                ✓ Email gönderildi
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-4 transform transition-transform duration-300 hover:scale-105 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Giriş yapılıyor...' : 'Log in'}
          </button>

          <div className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button 
              onClick={onToggleModal}
              className="text-blue-500 hover:underline bg-transparent border-none p-0 transform transition-transform duration-300 hover:scale-110 inline-block"
              disabled={loading}
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
