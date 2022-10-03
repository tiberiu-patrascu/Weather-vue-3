<template>
  <div class="section-fav">
    <div v-if="favorites.length !== 0" class="favorites_page">
      <ul class="list white">
        {{ $t("list") }}
        <li v-for="(favorite, i) in favorites" :key="i">
          {{ favorite }}
          <button v-on:click="yes({ favorite })" class="btn">{{ $t("btn_yes") }}</button>
          <button v-on:click="no({ favorite })" class="btn">{{ $t("btn_no") }}</button>
        </li>
        <li><button v-on:click="deleteFav()" class="btn">{{ $t("delete_fav") }}</button></li>
      </ul>
    </div>
    <div v-else class="text-center favorites_page">
      <h2 class="white">{{ $t("empty_fav") }}</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: "WeatherFavorites",
  data() {
    return {
      favorites: JSON.parse(localStorage.getItem("favorites")) || []
    };
  },
  methods: {
    yes(param) {
      this.emitter.emit('yes_call', { 'yesContent': param })
    },
    no(param) {
      this.emitter.emit('no_call', { 'noContent': param })
    },
    deleteFav() {
      localStorage.removeItem("favorites");
      window.location.href = "/";
    }
  }
};
</script>