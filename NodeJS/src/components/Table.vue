<!-- Usaremos la misma tabla del ejemplo visto en clase (genérica) -->
<template>
  <!-- La tabla va ir dentro de una card -->
  <v-card>
    <!-- Título de la tabla -->
    <v-card-title class="text-h6">
      {{ title }}
    </v-card-title>

    <!-- Tabla de datos -->
    <v-data-table
      :headers="headers"
      :items="data"
      class="elevation-1"
      :loading="loading"
      loading-text="Cargando información..."
    >
      <!-- Celda personalizada para Category -->
      <template #item.Category="{ item }">
        <span class="category-chip" :class="`cat-${item.Category}`">
          {{ categoryLabel(item.Category) }}
        </span>
      </template>

      <!-- Mensaje cuando no hay datos -->
      <template #no-data>
        <div class="text-center py-4 text-grey">
          No hay registros disponibles
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
/*
  Props que recibe el componente:
  - data: Arreglo con los registros a mostrar
  - headers: Columnas de la tabla
  - loading: Booleano para indicar si está cargando
  - title: Título mostrado en la parte superior
*/

/* Para convertir de la clave de la categoría al nombre de la categoría */
const categoryLabel = (code) => {
  const map = {
    11: "Adventure",
    12: "Puzzle",
    13: "Strategy",
    14: "Fantasy",
    15: "Civilization",
  };
  return map[code] || code;
};

defineProps({
  data: {
    type: Array,
    required: true,
  },
  headers: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "Listado",
  },
});
</script>

<style scoped>
.category-chip {
  padding: 4px 10px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
}

/* 11 Adventure */
.cat-11 {
  background-color: #e3f2fd;
  color: #0d47a1;
}

/* 12 Puzzle */
.cat-12 {
  background-color: #e8f5e9;
  color: #1b5e20;
}

/* 13 Strategy */
.cat-13 {
  background-color: #fffde7;
  color: #f57f17;
}

/* 14 Fantasy */
.cat-14 {
  background-color: #f3e5f5;
  color: #6a1b9a;
}

/* 15 Civilization */
.cat-15 {
  background-color: #fff3e0;
  color: #e65100;
}
</style>
