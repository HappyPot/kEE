<template>
  <div id="loading">
    <img src="../assets/loading.gif" alt="">
  </div>
</template>

<script>
export default {};
</script>

<style>
#loading {
  position: fixed;
  top: 0px;
  left: 0px;
  background: rgba(255, 255, 255, 0.8);
  width: 100%;
  height: 100%;
}
#loading img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
