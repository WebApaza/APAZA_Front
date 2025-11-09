<template>
    <section>
        <div class="partners-container">
            <div class="banner text-center py-5 rounded-5 rounded-top-0">
                <h1 class="display-4 text-white">{{ lang?.adminCollaboratorPage?.title }}</h1>
                <div class="text-center">
                    <button @click="openAddModal" class="btn btn-primary btn-lg btn-block mt-3">
                        {{ lang?.adminCollaboratorPage?.addCollaborator }}
                    </button>
                </div>
            </div>

            <div class="partners-container relative px-5 mb-3 mb-md-5">
                <div class="z1">
                    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        <div class="col" v-for="(collaborator, index) in collaborators" :key="index">
                            <div class="card h-100 partner-card">
                                <div class="menu-button-container">
                                    <button @click="toggleMenu(index)" class="menu-button">
                                        <i class="fas fa-ellipsis-v"></i>
                                    </button>
                                    <div v-if="activeMenu === index" class="menu-popup">
                                        <button @click="openEditModal(collaborator)" class="menu-item">
                                            <i class="fas fa-edit"></i> {{ lang?.adminCollaboratorPage?.edit }}
                                        </button>
                                        <button @click="confirmDelete(collaborator)" class="menu-item menu-item-danger">
                                            <i class="fas fa-trash"></i> {{ lang?.adminCollaboratorPage?.delete }}
                                        </button>
                                    </div>
                                </div>
                                <img :src="collaborator.image === 'Sin imagen' ? BaseImage : collaborator.image"
                                     class="card-img-top"
                                     :alt="collaborator.title">
                                <div class="card-body">
                                    <h5 class="card-title">{{ collaborator.title }}</h5>
                                    <p class="card-text">{{ collaborator.description }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="charge" class="m-5 p-5 d-flex justify-content-center">
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
<!--                         <p class="ms-3 fs-4">{{ lang?.loading }}</p>
 -->                    </div>

                    <div v-if="collaborators.length === 0 && !charge" class="text-center my-5">
                        <LottieAnimation></LottieAnimation>
                        <h3 style="color: var(--text-color-3)">{{ lang?.adminCollaboratorPage?.noCollaborators }}</h3>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal for Add/Edit Collaborator -->
        <CollaboratorModal
            :show="showModal"
            :collaborator="selectedCollaborator"
            :isEdit="isEditMode"
            @close="closeModal"
            @save="handleSave"
        />

        <!-- Modal de confirmación para eliminar -->
        <BaseModal
            modalId="deleteCollaboratorModal"
            :title="modalDeleteInfo.title"
            :body="modalDeleteInfo.body"
            :closeText="modalDeleteInfo.closeText"
            :acceptText="modalDeleteInfo.acceptText"
            :onAccept="modalDeleteInfo.onAccept"
            colorAcceptButton="danger"
        />

        <!-- Modal de confirmación para actualizar -->
        <BaseModal
            modalId="updateCollaboratorModal"
            :title="modalUpdateInfo.title"
            :body="modalUpdateInfo.body"
            :closeText="modalUpdateInfo.closeText"
            :acceptText="modalUpdateInfo.acceptText"
            :onAccept="modalUpdateInfo.onAccept"
            colorAcceptButton="primary"
        />
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getCollaborators, addCollaborator, updateCollaborator, deleteCollaborator } from '@/services/CollaboratorService';
import { getLangForPage, getConfig } from '@/config/BasicConfig';
import CollaboratorModal from '@/components/modals/CollaboratorModal.vue';
import BaseModal from '@/components/modals/BaseModal.vue';
import BaseImage from '@/assets/imgwebp/APAZA_FONDO.webp';
import LottieAnimation from '@/components/LottieAnimation.vue';

const router = useRouter();
const collaborators = ref([]);
const charge = ref(true);
const showModal = ref(false);
const selectedCollaborator = ref(null);
const isEditMode = ref(false);
const activeMenu = ref(null);
const PAGE = 'adminCollaboratorPage';
const lang = ref({});
const pendingCollaboratorData = ref(null);

// Modal de confirmación para eliminar
const modalDeleteInfo = ref({
    title: '',
    body: '',
    closeText: '',
    acceptText: '',
    onAccept: async () => {
        try {
            if (selectedCollaborator.value) {
                await deleteCollaborator(selectedCollaborator.value._id);
                await fetchCollaborators();
                selectedCollaborator.value = null;
            }
        } catch (error) {
            console.error('Error deleting collaborator:', error);
        }
    }
});

