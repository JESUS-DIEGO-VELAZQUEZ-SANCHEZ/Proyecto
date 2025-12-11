<template>
  <v-container class="mt-4 py-6">
    <h1>Detalle del juego de mesa</h1>

    <!-- Botón Regresar -->
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

        <!-- Card que muestra los datos del juego -->
        <v-card v-if="!loading && boardgame" class="elevation-2">

          <!-- Encabezado del card con nombre y publisher -->
          <v-card-title class="py-4 d-flex align-start">
            <div class="d-flex flex-column flex-grow-1">
              <!-- Nombre del juego -->
              <span class="text-h5 font-weight-bold text-wrap">
                {{ boardgame.Name }}
              </span>
              <!-- Publisher -->
              <span class="text-subtitle-2 text-grey-darken-1 mt-1">
                {{ boardgame.Publisher }}
              </span>
            </div>

            <!-- Botón que abre el modal de editar -->
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

          <!-- Chip del año -->
          <v-card-text class="pb-0">
            <v-chip
              v-if="boardgame.Year"
              color="primary"
              variant="tonal"
              label
              size="small"
            >
              Año {{ boardgame.Year }}
            </v-chip>
          </v-card-text>

          <v-divider class="mt-4" />

          <!-- Cuerpo con todos los datos del juego -->
          <v-card-text class="pt-4">
            <v-row>

              <!-- Publisher -->
              <v-col cols="12" sm="6">
                <div class="text-caption font-weight-bold text-primary">
                  PUBLISHER
                </div>
                <div class="text-body-1">
                  {{ boardgame.Publisher }}
                </div>
              </v-col>

              <!-- Category -->
              <v-col cols="12" sm="6">
                <div class="text-caption font-weight-bold text-primary">
                  CATEGORY
                </div>
                <v-chip class="mt-1" color="secondary" variant="tonal" label>
                  {{ categoryLabel(boardgame.Category) }}
                </v-chip>
              </v-col>

              <!-- Año -->
              <v-col cols="12" sm="6">
                <div class="text-caption font-weight-bold text-primary">
                  YEAR
                </div>
                <div class="text-body-1">
                  {{ boardgame.Year || "Sin especificar" }}
                </div>
              </v-col>

              <!-- ID -->
              <v-col cols="12" sm="6">
                <div class="text-caption font-weight-bold text-primary">
                  ID
                </div>
                <div class="text-body-1">
                  {{ boardgame.ID }}
                </div>
              </v-col>

              <!-- Description -->
              <v-col cols="12">
                <v-divider class="my-4" />
                <div class="text-caption font-weight-bold text-primary mb-2">
                  DESCRIPTION
                </div>
                <p class="text-body-1 text-justify mb-0">
                  {{
                    boardgame.Description ||
                    "No hay descripción disponible."
                  }}
                </p>
              </v-col>

            </v-row>
          </v-card-text>
        </v-card>

        <!-- Loader mientras carga la información -->
        <div v-else class="d-flex justify-center mt-10">
          <v-progress-circular indeterminate color="primary" />
        </div>

      </v-col>
    </v-row>

    <!-- Modal para editar -->
    <v-dialog v-model="dialogEditar" max-width="600px" persistent>
      <v-card>

        <!-- Encabezado -->
        <v-card-title class="bg-primary text-white">
          Editar Juego de Mesa
        </v-card-title>

        <v-card-text class="pt-4">
          <!-- Formulario -->
          <v-form
            ref="formRef"
            v-model="esValido"
            @submit.prevent="guardarCambios"
          >
            <v-row dense>

              <!-- ID (solo lectura) -->
              <v-col cols="12" sm="4">
                <v-text-field
                  v-model="formulario.ID"
                  label="ID"
                  disabled
                  variant="filled"
                />
              </v-col>

              <!-- Name (solo lectura) -->
              <v-col cols="12" sm="8">
                <v-text-field
                  v-model="formulario.Name"
                  label="Name"
                  disabled
                  variant="filled"
                  hint="El nombre no es editable"
                  persistent-hint
                />
              </v-col>

              <v-col cols="12">
                <v-divider class="my-3" />
              </v-col>

              <!-- Publisher -->
              <v-col cols="12">
                <v-text-field
                  v-model="formulario.Publisher"
                  label="Publisher *"
                  :rules="reglas.publisher"
                  counter="60"
                  variant="outlined"
                />
              </v-col>

              <!-- Category -->
              <v-col cols="12" sm="6">
                <v-select
                  v-model="formulario.Category"
                  :items="listaCategorias"
                  item-title="label"
                  item-value="value"
                  label="Category *"
                  :rules="reglas.category"
                  variant="outlined"
                />
              </v-col>

              <!-- Year -->
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formulario.Year"
                  label="Year"
                  type="number"
                  :rules="reglas.year"
                  counter="4"
                  variant="outlined"
                />
              </v-col>

              <!-- Description -->
              <v-col cols="12">
                <v-textarea
                  v-model="formulario.Description"
                  label="Description"
                  :rules="reglas.description"
                  counter="200"
                  variant="outlined"
                  rows="3"
                />
              </v-col>

            </v-row>
          </v-form>
        </v-card-text>

        <!-- Botones del modal -->
        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>

          <!-- Cancelar -->
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="dialogEditar = false"
          >
            Cancelar
          </v-btn>

          <!-- Guardar -->
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

