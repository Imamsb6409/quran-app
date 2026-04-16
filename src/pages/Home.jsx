import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSurah, setSearchTerm } from "../features/quranSlice";
import { Link } from "react-router-dom";
import { SkeletonCard } from "../components/Skeleton";

const Home = () => {
  // ============ HOOKS ============
  // useDispatch: untuk mengirim action ke Redux
  const dispatch = useDispatch();

  // useSelector: untuk membaca state dari Redux
  const { surahList, loading, searchTerm, lastRead } = useSelector(
    (state) => state.quran,
  );

  // ============ SIDE EFFECTS ============
  // useEffect: menjalankan kode saat komponen pertama kali dimuat
  useEffect(() => {
    dispatch(getAllSurah()); // Ambil data surat dari API
  }, [dispatch]); // Dependency array: hanya jalan sekali

  // ============ FILTERING ============
  // Filter surat berdasarkan kata kunci pencarian
  const filteredSurah = surahList.filter((s) =>
    s.namaLatin.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="container mx-auto p-4">
      {/* HEADER */}
      <header className="text-center my-8">
        <h1 className="text-4xl font-bold text-emerald-600 italic">
         Tempat baca quran terlengkap di dunia
        </h1>
      </header>

      {/* SEARCH INPUT */}
      <div className="mb-8 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Cari Surah (contoh: Al-Fatihah)..."
          className="w-full p-3 border-2 border-emerald-500 rounded-lg outline-none focus:ring-2 focus:ring-emerald-300 dark:placeholder:text-gray-400"
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          // Setiap kali user mengetik, update searchTerm di Redux
        />
      </div>
      {lastRead && (
        <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900/50 rounded-xl flex justify-between items-center">
          <div>
            <p className="text-xs text-orange-600 dark:text-orange-400 font-bold uppercase ">
              Terakhir Dibaca
            </p>
            <h4 className="font-bold dark:text-white">
              Surah {lastRead.name}: Ayat {lastRead.ayatNo}
            </h4>
          </div>
          <Link
            to={`/surat/${lastRead.surahNo}`}
            className="bg-orange-500 hover:scale-105 active:scale-95 transition-all duration-300 text-white px-4 py-2 rounded-lg text-sm font-bold"
          >
            Lanjut Baca
          </Link>
        </div>
      )}
      {/* GRID SURAH */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? // Tampilkan skeleton saat loading
            [...Array(9)].map((_, i) => <SkeletonCard key={i} />)
          : // Tampilkan data surat yang sudah difilter
            filteredSurah.map((surah) => (
              <Link to={`/surat/${surah.nomor}`} key={surah.nomor}>
                <div className="p-5 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all hover:border-emerald-500 group">
                  <div className="flex justify-between items-center">
                    {/* Bagian Kiri: Nomor & Nama Latin */}
                    <div className="flex items-center gap-4">
                      <span className="bg-emerald-100 text-emerald-700 w-10 h-10 flex items-center justify-center rounded-full font-bold">
                        {surah.nomor}
                      </span>
                      <div>
                        <h3 className="font-bold text-lg group-hover:text-emerald-600">
                          {surah.namaLatin}
                        </h3>
                        <p className="text-sm text-gray-500">{surah.arti}</p>
                      </div>
                    </div>

                    {/* Bagian Kanan: Nama Arab & Jumlah Ayat */}
                    <div className="text-right">
                      <h3 className="text-2xl font-arabic font-bold text-emerald-700">
                        {surah.nama}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {surah.jumlahAyat} Ayat
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default Home;
