<template>
  <router-view />

  <div class="toast-container">
    <v-alert
      v-if="toast"
      :type="toast.color"
      border="start"
      elevation="2"
      class="mb-2"
    >
      {{ toast.message }}
    </v-alert>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useNotifyStore } from "@/stores/notify";

const notify = useNotifyStore();
const { toast } = storeToRefs(notify);
</script>

<style>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 280px;
  z-index: 9999;
}
</style>
