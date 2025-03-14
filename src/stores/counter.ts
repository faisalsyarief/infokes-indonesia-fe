import { defineStore } from "pinia";
import { ref, computed } from "vue";

import axios from "axios";

interface Folder {
  id: number;
  name: string;
  parent_id: number | null;
}

interface File {
  id: number;
  name: string;
  folder_id?: number | null;
}

export const useExplorerStore = defineStore("explorer", () => {
  // const folders = ref([]);
  const folders = ref<Folder[]>([]);
  // const subFolders = ref([]);
  const subFolders = ref<Folder[]>([]);
  // const files = ref([]);
  const files = ref<File[]>([]);

  const selectedFolderId = ref<number | null>(null);
  const openFolderId = ref<number | null>(null);
  const openFileId = ref<number | null>(null);
  const searchQuery = ref("");
  const errorMessage = ref("");
  const newFolderName = ref("");

  const folderCache = new Map();
  const fileCache = new Map();

  const API_BASE = "http://localhost:3000";

  const api = {
    async get(url: string) {
      try {
        const response = await axios.get(`${API_BASE}${url}`);
        if (response.data.rc === "00") {
          // console.log(response.data.data);
          return response.data.data;
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    async post(url: string, data: object) {
      try {
        await axios.post(`${API_BASE}${url}`, data);
      } catch (error) {
        console.error(error);
      }
    },
    async delete(url: string) {
      try {
        await axios.delete(`${API_BASE}${url}`);
      } catch (error) {
        console.error(error);
      }
    },
  };

  const fetchFolders = async () => {
    try {
      folders.value = await api.get("/getParentFolders");
    } catch (error) {
      console.error("error get folder", error);
      folders.value = [];
    }
  };

  const fetchSubFolders = async (folderId: number) => {
    if (folderCache.has(folderId)) {
      subFolders.value = folderCache.get(folderId);
      return;
    }

    if (selectedFolderId.value === folderId) {
      selectedFolderId.value = null;
      subFolders.value = [];
      return;
    }
    selectedFolderId.value = folderId;

    const response = await api.get(`/folders/subfolders/${folderId}`);
    if (Array.isArray(response) && response.length === 0) {
      const responseFile = await api.get(`/foldersFiles/${folderId}`);
      if (Array.isArray(responseFile) && responseFile.length === 0) {
        console.warn(`Tidak ada subfolder untuk folder ID ${folderId}`);
        subFolders.value = [{ id: -1, name: "(Tidak ada subfile)", parent_id: folderId }];
      } else {
        subFolders.value = responseFile.data.map((file: File) => ({
          id: -1,
          name: file.name,
          parent_id: file.folder_id
        }));;
      }
    } else {
      subFolders.value = response;
    }

    folderCache.set(folderId, subFolders.value);
  };

  const toggleFolder = (folderId: number) => {
    if (openFolderId.value === folderId) {
      openFolderId.value = null;
    } else {
      openFolderId.value = folderId;
      fetchSubFolders(folderId);
    }
  };

  const fetchSubFoldersFiles = async (fileId: number) => {
    if (folderCache.has(fileId)) {
      files.value = folderCache.get(fileId);
      return;
    }

    if (selectedFolderId.value === fileId) {
      selectedFolderId.value = null;
      files.value = [];
      return;
    }
    selectedFolderId.value = fileId;

    const response = await api.get(`/foldersFiles/${fileId}`);
    if (Array.isArray(response) && response.length === 0) {
      console.warn(`Tidak ada subfile untuk folder ID ${fileId}`);
      files.value = [{ id: -1, name: "(Tidak ada subfile)", folder_id: fileId }];
    } else {
      files.value = response;
    }

    folderCache.set(fileId, files.value);
  };

  const toggleFile = (fileId: number) => {
    if (openFileId.value === fileId) {
      openFileId.value = null;
    } else {
      openFileId.value = fileId;
      fetchSubFoldersFiles(fileId);
    }
  };

  const addFolder = async (folderName: string) => {
    if (!folderName.trim() || selectedFolderId.value === null) return;
    await api.post("/folders", { name: folderName, parent_id: selectedFolderId.value });
    reloadPage();
  };

  const deleteFolder = async (folderId: number) => {
    if (!folderId) return;
    const response = await api.delete(`/folders/${folderId}`);

    try {
      if (Array.isArray(response) && response.length === 0) {
        console.warn(`Tidak ada subfile untuk folder ID ${folderId}`);
      }
      if (selectedFolderId.value === folderId) {
        selectedFolderId.value = null;
        subFolders.value = [];
      } else {
        reloadPage();
        await fetchSubFolders(selectedFolderId.value!);
      }
    } catch (error) {
      console.error(`Gagal menghapus folder ID ${folderId}:`, error);
    }
  };

  const deleteFile = async (fileId: number) => {
    if (!fileId) return;
    await api.delete(`/files/${fileId}`);
    reloadPage();
    await fetchSubFolders(selectedFolderId.value!);
  };

  const addFile = async (fileName: string) => {
    if (!fileName.trim() || selectedFolderId.value === null) return;
    await api.post("/files", {
      name: fileName,
      folder_id: selectedFolderId.value,
      file_type: "txt",
      size: 1024,
    });
    reloadPage();
    await fetchFiles(selectedFolderId.value);
  };

  const fetchFiles = async (folderId: number) => {
    if (fileCache.has(folderId)) {
      files.value = fileCache.get(folderId);
      return;
    }

    if (selectedFolderId.value === folderId) {
      files.value = [];
      return;
    }
    selectedFolderId.value = folderId;
    files.value = await api.get(`/foldersFiles/${folderId}`);
    fileCache.set(folderId, files.value);
  };

  const filteredFolders = computed(() => {
    if (!searchQuery.value) return folders.value;
    return folders.value.filter((folder) =>
      folder.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });

  const reloadPage = () => {
    window.location.reload();
  };

  return {
    folders,
    subFolders,
    files,
    selectedFolderId,
    openFolderId,
    openFileId,
    searchQuery,
    errorMessage,
    newFolderName,
    filteredFolders,
    fetchFolders,
    fetchSubFolders,
    fetchFiles,
    addFolder,
    deleteFolder,
    addFile,
    deleteFile,
    toggleFolder,
    toggleFile
  };
});
