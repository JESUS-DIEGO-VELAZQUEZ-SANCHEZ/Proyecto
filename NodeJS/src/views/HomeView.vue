<template>
  <v-container class="mt-4 py-6">
    <h1>Personas</h1>
    <v-row>
      <v-col cols="12" class="d-flex justify-end mb-4">
        <v-btn color="primary" variant="flat" @click="router.push('/agregar')">
          Agregar Persona
        </v-btn>
      </v-col>

      <v-col cols="12">
        <Table
          :data="personas"
          :headers="headers"
          :loading="loading"
          @editar="irEditar"
          @eliminar="abrirModalEliminar"
        >
        </Table>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogEliminar" max-width="420">
      <v-card>
        <v-card-title class="text-h6">¿Eliminar persona?</v-card-title>
        <v-card-text> Esta acción no se puede deshacer. </v-card-text>
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Table from "@/components/Table.vue";
import { usePersonasStore } from "@/stores/boardgames";
import { storeToRefs } from "pinia";
import { useNotifyStore } from "@/stores/notify";
const notify = useNotifyStore();

const router = useRouter();
const store = usePersonasStore();

const { personas, loading } = storeToRefs(store);

const dialogEliminar = ref(false);
const idEliminar = ref(null);

const headers = [
  { title: "ID", key: "id" },
  { title: "Nombre", key: "nombre" },
  { title: "Dirección", key: "direccion" },
  { title: "Teléfono", key: "telefono" },
  { title: "Acciones", key: "acciones", sortable: false },
];


onMounted(() => {
  store.listarPersonas();
});


const irEditar = (id) => {
  router.push(`/editar/${id}`);
};

const abrirModalEliminar = (id) => {
  idEliminar.value = id;
  dialogEliminar.value = true;
};

const confirmarEliminar = async () => {
  await store.eliminarPersona({
    id: idEliminar.value,
    onComplete: (response) => {
      console.log(response);
      notify.show(response.data.mensaje, "success");
      setTimeout(() => store.listarPersonas(), 1000);
    },
  });
  dialogEliminar.value = false;
};
</script>
