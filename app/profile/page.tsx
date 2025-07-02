'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { doc, updateDoc, getDoc, setDoc, collection, addDoc, query, where, getDocs, deleteDoc, onSnapshot, orderBy } from 'firebase/firestore';
import { db, auth, storage } from '@/lib/firebase';
import { updatePassword, updateEmail, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  country: string;
  city: string;
  investmentExperience: string;
  riskTolerance: string;
  investmentGoals: string[];
  preferredAssets: string[];
  avatar: string;
  phone: string;
  birthDate: string;
  occupation: string;
  totalInvestment: number;
  totalProfit: number;
  portfolioCount: number;
  joinDate: string;
  lastLogin: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  profileVisibility: string;
}

interface Investment {
  id: string;
  category: 'altin' | 'hisse' | 'fon' | 'coin';
  name: string;
  symbol: string;
  quantity: number;
  unitPrice: number;
  totalCost: number;
  purchaseDate: string;
  purchaseLocation: string;
  notes?: string;
  createdAt: Date;
}

const ProfilePage = () => {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('kisisel');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [calculatedStats, setCalculatedStats] = useState({
    totalInvestment: 0,
    totalProfit: 0,
    portfolioCount: 0
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    country: '',
    city: '',
      investmentExperience: 'Beginner',
  riskTolerance: 'Medium',
  investmentGoals: [],
  preferredAssets: [],
  avatar: '',
  phone: '',
  birthDate: '',
  occupation: '',
  totalInvestment: 0,
  totalProfit: 0,
  portfolioCount: 0,
  joinDate: '',
  lastLogin: '',
  emailNotifications: true,
  pushNotifications: true,
  profileVisibility: 'Private'
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }

    if (user) {
      loadUserProfile();
      loadUserInvestments();
    }
  }, [user, loading]);

  // Kullanıcının yatırımlarını gerçek zamanlı takip et
  const loadUserInvestments = () => {
    if (!user) return;

    const investmentsRef = collection(db, `users/${user.uid}/investments`);
    const q = query(investmentsRef, orderBy('purchaseDate', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const investmentsList: Investment[] = [];
      snapshot.forEach((doc) => {
        investmentsList.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        } as Investment);
      });
      setInvestments(investmentsList);
    });

    return unsubscribe;
  };

  // Yatırım istatistiklerini hesapla
  useEffect(() => {
    if (investments.length === 0) {
      setCalculatedStats({
        totalInvestment: 0,
        totalProfit: 0,
        portfolioCount: 0
      });
      return;
    }

    // Yatırımları sembol ve isme göre grupla
    const groupedInvestments = investments.reduce((acc, investment) => {
      const key = `${investment.symbol}_${investment.name}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(investment);
      return acc;
    }, {} as Record<string, Investment[]>);

    // Mock current prices (gerçek uygulamada API'den gelecek)
    const mockPrices = {
      'BTC': 2874650,
      'ETH': 125450,
      'XAU': 2847.50,
      'USD': 34.25,
      'EUR': 36.80,
      'TCMB': 32.15,
      'GARAN': 125.60,
      'AKBNK': 89.75,
      'BIST': 8650.25
    };

    let totalInvestmentAmount = 0;
    let totalCurrentValue = 0;
    const portfolioCount = Object.keys(groupedInvestments).length;

    Object.entries(groupedInvestments).forEach(([key, invs]) => {
      const firstInv = invs[0];
      const totalQuantity = invs.reduce((sum, inv) => sum + inv.quantity, 0);
      const totalCost = invs.reduce((sum, inv) => sum + inv.totalCost, 0);
      const avgBuyPrice = totalCost / totalQuantity;
      
      // Mock current price (gerçek uygulamada API'den gelecek)
      const currentPrice = mockPrices[firstInv.symbol as keyof typeof mockPrices] || avgBuyPrice * 1.02;
      const currentValue = totalQuantity * currentPrice;

      totalInvestmentAmount += totalCost;
      totalCurrentValue += currentValue;
    });

    const totalProfit = totalCurrentValue - totalInvestmentAmount;

    setCalculatedStats({
      totalInvestment: totalInvestmentAmount,
      totalProfit: totalProfit,
      portfolioCount: portfolioCount
    });

    // Ana kullanıcı belgesini de güncelleyebiliriz (isteğe bağlı)
    if (user && totalInvestmentAmount > 0) {
      updateDoc(doc(db, 'users', user.uid), {
        totalInvestment: totalInvestmentAmount,
        totalProfit: totalProfit,
        portfolioCount: portfolioCount,
        updatedAt: new Date()
      }).catch(error => {
        console.warn('Kullanıcı istatistikleri güncellenemedi:', error);
      });
    }
  }, [investments, user]);

  const loadUserProfile = async () => {
    if (!user) return;

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Get active profile image from subcollection
        const profileImagesRef = collection(db, 'users', user.uid, 'profileImages');
        const activeImageQuery = query(profileImagesRef, where('isActive', '==', true));
        const activeImages = await getDocs(activeImageQuery);
        
        let avatarUrl = userData.avatar || '';
        if (!activeImages.empty) {
          const activeImage = activeImages.docs[0].data();
          avatarUrl = activeImage.url;
        }
        
        setProfile(prev => ({
          ...prev,
          ...userData,
          avatar: avatarUrl,
          email: user.email || '',
          joinDate: userData.createdAt?.toDate?.()?.toLocaleDateString?.('en-US') || 'Unknown',
          lastLogin: userData.lastLogin?.toDate?.()?.toLocaleDateString?.('en-US') || 'Unknown'
        }));
      } else {
        // If user document doesn't exist, create with basic information
        const initialUserData = {
          firstName: '',
          lastName: '',
          email: user.email || '',
          avatar: '',
          bio: '',
          country: '',
          city: '',
          phone: '',
          birthDate: '',
          occupation: '',
          investmentExperience: 'Beginner',
          riskTolerance: 'Medium',
          investmentGoals: [],
          preferredAssets: [],
          totalInvestment: 0,
          totalProfit: 0,
          portfolioCount: 0,
          emailNotifications: true,
          pushNotifications: true,
          profileVisibility: 'Private',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await setDoc(doc(db, 'users', user.uid), initialUserData);
        setProfile(prev => ({
          ...prev,
          ...initialUserData
        }));
      }
    } catch (error) {
      console.error('Profil yüklenirken hata:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { email, joinDate, lastLogin, ...profileData } = profile;
      await updateDoc(doc(db, 'users', user.uid), {
        ...profileData,
        updatedAt: new Date()
      });

      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: 'investmentGoals' | 'preferredAssets', value: string) => {
    setProfile(prev => {
      const currentArray = prev[field] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return {
        ...prev,
        [field]: newArray
      };
    });
  };

  // Base64 ile fotoğraf yükleme (CORS sorunu için alternatif)
  const handlePhotoUploadBase64 = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('=== BASE64 PROFILE PHOTO UPLOAD STARTED ===');
    
    const file = event.target.files?.[0];
    if (!file || !user) {
      console.error('❌ File or user not found:', { file: !!file, user: !!user });
      alert('File could not be selected or user is not logged in.');
      return;
    }

    console.log('✅ File selected:', {
      name: file.name,
      size: file.size,
      type: file.type,
      userId: user.uid
    });

    // File size check (1MB for Base64)
    if (file.size > 1 * 1024 * 1024) {
      console.error('❌ File too large:', file.size);
      alert('Photo size must be smaller than 1MB for Base64 method.');
      return;
    }

    // File type check
    if (!file.type.startsWith('image/')) {
      console.error('❌ Invalid file type:', file.type);
      alert('Please select a valid image file.');
      return;
    }

    setUploadingPhoto(true);
    
    try {
      console.log('🔄 Dosya Base64\'e çevriliyor...');
      
      // Dosyayı Base64'e çevir
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      
      console.log('✅ Base64 dönüşümü tamamlandı, boyut:', base64.length);

      console.log('💾 Firestore işlemleri başlıyor...');

      // Subcollection referansı
      const profileImagesRef = collection(db, 'users', user.uid, 'profileImages');
      console.log('📊 Subcollection referansı oluşturuldu');

      // Önce eski aktif fotoğrafları bul
      console.log('🔍 Eski aktif fotoğraflar aranıyor...');
      const activeImageQuery = query(profileImagesRef, where('isActive', '==', true));
      const activeImages = await getDocs(activeImageQuery);
      console.log('📋 Bulunan aktif fotoğraf sayısı:', activeImages.size);
      
      // Eski aktif fotoğrafları pasif yap
      for (const docSnapshot of activeImages.docs) {
        await updateDoc(docSnapshot.ref, { isActive: false });
        console.log('🔄 Eski fotoğraf pasif yapıldı:', docSnapshot.id);
      }

      // Yeni profil fotoğrafını subcollection'a ekle
      const timestamp = Date.now();
      const profileImageData = {
        url: base64, // Base64 string olarak kaydet
        uploadedAt: new Date(),
        isActive: true,
        fileName: `${user.uid}_${timestamp}_base64.${file.type.split('/')[1]}`,
        type: 'base64'
      };
      
      console.log('➕ Yeni fotoğraf subcollection\'a ekleniyor...');
      const newDocRef = await addDoc(profileImagesRef, profileImageData);
      console.log('✅ Subcollection\'a eklendi, Doc ID:', newDocRef.id);

      // Ana kullanıcı belgesini güncelle
      console.log('📝 Ana kullanıcı belgesi güncelleniyor...');
      await updateDoc(doc(db, 'users', user.uid), {
        avatar: base64,
        updatedAt: new Date()
      });
      console.log('✅ Ana belge güncellendi');

      // Local state'i güncelle
      setProfile(prev => ({ ...prev, avatar: base64 }));
      console.log('🔄 Local state güncellendi');
      
      // AuthContext'i güncelle
      try {
        await refreshUser();
        console.log('✅ AuthContext güncellendi');
      } catch (refreshError) {
        console.warn('⚠️ AuthContext güncellenemedi:', refreshError);
      }
      
      alert('Profil fotoğrafı başarıyla güncellendi! 🎉');
      console.log('🎉 TÜM İŞLEMLER TAMAMLANDI');
      
    } catch (error: any) {
      console.error('💥 HATA OLUŞTU:', error);
      console.error('Hata kodu:', error.code);
      console.error('Hata mesajı:', error.message);
      console.error('Full error:', JSON.stringify(error, null, 2));
      
      let errorMessage = 'Fotoğraf yüklenirken bir hata oluştu.';
      
      if (error.code === 'permission-denied') {
        errorMessage = 'Firestore yazma yetkiniz yok. Lütfen Firestore kurallarını kontrol edin.';
      } else if (error.message.includes('Missing or insufficient permissions')) {
        errorMessage = 'Firestore izinleri yetersiz. Lütfen authentication kontrolü yapın.';
      }
      
      alert(`❌ ${errorMessage}\n\nDetay: ${error.message}`);
    } finally {
      setUploadingPhoto(false);
      console.log('🔚 Upload işlemi sonlandırıldı');
      
      // Input'ları temizle
      const base64Input = document.getElementById('photo-upload-base64') as HTMLInputElement;
      if (base64Input) base64Input.value = '';
    }
  };

  // Storage ile fotoğraf yükleme (CORS sorunu var)
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('=== STORAGE PROFIL FOTOĞRAFI YÜKLEME BAŞLADI ===');
    
    const file = event.target.files?.[0];
    if (!file || !user) {
      console.error('❌ Dosya veya kullanıcı bulunamadı:', { file: !!file, user: !!user });
      alert('Dosya seçilemedi veya kullanıcı girişi yapılmamış.');
      return;
    }

    console.log('✅ Dosya seçildi:', {
      name: file.name,
      size: file.size,
      type: file.type,
      userId: user.uid
    });

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.error('❌ Dosya çok büyük:', file.size);
      alert('Fotoğraf boyutu 5MB\'dan küçük olmalıdır.');
      return;
    }

    // Dosya tipi kontrolü
    if (!file.type.startsWith('image/')) {
      console.error('❌ Geçersiz dosya tipi:', file.type);
      alert('Lütfen geçerli bir resim dosyası seçin.');
      return;
    }

    setUploadingPhoto(true);
    
    try {
      console.log('🚀 Storage yükleme başlıyor...');
      
      // Basit dosya adı
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop() || 'jpg';
      const fileName = `${user.uid}_${timestamp}.${fileExtension}`;
      
      console.log('📁 Dosya adı:', fileName);
      
      // Firebase Storage'a yükle
      const photoRef = ref(storage, `profile-photos/${fileName}`);
      console.log('📤 Storage referansı oluşturuldu');
      
      const uploadResult = await uploadBytes(photoRef, file);
      console.log('✅ Storage yükleme tamamlandı:', uploadResult.metadata.name);
      
      const photoURL = await getDownloadURL(photoRef);
      console.log('🔗 Download URL alındı:', photoURL);

      console.log('💾 Firestore işlemleri başlıyor...');

      // Subcollection referansı
      const profileImagesRef = collection(db, 'users', user.uid, 'profileImages');
      console.log('📊 Subcollection referansı oluşturuldu');

      // Önce eski aktif fotoğrafları bul
      console.log('🔍 Eski aktif fotoğraflar aranıyor...');
      const activeImageQuery = query(profileImagesRef, where('isActive', '==', true));
      const activeImages = await getDocs(activeImageQuery);
      console.log('📋 Bulunan aktif fotoğraf sayısı:', activeImages.size);
      
      // Eski aktif fotoğrafları pasif yap
      for (const docSnapshot of activeImages.docs) {
        await updateDoc(docSnapshot.ref, { isActive: false });
        console.log('🔄 Eski fotoğraf pasif yapıldı:', docSnapshot.id);
      }

      // Yeni profil fotoğrafını subcollection'a ekle
      const profileImageData = {
        url: photoURL,
        uploadedAt: new Date(),
        isActive: true,
        fileName: fileName,
        type: 'storage'
      };
      
      console.log('➕ Yeni fotoğraf subcollection\'a ekleniyor...');
      const newDocRef = await addDoc(profileImagesRef, profileImageData);
      console.log('✅ Subcollection\'a eklendi, Doc ID:', newDocRef.id);

      // Ana kullanıcı belgesini güncelle
      console.log('📝 Ana kullanıcı belgesi güncelleniyor...');
      await updateDoc(doc(db, 'users', user.uid), {
        avatar: photoURL,
        updatedAt: new Date()
      });
      console.log('✅ Ana belge güncellendi');

      // Local state'i güncelle
      setProfile(prev => ({ ...prev, avatar: photoURL }));
      console.log('🔄 Local state güncellendi');
      
      // AuthContext'i güncelle
      try {
        await refreshUser();
        console.log('✅ AuthContext güncellendi');
      } catch (refreshError) {
        console.warn('⚠️ AuthContext güncellenemedi:', refreshError);
      }
      
      alert('Profil fotoğrafı başarıyla güncellendi! 🎉');
      console.log('🎉 TÜM İŞLEMLER TAMAMLANDI');
      
    } catch (error: any) {
      console.error('💥 STORAGE HATASI - Base64 yöntemini deneyin:', error);
      console.error('Hata kodu:', error.code);
      console.error('Hata mesajı:', error.message);
      
      // CORS hatası durumunda Base64 yöntemini kullan
      if (error.message.includes('CORS') || error.message.includes('blocked') || error.code === 'storage/unknown') {
        console.log('🔄 CORS hatası - Base64 yöntemine geçiliyor...');
        setUploadingPhoto(false);
        await handlePhotoUploadBase64(event);
        return;
      }
      
      let errorMessage = 'Fotoğraf yüklenirken bir hata oluştu.';
      
      if (error.code === 'storage/unauthorized') {
        errorMessage = 'Firebase Storage yetkiniz yok. Lütfen Firebase Storage kurallarını kontrol edin.';
      } else if (error.code === 'permission-denied') {
        errorMessage = 'Firestore yazma yetkiniz yok. Lütfen Firestore kurallarını kontrol edin.';
      } else if (error.code === 'storage/quota-exceeded') {
        errorMessage = 'Depolama kotası doldu.';
      } else if (error.message.includes('Missing or insufficient permissions')) {
        errorMessage = 'Firestore izinleri yetersiz. Lütfen authentication kontrolü yapın.';
      }
      
      alert(`❌ ${errorMessage}\n\nBase64 yöntemi denenecek...`);
      
      // Base64 yöntemini dene
      setUploadingPhoto(false);
      await handlePhotoUploadBase64(event);
    } finally {
      setUploadingPhoto(false);
      console.log('🔚 Upload işlemi sonlandırıldı');
      
      // Input'ları temizle
      const storageInput = document.getElementById('photo-upload-storage') as HTMLInputElement;
      if (storageInput) storageInput.value = '';
    }
  };

  const handlePhotoRemove = async () => {
    if (!user || !profile.avatar) return;

    if (!confirm('Profil fotoğrafınızı silmek istediğinizden emin misiniz?')) return;

    setUploadingPhoto(true);
    try {
      // Storage'dan sil
      const photoRef = ref(storage, `profile-photos/${user.uid}`);
      await deleteObject(photoRef);

      // Aktif profil fotoğrafını subcollection'dan bul ve sil
      const profileImagesRef = collection(db, 'users', user.uid, 'profileImages');
      const activeImageQuery = query(profileImagesRef, where('isActive', '==', true));
      const activeImages = await getDocs(activeImageQuery);
      
      // Aktif fotoğrafları subcollection'dan sil
      for (const docSnapshot of activeImages.docs) {
        await deleteDoc(docSnapshot.ref);
        console.log('Aktif profil fotoğrafı subcollection\'dan silindi');
      }

      // Ana kullanıcı belgesindeki avatar alanını da temizle
      await updateDoc(doc(db, 'users', user.uid), {
        avatar: '',
        updatedAt: new Date()
      });

      // Local state'i güncelle
      setProfile(prev => ({ ...prev, avatar: '' }));
      
      // AuthContext'i de güncelle - navbar'daki profil fotoğrafı da güncellenecek
      await refreshUser();
      
      alert('Profil fotoğrafı başarıyla silindi!');
      console.log('Profil fotoğrafı başarıyla silindi');
    } catch (error) {
      console.error('Fotoğraf silinirken hata:', error);
      alert('Fotoğraf silinirken bir hata oluştu.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!user || !passwordData.currentPassword || !passwordData.newPassword) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Yeni şifreler eşleşmiyor.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Yeni şifre en az 6 karakter olmalıdır.');
      return;
    }

    try {
      // Mevcut şifreyi doğrula
      const credential = EmailAuthProvider.credential(user.email!, passwordData.currentPassword);
      await reauthenticateWithCredential(auth.currentUser!, credential);

      // Şifreyi güncelle
      await updatePassword(auth.currentUser!, passwordData.newPassword);

      alert('Şifreniz başarıyla güncellendi!');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      console.error('Şifre değiştirme hatası:', error);
      if (error.code === 'auth/wrong-password') {
        alert('Mevcut şifreniz yanlış.');
      } else if (error.code === 'auth/weak-password') {
        alert('Yeni şifre çok zayıf.');
      } else {
        alert('Şifre değiştirirken bir hata oluştu.');
      }
    }
  };

  // Profil fotoğrafı geçmişini al (isteğe bağlı fonksiyon)
  const getProfileImageHistory = async () => {
    if (!user) return [];

    try {
      const profileImagesRef = collection(db, 'users', user.uid, 'profileImages');
      const historyQuery = query(profileImagesRef);
      const historySnapshot = await getDocs(historyQuery);
      
      const imageHistory = historySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];

      return imageHistory.sort((a, b) => b.uploadedAt.toDate() - a.uploadedAt.toDate());
    } catch (error) {
      console.error('Profil fotoğrafı geçmişi alınırken hata:', error);
      return [];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const tabs = [
    { id: 'kisisel', label: 'Personal Information', icon: '👤' },
    { id: 'yatirim', label: 'Investment Profile', icon: '📈' },
    { id: 'istatistik', label: 'Statistics', icon: '📊' },
    { id: 'ayarlar', label: 'Account Settings', icon: '⚙️' }
  ];

  const investmentGoalsOptions = [
    'Retirement', 'Buy House', 'Buy Car', 'Education', 'Emergency Fund', 
    'Passive Income', 'Wealth Building', 'Debt Payment'
  ];

  const preferredAssetsOptions = [
    'Stock', 'Bond', 'Gold', 'Currency', 'Cryptocurrency', 
    'Real Estate', 'Mutual Fund', 'Government Bond'
  ];

  return (
    <div className="min-h-screen bg-main">
      {/* Header */}
      <div className="bg-accent text-light shadow-modern-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="flex items-center space-x-2 text-light hover:text-yellow-300 transition-all duration-300 group"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Back to Home</span>
              </Link>
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-1 text-light">User Profile</h1>
              <p className="text-light/80 text-sm">Manage your investment information</p>
            </div>
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Profil Fotoğrafı */}
                             <div className="bg-gradient-to-b from-indigo-500 to-purple-600 px-6 pt-8 pb-6 text-center text-white">
                 <div className="relative inline-block">
                   <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm mx-auto flex items-center justify-center text-white text-3xl font-bold border-4 border-white/30 relative overflow-hidden">
                     {uploadingPhoto && (
                       <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                         <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                       </div>
                     )}
                     {profile.avatar ? (
                       <img src={profile.avatar} alt="Profile" className="w-28 h-28 rounded-full object-cover" />
                     ) : (
                       (profile.firstName?.[0] || 'U').toUpperCase()
                     )}
                   </div>
                   
                   {/* Photo Edit Buttons */}
                   <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                     {/* Storage ile yükleme */}
                     <input
                       type="file"
                       accept="image/*"
                       onChange={handlePhotoUpload}
                       className="hidden"
                       id="photo-upload-storage"
                       disabled={uploadingPhoto}
                     />
                     <label
                       htmlFor="photo-upload-storage"
                       className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg transition-colors cursor-pointer"
                       title="Upload with Storage (5MB)"
                     >
                       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                       </svg>
                     </label>

                     {/* Base64 ile yükleme */}
                     <input
                       type="file"
                       accept="image/*"
                       onChange={handlePhotoUploadBase64}
                       className="hidden"
                       id="photo-upload-base64"
                       disabled={uploadingPhoto}
                     />
                     <label
                       htmlFor="photo-upload-base64"
                       className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2 shadow-lg transition-colors cursor-pointer"
                       title="Upload with Base64 (1MB)"
                     >
                       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                       </svg>
                     </label>
                     
                     {profile.avatar && (
                       <button
                         onClick={handlePhotoRemove}
                         disabled={uploadingPhoto}
                         className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
                         title="Remove Photo"
                       >
                         <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                         </svg>
                       </button>
                     )}
                   </div>
                 </div>
                <h3 className="mt-4 text-xl font-bold">
                  {profile.firstName || 'First Name'} {profile.lastName || 'Last Name'}
                </h3>
                <p className="text-blue-100 text-sm mt-1">
                  {profile.occupation || 'Occupation Not Specified'}
                </p>
                <div className="mt-3 space-y-2">
                  <div className="bg-white/10 rounded-lg px-3 py-2">
                    <p className="text-blue-100 text-xs">
                      Membership: {profile.joinDate || 'Unknown'}
                    </p>
                  </div>
                
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-4 space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 font-medium ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105'
                        : 'text-gray-800 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
              {/* Tab Header */}
              <div className="bg-gradient-to-r from-gray-50 to-indigo-50 px-8 py-6 border-b border-gray-200 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">
                      {tabs.find(tab => tab.id === activeTab)?.label}
                    </h2>
                    <p className="text-gray-700 text-sm">
                      {activeTab === 'kisisel' && 'Update your basic information'}
                      {activeTab === 'yatirim' && 'Set your investment preferences'}
                      {activeTab === 'istatistik' && 'View your investment performance'}
                      {activeTab === 'ayarlar' && 'Manage your account settings'}
                    </p>
                  </div>
                  {activeTab !== 'istatistik' && (
                    <div className="flex items-center space-x-3">
                      {isEditing && (
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        disabled={saving}
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg ${
                          isEditing
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                            : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white'
                        }`}
                      >
                        {saving ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Saving...</span>
                          </div>
                        ) : isEditing ? (
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Save</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            <span>Edit</span>
                          </div>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {activeTab === 'kisisel' && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <span className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>First Name</span>
                          </span>
                        </label>
                        <input
                          type="text"
                          value={profile.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          disabled={!isEditing}
                          placeholder="Enter your first name"
                          className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 text-gray-800 font-medium ${
                            isEditing 
                              ? 'border-indigo-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 bg-white' 
                              : 'border-gray-200 bg-gray-50 text-gray-700'
                          }`}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <span className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>Last Name</span>
                          </span>
                        </label>
                        <input
                          type="text"
                          value={profile.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          disabled={!isEditing}
                          placeholder="Enter your last name"
                          className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 text-gray-800 font-medium ${
                            isEditing 
                              ? 'border-indigo-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 bg-white' 
                              : 'border-gray-200 bg-gray-50 text-gray-700'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <span className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a1 1 0 001.42 0L21 7M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span>Email</span>
                        </span>
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-700 font-medium"
                      />
                      <p className="text-xs text-gray-500 mt-2 flex items-center space-x-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span>Email address cannot be changed for security reasons</span>
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <span className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span>About Me</span>
                        </span>
                      </label>
                      <textarea
                        value={profile.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        disabled={!isEditing}
                        rows={4}
                        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 text-gray-800 font-medium resize-none ${
                          isEditing 
                            ? 'border-indigo-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 bg-white' 
                            : 'border-gray-200 bg-gray-50 text-gray-700'
                        }`}
                        placeholder="Write a brief description about yourself, your investment experience and goals..."
                      />
                    </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent disabled:bg-gray-50 text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-2">
                        Birth Date
                      </label>
                      <input
                        type="date"
                        value={profile.birthDate}
                        onChange={(e) => handleInputChange('birthDate', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent disabled:bg-gray-50 text-gray-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        value={profile.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent disabled:bg-gray-50  text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={profile.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent disabled:bg-gray-50  text-gray-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      Occupation
                    </label>
                    <input
                      type="text"
                      value={profile.occupation}
                      onChange={(e) => handleInputChange('occupation', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent disabled:bg-gray-50 text-gray-800"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'yatirim' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-2">
                        Investment Experience
                      </label>
                      <select
                        value={profile.investmentExperience}
                        onChange={(e) => handleInputChange('investmentExperience', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent disabled:bg-gray-50 text-gray-800"
                      >
                        <option value="Beginner">Beginner (0-1 year)</option>
                        <option value="Intermediate">Intermediate (1-3 years)</option>
                        <option value="Advanced">Advanced (3-5 years)</option>
                        <option value="Expert">Expert (5+ years)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-2">
                        Risk Tolerance
                      </label>
                      <select
                        value={profile.riskTolerance}
                        onChange={(e) => handleInputChange('riskTolerance', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent disabled:bg-gray-50 text-gray-800"
                      >
                        <option value="Low">Low Risk</option>
                        <option value="Medium">Medium Risk</option>
                        <option value="High">High Risk</option>
                        <option value="Very High">Very High Risk</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-3">
                      Investment Goals
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {investmentGoalsOptions.map((goal) => (
                        <label key={goal} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={profile.investmentGoals.includes(goal)}
                            onChange={() => handleArrayChange('investmentGoals', goal)}
                            disabled={!isEditing}
                            className="text-accent focus:ring-accent"
                          />
                          <span className="text-sm text-secondary">{goal}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-3">
                      Preferred Asset Types
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {preferredAssetsOptions.map((asset) => (
                        <label key={asset} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={profile.preferredAssets.includes(asset)}
                            onChange={() => handleArrayChange('preferredAssets', asset)}
                            disabled={!isEditing}
                            className="text-accent focus:ring-accent"
                          />
                          <span className="text-sm text-secondary">{asset}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'istatistik' && (
                <div className="space-y-8">
                  {/* Gerçek Zamanlı İstatistikler */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-blue-500 rounded-full p-2">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-blue-900">Real-Time Statistics</h3>
                        <p className="text-blue-700 text-sm">Current information calculated from your portfolio data</p>
                      </div>
                    </div>
                    <div className="text-xs text-blue-600 bg-blue-100 rounded-lg px-3 py-2">
                      📊 You have {investments.length} investment transactions
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-center text-white shadow-xl">
                      <div className="text-center">
                        <svg className="w-12 h-12 mx-auto mb-4 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        <div className="text-3xl font-bold mb-2">
                          ₺{calculatedStats.totalInvestment.toLocaleString('en-US')}
                        </div>
                        <div className="text-blue-100 text-sm font-medium">Total Investment</div>
                        <div className="text-blue-200 text-xs mt-1">
                          Total amount of investments you made
                        </div>
                      </div>
                    </div>
                    <div className={`bg-gradient-to-br rounded-2xl p-6 text-center text-white shadow-xl ${
                      calculatedStats.totalProfit >= 0 
                        ? 'from-green-500 to-emerald-600' 
                        : 'from-red-500 to-red-600'
                    }`}>
                      <div className="text-center">
                        <svg className="w-12 h-12 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {calculatedStats.totalProfit >= 0 ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                          )}
                        </svg>
                        <div className="text-3xl font-bold mb-2">
                          {calculatedStats.totalProfit >= 0 ? '+' : ''}₺{calculatedStats.totalProfit.toLocaleString('en-US')}
                        </div>
                        <div className="opacity-90 text-sm font-medium">
                          {calculatedStats.totalProfit >= 0 ? 'Total Profit' : 'Total Loss'}
                        </div>
                        <div className="opacity-80 text-xs mt-1">
                          {calculatedStats.totalInvestment > 0 && (
                            `${((calculatedStats.totalProfit / calculatedStats.totalInvestment) * 100).toFixed(2)}% return`
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-center text-white shadow-xl">
                      <div className="text-center">
                        <svg className="w-12 h-12 mx-auto mb-4 text-purple-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <div className="text-3xl font-bold mb-2">
                          {calculatedStats.portfolioCount}
                        </div>
                        <div className="text-purple-100 text-sm font-medium">Different Assets</div>
                        <div className="text-purple-200 text-xs mt-1">
                          Investment diversity in your portfolio
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Yatırım Özeti */}
                  {investments.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-indigo-100 rounded-full p-3">
                          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Investment Summary</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-blue-50 rounded-xl p-4">
                          <div className="text-sm font-medium text-blue-800">Total Transactions</div>
                          <div className="text-2xl font-bold text-blue-900">{investments.length}</div>
                          <div className="text-xs text-blue-600">Investment transactions</div>
                        </div>
                        <div className="bg-green-50 rounded-xl p-4">
                          <div className="text-sm font-medium text-green-800">Current Value</div>
                          <div className="text-2xl font-bold text-green-900">
                            ₺{(calculatedStats.totalInvestment + calculatedStats.totalProfit).toLocaleString('en-US')}
                          </div>
                          <div className="text-xs text-green-600">Current portfolio value</div>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-4">
                          <div className="text-sm font-medium text-purple-800">First Investment</div>
                          <div className="text-2xl font-bold text-purple-900">
                            {investments.length > 0 
                              ? new Date(Math.min(...investments.map(inv => new Date(inv.purchaseDate).getTime()))).toLocaleDateString('en-US')
                              : '-'
                            }
                          </div>
                          <div className="text-xs text-purple-600">Earliest purchase date</div>
                        </div>
                        <div className="bg-orange-50 rounded-xl p-4">
                          <div className="text-sm font-medium text-orange-800">Last Investment</div>
                          <div className="text-2xl font-bold text-orange-900">
                            {investments.length > 0 
                              ? new Date(Math.max(...investments.map(inv => new Date(inv.purchaseDate).getTime()))).toLocaleDateString('en-US')
                              : '-'
                            }
                          </div>
                          <div className="text-xs text-orange-600">Latest purchase date</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Yatırım Yoksa Uyarı */}
                  {investments.length === 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
                      <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-yellow-800 mb-2">No Investments Yet</h3>
                      <p className="text-yellow-700 mb-4">
                        To view your statistics, you need to add investments from the portfolio page first.
                      </p>
                      <Link 
                        href="/portfolio"
                        className="inline-flex items-center space-x-2 bg-yellow-600 text-white px-6 py-3 rounded-xl hover:bg-yellow-700 transition-colors font-medium"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Go to Portfolio Page</span>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'ayarlar' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-4">Notification Settings</h3>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between">
                        <span className="text-secondary">Email Notifications</span>
                        <input
                          type="checkbox"
                          checked={profile.emailNotifications}
                          onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                          disabled={!isEditing}
                          className="text-accent focus:ring-accent"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-secondary">Push Notifications</span>
                        <input
                          type="checkbox"
                          checked={profile.pushNotifications}
                          onChange={(e) => handleInputChange('pushNotifications', e.target.checked)}
                          disabled={!isEditing}
                          className="text-accent focus:ring-accent"
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-4">Privacy Settings</h3>
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-2">
                        Profile Visibility
                      </label>
                      <select
                        value={profile.profileVisibility}
                        onChange={(e) => handleInputChange('profileVisibility', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent disabled:bg-gray-50"
                      >
                        <option value="Public">Public</option>
                        <option value="Followers Only">Followers Only</option>
                        <option value="Private">Private</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
                    <div className="space-y-4">
                      <button
                        onClick={() => setShowPasswordModal(true)}
                        className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
                        </svg>
                        <span>Change Password</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete your account? This action cannot be undone!')) {
                            alert('Account deletion feature will be added soon.');
                          }
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Delete Account</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Şifre Değiştirme Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Change Password</h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 text-gray-800 font-medium"
                  placeholder="Enter your current password"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 text-gray-800 font-medium"
                  placeholder="Enter your new password"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 text-gray-800 font-medium"
                  placeholder="Confirm your new password"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Security Tips:</p>
                    <ul className="text-xs text-yellow-800 mt-1 space-y-1">
                      <li>• Password must be at least 6 characters</li>
                      <li>• Use uppercase, lowercase, numbers and special characters</li>
                      <li>• Don't use easily guessable information</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="flex-1 px-4 py-3 text-gray-700 hover:text-gray-900 font-medium transition-colors rounded-xl border border-gray-200 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;