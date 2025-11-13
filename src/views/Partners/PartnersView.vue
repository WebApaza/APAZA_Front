<template>
    <!--     <BaseCarousel :images="getImagesFromEvents()" v-if="!isInAdminPage(router.currentRoute.value.path)"/>
 -->
    <section :class="hasToShowMargin()">
        <div class="events-container">
            <div class="banner text-center py-5 rounded-5 rounded-top-0 mt-5 mt-md-4">
                <h1 class="display-4 text-white">{{ lang?.collaborators }}</h1>
                <p class="section-subtitle fade-in-up text-white px-5 mb-0">{{ lang?.collaboratorPage?.subtitle }}</p>

                <div class="text-center" v-if="isAdmin">
                    <button @click="goToAddEvent" class="btn btn-primary btn-lg btn-block"
                        v-if="isInAdminPage(router.currentRoute.value.path)">{{
                            lang?.eventhomepage?.titles?.addEvent }}</button>
                </div>
            </div>
            <div class="relative px-5 pb-5">
                <div class="z1">
                    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        <div class="col" v-for="(collaborator, index) in collaborators" :key="index" data-aos="fade-up"
                            :data-aos-delay="index * 100">
                            <div class="flip-card-container">
                                <div class="flip-card" :class="{ 'is-flipped': flippedCards[index] }">
                                    <!-- Front Side -->
                                    <div class="flip-card-front" @click="flipCard(index)">
                                        <div class="card-image-wrapper">
                                            <img :src="collaborator.image || BaseImage" :alt="collaborator.title"
                                                class="card-image">
                                        </div>
                                        <div class="front-overlay">
                                            <h6 class="collab-name">{{ collaborator.title }}</h6>
                                            <span v-if="collaborator.tag" class="collab-tag">Voluntario Activo</span>
                                        </div>
                                    </div>

                                    <!-- Back Side -->
                                    <div class="flip-card-back" @click="flipCard(index)">
                                        <div class="back-content">
                                            <h3 class="back-title">{{ collaborator.title }}</h3>
                                            <p class="back-description">{{ collaborator.description }}</p>

                                            <div class="line"></div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Mobile Flip Button -->
                                <button class="flip-button-mobile" @click="flipCard(index)"
                                    :class="{ 'pulse': !flippedCards[index] }">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <path d="M21 2v6h-6"></path>
                                        <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                                        <path d="M3 22v-6h6"></path>
                                        <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>

                    </div>
                    <div v-if="charge" class="m-5 p-5 d-flex justify-content-center">
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="ms-3 fs-4">{{ lang?.loading }}</p>
                    </div>

                    <div v-if="collaborators.length === 0 && !charge" class="text-center">
                        <h4 style="color: var(--accent-color) !important;" class="p-4">{{ lang?.adminCollaboratorPage?.noCollaborators }}</h4>
                    </div>
                </div>
            </div>

        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getCollaborators } from '@/services/CollaboratorService';
import { isUserLoggedAdmin, isInAdminPage } from '@/utils/Validations';
import { getLangForPage, getConfig } from '@/config/BasicConfig';
import BaseImage from '@/assets/imgwebp/APAZA_FONDO.webp';
import { useHead } from '@vueuse/head';

useHead({
  title: 'Colaboradores - APAZA',
  meta: [
    {
      name: 'description',
      content: 'Conoce a nuestros colaboradores y voluntarios que apoyan la misión de APAZA de ayudar a personas con autismo y sus familias.'
    },
    {
      name: 'keywords',
      content: 'colaboradores APAZA, voluntarios, apoyo, comunidad, TEA'
    }
  ]
});

const router = useRouter();
const collaborators = ref([]);
const isAdmin = ref(false);
const charge = ref(true);
const PAGE = 'collaboratorPage';
const lang = ref({});
const flippedCards = ref({});

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

function goToAddEvent() {
    router.push('/admin/add-event');
}

function hasToShowMargin() {
    return collaborators.value.length === 0 && !isInAdminPage(router.currentRoute.value.path) ? 'mt-3' : '';
}

function flipCard(index) {
    flippedCards.value[index] = !flippedCards.value[index];
}

onMounted(async () => {
    isAdmin.value = isUserLoggedAdmin();
    await fetchCollaborators();
    await getLangForPage(getConfig().CURRENT_LANG, PAGE).then((data) => {
        lang.value = data;
    }).catch(() => {
        router.go(0);
    });
});
</script>

