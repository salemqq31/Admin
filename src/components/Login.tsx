"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Image from "next/image";

interface LoginProps {
  onLogin: (username: string, password: string) => boolean;
}

interface LoginFormData {
  username: string;
  password: string;
}

export default function Login({ onLogin }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError("");
    
    try {
      // Küçük bir delay ekleyerek gerçekçi giriş deneyimi
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const success = onLogin(data.username, data.password);
      
      if (!success) {
        setError("Kullanıcı adı veya şifre hatalı!");
      }
    } catch {
      setError("Giriş yapılırken bir hata oluştu!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#111] flex items-center justify-center">
      <div className="bg-white dark:bg-[#222] rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image 
              src="/vercel.svg" 
              alt="Logo" 
              width={50} 
              height={50}
              className="dark:invert" 
            />
          </div>
          <h1 className="text-2xl font-bold mb-2">Yönetim Paneli</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Devam etmek için giriş yapın
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Kullanıcı Adı
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Kullanıcı adınızı girin"
              {...register("username", { 
                required: "Kullanıcı adı gerekli",
                minLength: {
                  value: 3,
                  message: "Kullanıcı adı en az 3 karakter olmalı"
                }
              })}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Şifre
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-3 py-2 pr-10 border rounded-md dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Şifrenizi girin"
                {...register("password", { 
                  required: "Şifre gerekli",
                  minLength: {
                    value: 6,
                    message: "Şifre en az 6 karakter olmalı"
                  }
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <FiEye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Giriş yapılıyor...
              </>
            ) : (
              "Giriş Yap"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Yönetim Paneli
          </p>
        </div>
      </div>
    </div>
  );
}
