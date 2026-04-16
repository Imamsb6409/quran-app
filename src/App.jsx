import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { toggleDarkMode, setSearchTerm } from "./features/quranSlice";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Bookmarks from "./pages/Bookmarks";
import { BookmarkIcon, Moon, Sun, HomeIcon } from "lucide-react";

const Header = () => {
  const { darkMode, searchTerm } = useSelector((state) => state.quran);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook untuk pindah halaman

  const handleSearch = (e) => {
    // Jika tombol yang ditekan adalah Enter
    if (e.key === "Enter") {
      // Pindah ke halaman Home (akar '/')
      navigate("/");
    }
  };

  return (
    <div className="p-4 flex justify-between items-center container mx-auto gap-4 sticky top-0 z-50 bg-gray-50/80 dark:bg-slate-900/80 backdrop-blur-md">
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400 shrink-0"
      >
        <div className="bg-emerald-600 p-2 rounded-lg text-white">
          <HomeIcon size={20} />
        </div>
        <span className="hidden sm:inline text-xl tracking-tight">
          Al-Mushaf
        </span>
      </Link>

      {/* Search & Tools */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-end">
        <input
          type="text"
          value={searchTerm}
          placeholder="Cari Surah... (Tekan Enter)"
          className="w-full max-w-[150px] sm:max-w-xs p-2 px-4 border-2 border-emerald-500/30 rounded-full outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-300 dark:bg-slate-800 dark:text-white transition-all shadow-sm"
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          onKeyDown={handleSearch} // Deteksi tombol keyboard
        />

        <Link
          to="/bookmarks"
          className="p-2 px-3 sm:px-4 rounded-full bg-white dark:bg-slate-800 shadow-sm border dark:border-slate-700 text-sm font-bold flex items-center gap-2 dark:text-white hover:bg-emerald-50 transition-colors shrink-0"
        >
          <BookmarkIcon size={16} className="text-emerald-600" />
          <span className="hidden md:inline">Bookmarks</span>
        </Link>

        <button
          onClick={() => dispatch(toggleDarkMode())}
          className="p-2 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm border dark:border-slate-700 dark:text-white transition-all shrink-0"
        >
          {darkMode ? (
            <Sun size={20} className="text-yellow-500" />
          ) : (
            <Moon size={20} className="text-blue-400" />
          )}
        </button>
      </div>
    </div>
  );
};

function App() {
  const { darkMode } = useSelector((state) => state.quran);
  const dispatch = useDispatch();

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
        <BrowserRouter>
          {/* Header/Nav Mini */}
          <Header />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/surat/:nomor" element={<Detail />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
