<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>
  
<template>
  <header>
    <div>
      <a href="#main" id="skip-link">
        <span class="screen-reader-text">{{$t("skip_link")}}</span>
        <span>{{$t("skip_link")}}</span>
      </a>
    </div>
    <div>
      <nav>
        <RouterLink to="/">{{ $t("home") }}</RouterLink>
        <RouterLink to="/favorites">{{ $t("favorites") }}</RouterLink>
      </nav>
    </div>
  </header>
  <RouterView />
</template>
  
<style scoped>

</style>
