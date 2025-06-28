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
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  username: z.string().min(1, "Kullanıcı adı gerekli"),
  password: z.string().min(3, "Şifre en az 6 karakter olmalı"),
});

export default function KullaniciEkle() {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3002";
  const { accessToken } = useAuth();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  const createUserMutation = useMutation({
    mutationFn: (userData: z.infer<typeof formSchema>) => {
      return axios.post(
        `${apiUrl}/api/register`,
        userData,
        accessToken ? { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true } : { withCredentials: true }
      );
    },
    onSuccess: () => {
      form.reset();
      toast.success("Kullanıcı başarıyla eklendi", {
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
          error.response?.data?.message || "Kullanıcı eklenirken bir hata oluştu",
        style: {
          backgroundColor: "#fee2e2",
          border: "1px solid #fca5a5",
          color: "#991b1b",
        },
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createUserMutation.mutate(values);
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-start justify-start p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card className="overflow-hidden p-0 shadow-xl border-0">
          <CardContent className="p-6 md:p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
            {/* Header - İkon ve Başlık */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-600 mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-teal-600 to-cyan-700 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
                  Kullanıcı Ekle
                </h1>
                <p className="text-gray-400 dark:text-gray-400 text-sm mt-0.5 font-normal">
                  Yeni kullanıcı hesabı oluşturun
                </p>
              </div>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
                autoComplete="off"
              >
                <div className="space-y-5">
                  {/* E-posta */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          E-posta
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="ornek@eposta.com" 
                            className="h-12 border-gray-200 dark:border-gray-700 focus:border-teal-500 focus:ring-teal-500/20 transition-all duration-200"
                            autoComplete="off"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Kullanıcı Adı */}
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          Kullanıcı Adı
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="text" 
                            placeholder="Kullanıcı adı" 
                            className="h-12 border-gray-200 dark:border-gray-700 focus:border-teal-500 focus:ring-teal-500/20 transition-all duration-200"
                            autoComplete="off"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Şifre */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          Şifre
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Şifre" 
                            className="h-12 border-gray-200 dark:border-gray-700 focus:border-teal-500 focus:ring-teal-500/20 transition-all duration-200"
                            autoComplete="new-password"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-5 border-t border-gray-100 dark:border-gray-600">
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
                    disabled={createUserMutation.isPending}
                    className="h-12 px-6 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {createUserMutation.isPending ? 'Kaydediliyor...' : 'Kaydet'}
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