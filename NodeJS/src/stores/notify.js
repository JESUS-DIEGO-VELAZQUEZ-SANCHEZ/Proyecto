/* Esta clase es reutilizada del proyecto visto en clase */
import { defineStore } from "pinia";
import { ref } from "vue";

export const useNotifyStore = defineStore("notify", () => {
  const toast = ref(null);
  let timeoutId = null;

  const show = (message, color = "success") => {
  
    if (timeoutId) clearTimeout(timeoutId);

  
    toast.value = {
      message,
      color,
      id: Date.now(),
    };

   
    timeoutId = setTimeout(() => {
      toast.value = null;
    }, 3000);
  };

  const hide = () => {
    toast.value = null;
    if (timeoutId) clearTimeout(timeoutId);
  };

  return {
    toast,
    show,
    hide,
  };
});
