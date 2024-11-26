import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

interface LoginProps {
    onLoginSuccess: (token: string) => void;
}

function Login({ onLoginSuccess }: LoginProps) {
    const handleGoogleLogin = async (response: any) => {
        try {
            const res = await axios.post('https://localhost:7128/api/auth/google/callback', {
                id_token: response.credential,
            });
            onLoginSuccess(res.data.token);
        } catch (error) {
            console.error('Google login error: ', error);
        }
    };

    return (
        <div>
            <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => console.log('Login Failed')}
            />
        </div>
    );
}
export default Login;
