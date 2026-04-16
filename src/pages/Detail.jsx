import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getSurahDetail,
  toggleBookmark,
  setLastRead,
  setQari
} from "../features/quranSlice";
import { SkeletonAyat } from "../components/Skeleton";
import { 
  BookmarkPlusIcon, 
  BookmarkCheckIcon, 
  Tag, 
  Share, 
  PlayIcon, 
  SquareIcon 
} from "lucide-react";

const daftarQari = [
  { id: '01', nama: 'Abdullah Al-Juhany' },
  { id: '02', nama: 'Abdul Muhsin Al-Qasim' },
  { id: '03', nama: 'Abdurrahman as-Sudais' },
  { id: '04', nama: 'Ibrahim Al-Dossari' },
  { id: '05', nama: 'Misyari Rasyid Al-Afasi' },
  {id: '06', nama: 'Yasser Al-Dosari' },
];

// --- Sub-Komponen Audio Ayat dengan Logika Global Control ---
const AyatAudio = ({ src, ayatId, activeAudioId, setActiveAudioId }) => {
  const audioRef = useRef(null);
  const isPlaying = activeAudioId === ayatId;

  // Pantau perubahan activeAudioId
  useEffect(() => {
    if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isPlaying]);

  const toggleAudio = () => {
    if (isPlaying) {
      setActiveAudioId(null); // Matikan jika sedang nyala
    } else {
      setActiveAudioId(ayatId); // Nyalakan ini, otomatis memicu useEffect di komponen lain
      audioRef.current.play();
    }
  };

  return (
    <div className="flex items-center">
      <audio 
        ref={audioRef} 
        src={src} 
        onEnded={() => setActiveAudioId(null)} 
        className="hidden" 
      />
      <button
        onClick={toggleAudio}
        className={`p-1.5 rounded-full transition-all hover:scale-110 active:scale-95 ${
          isPlaying 
            ? "bg-red-500 text-white animate-pulse" 
            : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
        }`}
      >
        {isPlaying ? <SquareIcon size={14} fill="currentColor" /> : <PlayIcon size={14} fill="currentColor" />}
      </button>
    </div>
  );
};

