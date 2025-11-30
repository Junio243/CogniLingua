import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

export const metadata: Metadata = {
  title: 'Login | CogniLingua',
  description: 'Acesse o painel autenticado do CogniLingua.',
};

export default function LoginPage({ searchParams }: { searchParams: { redirectTo?: string } }) {
  const redirectTo = searchParams?.redirectTo ?? '/dashboard';

  return (
    <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-6 py-12">
      <Card className="w-full border-white/10 bg-slate-900/70 shadow-glow">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-50">Faça login para continuar</CardTitle>
          <CardDescription className="text-slate-400">
            O acesso ao painel exige uma sessão válida para encaminhar as requisições ao gateway protegido.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button asChild>
            <Link href={`/api/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`}>Entrar com sua conta</Link>
          </Button>
          <p className="text-sm text-slate-400">
            Caso já tenha feito login em outra aba, atualize a página para reutilizar o token JWT presente no cookie.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
