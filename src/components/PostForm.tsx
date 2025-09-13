"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Post } from "@/firebase/posts";

interface PostFormProps {
  post?: Post;
  onSubmit: (data: Post) => Promise<void>;
  onCancel: () => void;
}

export default function PostForm({ post, onSubmit, onCancel }: PostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<Post>({
    defaultValues: post || {
      title: "",
      content: "",
      category: "",
      status: "taslak"
    }
  });

  useEffect(() => {
    if (post) {
      reset(post);
    }
  }, [post, reset]);

  const submitHandler = async (data: Post) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error("Form gönderme hatası:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Başlık</label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-800"
          placeholder="Yazı başlığı"
          {...register("title", { required: "Başlık gerekli" })}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Kategori</label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-800"
          placeholder="Kategori"
          {...register("category", { required: "Kategori gerekli" })}
        />
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">İçerik</label>
        <textarea
          className="w-full px-3 py-2 border rounded-md h-40 dark:border-gray-700 dark:bg-gray-800"
          placeholder="Yazı içeriği..."
          {...register("content", { required: "İçerik gerekli" })}
        />
        {errors.content && (
          <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Durum</label>
        <select
          className="w-full px-3 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-800"
          {...register("status")}
        >
          <option value="taslak">Taslak</option>
          <option value="yayında">Yayında</option>
        </select>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border dark:border-gray-700 rounded-md"
          disabled={isSubmitting}
        >
          İptal
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Kaydediliyor..." : post ? "Güncelle" : "Kaydet"}
        </button>
      </div>
    </form>
  );
}