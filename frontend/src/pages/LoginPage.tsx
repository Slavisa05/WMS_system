import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import Button from '@/components/Button'
import logo from "/public/logo.png"

const LoginPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { login } = useAuth()
    const navigate = useNavigate()
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await login(username, password);
            navigate('/dashboard');
        } catch {
            setError('Pogrešno korisničko ime ili lozinka');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full h-screen flex items-center justify-center">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-[30vw] px-6 py-6 rounded-xl shadow-sm shadow-blue-200">
                <img className="w-40 self-center" src={logo} alt="Logo" />
                <h1 className="self-center">Prijava</h1>

                {error && (<p className="text-sm text-red-500 text-center">{error}</p>)}
                <div className="flex flex-col gap-1">
                    <label>Korisničko ime</label>
                    <input type="text" 
                            value={username} 
                            placeholder="npr. marko1910"
                            onChange={e => setUsername(e.target.value)}
                            className="w-full border border-border rounded-xl px-2 py-1 transition-all duration-150 hover:border-black" />
                </div>

                <div className="flex flex-col gap-1">
                    <label>Lozinka</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            placeholder="••••••••"
                            onChange={e => setPassword(e.target.value)}
                            className="w-full border border-border rounded-xl px-2 py-1 pr-9 transition-all duration-150 hover:border-black" />
                        <button
                            type="button"
                            onClick={() => setShowPassword(p => !p)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-foreground transition-colors duration-150"
                            aria-label={showPassword ? 'Sakrij lozinku' : 'Prikaži lozinku'}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                <Button type="submit" text="Uloguj se" isLoading={isLoading} loadingText="Prijavljivanje..." />
            </form>
        </div>
    );
}

export default LoginPage