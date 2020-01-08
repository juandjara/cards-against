<template>
  <form 
    class="user-form-container user-select-container"
    @submit.prevent="onSubmit">
    <input v-model="name" placeholder="What is your name" />
    <button type="submit">Enviar</button>
  </form>
</template>

<script>
export default {
  name: 'UserForm',
  data () {
    return {
      name: ""
    }
  },
  methods: {
    onSubmit () {
      this.$emit('submit', this.name)
    }
  }
}
</script>

<style scoped>
  form {
    padding: 1rem;
    display: block;
    border: 1px dotted black;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>