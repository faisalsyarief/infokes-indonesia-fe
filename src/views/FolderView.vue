<script setup lang="ts">
import { onMounted } from "vue";
import FolderTree from "../components/FolderTree.vue";
import FolderView from "../components/FolderView.vue";
import { useExplorerStore } from "../stores/counter";

const store = useExplorerStore();

onMounted(() => {
  store.fetchFolders();
});
</script>

<template>
  <div class="flex h-screen bg-gray-200">
    <div class="w-64 bg-gray-100 p-4 h-screen overflow-auto">
      <input v-model="store.searchQuery" placeholder="Cari folder..." class="w-full p-2 border rounded mb-2" />
      <FolderTree :folders="store.filteredFolders" />
    </div>
    <FolderView :folders="store.filteredFolders" />
  </div>
</template>
