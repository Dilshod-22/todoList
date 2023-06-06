<template>
    <input 
        type="text" 
        class="form-control"
        :value="modelValue"
        @input="updateInput"
    />
       <!-- @input="viewers = $event.target.value" -->
 
</template>

<script>
    export default {
        name: 'Input',
        props: {
            modelValue: [String, Number],
        },
        methods: {
            updateInput(e) {
                this.$emit('update:modelValue',e.target.value)
            }
        }
    }
</script>

<style>

</style>