// Modal de confirmación para actualizar
const modalUpdateInfo = ref({
    title: '',
    body: '',
    closeText: '',
    acceptText: '',
    onAccept: async () => {
        try {
            if (pendingCollaboratorData.value) {
                await updateCollaborator(pendingCollaboratorData.value);
                await fetchCollaborators();
                closeModal();
                pendingCollaboratorData.value = null;
            }
        } catch (error) {
            console.error('Error updating collaborator:', error);
        }
    }
});

const fetchCollaborators = async () => {
    try {
        const response = await getCollaborators();
        collaborators.value = response.data.data;
        charge.value = false;
    } catch (error) {
        console.error('Error fetching collaborators:', error);
        charge.value = false;
    }
};

const openAddModal = () => {
    selectedCollaborator.value = null;
    isEditMode.value = false;
    showModal.value = true;
};

const openEditModal = (collaborator) => {
    activeMenu.value = null;
    selectedCollaborator.value = { ...collaborator };
    isEditMode.value = true;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    selectedCollaborator.value = null;
};

const handleSave = async (collaboratorData) => {
    try {
        if (isEditMode.value) {
            // Guardar datos y mostrar modal de confirmación
            pendingCollaboratorData.value = collaboratorData;
            const bootstrap = await import('bootstrap');
            const modalElement = document.getElementById('updateCollaboratorModal');
            if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
            }
        } else {
            await addCollaborator(collaboratorData);
            await fetchCollaborators();
            closeModal();
        }
    } catch (error) {
        console.error('Error saving collaborator:', error);
    }
};

const toggleMenu = (index) => {
    activeMenu.value = activeMenu.value === index ? null : index;
};

const confirmDelete = async (collaborator) => {
    activeMenu.value = null;
    selectedCollaborator.value = collaborator;

    // Construir mensaje dinámico con el nombre del colaborador
    const baseBody = lang.value?.adminCollaboratorPage.deleteModal?.body || '';
    const collaboratorName = collaborator.title;
    modalDeleteInfo.value.body = baseBody.replace('este colaborador', collaboratorName).replace('this collaborator', collaboratorName);

    const bootstrap = await import('bootstrap');
    const modalElement = document.getElementById('deleteCollaboratorModal');
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }
};

const updateModalTexts = () => {
    // Actualizar textos de modal de eliminar
    if (lang.value?.adminCollaboratorPage.deleteModal) {
        modalDeleteInfo.value.title = lang.value?.adminCollaboratorPage.deleteModal.title;
        modalDeleteInfo.value.body = lang.value?.adminCollaboratorPage.deleteModal.body;
        modalDeleteInfo.value.closeText = lang.value?.adminCollaboratorPage.deleteModal.closeText;
        modalDeleteInfo.value.acceptText = lang.value?.adminCollaboratorPage.deleteModal.acceptText;
    }

    // Actualizar textos de modal de actualizar
    if (lang.value?.adminCollaboratorPage.updateModal) {
        modalUpdateInfo.value.title = lang.value?.adminCollaboratorPage.updateModal.title;
        modalUpdateInfo.value.body = lang.value?.adminCollaboratorPage.updateModal.body;
        modalUpdateInfo.value.closeText = lang.value?.adminCollaboratorPage.updateModal.closeText;
        modalUpdateInfo.value.acceptText = lang.value?.adminCollaboratorPage.updateModal.acceptText;
    }
};

onMounted(async () => {
    await fetchCollaborators();
    await getLangForPage(getConfig().CURRENT_LANG, PAGE).then((data) => {
        lang.value = data;
        updateModalTexts();
    }).catch(() => {
        router.go(0);
    });
});
</script>

<style scoped>
.partners-container {
    min-height: 100vh;
}

.banner {
    background: linear-gradient(45deg, var(--primary-color), var(--background-color));
    margin-bottom: 2rem;
}

.relative {
    position: relative;
}

.z1 {
    position: relative;
    z-index: 2;
}

.partner-card {
    color: var(--text-color-3);
    transition: all 0.3s ease;
    border: none;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.partner-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.card-img-top {
    height: 250px;
    object-fit: cover;
}

.card-title {
    font-weight: bold;
    color: #2C2C2C;
}

.card-text {
    color: #2C2C2C;
}

.menu-button-container {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10;
}

.menu-button {
    background-color: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.2s ease;
}

.menu-button:hover {
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.menu-popup {
    position: absolute;
    top: 0;
    right: 45px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    min-width: 150px;
    overflow: hidden;
    z-index: 100;
}

.menu-item {
    width: 100%;
    padding: 12px 16px;
    border: none;
    background: white;
    color: #2C2C2C;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
}

.menu-item:hover {
    background-color: #f8f9fa;
}

.menu-item-danger:hover {
    background-color: #dc3545;
    color: white;
}

.menu-item i {
    width: 16px;
}
</style>
