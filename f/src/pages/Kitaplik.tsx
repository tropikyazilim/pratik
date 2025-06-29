import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Check,
  X,
  RotateCcw,
  Plus,
  Settings,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Search,
  List,
  Copy,
  Download,
  FileSpreadsheet,
  Printer,
  Eye,
  BookOpen
} from "lucide-react";
// Heroicons SVG'leri
const icons = {
  kaydet: <Check className="w-5 h-5" />,
  sil: <X className="w-5 h-5" />,
  iptal: <X className="w-5 h-5" />,
  yenile: <RotateCcw className="w-5 h-5" />,
  ekle: <Plus className="w-5 h-5" />,
  islemler: <Settings className="w-5 h-5" />,
  onceki: <ChevronLeft className="w-5 h-5" />,
  sonraki: <ChevronRight className="w-5 h-5" />,
  geriDon: <ArrowLeft className="w-5 h-5" />,
  kapat: <X className="w-5 h-5" />,
  bul: <Search className="w-5 h-5" />,
  listele: <List className="w-5 h-5" />,
  kopyala: <Copy className="w-5 h-5" />,
  aktar: <Download className="w-5 h-5" />,
  excel: <FileSpreadsheet className="w-5 h-5" />,
  yazdir: <Printer className="w-5 h-5" />,
  onizle: <Eye className="w-5 h-5" />,
  input: <Search className="w-5 h-5" />,
};
// Kitaplık sayfası: örnek bileşenlerinizi burada sergileyebilirsiniz
const Kitaplik: React.FC = () => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-start justify-start p-6 md:p-10">
      <div className="w-full max-w-6xl">
        <Card className="overflow-hidden p-0 shadow-xl border-0">
          <CardContent className="p-6 md:p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
            {/* Header - İkon ve Başlık */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-600 mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-teal-600 to-cyan-700 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
                  Kitaplık
                </h1>
                <p className="text-gray-400 dark:text-gray-400 text-sm mt-0.5 font-normal">
                  Örnek butonlar ve bileşenler
                </p>
              </div>
            </div>
            {/* Buton Kategorileri */}
            <div className="space-y-12">
              {/* KAYDET Butonu Varyasyonları */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b-2 border-gray-200 dark:border-gray-700">
                  💾 KAYDET Butonu Varyasyonları
                </h2>
                <div className="flex flex-wrap gap-3 mb-3">
                  <Button className="h-12 px-6 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">Kaydet</Button>
                  <Button variant="outline" className="h-12 px-6 rounded-lg border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">Kaydet</Button>
                  <Button size="sm" className="h-8 px-4 rounded-md bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">Kaydet</Button>
                </div>
                <div className="flex flex-wrap gap-3 mb-3">
                  <Button variant="secondary" className="h-12 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium transition-all duration-200">Kaydet</Button>
                  <Button variant="ghost" className="h-12 px-6 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200">Kaydet</Button>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                <div className="flex flex-wrap gap-3">
                  <Button className="h-12 px-6 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-700 text-white font-medium flex items-center gap-2"><span className="mr-2">{icons.kaydet}</span>Kaydet</Button>
                  <Button variant="outline" className="h-12 px-6 rounded-lg border-gray-200 dark:border-gray-700 flex items-center gap-2"><span className="mr-2">{icons.kaydet}</span>Kaydet</Button>
                  <Button size="sm" className="h-8 px-4 rounded-md bg-gradient-to-r from-teal-600 to-cyan-700 text-white font-medium flex items-center gap-2"><span className="mr-2">{icons.kaydet}</span>Kaydet</Button>
                  <Button variant="ghost" className="h-12 w-12 p-0 flex items-center justify-center">{icons.kaydet}</Button>
                </div>
                <div className="flex flex-wrap gap-3 mt-3">
                  <Button variant="secondary" className="h-12 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center gap-2"><span className="mr-2">{icons.kaydet}</span>Kaydet</Button>
                </div>
              </div>
              {/* SİL Butonu Varyasyonları */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b-2 border-gray-200 dark:border-gray-700">🗑️ SİL Butonu Varyasyonları</h2>
                <div className="flex flex-wrap gap-3 mb-3">
                  <Button className="h-12 px-6 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">Sil</Button>
                  <Button variant="outline" className="h-12 px-6 rounded-lg border-red-200 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-800/20 transition-all duration-200 text-red-600 dark:text-red-400">Sil</Button>
                  <Button size="sm" className="h-8 px-4 rounded-md bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">Sil</Button>
                </div>
                <div className="flex flex-wrap gap-3 mb-3">
                  <Button variant="secondary" className="h-12 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium transition-all duration-200">Sil</Button>
                  <Button variant="ghost" className="h-12 px-6 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200">Sil</Button>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                <div className="flex flex-wrap gap-3">
                  <Button className="h-12 px-6 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-medium flex items-center gap-2"><span className="mr-2">{icons.sil}</span>Sil</Button>
                  <Button variant="outline" className="h-12 px-6 rounded-lg border-red-200 dark:border-red-700 flex items-center gap-2"><span className="mr-2">{icons.sil}</span>Sil</Button>
                  <Button size="sm" className="h-8 px-4 rounded-md bg-gradient-to-r from-red-600 to-red-700 text-white font-medium flex items-center gap-2"><span className="mr-2">{icons.sil}</span>Sil</Button>
                  <Button variant="ghost" className="h-12 w-12 p-0 flex items-center justify-center">{icons.sil}</Button>
                </div>
                <div className="flex flex-wrap gap-3 mt-3">
                  <Button variant="secondary" className="h-12 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center gap-2"><span className="mr-2">{icons.sil}</span>Sil</Button>
                </div>
              </div>
              {/* İPTAL Butonu Varyasyonları */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b-2 border-gray-200 dark:border-gray-700">❌ İPTAL Butonu Varyasyonları</h2>
                <div className="flex flex-wrap gap-3 mb-3">
                  <Button className="h-12 px-6 rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">İptal</Button>
                  <Button variant="outline" className="h-12 px-6 rounded-lg border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">İptal</Button>
                  <Button size="sm" className="h-8 px-4 rounded-md bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">İptal</Button>
                </div>
                <div className="flex flex-wrap gap-3 mb-3">
                  <Button variant="secondary" className="h-12 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium transition-all duration-200">İptal</Button>
                  <Button variant="ghost" className="h-12 px-6 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200">İptal</Button>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                <div className="flex flex-wrap gap-3">
                  <Button className="h-12 px-6 rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium flex items-center gap-2"><span className="mr-2">{icons.iptal}</span>İptal</Button>
                  <Button variant="outline" className="h-12 px-6 rounded-lg border-gray-200 dark:border-gray-700 flex items-center gap-2"><span className="mr-2">{icons.iptal}</span>İptal</Button>
                  <Button size="sm" className="h-8 px-4 rounded-md bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium flex items-center gap-2"><span className="mr-2">{icons.iptal}</span>İptal</Button>
                  <Button variant="ghost" className="h-12 w-12 p-0 flex items-center justify-center">{icons.iptal}</Button>
                </div>
                <div className="flex flex-wrap gap-3 mt-3">
                  <Button variant="secondary" className="h-12 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center gap-2"><span className="mr-2">{icons.iptal}</span>İptal</Button>
                </div>
              </div>
              {/* YENİLE Butonu Varyasyonları */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b-2 border-gray-200 dark:border-gray-700">🔄 YENİLE Butonu Varyasyonları</h2>
                <div className="flex flex-wrap gap-3 mb-3">
                  <Button className="h-12 px-6 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">Yenile</Button>
                  <Button variant="outline" className="h-12 px-6 rounded-lg border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-800/20 transition-all duration-200 text-blue-600 dark:text-blue-400">Yenile</Button>
                  <Button size="sm" className="h-8 px-4 rounded-md bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">Yenile</Button>
                </div>
                <div className="flex flex-wrap gap-3 mb-3">
                  <Button variant="secondary" className="h-12 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium transition-all duration-200">Yenile</Button>
                  <Button variant="ghost" className="h-12 px-6 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200">Yenile</Button>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                <div className="flex flex-wrap gap-3">
                  <Button className="h-12 px-6 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium flex items-center gap-2"><span className="mr-2">{icons.yenile}</span>Yenile</Button>
                  <Button variant="outline" className="h-12 px-6 rounded-lg border-blue-200 dark:border-blue-700 flex items-center gap-2"><span className="mr-2">{icons.yenile}</span>Yenile</Button>
                  <Button size="sm" className="h-8 px-4 rounded-md bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium flex items-center gap-2"><span className="mr-2">{icons.yenile}</span>Yenile</Button>
                  <Button variant="ghost" className="h-12 w-12 p-0 flex items-center justify-center">{icons.yenile}</Button>
                </div>
                <div className="flex flex-wrap gap-3 mt-3">
                  <Button variant="secondary" className="h-12 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center gap-2"><span className="mr-2">{icons.yenile}</span>Yenile</Button>
                </div>
              </div>
              {/* EKLE Butonu Varyasyonları */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b-2 border-gray-200 dark:border-gray-700">➕ EKLE Butonu Varyasyonları</h2>
                <div className="flex flex-wrap gap-3 mb-3">
                  <Button className="h-12 px-6 rounded-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">Ekle</Button>
                  <Button variant="outline" className="h-12 px-6 rounded-lg border-green-200 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-800/20 transition-all duration-200 text-green-600 dark:text-green-400">Ekle</Button>
                  <Button size="sm" className="h-8 px-4 rounded-md bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">Ekle</Button>
                </div>
                <div className="flex flex-wrap gap-3 mb-3">
                  <Button variant="secondary" className="h-12 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium transition-all duration-200">Ekle</Button>
                  <Button variant="ghost" className="h-12 px-6 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200">Ekle</Button>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                <div className="flex flex-wrap gap-3">
                  <Button className="h-12 px-6 rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white font-medium flex items-center gap-2"><span className="mr-2">{icons.ekle}</span>Ekle</Button>
                  <Button variant="outline" className="h-12 px-6 rounded-lg border-green-200 dark:border-green-700 flex items-center gap-2"><span className="mr-2">{icons.ekle}</span>Ekle</Button>
                  <Button size="sm" className="h-8 px-4 rounded-md bg-gradient-to-r from-green-600 to-green-700 text-white font-medium flex items-center gap-2"><span className="mr-2">{icons.ekle}</span>Ekle</Button>
                  <Button variant="ghost" className="h-12 w-12 p-0 flex items-center justify-center">{icons.ekle}</Button>
                </div>
                <div className="flex flex-wrap gap-3 mt-3">
                  <Button variant="secondary" className="h-12 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center gap-2"><span className="mr-2">{icons.ekle}</span>Ekle</Button>
                </div>
              </div>
              {/* İŞLEMLER Butonu Varyasyonları */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b-2 border-gray-200 dark:border-gray-700">⚙️ İŞLEMLER Butonu Varyasyonları</h2>
                <div className="flex flex-wrap gap-3 mb-3">
                  <Button className="h-12 px-6 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">İşlemler</Button>
                  <Button variant="outline" className="h-12 px-6 rounded-lg border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-800/20 transition-all duration-200 text-purple-600 dark:text-purple-400">İşlemler</Button>
                  <Button size="sm" className="h-8 px-4 rounded-md bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">İşlemler</Button>
                </div>
                <div className="flex flex-wrap gap-3 mb-3">
                  <Button variant="secondary" className="h-12 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium transition-all duration-200">İşlemler</Button>
                  <Button variant="ghost" className="h-12 px-6 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200">İşlemler</Button>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                <div className="flex flex-wrap gap-3">
                  <Button className="h-12 px-6 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium flex items-center gap-2"><span className="mr-2">{icons.islemler}</span>İşlemler</Button>
                  <Button variant="outline" className="h-12 px-6 rounded-lg border-purple-200 dark:border-purple-700 flex items-center gap-2"><span className="mr-2">{icons.islemler}</span>İşlemler</Button>
                  <Button size="sm" className="h-8 px-4 rounded-md bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium flex items-center gap-2"><span className="mr-2">{icons.islemler}</span>İşlemler</Button>
                  <Button variant="ghost" className="h-12 w-12 p-0 flex items-center justify-center">{icons.islemler}</Button>
                </div>
                <div className="flex flex-wrap gap-3 mt-3">
                  <Button variant="secondary" className="h-12 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center gap-2"><span className="mr-2">{icons.islemler}</span>İşlemler</Button>
                </div>
              </div>
              {/* ÖNCEKİ/SONRAKİ Butonu Varyasyonları */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b-2 border-gray-200 dark:border-gray-700">⬅️➡️ ÖNCEKİ/SONRAKİ Butonu Varyasyonları</h2>
                <div className="flex flex-wrap gap-3 mb-3">
                  <Button className="h-12 px-6 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">Önceki</Button>
                  <Button className="h-12 px-6 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">Sonraki</Button>
                  <Button variant="outline" className="h-12 px-6 rounded-lg border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-800/20 transition-all duration-200 text-indigo-600 dark:text-indigo-400">Önceki</Button>
                  <Button variant="outline" className="h-12 px-6 rounded-lg border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-800/20 transition-all duration-200 text-indigo-600 dark:text-indigo-400">Sonraki</Button>
                </div>
                <div className="flex flex-wrap gap-3 mb-3">
                  <Button variant="secondary" className="h-12 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium transition-all duration-200">Önceki</Button>
                  <Button variant="secondary" className="h-12 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium transition-all duration-200">Sonraki</Button>
                  <Button variant="ghost" className="h-12 px-6 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200">Önceki</Button>
                  <Button variant="ghost" className="h-12 px-6 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200">Sonraki</Button>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                <div className="flex flex-wrap gap-3">
                  <Button className="h-12 px-6 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium flex items-center gap-2"><span className="mr-2">{icons.onceki}</span>Önceki</Button>
                  <Button className="h-12 px-6 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium flex items-center gap-2"><span className="mr-2">{icons.sonraki}</span>Sonraki</Button>
                  <Button variant="outline" className="h-12 px-6 rounded-lg border-indigo-200 dark:border-indigo-700 flex items-center gap-2"><span className="mr-2">{icons.onceki}</span>Önceki</Button>
                  <Button variant="outline" className="h-12 px-6 rounded-lg border-indigo-200 dark:border-indigo-700 flex items-center gap-2"><span className="mr-2">{icons.sonraki}</span>Sonraki</Button>
                  <Button variant="ghost" className="h-12 w-12 p-0 flex items-center justify-center">{icons.onceki}</Button>
                  <Button variant="ghost" className="h-12 w-12 p-0 flex items-center justify-center">{icons.sonraki}</Button>
                </div>
                <div className="flex flex-wrap gap-3 mt-3">
                  <Button variant="secondary" className="h-12 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center gap-2"><span className="mr-2">{icons.onceki}</span>Önceki</Button>
                  <Button variant="secondary" className="h-12 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center gap-2"><span className="mr-2">{icons.sonraki}</span>Sonraki</Button>
                </div>
              </div>
              {/* GERİ DÖN Butonu Varyasyonları */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b-2 border-gray-200 dark:border-gray-700">🔙 GERİ DÖN Butonu Varyasyonları</h2>
                <div className="flex flex-wrap gap-3 mb-3">
                  <Button className="h-12 px-6 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">Geri Dön</Button>
                  <Button variant="outline" className="h-12 px-6 rounded-lg border-orange-200 dark:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-800/20 transition-all duration-200 text-orange-600 dark:text-orange-400">Geri Dön</Button>
                  <Button size="sm" className="h-8 px-4 rounded-md bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">Geri Dön</Button>
                </div>
                <div className="flex flex-wrap gap-3 mb-3">
                  <Button variant="secondary" className="h-12 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium transition-all duration-200">Geri Dön</Button>
                  <Button variant="ghost" className="h-12 px-6 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200">Geri Dön</Button>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                <div className="flex flex-wrap gap-3">
                  <Button className="h-12 px-6 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white font-medium flex items-center gap-2"><span className="mr-2">{icons.geriDon}</span>Geri Dön</Button>
                  <Button variant="outline" className="h-12 px-6 rounded-lg border-orange-200 dark:border-orange-700 flex items-center gap-2"><span className="mr-2">{icons.geriDon}</span>Geri Dön</Button>
                  <Button size="sm" className="h-8 px-4 rounded-md bg-gradient-to-r from-orange-600 to-orange-700 text-white font-medium flex items-center gap-2"><span className="mr-2">{icons.geriDon}</span>Geri Dön</Button>
                  <Button variant="ghost" className="h-12 w-12 p-0 flex items-center justify-center">{icons.geriDon}</Button>
                </div>
                <div className="flex flex-wrap gap-3 mt-3">
                  <Button variant="secondary" className="h-12 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center gap-2"><span className="mr-2">{icons.geriDon}</span>Geri Dön</Button>
                </div>
              </div>
              {/* KAPAT Butonu Varyasyonları */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b-2 border-gray-200 dark:border-gray-700">❌ KAPAT Butonu Varyasyonları</h2>
                <div className="flex flex-wrap gap-3 mb-3">
                  <Button className="h-12 px-6 rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">Kapat</Button>
                  <Button variant="outline" className="h-12 px-6 rounded-lg border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">Kapat</Button>
                  <Button size="sm" className="h-8 px-4 rounded-md bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">Kapat</Button>
                </div>
                <div className="flex flex-wrap gap-3 mb-3">
                  <Button variant="secondary" className="h-12 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium transition-all duration-200">Kapat</Button>
                  <Button variant="ghost" className="h-12 px-6 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200">Kapat</Button>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                <div className="flex flex-wrap gap-3">
                  <Button className="h-12 px-6 rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium flex items-center gap-2"><span className="mr-2">{icons.kapat}</span>Kapat</Button>
                  <Button variant="outline" className="h-12 px-6 rounded-lg border-gray-200 dark:border-gray-700 flex items-center gap-2"><span className="mr-2">{icons.kapat}</span>Kapat</Button>
                  <Button size="sm" className="h-8 px-4 rounded-md bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium flex items-center gap-2"><span className="mr-2">{icons.kapat}</span>Kapat</Button>
                  <Button variant="ghost" className="h-12 w-12 p-0 flex items-center justify-center">{icons.kapat}</Button>
                </div>
                <div className="flex flex-wrap gap-3 mt-3">
                  <Button variant="secondary" className="h-12 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center gap-2"><span className="mr-2">{icons.kapat}</span>Kapat</Button>
                </div>
              </div>
              {/* BUL Butonu Varyasyonları */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b-2 border-gray-200 dark:border-gray-700">🔍 BUL Butonu Varyasyonları</h2>
                <div className="flex flex-wrap gap-3 mb-3">
                  <Button className="h-12 px-6 rounded-lg bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">Bul</Button>
                  <Button variant="outline" className="h-12 px-6 rounded-lg border-yellow-200 dark:border-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-800/20 transition-all duration-200 text-yellow-600 dark:text-yellow-400">Bul</Button>
                  <Button size="sm" className="h-8 px-4 rounded-md bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">Bul</Button>
                </div>
                <div className="flex flex-wrap gap-3 mb-3">
                  <Button variant="secondary" className="h-12 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium transition-all duration-200">Bul</Button>
                  <Button variant="ghost" className="h-12 px-6 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200">Bul</Button>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                <div className="flex flex-wrap gap-3">
                  <Button className="h-12 px-6 rounded-lg bg-gradient-to-r from-yellow-600 to-yellow-700 text-white font-medium flex items-center gap-2"><span className="mr-2">{icons.bul}</span>Bul</Button>
                  <Button variant="outline" className="h-12 px-6 rounded-lg border-yellow-200 dark:border-yellow-700 flex items-center gap-2"><span className="mr-2">{icons.bul}</span>Bul</Button>
                  <Button size="sm" className="h-8 px-4 rounded-md bg-gradient-to-r from-yellow-600 to-yellow-700 text-white font-medium flex items-center gap-2"><span className="mr-2">{icons.bul}</span>Bul</Button>
                  <Button variant="ghost" className="h-12 w-12 p-0 flex items-center justify-center">{icons.bul}</Button>
                </div>
                <div className="flex flex-wrap gap-3 mt-3">
                  <Button variant="secondary" className="h-12 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center gap-2"><span className="mr-2">{icons.bul}</span>Bul</Button>
                </div>
              </div>
              {/* LİSTELE Butonu Varyasyonları */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b-2 border-gray-200 dark:border-gray-700">📋 LİSTELE Butonu Varyasyonları</h2>
                <div className="flex flex-wrap gap-3 mb-3">
                  <Button className="h-12 px-6 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">Listele</Button>
                  <Button variant="outline" className="h-12 px-6 rounded-lg border-cyan-200 dark:border-cyan-700 hover:bg-cyan-50 dark:hover:bg-cyan-800/20 transition-all duration-200 text-cyan-600 dark:text-cyan-400">Listele</Button>
                  <Button size="sm" className="h-8 px-4 rounded-md bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">Listele</Button>
                </div>
                <div className="flex flex-wrap gap-3 mb-3">
                  <Button variant="secondary" className="h-12 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium transition-all duration-200">Listele</Button>
                  <Button variant="ghost" className="h-12 px-6 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200">Listele</Button>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                <div className="flex flex-wrap gap-3">
                  <Button className="h-12 px-6 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-700 text-white font-medium flex items-center gap-2"><span className="mr-2">{icons.listele}</span>Listele</Button>
                  <Button variant="outline" className="h-12 px-6 rounded-lg border-cyan-200 dark:border-cyan-700 flex items-center gap-2"><span className="mr-2">{icons.listele}</span>Listele</Button>
                  <Button size="sm" className="h-8 px-4 rounded-md bg-gradient-to-r from-cyan-600 to-cyan-700 text-white font-medium flex items-center gap-2"><span className="mr-2">{icons.listele}</span>Listele</Button>
                  <Button variant="ghost" className="h-12 w-12 p-0 flex items-center justify-center">{icons.listele}</Button>
                </div>
                <div className="flex flex-wrap gap-3 mt-3">
                  <Button variant="secondary" className="h-12 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center gap-2"><span className="mr-2">{icons.listele}</span>Listele</Button>
                </div>
              </div>
              {/* KOPYALA Butonu Varyasyonları */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b-2 border-gray-200 dark:border-gray-700">📋 KOPYALA Butonu Varyasyonları</h2>
                <div className="flex flex-wrap gap-3 mb-3">
                  <Button className="h-12 px-6 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">Kopyala</Button>
                  <Button variant="outline" className="h-12 px-6 rounded-lg border-emerald-200 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-800/20 transition-all duration-200 text-emerald-600 dark:text-emerald-400">Kopyala</Button>
                  <Button size="sm" className="h-8 px-4 rounded-md bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">Kopyala</Button>
                </div>
                <div className="flex flex-wrap gap-3 mb-3">
                  <Button variant="secondary" className="h-12 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium transition-all duration-200">Kopyala</Button>
                  <Button variant="ghost" className="h-12 px-6 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200">Kopyala</Button>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                <div className="flex flex-wrap gap-3">
                  <Button className="h-12 px-6 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-medium flex items-center gap-2"><span className="mr-2">{icons.kopyala}</span>Kopyala</Button>
                  <Button variant="outline" className="h-12 px-6 rounded-lg border-emerald-200 dark:border-emerald-700 flex items-center gap-2"><span className="mr-2">{icons.kopyala}</span>Kopyala</Button>
                  <Button size="sm" className="h-8 px-4 rounded-md bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-medium flex items-center gap-2"><span className="mr-2">{icons.kopyala}</span>Kopyala</Button>
                  <Button variant="ghost" className="h-12 w-12 p-0 flex items-center justify-center">{icons.kopyala}</Button>
                </div>
                <div className="flex flex-wrap gap-3 mt-3">
                  <Button variant="secondary" className="h-12 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center gap-2"><span className="mr-2">{icons.kopyala}</span>Kopyala</Button>
                </div>
              </div>
              {/* AKTAR Butonu Varyasyonları */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b-2 border-gray-200 dark:border-gray-700">📤 AKTAR Butonu Varyasyonları</h2>
                <div className="flex flex-wrap gap-3 mb-3">
                  <Button className="h-12 px-6 rounded-lg bg-gradient-to-r from-lime-600 to-lime-700 hover:from-lime-700 hover:to-lime-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">Aktar</Button>
                  <Button variant="outline" className="h-12 px-6 rounded-lg border-lime-200 dark:border-lime-700 hover:bg-lime-50 dark:hover:bg-lime-800/20 transition-all duration-200 text-lime-600 dark:text-lime-400">Aktar</Button>
                  <Button size="sm" className="h-8 px-4 rounded-md bg-gradient-to-r from-lime-600 to-lime-700 hover:from-lime-700 hover:to-lime-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">Aktar</Button>
                </div>
                <div className="flex flex-wrap gap-3 mb-3">
                  <Button variant="secondary" className="h-12 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium transition-all duration-200">Aktar</Button>
                  <Button variant="ghost" className="h-12 px-6 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200">Aktar</Button>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                <div className="flex flex-wrap gap-3">
                  <Button className="h-12 px-6 rounded-lg bg-gradient-to-r from-lime-600 to-lime-700 text-white font-medium flex items-center gap-2"><span className="mr-2">{icons.aktar}</span>Aktar</Button>
                  <Button variant="outline" className="h-12 px-6 rounded-lg border-lime-200 dark:border-lime-700 flex items-center gap-2"><span className="mr-2">{icons.aktar}</span>Aktar</Button>
                  <Button size="sm" className="h-8 px-4 rounded-md bg-gradient-to-r from-lime-600 to-lime-700 text-white font-medium flex items-center gap-2"><span className="mr-2">{icons.aktar}</span>Aktar</Button>
                  <Button variant="ghost" className="h-12 w-12 p-0 flex items-center justify-center">{icons.aktar}</Button>
                </div>
                <div className="flex flex-wrap gap-3 mt-3">
                  <Button variant="secondary" className="h-12 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center gap-2"><span className="mr-2">{icons.aktar}</span>Aktar</Button>
                </div>
              </div>
              {/* EXCEL'E AT Butonu Varyasyonları */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b-2 border-gray-200 dark:border-gray-700">📊 EXCEL'E AT Butonu Varyasyonları</h2>
                <div className="flex flex-wrap gap-3 mb-3">
                  <Button className="h-12 px-6 rounded-lg bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">Excel'e At</Button>
                  <Button variant="outline" className="h-12 px-6 rounded-lg border-pink-200 dark:border-pink-700 hover:bg-pink-50 dark:hover:bg-pink-800/20 transition-all duration-200 text-pink-600 dark:text-pink-400">Excel'e At</Button>
                  <Button size="sm" className="h-8 px-4 rounded-md bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">Excel'e At</Button>
                </div>
                <div className="flex flex-wrap gap-3 mb-3">
                  <Button variant="secondary" className="h-12 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium transition-all duration-200">Excel'e At</Button>
                  <Button variant="ghost" className="h-12 px-6 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200">Excel'e At</Button>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                <div className="flex flex-wrap gap-3">
                  <Button className="h-12 px-6 rounded-lg bg-gradient-to-r from-pink-600 to-pink-700 text-white font-medium flex items-center gap-2"><span className="mr-2">{icons.excel}</span>Excel'e At</Button>
                  <Button variant="outline" className="h-12 px-6 rounded-lg border-pink-200 dark:border-pink-700 flex items-center gap-2"><span className="mr-2">{icons.excel}</span>Excel'e At</Button>
                  <Button size="sm" className="h-8 px-4 rounded-md bg-gradient-to-r from-pink-600 to-pink-700 text-white font-medium flex items-center gap-2"><span className="mr-2">{icons.excel}</span>Excel'e At</Button>
                  <Button variant="ghost" className="h-12 w-12 p-0 flex items-center justify-center">{icons.excel}</Button>
                </div>
                <div className="flex flex-wrap gap-3 mt-3">
                  <Button variant="secondary" className="h-12 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center gap-2"><span className="mr-2">{icons.excel}</span>Excel'e At</Button>
                </div>
              </div>
              {/* YAZDIR Butonu Varyasyonları */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b-2 border-gray-200 dark:border-gray-700">🖨️ YAZDIR Butonu Varyasyonları</h2>
                <div className="flex flex-wrap gap-3 mb-3">
                  <Button className="h-12 px-6 rounded-lg bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">Yazdır</Button>
                  <Button variant="outline" className="h-12 px-6 rounded-lg border-violet-200 dark:border-violet-700 hover:bg-violet-50 dark:hover:bg-violet-800/20 transition-all duration-200 text-violet-600 dark:text-violet-400">Yazdır</Button>
                  <Button size="sm" className="h-8 px-4 rounded-md bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">Yazdır</Button>
                </div>
                <div className="flex flex-wrap gap-3 mb-3">
                  <Button variant="secondary" className="h-12 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium transition-all duration-200">Yazdır</Button>
                  <Button variant="ghost" className="h-12 px-6 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200">Yazdır</Button>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                <div className="flex flex-wrap gap-3">
                  <Button className="h-12 px-6 rounded-lg bg-gradient-to-r from-violet-600 to-violet-700 text-white font-medium flex items-center gap-2"><span className="mr-2">{icons.yazdir}</span>Yazdır</Button>
                  <Button variant="outline" className="h-12 px-6 rounded-lg border-violet-200 dark:border-violet-700 flex items-center gap-2"><span className="mr-2">{icons.yazdir}</span>Yazdır</Button>
                  <Button size="sm" className="h-8 px-4 rounded-md bg-gradient-to-r from-violet-600 to-violet-700 text-white font-medium flex items-center gap-2"><span className="mr-2">{icons.yazdir}</span>Yazdır</Button>
                  <Button variant="ghost" className="h-12 w-12 p-0 flex items-center justify-center">{icons.yazdir}</Button>
                </div>
                <div className="flex flex-wrap gap-3 mt-3">
                  <Button variant="secondary" className="h-12 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center gap-2"><span className="mr-2">{icons.yazdir}</span>Yazdır</Button>
                </div>
              </div>
              {/* ÖNİZLE Butonu Varyasyonları */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b-2 border-gray-200 dark:border-gray-700">👁️ ÖNİZLE Butonu Varyasyonları</h2>
                <div className="flex flex-wrap gap-3 mb-3">
                  <Button className="h-12 px-6 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">Önizle</Button>
                  <Button variant="outline" className="h-12 px-6 rounded-lg border-amber-200 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-800/20 transition-all duration-200 text-amber-600 dark:text-amber-400">Önizle</Button>
                  <Button size="sm" className="h-8 px-4 rounded-md bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">Önizle</Button>
                </div>
                <div className="flex flex-wrap gap-3 mb-3">
                  <Button variant="secondary" className="h-12 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium transition-all duration-200">Önizle</Button>
                  <Button variant="ghost" className="h-12 px-6 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200">Önizle</Button>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                <div className="flex flex-wrap gap-3">
                  <Button className="h-12 px-6 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium flex items-center gap-2"><span className="mr-2">{icons.onizle}</span>Önizle</Button>
                  <Button variant="outline" className="h-12 px-6 rounded-lg border-amber-200 dark:border-amber-700 flex items-center gap-2"><span className="mr-2">{icons.onizle}</span>Önizle</Button>
                  <Button size="sm" className="h-8 px-4 rounded-md bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium flex items-center gap-2"><span className="mr-2">{icons.onizle}</span>Önizle</Button>
                  <Button variant="ghost" className="h-12 w-12 p-0 flex items-center justify-center">{icons.onizle}</Button>
                </div>
                <div className="flex flex-wrap gap-3 mt-3">
                  <Button variant="secondary" className="h-12 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center gap-2"><span className="mr-2">{icons.onizle}</span>Önizle</Button>
                </div>
              </div>
              {/* INPUT İÇİNDEKİ BUTON Varyasyonları */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b-2 border-gray-200 dark:border-gray-700">🔘 INPUT İÇİNDEKİ BUTON Varyasyonları</h2>
                <div className="flex flex-wrap gap-3 mb-3">
                  <Button className="h-12 px-6 rounded-lg bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">Input İçindeki Buton</Button>
                  <Button variant="outline" className="h-12 px-6 rounded-lg border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200">Input İçindeki Buton</Button>
                  <Button size="sm" className="h-8 px-4 rounded-md bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">Input İçindeki Buton</Button>
                </div>
                <div className="flex flex-wrap gap-3 mb-3">
                  <Button variant="secondary" className="h-12 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium transition-all duration-200">Input İçindeki Buton</Button>
                  <Button variant="ghost" className="h-12 px-6 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200">Input İçindeki Buton</Button>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                <div className="flex flex-wrap gap-3">
                  <Button className="h-12 px-6 rounded-lg bg-gradient-to-r from-slate-600 to-slate-700 text-white font-medium flex items-center gap-2"><span className="mr-2">{icons.input}</span>Input İçindeki Buton</Button>
                  <Button variant="outline" className="h-12 px-6 rounded-lg border-slate-200 dark:border-slate-700 flex items-center gap-2"><span className="mr-2">{icons.input}</span>Input İçindeki Buton</Button>
                  <Button size="sm" className="h-8 px-4 rounded-md bg-gradient-to-r from-slate-600 to-slate-700 text-white font-medium flex items-center gap-2"><span className="mr-2">{icons.input}</span>Input İçindeki Buton</Button>
                  <Button variant="ghost" className="h-12 w-12 p-0 flex items-center justify-center">{icons.input}</Button>
                </div>
                <div className="flex flex-wrap gap-3 mt-3">
                  <Button variant="secondary" className="h-12 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center gap-2"><span className="mr-2">{icons.input}</span>Input İçindeki Buton</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default Kitaplik;
