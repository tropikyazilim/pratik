import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/auth-context";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-600 to-cyan-700 rounded-2xl mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">Hoşgeldiniz</h1>
              <div className="relative text-center text-sm after:content-[''] after:absolute after:top-1/2 after:left-0 after:w-full after:border-t after:border-gray-200 dark:after:border-gray-700 after:z-0">
                <span className="relative z-10 bg-white dark:bg-slate-900 px-2 text-gray-600 dark:text-gray-300 mb-3">
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
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              Giriş Yap
            </Button>
            {error && <div className="text-red-600 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800">{error}</div>}
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
      Devam ederek <a href="#">Hizmet Şartları</a> ve{" "}
      <a href="#">Gizlilik Politikası</a>'nı kabul etmiş olursunuz.
    </div>
  </div>
  )
}
