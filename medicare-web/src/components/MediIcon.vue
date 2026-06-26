<!-- 医院大楼 SVG 插图 -->
<template>
  <svg :width="w" :height="h" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- 大楼主体 -->
    <rect x="40" y="30" width="120" height="120" rx="4" fill="#e8f0fe" stroke="#667eea" stroke-width="2"/>
    <!-- 十字标志 -->
    <rect x="90" y="60" width="20" height="50" rx="4" fill="#667eea"/>
    <rect x="75" y="75" width="50" height="20" rx="4" fill="#667eea"/>
    <!-- 窗户 -->
    <rect x="50" y="45" width="14" height="12" rx="2" fill="#fff" stroke="#667eea" stroke-width="1"/>
    <rect x="136" y="45" width="14" height="12" rx="2" fill="#fff" stroke="#667eea" stroke-width="1"/>
    <rect x="50" y="115" width="14" height="12" rx="2" fill="#fff" stroke="#667eea" stroke-width="1"/>
    <rect x="136" y="115" width="14" height="12" rx="2" fill="#fff" stroke="#667eea" stroke-width="1"/>
    <!-- 门 -->
    <rect x="80" y="130" width="40" height="20" rx="4" fill="#667eea"/>
    <!-- 屋顶 -->
    <polygon points="30,30 100,5 170,30" fill="#764ba2" opacity="0.3"/>
  </svg>
</template>
<script setup lang="ts">
defineProps<{ w?: number; h?: number }>()
withDefaults(defineProps<{ w?: number; h?: number }>(), { w: 160, h: 130 })
</script>
