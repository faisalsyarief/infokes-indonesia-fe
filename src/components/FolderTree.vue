<script setup lang="ts">
import { onMounted } from "vue";
import { useExplorerStore } from "../stores/counter";

interface Folder {
  id: number;
  name: string;
  parent_id?: number | null;
}

const props = defineProps<{ folders: Folder[] }>();
const store = useExplorerStore();

onMounted(() => {
  store.fetchFolders();
});
</script>

<template>
  <div class="w-64 bg-gray-100 p-4 h-screen overflow-auto">
    <h2 class="font-bold text-lg mb-2">Folder Struktur</h2>
    <ul>
      <li v-for="folder in store.folders" :key="folder.id">
        <div class="flex items-center">
          <button @click="store.toggleFolder(folder.id)" class="mr-2">
            <img alt="Folder" class="logo"
              :src="store.openFolderId === folder.id ? '/src/assets/folders-3.png' : '/src/assets/folders-1.png'"
              width="25" height="25" />
          </button>

          <span class="cursor-pointer" @click="store.toggleFolder(folder.id)">
            {{ folder.name }}
          </span>
        </div>
        <transition-group name="fade">
          <ul v-if="store.openFolderId === folder.id" class="ml-6">
            <li v-for="subFolder in store.subFolders" :key="subFolder.id">
              <button @click="store.toggleFile(subFolder.id)" class="mr-2">
                <img alt="Folder" class="logo" src="@/assets/folders-2.png" width="25" height="25" />
              </button>
              <span class="cursor-pointer" @click="store.toggleFile(subFolder.id)">
                {{ subFolder.name }} || {{ subFolder.id }}
              </span>

              <button @click="store.deleteFolder(subFolder.id)" class="text-red-500">🗑</button>
            </li>
          </ul>
        </transition-group>

      </li>
    </ul>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