/* Estado del modal */
const dialogEditar = ref(false);
const guardando = ref(false);
const esValido = ref(false);
const formRef = ref(null);

/* Objeto formulario local */
const formulario = ref({
  ID: "",
  Name: "",
  Publisher: "",
  Category: "",
  Year: "",
  Description: "",
});

/* Listado de categorías */
const listaCategorias = [
  { label: "Adventure", value: "11" },
  { label: "Puzzle", value: "12" },
  { label: "Strategy", value: "13" },
  { label: "Fantasy", value: "14" },
  { label: "Civilization", value: "15" },
];

/* Validaciones */
const reglas = {
  publisher: [
    (v) => !!v || "El Publisher es obligatorio",
    (v) => (!v || v.length <= 60) || "Máximo 60 caracteres",
  ],
  category: [(v) => !!v || "La categoría es obligatoria"],
  year: [
    // Explicación de la regla:
    // 1. !v  -> Si está vacío, pasa (es opcional).
    // 2. /^\d{4}$/.test(v) -> Verifica que sean números (\d) y exactamente 4 ({4}).
    v => !v || /^\d{4}$/.test(v) || "El año debe ser un número de 4 dígitos"
  ],
  description: [
    (v) => !v || v.length <= 200 || "Máximo 200 caracteres",
  ],
};

/* Función para abrir el modal y copiar los datos*/
const abrirModalEditar = () => {
  if (boardgame.value) {
    // Copiamos los datos actuales al formulario para no mutar el store directo
    formulario.value = {
      ID: boardgame.value.ID,
      Name: boardgame.value.Name,
      Publisher: boardgame.value.Publisher || "",
      Category:
        boardgame.value.Category !== null &&
        boardgame.value.Category !== undefined
          ? String(boardgame.value.Category)
          : "",
      Year:
        boardgame.value.Year !== null &&
        boardgame.value.Year !== undefined
          ? String(boardgame.value.Year)
          : "",
      Description: boardgame.value.Description || "",
    };

    dialogEditar.value = true;
  }
};

/* Guardar Cambios (PUT /boardgame/:id) */
const guardarCambios = async () => {
  if (!formRef.value) return;
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  guardando.value = true;

  // Datos limpios para enviar
  const datosEnviar = {
    Publisher: formulario.value.Publisher.trim(),
    Category: String(formulario.value.Category),
    Year: formulario.value.Year ? String(formulario.value.Year) : null,
    Description: formulario.value.Description ? formulario.value.Description.trim() : "",
  };

  await boardgamesStore.editarBoardgame({
    id: formulario.value.ID,
    datos: datosEnviar,
    onComplete: (res) => {
      const msg = res.data?.mensaje || "Juego de mesa actualizado con éxito";
      notify.show(msg, "success");
      boardgamesStore.obtenerBoardgame({ 
        id: formulario.value.ID,
        onComplete: () => {
           guardando.value = false;
           dialogEditar.value = false;
        }
      });
    },
    onError: (error) => {
      console.error(error);
      const msg = error.response?.data?.mensaje || "Error al actualizar";
      notify.show(msg, "error");
      guardando.value = false;
    },
  });
};

/* Converitr la clave de la categoría a el nombre de la categoría */
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

/* Cargar datos*/
onMounted(() => {
  const id = route.params.id;

  boardgamesStore.obtenerBoardgame({
    id,
    onComplete: () => {
      // Si viene con ?edit=true en la URL, abrimos el modal directo
      if (route.query.edit === "true") {
        abrirModalEditar();
      }
    },
    onError: (err) => {
      console.error("Error al cargar juego", err);
      notify.show("No se pudo cargar el juego solicitado", "error");
    },
  });
});
</script>
