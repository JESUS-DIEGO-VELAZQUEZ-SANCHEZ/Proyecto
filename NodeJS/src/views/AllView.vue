<template>
  <v-container class="mt-4 py-6">
    <h1>Juegos de mesa</h1>

    <!-- Botón Regresar -->
    <v-row class="mt-2 mb-4" align="center">
      <v-col cols="12" md="6">
        <v-btn
          color="primary"
          variant="flat"
          @click="router.push('/')"
          style="font-weight: 600; letter-spacing: 1px;"
        >
          ← REGRESAR A HOME
        </v-btn>
      </v-col>

      <!-- Botón Agregar -->
      <v-col cols="12" md="6" class="d-flex justify-end">
        <v-btn
          color="primary"
          variant="flat"
          @click="router.push('/addBoardgame')"
          style="font-weight: 600; letter-spacing: 1px;"
        >
          AGREGAR BOARDGAME
        </v-btn>
      </v-col>
    </v-row>

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
          @editar="irEditar(juego.id)"
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

const { boardgames, loading } = storeToRefs(boardgamesStore);
const { favorites } = storeToRefs(favoritesStore);

/* Dialogo de eliminar */
const dialogEliminar = ref(false);
const idEliminar = ref(null); // id del boardgame a eliminar

/* Campos que muestra cada Card, al igual que su valor*/
const fields = [
  { label: "Name", value: "Name" },
  { label: "Publisher", value: "Publisher" },
  { label: "Year", value: "Year" },
];

/* Preparamos el ID */
const boardgamesConCategoria = computed(() =>
  boardgames.value.map((juego) => ({
    ...juego,
    id: juego.ID || juego.id, 
  }))
);

/* Asegurarnos que los IDs sean números */
const idsFavoritos = computed(() =>
  favorites.value.map((fav) => Number(fav.IdBoardgame))
);

/* Verificar si es favorito */
const esFavorito = (IdBoardgame) =>
  idsFavoritos.value.includes(Number(IdBoardgame));

/* Cargar datos */
onMounted(() => {
  boardgamesStore.listarBoardgames(); // GET /boardgame
  favoritesStore.listarFavorites();   // GET /favorites (para saber qué está marcado)
});

/* Ir a editar */
const irEditar = (id) => {
  router.push(`/boardgame/${id}?edit=true`);
};

/* Ir a detalle */
const irDetalle = (id) => {
  router.push(`/boardgame/${id}`);
};

/* Modal para eliminar un juego */
const abrirModalEliminar = (id) => {
  idEliminar.value = id;
  dialogEliminar.value = true;
};

/* Confirmar la eliminación */
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

/* Para que cuando se le pique al corazón se agregue o se quite de Favorites */
const toggleFavorite = async (IdBoardgame) => {
  // Buscar si este juego ya está en Favorites
  const favorito = favorites.value.find(
    (fav) => fav.IdBoardgame === IdBoardgame
  );

  if (favorito) {
    // Si es favorito, se quita
    await favoritesStore.eliminarFavorite({
      id: favorito.ID, // ID de la tabla Favorites
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
    // Si no es favorito, se agrega
    await favoritesStore.agregarFavorite({
      IdBoardgame,
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

