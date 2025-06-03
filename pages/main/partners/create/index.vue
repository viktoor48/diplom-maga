<script setup lang="ts">
import ImageInput from '~/components/Constructor/FileInputs/ImageInput.vue';
import TextInputComponent from '~/components/Constructor/UI/TextInputComponent.vue';
import { useValidation } from '#imports';
import { usePartners } from "~/composables/requests/usePartners";

const { createPartner } = usePartners();

const title = "Логотип";
const subtitle = "Используйте этот блок, чтобы разместить логотип на странице.";

const isLoading = ref<boolean>(false);

const { isValidURL } = useValidation();

definePageMeta({
    layout: "auth",
});

const partnersData = ref({
    link: null,
    url: '',
})

const linkError = ref('');

watch(() => partnersData.value.url, (newLink) => {
    linkError.value = newLink && !isValidURL(newLink) ? 'Неверный тип данных' : '';
});

const uploadChanges = async () => {
    isLoading.value = true;
    try {
        const response = await createPartner({
            photo: partnersData.value.link,
            url: partnersData.value.url
        });

        if (response) {
            partnersData.value = { link: null, url: '' };
            navigateTo('/main');
        }
    } catch (error) {
        console.error("Ошибка при сохранении:", error);
    } finally {
        isLoading.value = false;
    }
};

const isValid = computed(() => {
    return !!(partnersData.value.link &&
        partnersData.value.url &&
        !linkError.value);
});
</script>

<template>
    <main class="relative">
        <EditingHeaderComponent class="bg-[#fff] sticky top-0 w-full" header-title="Добавление партнера"
            cancelLink="/main" :button_status="!isValid" @making-request="uploadChanges" />
        <div class="px-[20rem] py-[2.5rem] gap-[1.25rem] flex flex-col">
            <ImageInput v-model="partnersData" :delete-block="false" :title="title" :subtitle="subtitle"
                imgFileFormats="image/jpg, image/jpeg, image/png, image/svg+xml">
                <template v-slot:description>
                    <p class="text-[#667085] text-[0.875rem] leading-[142.857%] ml-2 mt-1">Загрузите логотип с
                        прозрачным фоном, он будет отображаться на главной странице в секции Партнёры.</p>
                </template>
                <TextInputComponent class="mt-3" v-model="partnersData.url"
                    place-holder="Введите ссылку, начиная с https://*" :errorMessage="linkError" title="Ссылка" />
            </ImageInput>
        </div>
        <Loader v-if="isLoading" />
    </main>
</template>

<style scoped></style>
