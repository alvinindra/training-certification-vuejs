<script setup>
import { StarIcon } from "@heroicons/vue/24/solid";
import { ref } from "vue";
const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
})

const rating = ref(props.movie.rating);
</script>

<template>
  <div class="flex flex-col flex-shrink-0 rounded-lg">
    <img class="w-full max-h-[600px] object-cover rounded-t-lg" :src="movie.image" :alt="movie.name" />
    <div class="flex flex-col h-full bg-white py-4 px-3 rounded-b-lg">
      <div class="font-bold text-3xl">{{ movie.name }}</div>
      <div class="flex gap-1 mb-4">
        <div class="bg-purple-700 font-medium text-[14px] rounded-3xl px-2 text-white" v-for="genre in movie.genres"
          :key="genre">
          {{ genre }}
        </div>
      </div>
      <p class="mb-[24px]">
        {{ movie.description }}
      </p>
      <div class="flex flex-row mt-auto">
        <div>Rating: ({{ rating }}/5)</div>
        <div class="ml-4 flex flex-row gap-1">
          <StarIcon
            :class="['h-[24px] w-[24px] cursor-pointer', indexStar < rating ? 'fill-yellow-500' : 'fill-gray-500', rating === star && '!cursor-not-allowed']"
            v-for="(star, indexStar) in 5" :key="'star-' + indexStar" @click="rating = star"
            :disabled="star === rating" />
        </div>
      </div>
    </div>
  </div>
</template>