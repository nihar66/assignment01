import { initializeApp } from "firebase/app";
import { useEffect, useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";










// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB8wGJyKrszGUDU2gtF1QlcEqQQRhiEvI8",
    authDomain: "pomodoro-timer66.firebaseapp.com",
    projectId: "pomodoro-timer66",
    storageBucket: "pomodoro-timer66.appspot.com",
    messagingSenderId: "67970293771",
    appId: "1:67970293771:web:d3af2f35e99f10ae90a70e",
    measurementId: "G-75YQ9RMW91"
};

const Auth = ({ setAccessToken }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    // Initialize Firebase
    initializeApp(firebaseConfig);

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setAccessToken(user.accessToken);
      } else {
        setAccessToken(null);
      }
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    setStatus('pending');

    const auth = getAuth();
    if (user.provider === 'password') {
      
      signInWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
          const user = userCredential.user;
          setAccessToken(user.accessToken);
          setStatus('success');
        })
        .catch((error) => {
          createUser(user);
        });
    } else if (user.provider === 'google.com') {
      // Google Sign-Up or Login
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
        .then((result) => {
          const user = result.user;
          setAccessToken(user.accessToken);
          setStatus('success');
        })
        .catch((error) => {
          console.dir(error.message);
          setStatus({ status: 'error', message: error.message });
        });
    }
  }, [user]);

  const createUser = ({ email, password }) => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setAccessToken(user.accessToken);
        setStatus('success');
      })
      .catch((error) => {
        console.dir(error.message);
        const isEmailAlready = error.message.includes('email-already-in-use');
        setStatus({
          status: 'error',
          message: isEmailAlready ? 'You have already an account from this email. Please enter a valid password!' : error.message,
        });
      });
  };

  const onSubmitHandler = (e) => {
    const email = e.target.email.value;
    const password = e.target.password.value;
    const provider = e.target.provider.value;
    setUser({ email, password, provider });
    e.preventDefault();
  };

  
  return (
    <div>

      <div className="max-w-lg bg-white p-14 rounded-md shadow-lg">
  
        <p className="text-black mb-8 text-4xl text-center">User Login</p>
        <form className="flex flex-col gap-8" onSubmit={onSubmitHandler}>
          <input className="px-4 py-2 rounded border-2 border-indigo-600 text-lg" name="email" type="email" placeholder="Enter Email" required />
      
          <div className="w-full">
            <input className="w-full px-4 py-2 rounded border-2 border-indigo-600 text-lg" name="password" type="password" placeholder="Enter Password" required />
            {status.status === 'error' && <p className="mt-2 text-base text-red-500">{status.message}</p>}
          </div>
          <input type="hidden" name="provider" value="password" />
          <button className={`px-4 py-2 bg-blue-500 rounded text-white ${status === 'pending' && 'cursor-not-allowed bg-blue-300'}`} disabled={status === 'pending'}>
            {status === 'pending' ? 'Please wait...' : 'Login with Email/Password'}
          </button>
        </form>
        <p className="mt-4 text-white text-center"></p>
        <hr className="my-6 border-t border-white" />
        <div className="flex  items-center justify-center ">
  <div className= "px-2 py-1 bg-red-500 rounded text-white text-sm">
  <button
 
 onClick={() => {
   const auth = getAuth();
   const provider = new GoogleAuthProvider();
   signInWithPopup(auth, provider)
     .then((result) => {
       const user = result.user;
       setAccessToken(user.accessToken);
       setStatus('success');
     })
     .catch((error) => {
      console.error('Google Sign-In Error:', error);
      setStatus({ status: 'error', message: error.message });
     });
 }}
>Sign up/Login with Google
</button>   
</div>
   </div>
   </div>
   </div>
 );
       };
       export default Auth;





