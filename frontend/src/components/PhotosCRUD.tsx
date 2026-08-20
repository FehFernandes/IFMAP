import React, { useState, useEffect } from "react";
import { photoService, locationService } from "../services/api";
import type { Photo, PhotoFormData, Location } from "../types";
import { useToast } from "../hooks/useToast";

interface PhotosCRUDProps {
  shouldOpenCreate?: boolean;
  onModalOpened?: () => void;
}

const PhotosCRUD: React.FC<PhotosCRUDProps> = ({ shouldOpenCreate, onModalOpened }) => {
  const { showToast } = useToast();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // Múltiplos arquivos
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<PhotoFormData>({
    path: "",
    filename: "",
    mime_type: "image/jpeg",
    size: 0,
    imageable_type: "App\\Models\\Location",
    imageable_id: 0,
    alt_text: "",
    order: 1,
  });

  useEffect(() => {
    loadData();
  }, []);

  // Abre modal automaticamente quando solicitado pelos botões de Ações Rápidas
  useEffect(() => {
    if (shouldOpenCreate === true && !showModal && locations.length > 0) {
      handleOpenModal();
      if (onModalOpened) {
        onModalOpened();
      }
    }
  }, [shouldOpenCreate, showModal, locations.length]);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [photosResponse, locationsResponse] = await Promise.all([
        photoService.getPhotos(),
        locationService.getLocations(),
      ]);

      if (photosResponse.success && photosResponse.data) {
        setPhotos(photosResponse.data);
      }

      if (locationsResponse.success && locationsResponse.data) {
        setLocations(locationsResponse.data);
      }
    } catch {
      setError("Erro de conexão com o servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (photo?: Photo) => {
    if (photo) {
      setEditingPhoto(photo);
      setUploadMode("url"); // Edição sempre via URL
      setSelectedFiles([]);
      setFormData({
        path: photo.path,
        filename: photo.filename,
        mime_type: photo.mime_type,
        size: photo.size,
        imageable_type: photo.imageable_type,
        imageable_id: photo.imageable_id,
        alt_text: photo.alt_text || "",
        order: photo.order,
      });
    } else {
      setEditingPhoto(null);
      setUploadMode("file"); // Nova foto inicia com upload
      setSelectedFiles([]);
      setFormData({
        path: "",
        filename: "",
        mime_type: "image/jpeg",
        size: 0,
        imageable_type: "App\\Models\\Location",
        imageable_id: locations.length > 0 ? locations[0].id : 0,
        alt_text: "",
        order: 1,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPhoto(null);
    setSelectedFiles([]);
    setUploadMode("file");
    setUploadProgress(0);
    setIsUploading(false);
    setFormData({
      path: "",
      filename: "",
      mime_type: "image/jpeg",
      size: 0,
      imageable_type: "App\\Models\\Location",
      imageable_id: 0,
      alt_text: "",
      order: 1,
    });
  };

  // Função para comprimir imagem antes do upload
  const compressImage = (file: File, maxWidth: number = 1920, maxHeight: number = 1080, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calcular novas dimensões mantendo proporção
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Não foi possível obter contexto do canvas'));
            return;
          }
          
          // Desenhar imagem redimensionada
          ctx.drawImage(img, 0, 0, width, height);
          
          // Converter para Blob com compressão
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Falha ao comprimir imagem'));
                return;
              }
              
              // Criar novo arquivo com o blob comprimido
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              
              console.log(`Compressão: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB (${Math.round((1 - compressedFile.size / file.size) * 100)}% de redução)`);
              
              resolve(compressedFile);
            },
            'image/jpeg',
            quality
          );
        };
        
        img.onerror = () => {
          reject(new Error('Erro ao carregar imagem'));
        };
      };
      
      reader.onerror = () => {
        reject(new Error('Erro ao ler arquivo'));
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      
      setError("Comprimindo imagens...");
      
      try {
        // Comprimir cada arquivo
        const compressedFiles = await Promise.all(
          filesArray.map(file => compressImage(file))
        );
        
        // Validar tamanho dos arquivos comprimidos
        const invalidFiles = compressedFiles.filter(file => file.size > 5 * 1024 * 1024);
        
        if (invalidFiles.length > 0) {
          setError(`${invalidFiles.length} arquivo(s) ainda excede(m) 5MB após compressão`);
          const validFiles = compressedFiles.filter(file => file.size <= 5 * 1024 * 1024);
          setSelectedFiles(validFiles);
        } else {
          setError("");
          setSelectedFiles(compressedFiles);
          showToast(`${compressedFiles.length} imagem(ns) comprimida(s).`, "success");
        }
      } catch (error) {
        console.error("Erro ao comprimir imagens:", error);
        setError("Erro ao comprimir imagens. Tente novamente.");
        showToast("Erro ao comprimir imagens", "error");
      }
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.imageable_id) {
      setError("Selecione uma localização");
      return;
    }

    try {
      if (editingPhoto) {
        // Edição sempre via URL
        const response = await photoService.updatePhoto(
          editingPhoto.id,
          formData
        );
        if (response.success) {
          await loadData();
          handleCloseModal();
        } else {
          setError(response.message || "Erro ao atualizar foto");
        }
      } else {
        // Nova foto - verifica modo
        if (uploadMode === "file") {
          // Upload de múltiplos arquivos
          if (selectedFiles.length === 0) {
            setError("Selecione pelo menos um arquivo para upload");
            return;
          }
          
          setIsUploading(true);
          let successCount = 0;
          let failCount = 0;
          
          console.log(`Iniciando upload de ${selectedFiles.length} arquivo(s)`);
          
          for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            const progress = Math.round(((i + 1) / selectedFiles.length) * 100);
            setUploadProgress(progress);
            
            console.log(`Enviando arquivo ${i + 1}/${selectedFiles.length}:`, file.name);
            
            try {
              const response = await photoService.uploadPhoto(
                file,
                formData.imageable_id,
                formData.alt_text || file.name,
                formData.order + i
              );
              
              console.log(`Resposta do arquivo ${i + 1}:`, response);
              
              if (response.success) {
                successCount++;
                console.log(`Arquivo ${i + 1} enviado com sucesso`);
              } else {
                failCount++;
                console.warn(`Falha ao enviar o arquivo ${i + 1}:`, response.message);
              }
            } catch (err) {
              failCount++;
              console.error(`Erro ao enviar o arquivo ${i + 1}:`, err);
            }
          }
          
          console.log(`Upload finalizado: ${successCount} sucesso(s), ${failCount} falha(s)`);

          
          setIsUploading(false);
          setUploadProgress(0);
          
          if (successCount > 0) {
            await loadData();
            handleCloseModal();
            if (failCount > 0) {
              showToast(`${successCount} foto(s) enviada(s), ${failCount} falhou(falharam)`, "warning");
            } else {
              showToast(`${successCount} foto(s) enviada(s) com sucesso!`, "success");
            }
          } else {
            showToast("Erro ao fazer upload das fotos", "error");
          }
        } else {
          // Via URL
          if (!formData.path) {
            setError("Informe a URL da imagem");
            return;
          }
          
          // Extrai o nome do arquivo da URL se não for fornecido
          if (!formData.filename && formData.path) {
            const filename = formData.path.split("/").pop() || "image.jpg";
            formData.filename = filename;
          }
          
          const response = await photoService.createPhoto(formData);
          if (response.success) {
            await loadData();
            handleCloseModal();
          } else {
            setError(response.message || "Erro ao criar foto");
          }
        }
      }
    } catch {
      setError("Erro de conexão com o servidor");
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta foto?")) {
      return;
    }

    setError("");

    try {
      const response = await photoService.deletePhoto(id);
      if (response.success) {
        await loadData();
      } else {
        setError(response.message || "Erro ao excluir foto");
      }
    } catch {
      setError("Erro de conexão com o servidor");
    }
  };

  const getLocationName = (imageableId: number) => {
    const location = locations.find((loc) => loc.id === imageableId);
    return location ? location.name : "N/A";
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gerenciar Fotos</h2>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Nova Foto
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              Nenhuma foto cadastrada
            </div>
          ) : (
            photos.map((photo) => (
              <div
                key={photo.id}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-gray-100 relative">
                  <img
                    src={photo.url || photo.path}
                    alt={photo.alt_text || photo.filename}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/400x300?text=Imagem+não+encontrada";
                    }}
                  />
                  <span className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                    Ordem: {photo.order}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1 truncate">
                    {photo.filename}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {getLocationName(photo.imageable_id)}
                  </p>
                  {photo.alt_text && (
                    <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                      {photo.alt_text}
                    </p>
                  )}
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleOpenModal(photo)}
                      className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(photo.id)}
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {editingPhoto ? "Editar Foto" : "Nova Foto"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!editingPhoto && (
                  <div className="flex gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setUploadMode("file")}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                        uploadMode === "file"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Upload de arquivo
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMode("url")}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                        uploadMode === "url"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Link/URL
                    </button>
                  </div>
                )}

                {(editingPhoto || uploadMode === "url") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL da Foto *
                    </label>
                    <input
                      type="url"
                      required={uploadMode === "url"}
                      value={formData.path}
                      onChange={(e) =>
                        setFormData({ ...formData, path: e.target.value })
                      }
                      placeholder="https://exemplo.com/imagem.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formData.path && (
                      <div className="mt-2">
                        <img
                          src={formData.path}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/400x300?text=URL+inválida";
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {!editingPhoto && uploadMode === "file" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Selecionar Arquivos * (múltiplos)
                    </label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                      multiple
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Formatos: JPEG, PNG, JPG, GIF, WEBP • Máximo: 5MB por arquivo • Selecione múltiplos arquivos
                    </p>
                    
                    {selectedFiles.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between text-sm font-medium text-gray-700">
                          <span>{selectedFiles.length} arquivo(s) selecionado(s)</span>
                          <button
                            type="button"
                            onClick={() => setSelectedFiles([])}
                            className="text-red-600 hover:text-red-700 text-xs"
                          >
                            Limpar todos
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="relative border border-gray-200 rounded-lg p-2 bg-gray-50">
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 text-xs"
                              >
                                ×
                              </button>
                              
                              {file.type.startsWith("image/") && (
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={file.name}
                                  className="w-full h-24 object-cover rounded mb-1"
                                />
                              )}
                              
                              <div className="text-xs">
                                <p className="truncate text-gray-700 font-medium" title={file.name}>
                                  {file.name}
                                </p>
                                <p className="text-gray-500">
                                  {(file.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {isUploading && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-700">Enviando...</span>
                              <span className="text-blue-600 font-medium">{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {(editingPhoto || uploadMode === "url") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do Arquivo
                    </label>
                    <input
                      type="text"
                      value={formData.filename}
                      onChange={(e) =>
                        setFormData({ ...formData, filename: e.target.value })
                      }
                      placeholder="Será extraído da URL se vazio"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Texto Alternativo (Alt)
                  </label>
                  <input
                    type="text"
                    value={formData.alt_text}
                    onChange={(e) =>
                      setFormData({ ...formData, alt_text: e.target.value })
                    }
                    placeholder="Descrição da imagem para acessibilidade"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Localização *
                    </label>
                    <select
                      required
                      value={formData.imageable_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          imageable_id: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecione</option>
                      {locations.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ordem *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.order}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          order: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={isUploading}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      <>
                        {editingPhoto 
                          ? "Atualizar" 
                          : uploadMode === "file" && selectedFiles.length > 1
                          ? `Enviar ${selectedFiles.length} Fotos`
                          : "Criar"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotosCRUD;
