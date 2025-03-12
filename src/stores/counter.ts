import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useExplorerStore = defineStore("explorer", () => {
  const folders = ref([]);
  const subFolders = ref([]);
  const files = ref([]);
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
          return response.data.data;
        } else {
          throw new Error("Gagal memuat data");
        }
      } catch (error) {
        errorMessage.value = "Terjadi kesalahan saat mengambil data.";
        console.error(error);
        return [];
      }
    },
    async post(url: string, data: object) {
      try {
        await axios.post(`${API_BASE}${url}`, data);
      } catch (error) {
        errorMessage.value = "Terjadi kesalahan saat menambahkan data.";
        console.error(error);
      }
    },
    async delete(url: string) {
      try {
        await axios.delete(`${API_BASE}${url}`);
      } catch (error) {
        errorMessage.value = "Terjadi kesalahan saat menghapus data.";
        console.error(error);
      }
    },
  };

  const fetchFolders = async () => {
    folders.value = await api.get("/getParentFolders");
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
        console.warn(`⚠️ Tidak ada subfolder untuk folder ID ${folderId}`);
        subFolders.value = [{ id: -1, name: "(Tidak ada subfile)", parent_id: folderId }];
      } else {
        subFolders.value = responseFile.map(file => ({
          id: -1,
          name: file.name,
          parent_id: file.parent_id
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
      console.warn(`⚠️ Tidak ada subfile untuk folder ID ${fileId}`);
      files.value = [{ id: -1, name: "(Tidak ada subfile)", parent_id: fileId }];
    } else {
      files.value = response;
    }

    folderCache.set(fileId, files.value);
  };

  const toggleFile = (fileId: number) => {
    console.log('xxx' + openFileId.value);
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
    await fetchSubFolders(selectedFolderId.value);
  };

  const deleteFolder = async (folderId: number) => {
    if (!folderId) return;
    const response = await api.delete(`/folders/${folderId}`);

    if (Array.isArray(response) && response.length === 0) {
      console.warn(`⚠️ Tidak ada subfile untuk folder ID ${folderId}`);
    }
    await fetchSubFolders(selectedFolderId.value!);
  };

  const deleteFile = async (fileId: number) => {
    if (!fileId) return;
    await api.delete(`/files/${fileId}`);
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

  const filteredFolders = () => {
    if (!searchQuery.value) return folders.value;
    return folders.value.filter((folder) =>
      folder.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
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
    fetchFolders,
    fetchSubFolders,
    fetchFiles,
    addFolder,
    deleteFolder,
    addFile,
    deleteFile,
    toggleFolder,
    toggleFile,
    filteredFolders,
  };
});
