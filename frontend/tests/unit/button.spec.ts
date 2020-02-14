import { shallowMount } from "@vue/test-utils";
import Button from "@/components/shared/Button.vue";

describe("Button.vue", () => {
  it("renders button and clicks it", () => {
    const wrapper = shallowMount(Button, {});
    wrapper.find("button").trigger("click");
  });
});
