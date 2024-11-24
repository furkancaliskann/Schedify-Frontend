import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

interface LoginProps {
    onLoginSuccess: (token: string) => void;
}

function Login({ onLoginSuccess }: LoginProps) {
    const handleGoogleLogin = async (response: any) => {
        try {
            // Google'dan alınan id_token'ı backend'e gönderiyoruz
            const res = await axios.post('https://localhost:7128/api/auth/google/callback', {
                id_token: response.credential, // credential, Google login'den alınan ID token
            });

            // Backend'den gelen JWT token'ı onLoginSuccess fonksiyonuna gönderiyoruz
            onLoginSuccess(res.data.token);
        } catch (error) {
            console.error('Google login error: ', error);
        }
    };

    return (
        <div>
            <GoogleLogin
                onSuccess={handleGoogleLogin} // Başarılı login işlemi sonrası handleGoogleLogin tetikleniyor
                onError={() => console.log('Login Failed')} // Login başarısız olursa hata mesajı
            />
        </div>
    );
}

export default Login;
