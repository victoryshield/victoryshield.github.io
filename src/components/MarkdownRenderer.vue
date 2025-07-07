<template>
  <div class="prose dark:prose-invert max-w-none" v-html="renderedMarkdown"></div>
</template>

<script setup>
import { computed } from 'vue';
import { marked } from 'marked';

const props = defineProps({
  markdown: {
    type: String,
    default: ''
  }
});

const renderedMarkdown = computed(() => {
  return marked(props.markdown);
});
</script>

<style>
/* Estilos para o markdown renderizado (Tailwind Typography) */
.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  color: var(--tw-prose-headings);
  font-weight: 700;
}

.prose strong {
  color: var(--tw-prose-bold);
}

.prose a {
  color: var(--tw-prose-links);
  text-decoration: underline;
}

.prose ul,
.prose ol {
  list-style-type: disc;
  padding-left: 1.25em;
}

.prose ol {
  list-style-type: decimal;
}

.prose li {
  margin-bottom: 0.25em;
}

.prose code {
  background-color: var(--tw-prose-code-bg);
  color: var(--tw-prose-code);
  padding: 0.2em 0.4em;
  border-radius: 0.25rem;
}

.prose pre {
  background-color: var(--tw-prose-pre-bg);
  color: var(--tw-prose-pre-code);
  padding: 1em;
  border-radius: 0.5rem;
  overflow-x: auto;
}

.prose table {
  width: 100%;
  border-collapse: collapse;
}

.prose th,
.prose td {
  border: 1px solid var(--tw-prose-hr);
  padding: 0.5em;
}

.prose blockquote {
  border-left: 0.25rem solid var(--tw-prose-quote-borders);
  padding-left: 1em;
  color: var(--tw-prose-quote);
}
</style>
