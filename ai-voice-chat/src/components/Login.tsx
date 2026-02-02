import React from 'react';
import { LogIn, Github } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6">
      <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-700 shadow-2xl">
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/20">
            <LogIn size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Üdvözöllek!</h1>
          <p className="text-slate-400 mt-2">Jelentkezz be az AI asszisztensedhez</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={onLogin}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-black font-semibold py-3 px-6 rounded-xl transition-all active:scale-95"
          >
            <img src="https://www.google.com/favicon.ico" alt="google" className="w-5 h-5" />
            Belépés Google-lel
          </button>

          <button 
            onClick={onLogin}
            className="w-full flex items-center justify-center gap-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-xl transition-all active:scale-95"
          >
            <Github size={20} />
            Belépés GitHub-bal
          </button>
        </div>

        <p className="text-center text-slate-500 text-xs mt-8">
          A belépéssel elfogadod a felhasználási feltételeket.
        </p>
      </div>
    </div>
  );
};

export default Login;