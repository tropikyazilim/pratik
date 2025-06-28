"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { AxiosError } from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent } from "@/components/ui/card";

interface ApiError {
  message: string;
}

const formSchema = z.object({
  modul_kodu: z.string().min(1, "Modül kodu gerekli"),
  modul_adi: z.string().min(1, "Modül adı gerekli"),
  modul_aciklama: z.string().min(1, "Modül açıklaması gerekli"),
});

export default function CariEkle() {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3002";
  const { accessToken } = useAuth();
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
      return axios.post(
        `${apiUrl}/api/moduller`,
        ModulData,
        accessToken ? { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true } : { withCredentials: true }
      );
    },
    onSuccess: () => {
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
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createModulMutation.mutate({
      ...values
    });
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-start justify-start p-6 md:p-10">
      <div className="w-full max-w-4xl">
        <Card className="overflow-hidden p-0 shadow-xl border-0">
          <CardContent className="p-6 md:p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
            {/* Header - İkon ve Başlık */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-600">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-teal-600 to-cyan-700 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Cari Ekle
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Yeni cari hesap ekleyin
                </p>
              </div>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Modül Kodu */}
                  <FormField
                    control={form.control}
                    name="modul_kodu"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          Modül Kodu
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="text" 
                            placeholder="Modül Kodu" 
                            className="h-12 border-gray-200 dark:border-gray-700 focus:border-teal-500 focus:ring-teal-500/20 transition-all duration-200"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Modül Adı */}
                  <FormField
                    control={form.control}
                    name="modul_adi"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          Modül Adı
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="text" 
                            placeholder="Modül Adı" 
                            className="h-12 border-gray-200 dark:border-gray-700 focus:border-teal-500 focus:ring-teal-500/20 transition-all duration-200"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Modül Açıklama */}
                  <FormField
                    control={form.control}
                    name="modul_aciklama"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          Modül Açıklama
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="text" 
                            placeholder="Modül Açıklama" 
                            className="h-12 border-gray-200 dark:border-gray-700 focus:border-teal-500 focus:ring-teal-500/20 transition-all duration-200"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-100 dark:border-gray-600">
                  <Button 
                    type="button" 
                    onClick={() => form.reset()}
                    variant="outline"
                    className="h-12 px-6 rounded-lg border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                  >
                    İptal
                  </Button>
                  <Button 
                    type="submit"
                    disabled={createModulMutation.isPending}
                    className="h-12 px-6 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {createModulMutation.isPending ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
