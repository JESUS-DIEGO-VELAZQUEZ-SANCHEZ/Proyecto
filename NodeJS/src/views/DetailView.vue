<template>
  <v-container class="mt-4 py-6">
    <h1>Detalle del juego de mesa</h1>

    <v-btn
      color="primary"
      variant="flat"
      class="mt-2 mb-4"
      style="font-weight: 600; letter-spacing: 1px;"
      @click="router.back()"
    >
      ← REGRESAR
    </v-btn>

    <v-row justify="center" class="mt-2">
      <v-col cols="12" md="8" lg="6">
        
        <v-card v-if="!loading && boardgame" class="elevation-2">
          
          <v-card-title class="py-4 d-flex align-start">
            <div class="d-flex flex-column flex-grow-1">
              <span class="text-h5 font-weight-bold text-wrap">
                {{ boardgame.Name }}
              </span>
              <span class="text-subtitle-2 text-grey-darken-1 mt-1">
                {{ boardgame.Publisher }}
              </span>
            </div>
            
            <v-btn
              icon
              variant="text"
              color="primary"
              class="ml-2"
              @click="abrirModalEditar"
            >
              <v-icon size="large">mdi-pencil</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text class="pb-0">
             <v-chip v-if="boardgame.Year" color="primary" variant="tonal" label size="small">
                Año {{ boardgame.Year }}
             </v-chip>
          </v-card-text>

          <v-divider class="mt-4" />

          <v-card-text class="pt-4">
            <v-row>
              <v-col cols="12" sm="6">
                <div class="text-caption font-weight-bold text-primary">PUBLISHER</div>
                <div class="text-body-1">{{ boardgame.Publisher }}</div>
              </v-col>

              <v-col cols="12" sm="6">
                <div class="text-caption font-weight-bold text-primary">CATEGORÍA</div>
                <v-chip class="mt-1" color="secondary" variant="tonal" label>
                  {{ categoryLabel(boardgame.Category) }}
                </v-chip>
              </v-col>

              <v-col cols="12" sm="6">
                <div class="text-caption font-weight-bold text-primary">AÑO</div>
                <div class="text-body-1">{{ boardgame.Year || 'Sin especificar' }}</div>
              </v-col>

              <v-col cols="12" sm="6">
                <div class="text-caption font-weight-bold text-primary">ID</div>
                <div class="text-body-1">{{ boardgame.ID }}</div>
              </v-col>

              <v-col cols="12">
                <v-divider class="my-4" />
                <div class="text-caption font-weight-bold text-primary mb-2">DESCRIPCIÓN</div>
                <p class="text-body-1 text-justify mb-0">
                  {{ boardgame.Description || 'No hay descripción disponible.' }}
                </p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <div v-else class="d-flex justify-center mt-10">
          <v-progress-circular indeterminate color="primary" />
        </div>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogEditar" max-width="600px" persistent>
      <v-card>
        <v-card-title class="bg-primary text-white">
          Editar Juego de Mesa
        </v-card-title>
        
        <v-card-text class="pt-4">
          <v-form ref="formRef" v-model="esValido" @submit.prevent="guardarCambios">
            <v-row dense>
              <v-col cols="12" sm="4">
                <v-text-field
                  v-model="formulario.ID"
                  label="ID"
                  disabled
                  variant="filled"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="8">
                <v-text-field
                  v-model="formulario.Name"
                  label="Nombre"
                  disabled
                  variant="filled"
                  hint="El nombre no es editable"
                  persistent-hint
                ></v-text-field>
              </v-col>

              <v-col cols="12"><v-divider class="my-3"></v-divider></v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="formulario.Publisher"
                  label="Publisher *"
                  :rules="reglas.publisher"
                  counter="60"
                  variant="outlined"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="formulario.Category"
                  :items="listaCategorias"
                  item-title="label"
                  item-value="value"
                  label="Categoría *"
                  :rules="reglas.category"
                  variant="outlined"
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formulario.Year"
                  label="Año"
                  type="number"
                  :rules="reglas.year"
                  counter="4"
                  variant="outlined"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="formulario.Description"
                  label="Descripción"
                  :rules="reglas.description"
                  counter="200"
                  variant="outlined"
                  rows="3"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="dialogEditar = false">
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            :loading="guardando"
            :disabled="!esValido"
            @click="guardarCambios"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBoardgamesStore } from "@/stores/boardgames";
import { storeToRefs } from "pinia";
import { useNotifyStore } from "@/stores/notify"; 

const route = useRoute();
const router = useRouter();
const boardgamesStore = useBoardgamesStore();
const notify = useNotifyStore();

const { boardgame, loading } = storeToRefs(boardgamesStore);

// --- ESTADO PARA EL MODAL DE EDICIÓN ---
const dialogEditar = ref(false);
const guardando = ref(false);
const esValido = ref(false);
const formRef = ref(null);

// Objeto formulario local
const formulario = ref({
  ID: "",
  Name: "",
  Publisher: "",
  Category: "",
  Year: "",
  Description: ""
});

// Listado de Categorías
const listaCategorias = [
  { label: "Adventure", value: "11" },
  { label: "Puzzle", value: "12" },
  { label: "Strategy", value: "13" },
  { label: "Fantasy", value: "14" },
  { label: "Civilization", value: "15" },
];

// Reglas de Validación
const reglas = {
  publisher: [
    v => !!v || "El Publisher es obligatorio",
    v => (v && v.length <= 60) || "Máximo 60 caracteres"
  ],
  category: [
    v => !!v || "La categoría es obligatoria"
  ],
  year: [
    v => !v || v.toString().length <= 4 || "Máximo 4 dígitos"
  ],
  description: [
    v => !v || v.length <= 200 || "Máximo 200 caracteres"
  ]
};

// Función para abrir modal y copiar datos
const abrirModalEditar = () => {
  if (boardgame.value) {
    //Copiamos los datos actuales al formulario para no mutar el store directamente
    formulario.value = { ...boardgame.value };
    // Aseguramos que Category sea string para el v-select
    formulario.value.Category = String(formulario.value.Category); 
    dialogEditar.value = true;
  }
};

// Guardar Cambios (PUT)
const guardarCambios = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  guardando.value = true;
  
  // 1. Preparamos los datos con MAYÚSCULAS para coincidir con tu Backend corregido
  const datosEnviar = {
    Publisher: formulario.value.Publisher,
    Category: formulario.value.Category,
    Year: formulario.value.Year,
    Description: formulario.value.Description
  };

  boardgamesStore.editarBoardgame({
    id: formulario.value.ID,
    datos: datosEnviar, 
    onComplete: (res) => {

      if (boardgame.value) {
        Object.assign(boardgame.value, datosEnviar);
      }

      dialogEditar.value = false;
      guardando.value = false;
    },
    onError: (err) => {
      console.error(err);
      guardando.value = false;
    }
  });
};

// --- FIN LÓGICA DE EDICIÓN ---

// Función auxiliar para categorías (vista detalle)
const categoryLabel = (code) => {
  const map = {
    11: "Adventure",
    12: "Puzzle",
    13: "Strategy",
    14: "Fantasy",
    15: "Civilization",
  };
  return map[Number(code)] || "Desconocida";
};

onMounted(() => {
  const id = route.params.id;
  boardgamesStore.obtenerBoardgame({
    id,
    onComplete: (res) => {
      // Datos cargados
    },
    onError: (err) => {
      console.error("Error al cargar juego", err);
    },
  });
});
</script>