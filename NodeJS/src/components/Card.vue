<template>
  <v-card class="pa-4 d-flex justify-space-between align-start">
    <!-- Lado izquierdo-->
    <div>
        <!-- Recorremos el arreglo fields y le agregamos un key a cada propiedad -->
      <div
        v-for="campo in fields"
        :key="campo.value"
        class="mb-2"
      >
        <!-- Por cada elemento, mostramos el nombre de la propiedad -->
        <div class="text-caption font-weight-bold">
          {{ campo.label.toUpperCase() }}:
        </div>
        <!-- Por cada elemento, mostramos el valor de la propiedad -->
        <div class="text-body-1">
          {{ item[campo.value] }}
        </div>
      </div>
    </div>

    <!-- Lado derecho -->
    <div class="d-flex flex-column align-end">
      <!-- Para la esquina superior derecha -->
      <!-- Botón para agregar y quitar de favoritos -->
      <v-btn
        icon
        variant="text"
        :color="isFavorite ? 'red' : undefined"
        @click="$emit('toggle-favorite', item.id)"
      >
        <v-icon>
          {{ isFavorite ? 'mdi-heart' : 'mdi-heart-outline' }}
        </v-icon>
      </v-btn>

      <!-- Para la esquina inferior derecha -->
      <div class="mt-4 d-flex flex-column align-end">
        <!-- Botón para ir detalle -->
        <v-btn
          icon
          variant="text"
          @click="$emit('detalle', item.id)"
        >
          <v-icon>mdi-eye</v-icon>
        </v-btn>
        <!-- Botón para ir editar -->
        <v-btn
          icon
          variant="text"
          @click="$emit('editar', item.id)"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <!-- Botón para eliminar -->
        <v-btn
          icon
          variant="text"
          @click="$emit('eliminar', item.id)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script setup>
/*
  Props que recibe el componente Card:
  - item: Objeto con la información del registro a mostrar.
  - fields: Arreglo que define qué campos se mostrarán en la tarjeta.
  - isFavorite: Booleano para indicar si el registro está marcado como favorito.
*/
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },

  fields: {
    type: Array,
    required: true,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
});

</script>
