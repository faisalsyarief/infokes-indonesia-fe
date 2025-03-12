
<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useExplorerStore } from "../stores/counter";

const store = useExplorerStore();
const newFolderName = ref("");
const newFileName = ref("");

watchEffect(() => {
  if (store.selectedFolderId !== null) {
    store.fetchFiles(store.selectedFolderId);
  }
});
</script>

<template>
  <div class="flex-1 p-4 bg-white">
    <h2 class="font-bold text-lg mb-2">Isi Folder</h2>

    <div v-if="store.selectedFolderId !== null">
      <div class="mb-2 flex items-center">
        <input v-model="newFolderName" placeholder="Nama Folder" class="border p-1 mr-2" />
        <button @click="store.addFolder(newFolderName)" class="bg-blue-500 text-white px-2 py-1">
          + Folder
        </button>
      </div>

      <div class="mt-4 flex items-center">
        <input v-model="newFileName" placeholder="Nama File" class="border p-1 mr-2" />
        <button @click="store.addFile(newFileName)" class="bg-green-500 text-white px-2 py-1">
          + File
        </button>
      </div>

      <ul>
        <li v-for="file in store.files" :key="file.id" class="flex justify-between items-center">

          <img alt="Folder" class="logo" src="@/assets/file.png" width="25" height="25" /> {{ file.name }}
          <button @click="store.deleteFile(file.id)" class="text-red-500">🗑</button>
        </li>
      </ul>
    </div>

    <p v-else>Pilih folder dari panel kiri.</p>
  </div>
</template>
