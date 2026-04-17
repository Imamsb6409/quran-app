import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSurah, setSearchTerm } from "../features/quranSlice";
import { Link } from "react-router";
import { SkeletonCard } from "../components/Skeleton";
import { motion } from "framer-motion";
import { 
  IconSearch, 
  IconBook, 
  IconMoonStars, 
  IconBookmarkFilled, 
  IconArrowRight 
} from "@tabler/icons-react";

const Home = () => {
  const dispatch = useDispatch();
  const { surahList, loading, searchTerm, lastRead } = useSelector(
    (state) => state.quran,
  );

  useEffect(() => {
    dispatch(getAllSurah());
  }, [dispatch]);

  const filteredSurah = surahList.filter((s) =>
    s.namaLatin.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-white">
      {/* HERO BANNER SECTION */}
      <header className="relative w-full py-16 md:py-24 px-6 overflow-hidden">
        {/* Dekorasi Background */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 bg-gradient-to-br from-emerald-50 to-white"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-200 rounded-full blur-3xl opacity-30"></div>

        <div className="container mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-600/10 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              <IconMoonStars size={16} />
              Digital Quran App
            </div>

            {/* Judul Utama */}
            <h1 className="text-5xl md:text-8xl font-bold text-emerald-900 tracking-tighter mb-6 italic">
              Al-Mushaf
            </h1>
            
            <p className="text-gray-600 font-quicksand text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Baca, pelajari, dan hayati firman Allah SWT dengan antarmuka yang bersih dan menenangkan.
            </p>

            {/* Statistik / Info */}
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm font-bold text-emerald-800/60 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <IconBook size={18} />
                114 Surah
              </div>
              <div className="w-1 h-1 bg-emerald-300 rounded-full my-auto hidden md:block"></div>
              <div className="flex items-center gap-2">
                30 Juz Al-Quran
              </div>
            </div>
          </motion.div>

          {/* SEARCH BAR TERINTEGRASI */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 relative max-w-2xl mx-auto"
          >
            <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-emerald-600 transition-transform group-focus-within:scale-110">
                <IconSearch size={22} />
              </div>
              <input
                type="text"
                value={searchTerm}
                placeholder="Cari Surah (contoh: Al-Kahfi)..."
                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                className="w-full pl-14 pr-6 py-5 bg-white border-2 border-emerald-100 rounded-[2rem] shadow-xl shadow-emerald-900/5 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-quicksand text-lg"
              />
            </div>
          </motion.div>
        </div>
      </header>

      {/* CONTENT SECTION */}
      <main className="container mx-auto px-6 pb-20">
        
        {/* LAST READ SECTION */}
        {lastRead && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-12 p-6 bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-[2rem] shadow-xl shadow-emerald-900/20 flex flex-col md:flex-row justify-between items-center gap-6 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <IconBookmarkFilled size={100} />
            </div>
            
            <div className="relative z-10 text-center md:text-left">
              <p className="text-xs text-emerald-200 font-bold uppercase tracking-widest mb-1 flex items-center justify-center md:justify-start gap-2">
                <IconBookmarkFilled size={14} /> Terakhir Dibaca
              </p>
              <h4 className="text-2xl font-bold">
                Surah {lastRead.name}: <span className="font-quicksand font-medium opacity-80">Ayat {lastRead.ayatNo}</span>
              </h4>
            </div>

            <Link
              to={`/surat/${lastRead.surahNo}`}
              className="relative z-10 bg-white text-emerald-800 px-8 py-3 rounded-2xl font-bold hover:bg-emerald-50 transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-black/10"
            >
              Lanjut Baca
              <IconArrowRight size={18} />
            </Link>
          </motion.div>
        )}

        {/* GRID SURAH */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? [...Array(9)].map((_, i) => <SkeletonCard key={i} />)
            : filteredSurah.map((surah) => (
                <Link to={`/surat/${surah.nomor}`} key={surah.nomor}>
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="p-6 bg-white border border-emerald-50 rounded-[2rem] hover:shadow-2xl hover:shadow-emerald-900/5 transition-all hover:border-emerald-200 group relative overflow-hidden"
                  >
                    <div className="flex justify-between items-center relative z-10">
                      {/* Nomor & Nama */}
                      <div className="flex items-center gap-5">
                        <span className="bg-emerald-50 text-emerald-700 w-12 h-12 flex items-center justify-center rounded-2xl font-bold text-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                          {surah.nomor}
                        </span>
                        <div>
                          <h3 className="font-bold text-xl text-emerald-900 group-hover:text-emerald-600 transition-colors">
                            {surah.namaLatin}
                          </h3>
                          <p className="text-sm text-gray-400 font-quicksand font-medium uppercase tracking-tight italic">
                            {surah.arti}
                          </p>
                        </div>
                      </div>

                      {/* Arab & Ayat */}
                      <div className="text-right">
                        <h3 className="text-3xl font-arabic font-bold text-emerald-700 leading-none mb-1">
                          {surah.nama}
                        </h3>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">
                          {surah.jumlahAyat} Ayat
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
        </div>

        {/* NOT FOUND STATE */}
        {!loading && filteredSurah.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 font-quicksand text-lg italic">
              Surah "{searchTerm}" tidak ditemukan...
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;