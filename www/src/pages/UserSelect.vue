<template>
  <UserForm @submit="onSubmit($event)" />
</template>

<script>
import UserForm from '@/components/UserForm.vue'
export default {
  name: 'UserSelect',
  components: {
    UserForm
  },
  data () {
    return {}
  },
  methods: {
    onSubmit ({ name }) {
      console.log('choosen name', name)
    }
  }
}
</script>

<style>

</style>