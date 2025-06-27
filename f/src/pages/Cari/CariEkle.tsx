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
    <>
      <div className="w-full  p-1 border border-border">
        <div className="bg-cyan-50 dark:bg-cyan-900">
        <h1 className="w-full  mb-0 text-2xl font-bold py-2 px-4 border-b ">
          Modül Ekle
        </h1>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-4 rounded-b-lg max-h-[calc(100vh-120px)] overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3"
          >
            {/* Modül Kodu */}
            <FormField
              control={form.control}
              name="modul_kodu"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Modül Kodu</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Modül Kodu" {...field} />
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
                <FormItem className="space-y-1">
                  <FormLabel>Modül Adı</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Modül Adı" {...field} />
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
                <FormItem className="space-y-1">
                  <FormLabel>Modül Açıklama</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Modül Açıklama" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-full flex justify-end gap-4 pt-8 border-t mt-4">
              <Button type="button" onClick={() => form.reset()}>İptal</Button>
              <Button type="submit">Kaydet</Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
