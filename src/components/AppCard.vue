<template>
  <Card class="custom-card"  >
    <template #header>
      <h3 class="mb-0 text-center color-yellow header">
        {{ textTitle }}
      </h3>
    </template>

    <template #content>
      <p class="text-center color-yellow">{{ textContent }}</p>
    </template>

    <template #footer>
      <div class="card-footer">
        <OfficeButton
          class="w-full mb-2"
          btn-type="office-regular"
          text="wejście"
          type="button"
          :btn-disabled="disabled"
          @click="clicked"
        />
      </div>
    </template>
  </Card>
</template>
<script setup lang="ts">
import OfficeButton from "../components/OfficeButton.vue";
// const emit = defineEmits(['clicked'])
const emit = defineEmits<{
  (e: "clicked"): void;
}>();

defineProps({
  textTitle: {
    type: String,
    required: true,
  },
  textContent: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: true
  },
});
function clicked() {
  console.log("clicked");
  emit("clicked");
}
</script>

<style scoped>
.card-footer {
  display: flex;
  justify-content: center;
}
.custom-card {
  width: 270px;
  background-color: #1a1a1a; /* Wybierz swój kolor */
  border: 2px solid rgba(255, 245, 0, 1)
}
.header{
  font-weight: bolder;
  letter-spacing: 1.2px;
  background-color: rgba(255, 245, 0, .1)

}
</style>
