<template>
  <view>
    <view>
      <u-navbar title-color="#fdffff" :is-back="false" :title="title" :background="background">
	  </u-navbar>
    </view>
  </view>
</template>

<script>
export default {
  name: "patrol-nav-bar",
  props: ["title"],
  data() {
    return {
      background: {
        backgroundImage:
          "linear-gradient(45deg, rgb(28, 187, 180), rgb(141, 198, 63))",
      },
    };
  },
};
</script>

<style>
</style>