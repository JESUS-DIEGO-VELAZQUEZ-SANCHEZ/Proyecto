<template>
  <v-container class="mt-4 py-6">
    <h1>Agregar juego de mesa</h1>

    <v-row class="mt-2 mb-4" align="center">
      <v-col cols="12" md="6">
        <!-- Botón para Regresar  -->
        <v-btn
          color="primary"
          variant="flat"
          style="font-weight: 600; letter-spacing: 1px;"
          @click="router.push('/boardgame')"
        >
          ← REGRESAR A LA LISTA
        </v-btn>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card>
          <v-card-title class="text-h6 bg-primary text-white mb-4">
            Nuevo juego de mesa
          </v-card-title>

          <v-card-text>
            <v-form ref="formRef" v-model="esValido" @submit.prevent="guardar">
              <!-- Name -->
              <v-text-field
                v-model="name"
                label="Name *"
                variant="outlined"
                density="comfortable"
                :rules="reglas.name"
                :maxlength="80"
                counter="80"
              />

              <!-- Publisher -->
              <v-text-field
                v-model="publisher"
                label="Publisher *"
                variant="outlined"
                density="comfortable"
                :rules="reglas.publisher"
                :maxlength="60"
                counter="60"
              />

              <!-- Category -->
              <v-select
                v-model="category"
                :items="categorias"
                item-title="label"
                item-value="value"
                label="Category *"
                variant="outlined"
                density="comfortable"
                :rules="reglas.category"
              />

              <!-- Year -->
              <v-text-field
                v-model="year"
                label="Year"
                variant="outlined"
                density="comfortable"
                type="number"
                :rules="reglas.year"
                :maxlength="4"
                counter="4"
              />
              
              <!-- Description -->
              <v-textarea
                v-model="description"
                label="Description"
                variant="outlined"
                density="comfortable"
                :rules="reglas.description"
                :maxlength="200"
                counter="200"
                rows="3"
              />
            </v-form>
          </v-card-text>

          <v-card-actions class="pa-4 pt-0">
            <v-spacer></v-spacer>

            <!-- Botón Cancelar -->
            <v-btn variant="text" color="grey-darken-1" @click="router.push('/boardgame')">
              Cancelar
            </v-btn>

            <!-- Botón Guardar -->
            <v-btn
              color="primary"
              variant="flat"
              :loading="loading"
              :disabled="!esValido"
              @click="guardar"
            >
              Guardar juego
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useBoardgamesStore } from "@/stores/boardgames";
import { useNotifyStore } from "@/stores/notify";

const router = useRouter();
const boardgamesStore = useBoardgamesStore();
const notify = useNotifyStore();
const { loading } = storeToRefs(boardgamesStore);

/* Variables de control para el formulario */
const formRef = ref(null);
const esValido = ref(false);

/* Campos del formulario */
const name = ref("");
const publisher = ref("");
const description = ref("");
const category = ref(null);
const year = ref("");

/* Convertir del nombre de la categoría a la clave de la categoría */
const categorias = [
  { label: "Adventure", value: "11" },
  { label: "Puzzle", value: "12" },
  { label: "Strategy", value: "13" },
  { label: "Fantasy", value: "14" },
  { label: "Civilization", value: "15" },
];

/* Validaciones */
const reglas = {
  name: [
    v => !!v || "El nombre es obligatorio",
    v => (v && v.length <= 80) || "El nombre no debe superar 80 caracteres"
  ],
  publisher: [
    v => !!v || "El publisher es obligatorio",
    v => (v && v.length <= 60) || "El publisher no debe superar 60 caracteres"
  ],
  category: [
    v => !!v || "La categoría es obligatoria"
  ],
  year: [
    // Explicación de la regla:
    // 1. !v  -> Si está vacío, pasa (es opcional).
    // 2. /^\d{4}$/.test(v) -> Verifica que sean números (\d) y exactamente 4 ({4}).
    v => !v || /^\d{4}$/.test(v) || "El año debe ser un número de 4 dígitos"
  ],
  description: [
    v => !v || v.length <= 200 || "La descripción no debe superar 200 caracteres"
  ]
};

/* Guardar juego (POST /boardgame) */
const guardar = async () => {
  // Verificamos si el formulario cumple todas las reglas
  const { valid } = await formRef.value.validate();
  if (!valid) {
    notify.show("Por favor revisa los campos marcados en rojo", "error");
    return;
  }

  // Preparar los datos que se van a mandar
    const datos = {
    Name: name.value.trim(),
    Publisher: publisher.value.trim(),
    Description: description.value ? description.value.trim() : "",
    Category: String(category.value), 
    Year: year.value ? String(year.value) : null,
  };

  await boardgamesStore.agregarBoardgame({
    datos,
    onComplete: (response) => {
      const msg = response.data?.mensaje || "Boardgame creado con éxito";
      notify.show(msg, "success");
      router.push("/boardgame");
    },
    onError: (error) => {
      console.error(error);
      const msg = error.response?.data?.mensaje || "Ocurrió un error al agregar el juego";
      notify.show(msg, "error");
    },
  });
};
</script>