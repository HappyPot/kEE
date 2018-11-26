<template>
  <div class="face">
    <div class="eyes">
      <div class="left-eye">
        <span></span>
      </div>
      <div class="right-eye"></div>
    </div>
    <div class="mouth-hidden">
      <div class="mouth"></div>
    </div>
    <p id="content">您访问的页面不知道飞哪去了</p>
  </div>
</template>

<script>
export default {};
</script>
<style scoped>
#content {
  font-size: 0.25rem;
  color: #ccc;
}
.face {
  position: absolute;
  width: 100%;
  height: 35%;
  text-align: center;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}
.left-eye,
.right-eye {
  width: 50px;
  height: 50px;
  background: #000;
  position: relative;
  display: inline-block;
  margin: 20px;
  border-radius: 100%;
}
.left-eye::before {
  content: "";
  position: absolute;
  width: 40px;
  height: 10px;
  top: 0;
  background: #000;
  transform: rotate(-30deg);
  z-index: 1;
  left: -7px;
}
.right-eye::before {
  content: "";
  position: absolute;
  width: 40px;
  height: 10px;
  right: 0;
  background: #000;
  transform: rotate(30deg);
  z-index: 1;
  right: -7px;
}
.left-eye::after {
  content: "";
  position: absolute;
  width: 20px;
  height: 20px;
  left: 10px;
  top: 10px;
  border-radius: 100%;
  background: #ccc;
}
.right-eye::after {
  content: "";
  position: absolute;
  width: 20px;
  height: 20px;
  right: 10px;
  top: 10px;
  border-radius: 100%;
  background: #ccc;
}
.left-eye span {
  position: absolute;
  background: #00b3b3;
  width: 20px;
  height: 20px;
  transform: rotate(-45deg);
  display: block;
  top: 70px;
  border-radius: 80% 0 55% 50% / 55% 0 80% 50%;
}
.mouth-hidden {
  height: 20px;
  overflow: hidden;
  margin-top: 30px;
}
.mouth {
  height: 100px;
  width: 100px;
  border: 4px solid #000;
  display: inline-block;
  border-radius: 100%;
}
</style>
