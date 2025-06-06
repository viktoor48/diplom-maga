const selectedCameras = ref<number[]>([]);

export function useCameras() {
  const toggleCamera = (cameraId: number) => {
    const index = selectedCameras.value.indexOf(cameraId);
    if (index === -1) {
      selectedCameras.value.push(cameraId);
    } else {
      selectedCameras.value.splice(index, 1);
    }
  };

  const resetCameras = () => {
    selectedCameras.value = [];
  }

  return {
    selectedCameras,
    toggleCamera,
    resetCameras,
  };
}
