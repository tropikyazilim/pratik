"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { AxiosError } from 'axios';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
interface ApiError {
  message: string;
}

const formSchema = z.object({
  modul_kodu: z.string().min(1, "Modül kodu gerekli"),
  modul_adi: z.string().min(1, "Modül adı gerekli"),
  modul_aciklama: z.string().min(1, "Modül açıklaması gerekli"),
  kayit_yapan_kullanici: z.string().optional(),
});

export default function CariEkle() {
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3002";
  console.log("Kullanılan API URL:", apiUrl);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      modul_kodu: "",
      modul_adi: "",
      modul_aciklama: "",
    },
  });
  const createModulMutation = useMutation({
      mutationFn: (ModulData: z.infer<typeof formSchema>) => {
        return axios.post(`${apiUrl}/api/moduller`, ModulData);
      },
      onSuccess: () => {
        setError(null);
        form.reset();
        // Modüller listesini güncelle
        

        toast.success("Modül başarıyla eklendi", {
          description: "İşlem başarıyla tamamlandı",
          style: {
            backgroundColor: "#dcfce7",
            border: "1px solid #86efac",
            color: "#166534",
          },
        });
      },
      onError: (error: AxiosError<ApiError>) => {
        toast.error("Hata", {
          description:
            error.response?.data?.message || "Modül eklenirken bir hata oluştu",
          style: {
            backgroundColor: "#fee2e2",
            border: "1px solid #fca5a5",
            color: "#991b1b",
          },
        });
        setError(null);
      },
    });
  
    function onSubmit(values: z.infer<typeof formSchema>) {
      // Kullanıcı bilgisini localStorage'dan al
      const kayitYapanKullanici = localStorage.getItem("userEmail") || "";
      setError(null);
      createModulMutation.mutate({
        ...values,
        kayit_yapan_kullanici: kayitYapanKullanici,
      });
    }



    return(
 <>
      <div className="h-full w-full">
        <div className="h-full w-full p-1">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="bg-white p-4 rounded-lg shadow-md max-h-[calc(100vh-120px)] overflow-y-auto shadow-slate-300"
            >
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-m">
                  {error}
                </div>
              )}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-white py-2 pl-4 border-b bg-cyan-700 rounded-t-lg">
                  Modül Ekle
                </h1>
                
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
                {/* Modül Kodu */}
                <FormField
                  control={form.control}
                  name="modul_kodu"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-slate-700 font-medium text-m">
                        Modül Kodu
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Modül Kodu"
                          className="bg-white border-slate-300 focus:border-blue-500 h-8 text-m shadow-sm shadow-blue-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                {/* Modül Adı */}
                <FormField
                  control={form.control}
                  name="modul_adi"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-slate-700 font-medium text-m">
                        Modül Adı
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Modül Adı"
                          className="bg-white border-slate-300 focus:border-blue-500 h-8 text-m shadow-sm shadow-blue-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                {/* Modül Açıklama */}
                <FormField
                  control={form.control}
                  name="modul_aciklama"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-slate-700 font-medium text-m">
                        Modül Açıklama
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Modül Açıklama"
                          className="bg-white border-slate-300 focus:border-blue-500 h-8 text-m shadow-sm shadow-blue-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-4 pt-8 border-t border-gray-100 mt-4">
                <Button
                  type="button"
                  onClick={() => {
                    form.reset();
                  }}
                  className="bg-red-400 text-white border border-gray-300 hover:bg-red-600 h-11 text-sm rounded-lg px-5 font-medium transition-all shadow-sm flex items-center group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1.5 text-white group-hover:text-white transition-colors"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  İptal
                </Button>

                <Button
                  type="submit"
                  className="bg-teal-500 hover:bg-teal-600 text-white h-11 text-sm rounded-lg px-6 font-medium transition-all shadow-sm flex items-center relative"
                >
                  Kaydet
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
    )
};