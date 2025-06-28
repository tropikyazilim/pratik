export default function Dashboard() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-start justify-start p-6 md:p-10">
      <div className="w-full max-w-2xl">
        <div className="overflow-hidden p-0 shadow-xl border-0 mb-8">
          <div className="p-6 md:p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
            {/* Başlık ve ikon */}
            <div className="flex items-center gap-4 mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-600 to-cyan-700 rounded-2xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 text-base">Tropik Yazılım yönetim paneli</p>
              </div>
            </div>
          </div>
        </div>

        {/* İstatistik kutuları */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="overflow-hidden p-0 shadow-xl border-0">
            <div className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
              <div className="flex flex-col items-start">
                <span className="text-xs font-semibold text-teal-700 dark:text-teal-400 mb-2">Toplam Kullanıcı</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">128</span>
              </div>
            </div>
          </div>
          <div className="overflow-hidden p-0 shadow-xl border-0">
            <div className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
              <div className="flex flex-col items-start">
                <span className="text-xs font-semibold text-cyan-700 dark:text-cyan-400 mb-2">Aktif Modül</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hoşgeldin mesajı ve buton */}
        <div className="overflow-hidden p-0 shadow-xl border-0">
          <div className="p-6 md:p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-center">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Hoş Geldiniz!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">BURA DEŞ BORD KANKİ!</p>
            <button className="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
              Modülleri Gör
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}