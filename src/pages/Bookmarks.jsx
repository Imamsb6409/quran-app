import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toggleBookmark } from "../features/quranSlice";
import { Trash2, ArrowLeft, BookOpen } from "lucide-react";

const Bookmarks = () => {
  const { bookmarks } = useSelector((state) => state.quran);
  const dispatch = useDispatch();

  return (
    <div className="container mx-auto p-4 max-w-4xl min-h-screen">
      {/* Header Halaman */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="text-emerald-600 dark:text-emerald-400" />
        </Link>
        <h1 className="text-2xl font-bold dark:text-white">Ayat Terpilih (Bookmark)</h1>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-700">
          <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 dark:text-slate-400">Belum ada ayat yang kamu simpan.</p>
          <Link to="/" className="mt-4 inline-block text-emerald-600 font-bold hover:underline">Cari Ayat Sekarang →</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookmarks.map((ayat, index) => (
            <div 
              key={`${ayat.surahName}-${ayat.nomorAyat}`}
              className="p-6 rounded-2xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm transition-all hover:shadow-md"
            >
              {/* Header Card Bookmark */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-bold text-emerald-600 dark:text-emerald-400">
                    QS. {ayat.surahName} : {ayat.nomorAyat}
                  </h3>
                </div>
                <div className="flex gap-2">
                    <Link 
                      to={`/surat/${ayat.surahNo}`} 
                      className="p-2 text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg font-bold"
                    >
                      Buka Surat
                    </Link>
                    <button 
                      onClick={() => dispatch(toggleBookmark(ayat))}
                      className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 transition-colors"
                      title="Hapus Bookmark"
                    >
                      <Trash2 size={16} />
                    </button>
                </div>
              </div>

              {/* Teks Ayat */}
              <div className="space-y-4">
                <h2 className="text-3xl font-arabic font-bold text-right leading-[2.5] dark:text-slate-100" dir="rtl">
                  {ayat.teksArab}
                </h2>
                <p className="text-gray-600 dark:text-slate-400 text-sm italic border-l-2 border-emerald-500 pl-4">
                  "{ayat.teksIndonesia}"
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;