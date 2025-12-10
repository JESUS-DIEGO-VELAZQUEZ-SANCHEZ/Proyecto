<!-- Usaremos la misma tabla del ejemplo visto en clase (genérica) -->
<template>
  <!-- La tabla va ir dentro de una card -->
  <v-card>
    <!-- Título de la tabla -->
    <v-card-title class="text-h6">
      {{ title }}
    </v-card-title>

    <!-- Tabla de datos -->
    <!-- ":header son las columnas"-->
    <!-- ":items son los datos"-->
    <!-- "class" es para darle sombra -->
    <!-- ":loading" muestra un algo mientras carga -->
    <!-- "loading-text" es el texto que se muestra mientras carga -->
    <v-data-table
      :headers="headers"
      :items="data"
      class="elevation-1"
      :loading="loading"
      loading-text="Cargando información..."
    >
          <!-- Mensaje cuando no hay datos -->
          <template #no-data>
            <div class="text-center py-4 text-grey">
              No hay registros disponibles
            </div>
          </template>

      <!-- Personaliza la celda de la columna acciones -->
      <template #item.acciones="{ item }">
        <!-- Botón de editar -->
        <v-btn
          size="small"
          variant="outlined"
          color="primary"
          @click="$emit('editar', item.id)"
        >
          Editar
        </v-btn>

        <!-- Botón de eliminar -->
        <v-btn
          size="small"
          variant="outlined"
          color="red"
          class="ml-2"
          @click="$emit('eliminar', item.id)"
        >
          Eliminar
        </v-btn>
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
const props = defineProps({
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
