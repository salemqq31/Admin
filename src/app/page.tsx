"use client";

import { useState, useEffect, useCallback } from "react";
import { FiEdit, FiPlus, FiTrash2, FiEye, FiX, FiLogOut } from "react-icons/fi";
import Image from "next/image";
import { getPosts, deletePost, addPost, updatePost, Post } from "@/firebase/posts";
import { getHotelApplications, getRegistrations, deleteHotelApplication, deleteRegistration, HotelApplication, Registration } from "@/firebase/applications";
import PostForm from "@/components/PostForm";
import Login from "@/components/Login";

export default function BlogAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState<Post[]>([]);
  const [hotelApplications, setHotelApplications] = useState<HotelApplication[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Basit kullanıcı bilgileri - gerçek uygulamada bu bilgiler veritabanından gelir
  const validCredentials = [
    { username: "admin", password: "123456" },
    { username: "editor", password: "editor123" },
    { username: "manager", password: "manager123" }
  ];

  // Sayfa yüklendiğinde localStorage'dan login durumunu kontrol et
  useEffect(() => {
    const savedAuth = localStorage.getItem("blogAdmin_auth");
    const savedUser = localStorage.getItem("blogAdmin_user");
    if (savedAuth === "true" && savedUser) {
      setIsAuthenticated(true);
      setCurrentUser(savedUser);
    }
  }, []);

  const handleLogin = (username: string, password: string) => {
    const isValid = validCredentials.some(
      cred => cred.username === username && cred.password === password
    );
    
    if (isValid) {
      setIsAuthenticated(true);
      setCurrentUser(username);
      localStorage.setItem("blogAdmin_auth", "true");
      localStorage.setItem("blogAdmin_user", username);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser("");
    localStorage.removeItem("blogAdmin_auth");
    localStorage.removeItem("blogAdmin_user");
    // Formları temizle
    setShowPostForm(false);
    setCurrentPost(null);
    setSearchTerm("");
    setActiveTab("posts");
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (activeTab === "posts") {
        const postsData = await getPosts();
        setPosts(postsData);
      } else if (activeTab === "hotel-applications") {
        const applicationsData = await getHotelApplications();
        setHotelApplications(applicationsData);
      } else if (activeTab === "registrations") {
        const registrationsData = await getRegistrations();
        setRegistrations(registrationsData);
      }
    } catch (error) {
      console.error("Veri getirme hatası:", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddPost = () => {
    setCurrentPost(null);
    setShowPostForm(true);
  };

  const handleEditPost = (post: Post) => {
    setCurrentPost(post);
    setShowPostForm(true);
  };

  const handleDeletePost = async (id: string) => {
    if (!window.confirm("Bu yazıyı silmek istediğinize emin misiniz?")) return;
    
    try {
      await deletePost(id);
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  };

  const handlePostSubmit = async (data: Post) => {
    try {
      if (currentPost?.id) {
        await updatePost(currentPost.id, data);
      } else {
        await addPost(data);
      }
      setShowPostForm(false);
      fetchData();
    } catch (error) {
      console.error("Kaydetme hatası:", error);
    }
  };

  const handleDeleteApplication = async (id: string) => {
    if (!window.confirm("Bu başvuruyu silmek istediğinize emin misiniz?")) return;
    
    try {
      await deleteHotelApplication(id);
      setHotelApplications(hotelApplications.filter(app => app.id !== id));
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  };


  const handleDeleteRegistration = async (id: string) => {
    if (!window.confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;
    
    try {
      await deleteRegistration(id);
      setRegistrations(registrations.filter(reg => reg.id !== id));
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Tarih formatını düzenleme
  const formatDate = (timestamp: { toDate?: () => Date } | Date | string | null | undefined) => {
    if (!timestamp) return '-';
    
    let date: Date;
    if (typeof timestamp === 'object' && timestamp !== null && 'toDate' in timestamp && timestamp.toDate) {
      date = timestamp.toDate();
    } else {
      date = new Date(timestamp as string | Date);
    }
    
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Eğer kullanıcı giriş yapmamışsa login sayfasını göster
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#111] flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-[#222] shadow-sm">
        <div className="container mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/vercel.svg" 
              alt="Logo" 
              width={30} 
              height={30}
              className="dark:invert"
            />
            <h1 className="text-xl font-bold">AdminDigi</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Hoş geldin, <span className="font-medium">{currentUser}</span>
              </span>
              <button 
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#333]"
                title="Çıkış Yap"
              >
                <FiLogOut size={20} />
              </button>
            </div>
            {activeTab === "posts" && (
              <button 
                onClick={handleAddPost}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <FiPlus /> Yeni Yazı
              </button>
            )}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="container mx-auto flex-1 p-4 md:p-6">
        {/* Tabs */}
        <div className="mb-6 border-b dark:border-gray-700">
          <div className="flex space-x-8">
            <button 
              className={`pb-4 px-1 ${activeTab === "posts" ? "border-b-2 border-blue-500 text-blue-500" : ""}`}
              onClick={() => setActiveTab("posts")}
            >
              Yazılar
            </button>
            <button 
              className={`pb-4 px-1 ${activeTab === "hotel-applications" ? "border-b-2 border-blue-500 text-blue-500" : ""}`}
              onClick={() => setActiveTab("hotel-applications")}
            >
              Otel Başvuruları
            </button>
            <button 
              className={`pb-4 px-1 ${activeTab === "registrations" ? "border-b-2 border-blue-500 text-blue-500" : ""}`}
              onClick={() => setActiveTab("registrations")}
            >
              Ön Kayıt
            </button>
          </div>
        </div>
        
        {/* Content */}
        {showPostForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#222] rounded-lg shadow-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {currentPost ? 'Yazı Düzenle' : 'Yeni Yazı Ekle'}
                </h2>
                <button 
                  onClick={() => setShowPostForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>
              <PostForm 
                post={currentPost || undefined} 
                onSubmit={handlePostSubmit} 
                onCancel={() => setShowPostForm(false)} 
              />
            </div>
          </div>
        )}
        
        {/* Yazılar Tab */}
        {activeTab === "posts" && (
          <div>
            <div className="bg-white dark:bg-[#222] rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-medium">Tüm Yazılar</h2>
                <div className="flex items-center gap-2">
                  <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Yazılarda ara..."
                    className="px-3 py-1 border dark:border-gray-700 rounded-md bg-gray-50 dark:bg-[#333]"
                  />
                </div>
              </div>
              
              {isLoading ? (
                <div className="p-8 text-center">Yükleniyor...</div>
              ) : (
                <>
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-[#2a2a2a] text-left">
                      <tr>
                        <th className="p-4">Başlık</th>
                        <th className="p-4">Kategori</th>
                        <th className="p-4">Tarih</th>
                        <th className="p-4">Durum</th>
                        <th className="p-4">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPosts.map(post => (
                        <tr key={post.id} className="border-t dark:border-gray-700">
                          <td className="p-4">{post.title}</td>
                          <td className="p-4">{post.category}</td>
                          <td className="p-4">{formatDate(post.createdAt)}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              post.status === "yayında" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            }`}>
                              {post.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleEditPost(post)}
                                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#333]"
                                title="Düzenle"
                              >
                                <FiEdit size={18} />
                              </button>
                              <button 
                                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#333]"
                                title="Görüntüle"
                              >
                                <FiEye size={18} />
                              </button>
                              <button 
                                onClick={() => handleDeletePost(post.id!)}
                                className="p-1 text-red-500 rounded hover:bg-gray-100 dark:hover:bg-[#333]"
                                title="Sil"
                              >
                                <FiTrash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {filteredPosts.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      {searchTerm ? 'Arama sonucunda yazı bulunamadı.' : 'Henüz hiç blog yazısı yok.'}
                    </div>
                  )}
                </>
              )}
              
              <div className="p-4 border-t dark:border-gray-700 flex justify-between items-center">
                <span>Toplam: {filteredPosts.length} yazı</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Otel Başvuruları Tab */}
        {activeTab === "hotel-applications" && (
          <div className="bg-white dark:bg-[#222] rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-medium">Otel Başvuruları</h2>
            </div>
            
            {isLoading ? (
              <div className="p-8 text-center">Yükleniyor...</div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-[#2a2a2a] text-left">
                      <tr>
                        <th className="p-4">Otel Adı</th>
                        <th className="p-4">İsim</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Telefon</th>
                        <th className="p-4">Ülke / Şehir</th>
                        <th className="p-4">Oda Sayısı</th>
                        <th className="p-4">Tarih</th>
                        <th className="p-4">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hotelApplications.map(app => (
                        <tr key={app.id} className="border-t dark:border-gray-700">
                          <td className="p-4">{app.hotelName}</td>
                          <td className="p-4">{app.fullName}</td>
                          <td className="p-4">{app.email}</td>
                          <td className="p-4">{app.phoneNumber}</td>
                          <td className="p-4">{app.country} / {app.state}</td>
                          <td className="p-4">{app.roomCount}</td>
                          <td className="p-4">{formatDate(app.createdAt)}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleDeleteApplication(app.id!)}
                                className="p-1 text-red-500 rounded hover:bg-gray-100 dark:hover:bg-[#333]"
                                title="Sil"
                              >
                                <FiTrash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {hotelApplications.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    Henüz hiç otel başvurusu yok.
                  </div>
                )}
              </>
            )}
            
            <div className="p-4 border-t dark:border-gray-700">
              <span>Toplam: {hotelApplications.length} başvuru</span>
            </div>
          </div>
        )}
        
        {/* Ön Kayıt Tab */}
        {activeTab === "registrations" && (
          <div className="bg-white dark:bg-[#222] rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-medium">Ön Kayıtlar</h2>
            </div>
            
            {isLoading ? (
              <div className="p-8 text-center">Yükleniyor...</div>
            ) : (
              <>
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-[#2a2a2a] text-left">
                    <tr>
                      <th className="p-4">Ad Soyad</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Telefon</th>
                      <th className="p-4">Kayıt No</th>
                      <th className="p-4">Pazarlama İzni</th>
                      <th className="p-4">Tarih</th>
                      <th className="p-4">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map(reg => (
                      <tr key={reg.id} className="border-t dark:border-gray-700">
                        <td className="p-4">{reg.fullName}</td>
                        <td className="p-4">{reg.email}</td>
                        <td className="p-4">{reg.phoneNumber}</td>
                        <td className="p-4">{reg.registrationNumber || '-'}</td>
                        <td className="p-4">
                          {reg.marketingAccepted ? (
                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Evet
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              Hayır
                            </span>
                          )}
                        </td>
                        <td className="p-4">{formatDate(reg.createdAt)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleDeleteRegistration(reg.id!)}
                              className="p-1 text-red-500 rounded hover:bg-gray-100 dark:hover:bg-[#333]"
                              title="Sil"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {registrations.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    Henüz hiç ön kayıt yok.
                  </div>
                )}
              </>
            )}
            
            <div className="p-4 border-t dark:border-gray-700">
              <span>Toplam: {registrations.length} ön kayıt</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-[#222] shadow-sm mt-auto">
        <div className="container mx-auto p-4 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Yönetim Paneli
        </div>
      </footer>
    </div>
  );
}