// stores/favorites.js
import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useFavoritesStore = defineStore("favorites", () => {
  const API_BASE = "http://localhost:3000/favorites";
  const favorites = ref([]);
  const loading = ref(false);


  // GET /favorites
  const listarFavorites = () => {
    loading.value = true;
    axios
      .get(API_BASE)
      .then((res) => {
        favorites.value = res.data;
      })
      .finally(() => (loading.value = false));
  };

  // POST /favorites
  const agregarFavorite = ({ IdBoardgame, onComplete, onError }) => {
    loading.value = true;
    axios
      .post(API_BASE, {IdBoardgame})
      .then((res) => {
        onComplete(res);
      })
      .catch(onError)
      .finally(() => (loading.value = false));
  };

  // DELETE /favorites/:id
  const eliminarFavorite = ({ id, onComplete, onError }) => {
    loading.value = true;
    axios
      .delete(`${API_BASE}/${id}`)
      .then(onComplete)
      .catch(onError)
      .finally(() => (loading.value = false));
  };

  return {
    favorites,
    loading,
    listarFavorites,
    agregarFavorite,
    eliminarFavorite,
  };
});