<style scoped>
.section-subtitle {
    font-size: 1.2rem;
    opacity: 0.9;
    font-weight: 300;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-in-up {
    animation: fadeInUp 0.6s ease forwards;
}

@media (min-width: 768px) {
    .section-subtitle {
        font-size: 1.5rem;
    }
}

/* Flip Card Container */
.flip-card-container {
    position: relative;
    height: 360px;
    perspective: 1000px;
}

.flip-card {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.6s ease-out;
}

.flip-card.is-flipped {
    transform: rotateY(180deg);
}

/* Front and Back Shared Styles */
.flip-card-front,
.flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

/* Front Side */
.flip-card-front {
    background: var(--background-color-3);
    display: flex;
    flex-direction: column;
    cursor: pointer;
    transition: box-shadow 0.3s ease;
}

.card-image-wrapper {
    flex: 1;
    overflow: hidden;
    position: relative;
}

.card-image {
    width: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.front-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 40px 30px;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 50%, transparent 100%);
}

.collab-name {
    font-size: 1.4rem;
    font-weight: 700;
    color: white;
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.collab-tag {
    display: inline-block;
    padding: 6px 16px;
    background: rgba(100, 181, 246, 0.9);
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    color: white;
    margin-top: 10px;
}


/* Back Side */
.flip-card-back {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--background-color) 100%);
    transform: rotateY(180deg);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    cursor: pointer;
}

.back-content {
    text-align: center;
    color: white;
}

.back-title {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: white;
}

.back-description {
    font-size: 1.1rem;
    line-height: 1.6;
    opacity: 0.95;
    color: white;
}

.line {
    border-top: 2px solid var(--border-color-1);
}

/* Mobile Flip Button */
.flip-button-mobile {
    display: none;
    position: absolute;
    bottom: 15px;
    right: 15px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--primary-color);
    border: none;
    color: white;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    z-index: 10;
    transition: all 0.3s ease;
}

.flip-button-mobile:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.flip-button-mobile:active {
    transform: scale(0.95);
}

/* Pulse Animation */
@keyframes pulse {

    0%,
    100% {
        transform: scale(1);
        opacity: 0.8;
    }

    50% {
        transform: scale(1.1);
        opacity: 1;
    }
}

.flip-button-mobile.pulse {
    animation: pulse 2s infinite;
}

/* Hover Effects - Desktop Only */
@media (min-width: 768px) {
    .flip-card-front:hover {
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
    }

    .flip-card-front:hover .card-image {
        transform: scale(1.05);
    }

    .flip-card-back:hover {
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
    }

    /* Auto flip on hover for desktop */
    .flip-card-container:hover .flip-card {
        transform: rotateY(180deg);
    }

    .flip-card-container:hover .flip-card.is-flipped {
        transform: rotateY(0deg);
    }
}

/* Mobile Styles */
@media (max-width: 767px) {
    .flip-button-mobile {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .flip-card-container {
        height: 400px;
    }
}

.absolute {
    position: absolute;
}

.top-0 {
    top: 0;
}

.left-0 {
    left: 0;
}

.w-full {
    width: 100%;
}

.h-full {
    height: 100%;
}

.object-cover {
    object-fit: cover;
}

.opacity-50 {
    opacity: 0.5;
}

.z2 {
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
}

.z1 {
    position: relative;
    z-index: 2;
}

#sectionCards {
    background-color: var(--primary-color);
    display: flex;

    padding: 10rem;
    position: relative;
    height: 200%;
    color: var(--text-color-1);
    font-family: var(--text-font-1);

    display: flex;
    flex-direction: column;
}

#title {
    color: var(--text-color-1);
    font-family: var(--text-font-1);
}

.custom-shape-divider-top-1721696071 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    line-height: 0;
    transform: rotate(180deg);
}

.custom-shape-divider-top-1721696071 svg {
    position: relative;
    display: block;
    width: calc(100% + 1.3px);
    height: 84px;
}

.custom-shape-divider-top-1721696071 .shape-fill {
    fill: var(--background-color-3);
}

.events-container {
    background: #bbc9d8;
    min-height: 100vh;
}

.banner {
    /* background: linear-gradient(45deg, #ff6b6b, #4ecdc4); */
    background: linear-gradient(45deg, var(--primary-color), var(--background-color));
    margin-bottom: 2rem;
}

.event-card {
    transition: all 0.3s ease;
    border: none;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    /* <-- El box-shadow no importa porque siempre es negro por eso no puse var() */
}

.event-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.card-img-top {
    height: 200px;
    object-fit: cover;
}

.card-title {
    /* color: #333; */
    color: var(--text-color-3);
    font-weight: bold;
}

.card-text {
    /* color: #666; */
    color: var(--text-color-3);
}

.card-footer {
    /* background-color: #fff; */
    background-color: var(--background-color-3);
    /* border-top: 1px solid #f0f0f0; */
    border-top: 1px solid var(--background-color);
}
</style>