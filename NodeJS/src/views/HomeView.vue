<template>
  <v-container class="mt-4 py-6">
    <h1>Favoritos</h1>

    <v-row class="mb-4">
      <!-- Botón agregar juego -->
      <v-col cols="12" md="6" class="d-flex align-center mb-2 mb-md-0">
        <v-btn
          color="primary"
          variant="flat"
          @click="router.push('/boardgame')"
        >
          Ver todos los Juegos de mesa
        </v-btn>
      </v-col>

      <!-- Filtro por categoría -->
      <v-col cols="12" md="6">
        <v-select
          v-model="categoriaSeleccionada"
          :items="categorias"
          item-title="label"
          item-value="value"
          label="Filtrar por categoría"
          variant="solo"
          density="comfortable"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <Table
          :data="favoritesFiltrados"
          :headers="headers"
          :loading="loading"
          @editar="irEditar"
          @eliminar="abrirModalEliminar"
        />
      </v-col>
    </v-row>

    <!-- Diálogo eliminar -->
    <v-dialog v-model="dialogEliminar" max-width="420">
      <v-card>
        <v-card-title class="text-h6">¿Quitar de favoritos?</v-card-title>
        <v-card-text>Esta acción no se puede deshacer.</v-card-text>
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
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

import Table from "@/components/Table.vue";
import { useFavoritesStore } from "@/stores/favorites";

const router = useRouter();
const favoritesStore = useFavoritesStore();

// store
const { favorites, loading } = storeToRefs(favoritesStore);

// categoría seleccionada
const categoriaSeleccionada = ref("ALL");

// encabezados
const headers = [
  { title: "ID", key: "IdBoardgame" },
  { title: "Nombre", key: "Name" },
  { title: "Publisher", key: "Publisher" },
  { title: "Category", key: "Category" },
  { title: "Año", key: "Year" },
  { title: "Acciones", key: "acciones", sortable: false },
];

// categorías según la rúbrica
const categorias = [
  { label: "Todas", value: "ALL" },
  { label: "Adventure", value: 11 },
  { label: "Puzzle", value: 12 },
  { label: "Strategy", value: 13 },
  { label: "Fantasy", value: 14 },
  { label: "Civilization", value: 15 },
];

// filtro dinámico
const favoritesFiltrados = computed(() => {
  if (categoriaSeleccionada.value === "ALL") {
    return favorites.value;
  }
  const seleccion = Number(categoriaSeleccionada.value);
  return favorites.value.filter(
    (juego) => Number(juego.Category) === seleccion
  );
});

// cargar datos
onMounted(() => {
  favoritesStore.listarFavorites();
});

</script>
