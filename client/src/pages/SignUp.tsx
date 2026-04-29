import { signInWithGooglePopup } from '../config/auth';
import gifts from '../assets/signup-image.jpg';
import './SignUp.css';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Navbar } from '../components/Navbar';

export default function SignUp() {
    const navigate = useNavigate();

    const logGoogleUser = async () => {
        try {
            await signInWithGooglePopup();
            navigate('/home');
        } catch (error: unknown) {
            const msg = (error as { code?: string })?.code === 'auth/popup-closed-by-user'
                ? 'Sign-in cancelled.'
                : 'Sign-in failed. Please try again.';
            toast.error(msg);
        }
    }
    
    return (
        <>
            <Navbar />
            <div className="signup-page">
            <div className="signup-inner">
                <div className="signup-content">
                    <div className="signup-text">
                        <h1 className="signup-title">Plan your gifts and track budget limits with GiftGiver</h1>
                        <h2 className="signup-subtitle">Put the people in your life first and never buy a last-minute gift again!</h2>
                    </div>
                    <button className="signup-button" onClick={logGoogleUser}>
                        <img src='/google.svg' alt="Google Icon" className="google-icon" />
                        Sign up with your Google account
                    </button>
                </div>
                <div className="signup-image-wrap">
                    <img src={gifts} alt="Gift giving image" className="signup-image" />
                </div>
            </div>
        </div>
        </>
    )
}
