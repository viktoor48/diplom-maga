<script setup lang="ts">
import UIHomeButton from "~/components/UIComponents/UIHomeButton.vue";
import Blocks from "~/components/Sections/Blocks.vue";
import Header from "~/components/Sections/Header.vue";
import Main from "~/components/Sections/Main.vue";
import Container from "~/components/Sections/Container.vue";
</script>
<template>
  <Blocks>
    <Header :hide-search-and-button="true">
      <template #title> <span class="pl-2">Начальная страница</span></template>
    </Header>
    <Main>
      <Container>
        <section class="overflow-y-auto scroll-hidden">
          <nuxt-img
              src="/preview.png"
              class="w-full h-[calc(100vh-10rem)] max-sm:w-full object-cover rounded-[2rem] max-sm:rounded-3xl"
              :placeholder="true"
              format="webp"
              alt=""
              loading="lazy"
            />
        </section>
      </Container>
    </Main>
  </Blocks>
</template>
