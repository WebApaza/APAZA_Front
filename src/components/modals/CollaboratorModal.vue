<template>
    <div v-if="show" class="modal-overlay" @click.self="closeModal">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        {{ isEdit ? 'Editar Colaborador' : 'Agregar Colaborador' }}
                    </h5>
                    <button type="button" class="btn-close" @click="closeModal"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="handleSubmit">
                        <div class="form-layout">
                            <!-- Columna de formulario -->
                            <div class="form-column">
                                <div class="mb-3">
                                    <label for="title" class="form-label">Título / Nombre *</label>
                                    <input type="text"
                                        class="form-control"
                                        :class="{ 'is-invalid': errors.title }"
                                        id="title"
                                        v-model="form.title"
                                        required
                                        placeholder="Nombre del colaborador"
                                        @input="clearError('title')" />
                                    <div v-if="errors.title" class="invalid-feedback">
                                        Campo requerido
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label for="description" class="form-label">Descripción *</label>
                                    <textarea
                                        class="form-control"
                                        :class="{ 'is-invalid': errors.description }"
                                        id="description"
                                        v-model="form.description"
                                        rows="4"
                                        required
                                        placeholder="Descripción del colaborador"
                                        @input="clearError('description')"></textarea>
                                    <div v-if="errors.description" class="invalid-feedback">
                                        Campo requerido
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="etiqueta" class="form-label">Etiqueta</label>
                                    <input class="form-control" id="etiqueta" v-model="form.tag" rows="4"
                                        placeholder="ej: institución, organizador, colaborador activo, etc"/>
                                </div>

                                <div class="mb-3">
                                    <label for="image" class="form-label">
                                        {{ isEdit ? 'Cambiar Imagen' : 'Imagen *' }}
                                    </label>
                                    <input type="file" class="form-control" id="image" @change="handleImageChange"
                                        accept="image/*" :required="!isEdit" />
                                    <small class="form-text text-muted">
                                        Formatos permitidos: JPG, PNG, WEBP
                                    </small>
                                </div>

                                <!-- Preview móvil -->
                                <div v-if="imagePreview || (isEdit && collaborator?.image)" class="mb-3 preview-mobile">
                                    <label class="form-label">Vista previa:</label>
                                    <div class="image-preview-container">
                                        <img :src="imagePreview || collaborator?.image" alt="Preview"
                                            class="img-thumbnail" />
                                    </div>
                                </div>
                            </div>

                            <!-- Columna de preview -->
                            <div v-if="imagePreview || (isEdit && collaborator?.image)" class="preview-column">
                                <label class="form-label">Vista previa:</label>
                                <div class="image-preview-container">
                                    <img :src="imagePreview || collaborator?.image" alt="Preview"
                                        class="img-thumbnail" />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary me-2" @click="closeModal" :disabled="isLoading">
                        Cerrar
                    </button>
                    <button type="button" class="btn btn-primary" @click="handleSubmit" :disabled="isLoading">
                        {{ isEdit ? 'Actualizar' : 'Guardar' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Loading Overlay -->
        <div v-if="isLoading" class="loading-overlay">
            <div class="spinner-container">
                <div class="spinner-border text-light" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="loading-text">{{ isEdit ? 'Actualizando...' : 'Guardando...' }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';

const props = defineProps({
    show: {
        type: Boolean,
        required: true,
    },
    collaborator: {
        type: Object,
        default: null,
    },
    isEdit: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['close', 'save']);

const form = ref({
    id: null,
    title: '',
    description: '',
    tag: '',
    image: null,
    newImage: null,
});

const imagePreview = ref('');
const errors = ref({
    title: false,
    description: false
});
const isLoading = ref(false);

watch(() => props.collaborator, (newVal) => {
    if (newVal) {
        form.value = {
            id: newVal._id,
            title: newVal.title,
            description: newVal.description,
            tag: newVal.tag,
            image: newVal.image,
            newImage: null,
        };
        imagePreview.value = '';
    } else {
        nextTick(() => {
            resetForm();
        });
    }
}, { immediate: true });

const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        if (props.isEdit) {
            form.value.newImage = file;
        } else {
            form.value.image = file;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

const clearError = (field) => {
    errors.value[field] = false;
};

const validateForm = () => {
    let isValid = true;

    if (!form.value.title || form.value.title.trim() === '') {
        errors.value.title = true;
        isValid = false;
    }

    if (!form.value.description || form.value.description.trim() === '') {
        errors.value.description = true;
        isValid = false;
    }

    return isValid;
};

const handleSubmit = async () => {
    // Reset errors
    errors.value = {
        title: false,
        description: false
    };

    if (!validateForm()) {
        return;
    }

    // Show loading spinner
    isLoading.value = true;

    // Simulate async operation (minimum 800ms for better UX)
    await new Promise(resolve => setTimeout(resolve, 800));

    emit('save', { ...form.value });

    // Hide loading after emit
    isLoading.value = false;
};

const closeModal = () => {
    emit('close');
    nextTick(() => {
        resetForm();
    });
};

const resetForm = () => {
    form.value = {
        id: null,
        title: '',
        description: '',
        tag: '',
        image: null,
        newImage: null,
    };
    imagePreview.value = '';
    errors.value = {
        title: false,
        description: false
    };
    isLoading.value = false;
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1050;
}

.modal-dialog {
    max-width: 900px;
    width: 90%;
}

.modal-content {
    background-color: var(--background-color-3);
    color: var(--text-color-3);
    border-radius: 15px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid var(--border-color-1);
    padding: 1.5rem;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
}

.modal-title {
    font-weight: bold;
    color: var(--text-color-3);
}

.btn-close {
    filter: var(--bs-btn-close-filter, none);
}

.modal-body {
    padding: 1.5rem;
    max-height: 70vh;
    overflow-y: auto;
}

.form-layout {
    display: flex;
    gap: 2rem;
    flex-direction: column;
}

.form-column {
    flex: 1;
}

.preview-column {
    flex: 0 0 300px;
    display: none;
}

.preview-mobile {
    display: block;
}

/* Desktop styles */
@media (min-width: 768px) {
    .form-layout {
        flex-direction: row;
    }

    .preview-column {
        display: block;
    }

    .preview-mobile {
        display: none;
    }

    .modal-dialog {
        max-width: 900px;
    }
}

.form-label {
    font-weight: 600;
    color: var(--text-color-3);
    margin-bottom: 0.5rem;
}

.form-control {
    background-color: var(--background-color-3);
    color: var(--text-color-3);
    border: 2px solid var(--background-color);
    border-radius: 8px;
    padding: 0.75rem;
}

.form-control:focus {
    background-color: var(--background-color-3);
    color: var(--text-color-3);
    border-color: var(--primary-color);
    box-shadow: 0 0 0 0.2rem rgba(var(--primary-color-rgb), 0.25);
}

.image-preview-container {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
}

.image-preview-container img {
    width: 100%;
    height: auto;
    max-height: 300px;
    object-fit: cover;
    border-radius: 10px;
}

.modal-footer {
    border-top: 1px solid var(--border-color-1);
    padding: 1.5rem;
}

.btn {
    border-radius: 8px;
    padding: 0.5rem 1.5rem;
    font-weight: 600;
}

.text-muted {
    opacity: 0.7;
}

/* Validation Styles */
.form-control.is-invalid {
    border-color: #dc3545;
    border-width: 2px;
}

.form-control.is-invalid:focus {
    border-color: #dc3545;
    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.invalid-feedback {
    display: block;
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    font-weight: 500;
}

/* Loading Overlay */
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1060;
}

.spinner-container {
    text-align: center;
}

.spinner-border {
    width: 4rem;
    height: 4rem;
    border-width: 0.4rem;
}

.loading-text {
    color: white;
    font-size: 1.2rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>
