<script setup lang="ts">
import {inject, onMounted, ref} from "vue";
import OfficeButton from "@/components/OfficeButton.vue";

const dialogRef = inject<any>('dialogRef');

const firstName = ref<string>("");
const lastName = ref<string>("");
const address = ref<string>("");
const nip = ref<string>("");
const phone = ref<string>("");
const phone2 = ref<string>("");
const mail = ref<string>("");

onMounted(() => {
  console.log('BasicInfoDialog MOUNTED');

  firstName.value = dialogRef.value.data.firstName;
  lastName.value = dialogRef.value.data.lastName;
  address.value = dialogRef.value.data.address;
  nip.value = dialogRef.value.data.nip;
  phone.value = dialogRef.value.data.phone;
  phone2.value = dialogRef.value.data.phone2;
  mail.value = dialogRef.value.data.mail;
})
const closeDialog = () => {
  dialogRef.value.close();
};
</script>

<template>
  <div class="card">
      <div class="flex flex-col  gap-4 mb-4">
        <p class="m-0 ">Imię:<span class="ml-2 font-bold"> {{ firstName }}</span></p>
        <p class="m-0 left-side">Nazwisko/Nazwa:<span class="ml-2 font-bold"> {{ lastName }}</span></p>
        <p class="m-0 left-side">Adres:<span class="ml-2 font-bold"> {{ address }}</span></p>
        <p v-if="nip && nip.trim().length > 0" class="m-0 left-side">NIP:<span class="ml-2 font-bold"> {{ nip }}</span></p>
        <p class="m-0 left-side">Telefon::<span class="ml-2 font-bold"> {{ phone }}</span></p>
        <p v-if="phone2 && phone2.trim().length > 0" class="m-0 left-side">Telefon_2::<span class="ml-2 font-bold"> {{ phone2 }}</span></p>
        <p class="m-0 left-side">E-mail:<span class="ml-2 font-bold"> {{ mail }}</span></p>
      </div>

      <div class="flex justify-end">
        <OfficeButton text="OK" btn-type="office-regular" @click="closeDialog"/>
      </div>
  </div>
</template>

<style scoped>

</style>