<script setup>
    //Props
    const props = defineProps(['modelValue']);

    //Prism init
    import { PrismEditor } from 'vue-prism-editor';
    import 'vue-prism-editor/dist/prismeditor.min.css';
    import { highlight, languages } from 'prismjs/components/prism-core';
    import 'prismjs/components/prism-clike';
    import 'prismjs/components/prism-c';
    import 'prismjs/components/prism-cpp';
    import 'prismjs/components/prism-arduino';
    import 'prismjs/themes/prism-solarizedlight.css';

    const highlighter = (codeToShow) => {
        return highlight(codeToShow, languages.arduino);
    };

</script>

<template>
    <PrismEditor 
        v-model="props.modelValue" 
        :highlight="highlighter" 
        line-numbers 
        :readonly=true>
    </PrismEditor>
</template>