import { useNavigate } from "react-router-dom";

export const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-blue-500 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-purple-500 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-40 h-40 rounded-full bg-green-500 blur-3xl"></div>

        {/* Chess piece silhouettes */}
        <div className="hidden md:block absolute top-20 right-20 opacity-20">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="white">
            <path d="M9,17L9,15.5C9,14.12 10.12,13 11.5,13C12.88,13 14,14.12 14,15.5V17H9M19,22H5V20H19V22M17.24,9.24L18.33,10.33C19.28,9.38 19.28,7.88 18.33,6.93C17.38,5.98 15.88,5.98 14.93,6.93L16.02,8.02C16.37,7.67 16.92,7.67 17.26,8.02C17.61,8.37 17.61,8.92 17.24,9.24M11.5,1C9.14,1 6.67,1 4.96,4.96S5,11.5 5,11.5L7,11.45V7C7,6.45 7.45,6 8,6C8.55,6 9,6.45 9,7V11.5L11,11.45V7C11,6.45 11.45,6 12,6C12.55,6 13,6.45 13,7V11.5L15,11.45V7C15,6.45 15.45,6 16,6C16.55,6 17,6.45 17,7V11.46L19,11.46C19,11.46 19.96,7.96 16,4C14.7,2.7 13.23,1 11.5,1Z" />
          </svg>
        </div>
        <div className="hidden md:block absolute bottom-20 left-20 opacity-20">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="white">
            <path d="M12,1C10.12,1 8.5,2.38 8.5,4.1C8.5,5.1 9,6.05 9.74,6.71C5.27,8 2,12.11 2,17C2,17.83 2.5,18.5 3.17,18.5C3.33,18.5 3.57,18.43 3.74,18.36C3.28,19.34 3,20.41 3,21.5V22H21V21.5C21,20.41 20.72,19.34 20.26,18.36C20.43,18.43 20.67,18.5 20.83,18.5C21.5,18.5 22,17.83 22,17C22,12.11 18.73,8 14.26,6.71C15,6.05 15.5,5.1 15.5,4.1C15.5,2.38 13.88,1 12,1Z" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl w-full z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center order-1 md:order-1">
            <div className="relative w-full max-w-lg">
              <img
                src="/chessboard.png"
                alt="Chess knights facing each other"
                className="w-full rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-6 order-2 md:order-2">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Play chess online on <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-400">the Best</span> site
              </h1>
              <p className="text-gray-300 text-lg mt-4 max-w-md">
                Challenge players worldwide, improve your skills, and join our thriving chess community today.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => navigate('/game')} className="px-8 py-4 text-xl bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-lg transform hover:translate-y-1 transition-all duration-200 flex items-center justify-center space-x-2">
                <span>Play online</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <button className="px-8 py-4 text-xl bg-transparent hover:bg-white/10 text-white border border-white/30 font-bold rounded-lg shadow-lg transform hover:translate-y-1 transition-all duration-200">
                Learn Chess
              </button>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="bg-white/5 p-4 rounded-lg backdrop-blur-sm">
                <div className="flex items-center space-x-2 text-green-400 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Free Analysis (coming soon)</span>
                </div>
                <p className="text-sm text-gray-300">AI-powered game reviews and insights</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg backdrop-blur-sm">
                <div className="flex items-center space-x-2 text-blue-400 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  <span className="font-semibold">Community</span>
                </div>
                <p className="text-sm text-gray-300">Join thousands of players worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};