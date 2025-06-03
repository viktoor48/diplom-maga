<template>
  <div class="loader-wrapper">
    <div class="loader" />
  </div>
</template>

<style lang="scss" scoped>
.loader-wrapper {
  background: rgba(128, 128, 128, 0.3);
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  display: flex;
  z-index: 2100;

  .loader {
    margin: auto;
    display: inline-block;
    width: 7.5rem;
    height: 7.5rem;
    border-top: 4px solid #fff;
    border-right: 4px solid transparent;
    border-radius: 50%;
    box-sizing: border-box;
    // -webkit-animation: spin 2s linear infinite;
    animation: rotation 1s linear infinite;
  }

  .loader::after {
    content: "";
    box-sizing: border-box;
    position: absolute;
    left: 0;
    top: 0;
    width: 7.5rem;
    height: 7.5rem;
    border-radius: 50%;
    border-left: 4px solid #639a72;
    border-bottom: 4px solid transparent;
    animation: rotation 0.5s linear infinite reverse;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
