<template>
  <div>
    <Header />
    <nuxt/>
  </div>
</template>
<script>
import Header from  "@/components/Header"
export default {
  //heryerde middleware tanımlamaktansa burda 1 sefer tanımlamak daha mantıklı
  //middleware : "auth"

  //sıralama önemlidir
 
  components : {
    Header
  }
}
</script>