const Detail = () => {
  const { nomor } = useParams();
  const dispatch = useDispatch();
  
  // State untuk melacak ID ayat mana yang audionya sedang aktif
  const [activeAudioId, setActiveAudioId] = useState(null);
  
  const { detailSurah, loading, bookmarks, lastRead, selectedQari } = useSelector(
    (state) => state.quran,
  );

  useEffect(() => {
    dispatch(getSurahDetail(nomor));
  }, [dispatch, nomor]);

  const handleShare = (ayat) => {
    const text = `QS. ${detailSurah.namaLatin} Ayat ${ayat.nomorAyat}\n\n${ayat.teksArab}\n\nArtinya: "${ayat.teksIndonesia}"\n\nLink: ${window.location.href}`;
    if (navigator.share) {
      navigator.share({ title: "Berbagi Ayat", text: text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Teks ayat berhasil disalin!");
    }
  };

  if (loading) return <div className="container mx-auto p-10"><SkeletonAyat /></div>;

  return (
    <div className="container mx-auto p-4 max-w-4xl min-h-screen transition-colors duration-300">
      <Link to="/" className="text-emerald-600 dark:text-emerald-400 font-bold mb-4 inline-block text-sm hover:underline">
        ← Kembali ke Daftar Surah
      </Link>

      {detailSurah && (
        <>
          {/* HEADER SURAT */}
          <div className="bg-emerald-600 text-white p-8 rounded-2xl text-center mb-8 shadow-xl relative overflow-hidden">
             {/* Dekorasi background */}
            <div className="absolute top-0 right-0 opacity-10 translate-x-1/4 -translate-y-1/4">
                <PlayIcon size={200} />
            </div>

            <h1 className="text-4xl font-bold mb-2 relative z-10">{detailSurah.namaLatin}</h1>
            <p className="italic mb-6 relative z-10 opacity-90">
              {detailSurah.arti} • {detailSurah.jumlahAyat} Ayat
            </p>

            {/* Pemilih Qari */}
            <div className="mb-6 max-w-xs mx-auto relative z-10">
              <label className="block text-xs font-bold mb-2 uppercase tracking-[0.2em] text-emerald-100">Qari Voice</label>
              <select 
                value={selectedQari || '01'}
                onChange={(e) => {
                    dispatch(setQari(e.target.value));
                    setActiveAudioId(null); // Stop audio jika ganti qari
                }}
                className="w-full p-2.5 rounded-xl bg-white/20 border border-white/30 text-white outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md cursor-pointer appearance-none text-center"
              >
                {daftarQari.map((q) => (
                  <option key={q.id} value={q.id} className="text-gray-800">{q.nama}</option>
                ))}
              </select>
            </div>

            {/* Audio Full Surat */}
            <audio
              key={selectedQari}
              onPlay={() => setActiveAudioId(null)} // Jika audio full diputar, audio ayat mati
              controls
              className="mx-auto w-full max-w-md invert dark:invert-0 h-10 shadow-lg rounded-full"
            >
              <source src={detailSurah.audioFull[selectedQari || "01"]} type="audio/mpeg" />
            </audio>
          </div>

          {/* DAFTAR AYAT */}
          <div className="space-y-6">
            {detailSurah.ayat.map((ayat) => {
              const ayatId = `ayat-${ayat.nomorAyat}`; // ID Unik untuk audio control
              const isBookmarked = bookmarks.some(b => b.nomorAyat === ayat.nomorAyat && b.surahName === detailSurah.namaLatin);
              const isLastRead = lastRead?.surahNo === nomor && lastRead?.ayatNo === ayat.nomorAyat;

              return (
                <div
                  key={ayat.nomorAyat}
                  className={`p-6 rounded-2xl border transition-all duration-500 ${
                    isLastRead 
                      ? "border-emerald-500 ring-4 ring-emerald-500/10 dark:ring-emerald-400/10" 
                      : "border-gray-100 dark:border-slate-700 shadow-sm"
                  } bg-white dark:bg-slate-800`}
                >
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex gap-3 items-center">
                      <span className="bg-emerald-500 text-white w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold shadow-md">
                        {ayat.nomorAyat}
                      </span>

                      {/* Komponen Audio Ayat Dinamis dengan Kontrol Global */}
                      <AyatAudio 
                        src={ayat.audio[selectedQari || "01"]} 
                        ayatId={ayatId}
                        activeAudioId={activeAudioId}
                        setActiveAudioId={setActiveAudioId}
                      />

                      <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

                      <button
                        onClick={() => dispatch(toggleBookmark({...ayat, surahName: detailSurah.namaLatin, surahNo: nomor}))}
                        className={`flex items-center gap-1.5 p-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
                          isBookmarked ? "bg-emerald-500 text-white" : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {isBookmarked ? <BookmarkCheckIcon size={14} className="text-amber-300" /> : <BookmarkPlusIcon size={14} />}
                        <span>{isBookmarked ? 'Saved' : 'Bookmark'}</span>
                      </button>

                      <button
                        onClick={() => dispatch(setLastRead({surahNo: nomor, ayatNo: ayat.nomorAyat, name: detailSurah.namaLatin}))}
                        className="flex items-center gap-1.5 p-1.5 px-3 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-xs font-medium hover:bg-orange-500 hover:text-white transition-all"
                      >
                        <Tag size={14} /> <span>Mark Read</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h2 className="text-4xl font-arabic font-bold text-right leading-[2.8] dark:text-slate-100" dir="rtl">
                      {ayat.teksArab}
                    </h2>
                    <p className="text-emerald-700 font-latin dark:text-emerald-400 font-medium text-right italic text-lg leading-relaxed">
                      {ayat.teksLatin}
                    </p>
                    <p className="text-gray-600 dark:text-slate-400 text-base leading-relaxed border-l-4 border-emerald-500/30 pl-4 py-1">
                      {ayat.teksIndonesia}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Detail;