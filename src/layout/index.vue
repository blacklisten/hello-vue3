<template>
  <div class="app-main">
    <el-menu class="navbar" router>
      <template v-for="route in routes">
        <template v-if="route.redirect && route.children && route.children.length === 1">
          <el-menu-item 
              v-for="child in route.children"
              :key="child.path" 
              :index="route.path">{{ child.meta.title }}</el-menu-item>
        </template>
        <template v-if="!route.redirect && route.children && route.children.length >= 1">
          <el-submenu :index="route.path" :key="route.path">
            <template #title>
              <i class="el-icon-location"></i>
              <span>{{ route.meta.title }}</span>
            </template>
            <el-menu-item 
              v-for="child in route.children"
              :key="child.path" 
              :index="route.path + '/' + child.path">{{ child.meta.title }}</el-menu-item>
          </el-submenu>
        </template>
        <template v-if="!route.children">
          <el-menu-item :index="route.path" :key="route.path">
            <template #title>{{ route.meta.title }}</template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { routes } from '../routes'

export default defineComponent({
  setup() {
    return {
      routes
    }
  },
})
</script>

<style lang="scss" scoped>
.app-main {
  display: flex;
  min-height: 100vh;
  min-width: 100vw;
  .navbar {
    min-height: 100vh;
    width: 200px;
  }
  .container {
    padding: 10px 15px;
  }
}
</style>
