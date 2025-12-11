<template>
  <v-container class="mt-4 py-6">
    <h1>Juegos de mesa</h1>

    <v-btn
    color="primary"
    variant="flat"
    class="mt-2 mb-4"
    @click="router.push('/')"
    >
    ← Regresar a Home
    </v-btn>

    <!-- Grid de tarjetas -->
    <v-row class="mt-4" dense>
      <v-col
        v-for="juego in boardgamesConCategoria"
        :key="juego.id"
        cols="12"
        sm="6"
        md="4"
        class="mb-4"
      >
        <Card
          :item="juego"
          :fields="fields"
          :is-favorite="esFavorito(juego.id)"
          @toggle-favorite="toggleFavorite"
          @editar="irEditar"
          @eliminar="abrirModalEliminar"
          @detalle="irDetalle"
        />
      </v-col>

      <!-- Si no hay juegos -->
      <v-col v-if="!loading && boardgamesConCategoria.length === 0" cols="12">
        <p class="text-center text-grey">
          No hay juegos de mesa registrados.
        </p>
      </v-col>
    </v-row>

    <!-- Diálogo de confirmación para eliminar juego -->
    <v-dialog v-model="dialogEliminar" max-width="420">
      <v-card>
        <v-card-title class="text-h6">
          ¿Eliminar juego de mesa?
        </v-card-title>

        <v-card-text>
          Esta acción no se puede deshacer.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn variant="text" @click="dialogEliminar = false">
            Cancelar
          </v-btn>

          <v-btn color="red" variant="flat" @click="confirmarEliminar">
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

import Card from "@/components/Card.vue";
import { useBoardgamesStore } from "@/stores/boardgames";
import { useFavoritesStore } from "@/stores/favorites";
import { useNotifyStore } from "@/stores/notify";

const router = useRouter();
const boardgamesStore = useBoardgamesStore();
const favoritesStore = useFavoritesStore();
const notify = useNotifyStore();

// refs de los stores
const { boardgames, loading } = storeToRefs(boardgamesStore);
const { favorites } = storeToRefs(favoritesStore);

// diálogo de eliminar
const dialogEliminar = ref(false);
const idEliminar = ref(null);

// campos que mostrará la tarjeta
// OJO: usamos CategoryName (nombre completo) en lugar del código numérico
const fields = [
  { label: "Nombre", value: "Name" },
  { label: "Publisher", value: "Publisher" },
  { label: "Categoría", value: "CategoryName" },
  { label: "Año", value: "Year" },
];

// mapa de categorías (clave -> nombre)
const categoryLabel = (code) => {
  const map = {
    11: "Adventure",
    12: "Puzzle",
    13: "Strategy",
    14: "Fantasy",
    15: "Civilization",
  };
  return map[code] || "Desconocida";
};

// añadimos id (en minúsculas, para Card) y CategoryName
const boardgamesConCategoria = computed(() =>
  boardgames.value.map((juego) => ({
    ...juego,
    id: juego.ID, // Card emite usando item.id
    CategoryName: categoryLabel(juego.Category),
  }))
);

// conjunto de IDs que están en favoritos
const idsFavoritos = computed(() => favorites.value.map((fav) => fav.ID));

// saber si un juego está marcado como favorito
const esFavorito = (id) => idsFavoritos.value.includes(id);

// cargar datos al entrar a la vista
onMounted(() => {
  boardgamesStore.listarBoardgames(); // GET /boardgame
  favoritesStore.listarFavorites();   // GET /favorites (para saber qué está marcado)
});

// navegar a editar
const irEditar = (id) => {
  router.push(`/editar/${id}`);
};

// navegar a detalle (si tienes una vista de detalle; si no, puedes dejar solo un console.log)
const irDetalle = (id) => {
  // ajusta la ruta si tu detalle se llama diferente
  router.push(`/detalle/${id}`);
};

// abrir modal de eliminar juego
const abrirModalEliminar = (id) => {
  idEliminar.value = id;
  dialogEliminar.value = true;
};

// confirmar eliminación de juego
const confirmarEliminar = async () => {
  await boardgamesStore.eliminarBoardgame({
    id: idEliminar.value,
    onComplete: (response) => {
      notify.show(response.data.mensaje || "Juego de mesa eliminado", "success");
      boardgamesStore.listarBoardgames();
      favoritesStore.listarFavorites(); // por si estaba en favoritos
    },
    onError: (error) => {
      console.error(error);
      notify.show("Ocurrió un error al eliminar el juego", "error");
    },
  });

  dialogEliminar.value = false;
};

// alternar favorito (agregar / quitar)
const toggleFavorite = async (id) => {
  if (esFavorito(id)) {
    // Quitar de favoritos -> DELETE /favorites/:id
    await favoritesStore.eliminarFavorite({
      id,
      onComplete: (response) => {
        notify.show(
          response.data.mensaje || "Juego quitado de favoritos",
          "info"
        );
        favoritesStore.listarFavorites();
      },
      onError: (error) => {
        console.error(error);
        notify.show("Ocurrió un error al quitar de favoritos", "error");
      },
    });
  } else {
    // Agregar a favoritos -> POST /favorites
    await favoritesStore.agregarFavorite({
      idBoardgame: id,
      onComplete: (response) => {
        notify.show(
          response.data.mensaje || "Juego agregado a favoritos",
          "success"
        );
        favoritesStore.listarFavorites();
      },
      onError: (error) => {
        console.error(error);
        notify.show("Ocurrió un error al agregar a favoritos", "error");
      },
    });
  }
};
</script>
