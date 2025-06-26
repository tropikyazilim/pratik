import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("userEmail", email);
      navigate("/");
    } catch (err) {
      setError("Sunucu hatası");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
    <Card className="overflow-hidden p-0">
      <CardContent className="grid p-0 md:grid-cols-2">
        <form className="p-6 md:p-8" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-4xl font-bold mb-4">Hoşgeldiniz</h1>
              <div className="relative text-center text-sm after:content-[''] after:absolute after:top-1/2 after:left-0 after:w-full after:border-t after:border-border after:z-0">
                <span className="relative z-10 bg-card px-2 text-muted-foreground mb-3">
                  Tropik Yazılım hesabınıza giriş yapın
                </span>
              </div>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Eposta</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@ornek.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password">Şifre</Label>
                <a
                  href="#"
                  className="ml-auto text-sm underline-offset-2 hover:underline"
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
              />
            </div>
            <Button type="submit" className="w-full">
              Giriş Yap
            </Button>
            {error && <div style={{ color: "red" }}>{error}</div>}
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
    <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
      Devam ederek <a href="#">Hizmet Şartları</a> ve{" "}
      <a href="#">Gizlilik Politikası</a>’nı kabul etmiş olursunuz.
    </div>
  </div>
  )
}
