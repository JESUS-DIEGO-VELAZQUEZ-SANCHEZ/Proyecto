// stores/boardgames.js
import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useBoardgamesStore = defineStore("boardgames", () => {
  const API_BASE = "http://localhost:3000";
  const boardgames = ref([]);
  const boardgame = ref({});
  const loading = ref(false);


  // GET /boardgame
  const listarBoardgames = () => {
    loading.value = true;
    axios
      .get(API_BASE)
      .then((res) => {
        boardgames.value = res.data;
      })
      .finally(() => (loading.value = false));
  };

  // GET /boardgame/:id
  const obtenerBoardgame = ({ id, onComplete, onError }) => {
    loading.value = true;
    axios
      .get(`${API_BASE}/${id}`)
      .then((res) => {
        boardgame.value = res.data.data[0] || {};
        onComplete(res);
      })
      .catch(onError)
      .finally(() => (loading.value = false));
  };

  // POST /boardgame
  const agregarBoardgame = ({ datos, onComplete, onError }) => {
    loading.value = true;
    axios
      .post(API_BASE, datos)
      .then((res) => {
        onComplete(res);
      })
      .catch(onError)
      .finally(() => (loading.value = false));
  };

  // PUT /boardgame/:id
  const editarBoardgame = ({ id, datos, onComplete, onError } = {}) => {
    loading.value = true;
    axios
      .put(`${API_BASE}/${id}`, datos)
      .then((res) => {
        boardgame.value = res.data.data;
        onComplete(res);
      })
      .catch(onError)
      .finally(() => (loading.value = false));
  };

  // DELETE /boardgame/:id
  const eliminarBoardgame = ({ id, onComplete, onError }) => {
    loading.value = true;
    axios
      .delete(`${API_BASE}/${id}`)
      .then(onComplete)
      .catch(onError)
      .finally(() => (loading.value = false));
  };

  return {
    boardgames,
    loading,
    listarBoardgames,
    obtenerBoardgame,
    agregarBoardgame,
    editarBoardgame,
    eliminarBoardgame,
  };
});
