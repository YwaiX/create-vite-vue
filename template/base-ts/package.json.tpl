{
  "name": "__PROJECT_NAME__",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "less": "^4.5.1",
    "tslib": "^2.8.1",
    "vue": "^3.5.25"__OPTIONAL_DEP__
  },
  "devDependencies": {
    "@types/node": "^24.11.0",
    "@vitejs/plugin-vue": "^6.0.2",
    "@vue/tsconfig": "^0.8.1",
    "typescript": "~5.9.3",
    "vite": "^8.0.0-beta.13",
    "vue-tsc": "^3.1.5"
  },
  "overrides": {
    "vite": "^8.0.0-beta.13"
  }
}