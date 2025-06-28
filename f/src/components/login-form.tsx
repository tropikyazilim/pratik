import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/auth-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const navigate = useNavigate();
  const { initialize } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Giriş başarısız");
        return;
      }
      initialize(data.accessToken);
      navigate("/");
    } catch (err) {
      setError("Sunucu hatası");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
    <Card className="overflow-hidden p-0 shadow-xl border-0">
      <CardContent className="grid p-0 md:grid-cols-2">
        <form className="p-6 md:p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center w-full max-w-xs mx-auto">
              {/* Mobilde logolu-yazılı-kilitli bar */}
              <div className="flex flex-row items-center justify-between w-full h-12 bg-gradient-to-br from-teal-600 to-cyan-700 rounded-lg shadow-lg px-4 mb-4 md:hidden">
                <img src="/logosadece.png" alt="Tropik Yazılım" className="w-8 h-8 rounded-full" />
                <span className="text-white font-semibold text-base">Tropik Yazılım</span>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              {/* Masaüstünde sadece kilit ikonu */}
              <div className="hidden md:inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-600 to-cyan-700 rounded-2xl shadow-lg mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">Hoşgeldiniz</h1>
              <div className="relative text-center text-sm w-full mb-6 after:content-[''] after:absolute after:top-1/2 after:left-0 after:w-full after:border-t after:border-gray-200 dark:after:border-gray-700 after:z-0">
                <span className="relative z-10 bg-white dark:bg-slate-900 px-2 text-gray-600 dark:text-gray-300">
                  Tropik Yazılım hesabınıza giriş yapın
                </span>
              </div>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-200">Eposta</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@ornek.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 border-gray-200 dark:border-gray-700 focus:border-teal-500 focus:ring-teal-500/20 transition-all duration-200"
              />
            </div>
            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-200">Şifre</Label>
                <a
                  href="#"
                  className="ml-auto text-sm underline-offset-2 hover:underline text-teal-600 dark:text-teal-400"
                >
                  Şifreni mi unuttun?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 border-gray-200 dark:border-gray-700 focus:border-teal-500 focus:ring-teal-500/20 transition-all duration-200"
              />
            </div>
            {error && <div className="text-red-600 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800">{error}</div>}
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] mt-2"
            >
              Giriş Yap
            </Button>
          </div>
        </form>
        <div className="bg-muted relative hidden md:block">
          <img
            src="/logo.png"
            alt="Image"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </CardContent>
    </Card>
    <div className="text-gray-500 dark:text-gray-400 *:[a]:hover:text-teal-600 dark:*:[a]:hover:text-teal-400 text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
      Devam ederek{" "}
      <Dialog open={isTermsOpen} onOpenChange={setIsTermsOpen}>
        <DialogTrigger asChild>
          <button className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 underline underline-offset-4 cursor-pointer">
            Hizmet Şartları
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Hizmet Şartları</DialogTitle>
            <DialogDescription>
              Tropik Yazılım hizmet şartları ve kullanım koşulları
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <h3 className="font-semibold text-lg">1. Hizmet Kapsamı</h3>
            <p>
              Tropik Yazılım olarak sunduğumuz yazılım çözümleri ve hizmetler, 
              müşterilerimizin iş süreçlerini optimize etmek ve verimliliği artırmak 
              amacıyla tasarlanmıştır.
            </p>
            
            <h3 className="font-semibold text-lg">2. Kullanım Koşulları</h3>
            <p>
              Hizmetlerimizi kullanırken aşağıdaki koşullara uymayı kabul edersiniz:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Hizmetleri yasal amaçlar için kullanmak</li>
              <li>Başkalarının haklarına saygı göstermek</li>
              <li>Sistem güvenliğini tehlikeye atmamak</li>
              <li>Telif hakkı ve fikri mülkiyet haklarına uymak</li>
            </ul>
            
            <h3 className="font-semibold text-lg">3. Gizlilik ve Veri Güvenliği</h3>
            <p>
              Kişisel verilerinizin güvenliği bizim için önemlidir. Verileriniz 
              endüstri standardı güvenlik önlemleri ile korunmaktadır.
            </p>
            
            <h3 className="font-semibold text-lg">4. Sorumluluk Sınırları</h3>
            <p>
              Tropik Yazılım, hizmetlerin kesintisiz kullanımını garanti etmez. 
              Hizmet kesintileri durumunda mümkün olan en kısa sürede çözüm 
              sağlanmaya çalışılacaktır.
            </p>
            <p>
              Kullanıcı adı, şifre ve diğer giriş bilgilerinizin gizliliğinden ve güvenliğinden 
              siz sorumlusunuz. Bu bilgilerin üçüncü kişiler tarafından elde edilmesi, 
              kullanılması veya kötüye kullanılması durumunda Tropik Yazılım sorumlu 
              tutulamaz. Hesap güvenliğinizi sağlamak için güçlü şifreler kullanmanız, 
              şifrenizi düzenli olarak değiştirmeniz ve giriş bilgilerinizi kimseyle 
              paylaşmamanız önerilir.
            </p>
            
            <h3 className="font-semibold text-lg">5. Değişiklikler</h3>
            <p>
              Bu hizmet şartları gerektiğinde güncellenebilir. Önemli değişiklikler 
              kullanıcılarımıza bildirilecektir.
            </p>
          </div>
        </DialogContent>
      </Dialog>
      {" "}ve{" "}
      <Dialog open={isPrivacyOpen} onOpenChange={setIsPrivacyOpen}>
        <DialogTrigger asChild>
          <button className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 underline underline-offset-4 cursor-pointer">
            Kişisel Verilerin Korunması ve Aydınlatma Metni
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Kişisel Verilerin Korunması ve Aydınlatma Metni</DialogTitle>
            <DialogDescription>
              Kişisel Verilerin Korunması Kanunu kapsamında bilgilendirme
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            <h3 className="font-semibold text-lg">1. Genel Bilgilendirme</h3>
            <p>
              Kişisel Verilerin Korunması Kanunu İşbu 6698 Sayılı Kişisel Verilerin Korunması Kanunu ile yürürlükteki yasal mevzuata uygun olarak ve 6698 sayılı Kişisel Verilerin Korunması Kanunu ("Kanun") kapsamında "Veri Sorumlusu" sıfatıyla DEV BROS LTD ŞTİ.'ye ("Şirket") ait www.devbros.com.tr alan adlı internet sitesinin kullanması ile bağlantılı olarak elde edilen ve tarafımızca sağlanan verilerin toplanması, işlenmesi ve kullanım türü, derecesi ve amacı ile ilgili olarak siz kullanıcılarımıza bilgilendirme yapılması amaçlanmaktadır.
            </p>
            
            <p>
              www.devbros.com.tr alan adlı internet sitesi DEV BROS LTD ŞTİ. tarafından işletilmektedir. Şirket kullanıcıların kişisel verilerinin yönetilmesinde sorumlu kuruluştur. İşbu madde kapsamındaki bilgilendirme 6698 sayılı "Kişisel Verilerin Korunması Kanunu" kapsamında yapılmaktadır.
            </p>
            
            <h3 className="font-semibold text-lg">2. Veri Güvenliği ve Koruma</h3>
            <p>
              Kişisel verilerinizin, gizli bilgilerinizin korunmasını ve gizli tutulmasını ciddiye almaktayız. Kanun ve ilgili mevzuat hükümlerine tarafımızca, çalışanlarımızca ve servis sağlayıcılarımızca görevlerini yerlerine getirirlerken gizliliklerine mutlaka dikkat edilmesini ve yalnızca sizlere bildirdiğimiz amaçlarla kullanılmasını sağlamak üzere teknik ve idari önlemleri almaktayız.
            </p>
            
            <h3 className="font-semibold text-lg">3. Kişisel Veri İşleme</h3>
            <p>
              Kişisel verilerin işlenmesi, kişisel verilerin tamamen ve kısmen otomatik olan (çerezler) ya da herhangi bir veri kayıt sisteminin parçası olmak kaydıyla otomatik olmayan yollarla elde edilmesi, kaydedilmesi, depolanması, muhafaza edilmesi, değiştirilmesi, yeniden düzenlenmesi, açıklanması, aktarılması, devralınması, elde edilebilir hale getirilmesi, sınıflandırılması ya da kullanılmasının engellenmesi gibi kişilere ait veriler üzerinde gerçekleştirilen her türlü işlemi ifade etmektedir.
            </p>
            
            <h3 className="font-semibold text-lg">4. Veri Kullanım Amaçları</h3>
            <p>
              İnternet sitesine üyeliği kapsamında bizlere sağladığınız bilgileriniz, buna ek olarak mal ve hizmet alımlarınız sırasında çerezler ve benzeri yöntemler aracılığı edinilen bilgiler; bizim tarafımızdan, mevcut ve ilerideki iştiraklerimiz, bağlı şirketlerimiz, hissedarlarımız, iş ortaklarımız, haleflerimiz, hizmet ve faaliyetlerimiz ile yan hizmetlerimizi yürütmek üzere hizmet aldığımız, işbirliği yaptığımız, yurt içinde ve/veya yurtdışında faaliyet gösteren program ortağı kuruluşlar ve diğer üçüncü kişiler (hukuk ve vergi danışmanlarımız, bankalar, bağımsız denetçiler dahil ve fakat bunlarla sınırlı olmamak üzere, sizlere hizmet sunabilmemiz için işbirliği yaptığımız veya yapabileceğimiz hizmet tedarikçileri) ve/veya bunların belirleyecekleri üçüncü kişiler/kuruluşlar tarafından muhtelif mal ve hizmetlerin sağlanması ve her türlü bilgilendirme, reklam-tanıtım, promosyon, satış, pazarlama ve üyelik uygulamaları amaçlı yapılacak elektronik ve diğer ticari-sosyal iletişimler için, belirtilenler ve halefleri nezdinde süresiz olarak veya öngörecekleri süre ile kayda alınabilecek, basılı/manyetik arşivlerde saklanabilecek, gerekli görülen hallerde güncellenebilecek, paylaşılabilecek, aktarılabilecek, transfer edilebilecek, kullanılabilecek ve Kanun'un 5. ve 6. maddelerinde belirtilen kişisel veri işleme şartları ve amaçları dahilinde işlenebilecektir.
            </p>
            
            <p>
              Buna ek olarak Kanun dahil ilgili mevzuat hükümleri dahilinde zorunlu olması durumunda bazı uygulamalar ve işlemler için ayrıca ilave izniniz de gerekebilecektir. Bu durumlarda sizlerle iletişime geçilecek ve sizlerin açık rızaları rica edilecektir. Bu verilere ek olarak bizlere iletmiş olduğunuz kişisel verileriniz hukukun gerekli kıldığı durumlarda resmi kurum/kuruluşlar, mahkemeler tarafından talep edilmesi halinde ilgili merci ve mahkemelere iletilebilecektir.
            </p>
            
            <h3 className="font-semibold text-lg">5. Hizmet İyileştirme ve Pazarlama</h3>
            <p>
              Kişisel verileriniz internet sitemizde siz kullanıcılarımıza daha iyi hizmet sunabilmesi, hizmetlerimizin iyileştirebilmesi, ayrıca bu konuda izin vermiş olmanız durumunda pazarlama faaliyetlerinde kullanılabilmesi, ürün/hizmet teklifi, her türlü bilgilendirme, reklam-tanıtım, promosyon, satış, pazarlama, mağaza kartı, kredi kartı ve üyelik uygulamaları, modelleme, raporlama, skorlama, internet sitesinin kullanımını kolaylaştırılması, kullanıcılarının ilgi alanlarına ve tercihlerine yönelik tarafımızca veya iştiraklerimiz tarafından yapılacak geliştirme çalışmalarda kullanılabilecektir.
            </p>
            
            <p>
              İnternet sitesi üzerinde yaptığınız hareketlerin çerezler ve benzeri yöntemlerle izlenebileceğini, kaydının tutulabileceğini, istatistiki veya yukarıda bahsedilen amaçlarla kullanılabilecektir. Ancak buna ek olarak önemle belirtmek isteriz ki internet sitemize üyelik, ürün veya hizmetlerimizin satın alınması ve bilgi güncelleme amaçlı girilen bilgiler, kredi kartı ve banka kartlarına ait gizli bilgiler diğer internet kullanıcıları tarafından görüntülenemez.
            </p>
            
            <h3 className="font-semibold text-lg">6. Önemli Uyarılar</h3>
            <p>
              Ebeveyninin veya velisinin izni olmadan küçüklerin kişisel verilerini göndermemeleri gerekmektedir.
            </p>
            
            <p>
              Şirket'e ait internet sitesinin, durumun niteliğine göre diğer internet sitelerine bağlantılar içermesi halinde bu sitelerin operatörlerinin veri koruma hükümlerine uygun olup olmamaları hususunda hiçbir taahhütte bulunmamaktayız. Şirket, link veya benzeri başka yöntemlerle bağlantı verdiği sitelerin içeriklerinden hiçbir zaman sorumlu değildir.
            </p>
            
            <h3 className="font-semibold text-lg">7. Kullanıcı Hakları</h3>
            <p>
              6698 Sayılı Kişisel Verilerin Korunması Kanunu'nun 11. maddesi uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme, kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme, kişisel verilerinizin eksik veya yanlış işlenmiş olması halinde bunların düzeltilmesini isteme ve bu kapsamda yapılan işleme ilişkin olarak kişisel verilerinizin aktarıldığı üçüncü kişilere bildirilmesini isteme, Kanun'un ve ilgili sair mevzuat hükümlerine uygun olarak işlenmiş olmasına rağmen, işlenmesini gerektiren sebeplerin ortadan kalkması halinde kişisel verilerin silinmesini veya yok edilmesini isteme ve bu kapsamda yapılan işlemin kişisel verilerinizin aktarıldığı üçüncü kişilere bildirilmesini isteme, işlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme, kişisel verilerinizin Kanun'a aykırı olarak işlenmesi sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme haklarına sahipsiniz.
            </p>
            
            <p>
              Kişisel veri sahipleri olarak, az önce saymış olduğumuz haklarınıza ilişkin taleplerinizi, söz konusu yöntemlerle Şirket'e iletmeniz durumunda Şirketimiz talebin niteliğine göre en kısa sürede ve en geç otuz gün içinde ücretsiz olarak sonuçlandıracaktır. Ancak, işlemin ayrıca bir maliyeti gerektirmesi halinde Kişisel Verileri Koruma Kurulunca belirlenen tarifedeki ücret alınabilir.
            </p>
            
            <p>
              Kanun'un 13. maddesinin 1. fıkrası gereğince, yukarıda belirtilen haklarınızı kullanmak ile ilgili talebinizi, yazılı olarak veya Kişisel Verileri Koruma Kurulu'nun belirlediği diğer yöntemlerle Şirket'e iletebilirsiniz. Kişisel Verileri Koruma Kurulu tarafından şu aşamada ilgili haklarınızın kullanımına ilişkin herhangi bir yöntem belirlemediği için, başvurunuzu Kanun gereğince, yazılı olarak Şirket'e iletmeniz gerekmektedir.
            </p>
            
            <h3 className="font-semibold text-lg">8. Çerezler</h3>
            <p>
              İnternet sitemizde; IP adresi, kullanılan tarayıcı, bilgisayarınızdaki işletim sistemi, internet bağlantınız, site kullanımları hakkındaki bilgiler gibi belirli verileri otomatik olarak elde etmemize yardımcı olan çerezler (cookie) bulunmaktadır. Söz konusu çerezler bir internet sayfası sunucusu tarafından sabit sürücünüze iletilen küçük metin dosyalarıdır ve sitemizde bulunan çerezler, bilgisayarınız için zararlı sayılabilecek virüsler göndermek için kullanılmamaktadır.
            </p>
            
            <p>
              Çerezler genellikle bilgisayarınızda saklanarak, internet sitemizde yapmış olduğunuz işlemler, gezintileriniz esnasındaki tıklamalarınızın kaydedilmesi yolu ile internet sitesini hangi zaman dilimi içerisinde, ne kadar süre ile kaç kişinin kullandığı, bir kişinin internet sitesini hangi amaçlarla, kaç kez ziyaret ettiği ve site üzerinde ne kadar vakit harcadığı hakkında istatistiksel bilgileri elde etmek ve kullanıcı sayfalarından dinamik olarak reklam ve içerik üretilmesine yardımcı olmak amacı ile sağlanmaktadır. İnternet sitemizi kullanarak kullanılan çerezleri onaylamış olursunuz. Şirket, söz konusu çerezler aracılığı ile verilerinizi işleyebilir ve elde edilen bilgileri analiz etme amacı ile bu kapsamda yurtiçinde ve yurtdışında üçüncü kişilere aktarabilir.
            </p>
            
            <p>
              Çerezler tarafından verileriniz toplanmadan internet sitemizi görüntülemek istiyorsanız seçiminizi cihazınızın/tarayıcınızın ayarlarından her zaman değiştirebilirsiniz. Çerezlerin kullanımını durdurduğunuzda internet sitemizde her türlü işlemi belirli özelliklerinin çalışmayabileceğini lütfen unutmayınız.
            </p>
            
            <h3 className="font-semibold text-lg">9. Açık Rıza</h3>
            <p>
              Sizler, internet sitemize girerek tarafımıza sağlamış olduğunuz kişisel verilerinizin Kanun'a ve işbu 6698 Sayılı Kişisel Verilerin Korunması Kanunu'ne uygun bir şekilde ve belirtilen amaçlarla işlenebileceğini bilmekte, kabul etmekte ve ayrıca işbu 6698 Sayılı Kişisel Verilerin Korunması Kanunu ile Kanun kapsamında yapılması gereken aydınlatma yükümlülüğü yerine getirildiğini, Sözleşme'yi okuduğunuzu, anladığınızı, haklarınızın ve yükümlülüklerinin bilincinde olduğunuzu beyan etmektesiniz.
            </p>
          </div>
        </DialogContent>
      </Dialog>
      'ni kabul etmiş olursunuz.
    </div>
  </div>
  )
}
