<script setup>
import { reactive } from "vue";
import MovieItem from "./components/movie/MovieItem.vue";
import { items } from "./movies.json";

const movies = reactive(items)
</script>

<template>
  <div class="bg-secondary">
    <div class="container py-16 mx-auto w-100 px-4">
      <div class="gap-x-4 grid grid-cols-3">
        <MovieItem v-for="item in movies" :key="item.id" :movie="item" />
      </div>
    </div>
  </div>
</template>
