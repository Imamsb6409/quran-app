import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllSurah, fetchDetailSurah } from "../services/quranApi";

export const getAllSurah = createAsyncThunk("quran/getAllSurah", async () => {
  const response = await fetchAllSurah();
  return response.data.data;
});

export const getSurahDetail = createAsyncThunk(
  "quran/getDetail",
  async (nomor) => {
    const response = await fetchDetailSurah(nomor);
    return response.data.data;
  },
);

const initialState = {
  surahList: [],
  detailSurah: null,
  loading: false,
  error: null,
  searchTerm: "",
  // Fitur Baru: Persistence dengan LocalStorage
  bookmarks: JSON.parse(localStorage.getItem("quran_bookmarks")) || [],
  lastRead: JSON.parse(localStorage.getItem("quran_lastRead")) || null,
  darkMode: JSON.parse(localStorage.getItem("quran_darkMode")) || false,
  selectedQari: localStorage.getItem("quran_qari") || "01",
};

const quranSlice = createSlice({
  name: "quran",
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem("quran_darkMode", JSON.stringify(state.darkMode));
    },
    toggleBookmark: (state, action) => {
      const ayat = action.payload;
      const index = state.bookmarks.findIndex(
        (b) => b.nomorAyat === ayat.nomorAyat && b.surahName === ayat.surahName,
      );
      if (index >= 0) {
        state.bookmarks.splice(index, 1);
      } else {
        state.bookmarks.push(ayat);
      }
      localStorage.setItem("quran_bookmarks", JSON.stringify(state.bookmarks));
    },
    setLastRead: (state, action) => {
      state.lastRead = action.payload;
      localStorage.setItem("quran_lastRead", JSON.stringify(action.payload));
    },
    setQari: (state, action) => {
      state.selectedQari = action.payload;
      localStorage.setItem("quran_qari", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllSurah.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllSurah.fulfilled, (state, action) => {
        state.loading = false;
        state.surahList = action.payload;
      })
      .addCase(getSurahDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.detailSurah = action.payload;
      });
  },
});

export const { setQari, setSearchTerm, toggleDarkMode, toggleBookmark, setLastRead } =
  quranSlice.actions;
export default quranSlice.reducer;
