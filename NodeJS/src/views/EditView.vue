<template>
  <v-container class="mt-6" max-width="600px">
    <v-card>
      <v-card-title class="text-h6">Editar Persona</v-card-title>

      <v-card-text>
        <v-form ref="formRef" @submit.prevent>
          <v-text-field
            label="Nombre"
            v-model="form.nombre"
            :rules="[rules.required]" 
          />

          <v-text-field
            label="Dirección"
            v-model="form.direccion"
            :rules="[rules.required]"
          />

          <v-text-field
            label="Teléfono"
            v-model="form.telefono"
            maxlength="10"
            :rules="[rules.required, rules.telefono]"
          />

          <v-btn
            type="submit"
            color="primary"
            class="mt-4"
            :loading="loading"
            @click="guardar"
            block
          >
            Actualizar
          </v-btn>

          <v-btn
            class="mt-2"
            variant="outlined"
            color="grey"
            block
            @click="regresar"
          >
            Cancelar
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePersonasStore } from "@/stores/boardgames";
import { storeToRefs } from "pinia";
import { useNotifyStore } from "@/stores/notify";

const store = usePersonasStore();
const notify = useNotifyStore();

const { loading, persona } = storeToRefs(store);

const route = useRoute();
const router = useRouter();

const formRef = ref(null);

const form = reactive({
  nombre: "",
  direccion: "",
  telefono: "",
});

const rules = {
  required: (v) => !!v || "Campo obligatorio",
  telefono: (v) => v.length === 10 || "Debe tener 10 dígitos",
};

onMounted(() => {
  store.obtenerPersona({
    id: route.params.id,
    onComplete: (res) => {
        const data = res.data.data[0];
      form.nombre = data.nombre || "";
      form.direccion = data.direccion || "";
      form.telefono = data.telefono || "";
    },
    onError: () => {
      notify.show("No se pudo cargar la persona", "error");
      regresar();
    },
  });
});

const guardar = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  store.editarPersona({
    id: route.params.id,
    datos: form,
    onComplete: (res) => {
      notify.show(res.data.mensaje, "success");
      regresar();
    },
    onError: (err) => {
      notify.show(err.response?.data?.message, "error");
    },
  });
};

const regresar = () => router.push("/");
</script>
