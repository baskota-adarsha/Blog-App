"use client";
import { RefreshCw, Home, ArrowLeft, BookOpen } from "lucide-react";

export default function ErrorPage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Main error illustration */}
        <div className="mb-8 relative">
          <div className="w-32 h-32 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-spin-slow opacity-20"></div>
            <div className="absolute inset-4 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-white animate-bounce" />
            </div>
          </div>

          {/* Glitch effect text */}
          <div className="relative">
            <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 mb-4 animate-pulse">
              Oops!
            </h1>
            <div className="absolute inset-0 text-6xl md:text-8xl font-bold text-red-500 opacity-20 animate-glitch">
              Oops!
            </div>
          </div>
        </div>

        {/* Error message */}
        <div className="mb-8 space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed max-w-lg mx-auto">
            We're sorry, but it looks like there was an error loading this page.
            Don't worry though - our best engineers are probably fixing it right
            now!
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <button
            onClick={handleRefresh}
            className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 min-w-[160px]"
          >
            <RefreshCw className="w-5 h-5 group-hover:animate-spin" />
            Try Again
          </button>

          <button
            onClick={handleGoHome}
            className="group bg-white bg-opacity-10 backdrop-blur-sm hover:bg-opacity-20 text-black px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 min-w-[160px] border border-white border-opacity-20"
          >
            <Home className="w-5 h-5 group-hover:animate-bounce" />
            Go Home
          </button>

          <button
            onClick={handleGoBack}
            className="group text-gray-300 hover:text-white px-6 py-2 font-medium transition-colors duration-300 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            Go Back
          </button>
        </div>

        {/* Fun message */}
        <div className="text-gray-400 text-sm">
          <p className="mb-2">
            While you're here, did you know that the first computer bug was
            literally a bug?
          </p>
          <p>A moth got stuck in a Harvard computer in 1947! 🦋</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes glitch {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
          100% {
            transform: translate(0);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-glitch {
          animation: glitch 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
