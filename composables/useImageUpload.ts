/** Upload d'images vers /api/uploads (admin) - renvoie les chemins publics générés. */
export function useImageUpload() {
  const { $csrfFetch } = useNuxtApp()
  const uploading = ref(false)

  async function upload(files: FileList | File[]): Promise<string[]> {
    const formData = new FormData()
    for (const file of Array.from(files)) formData.append('files', file)
    uploading.value = true
    try {
      const res = await $csrfFetch('/api/uploads', { method: 'POST', body: formData }) as { urls: string[] }
      return res.urls
    } finally {
      uploading.value = false
    }
  }

  return { upload, uploading }
}
