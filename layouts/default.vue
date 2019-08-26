<template>
  <div>
    <nuxt/>
  </div>
</template>
<script>
export default {
  //heryerde middleware tanımlamaktansa burda 1 sefer tanımlamak daha mantıklı
  //middleware : "auth"
  
  //sıralama önemlidir
  middleware : ["auth","session-control"]
}
</script>